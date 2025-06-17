import {
  assertEquals,
  assertExists,
} from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { MemcachedAdapter } from '../../../database/MemcachedAdapter.ts';
import { TopicModel } from '../../../models/TopicModel.ts';
import { Topic, TopicVersion } from '../../../types/index.ts';

class MockMemcachedAdapter extends MemcachedAdapter {
  private store = new Map<string, string>();
  constructor() {
    super({ host: 'localhost', port: 11211 });
  }
  override set<T>(key: string, value: T): Promise<boolean> {
    this.store.set(key, JSON.stringify(value));
    return Promise.resolve(true);
  }
  override get<T>(key: string): Promise<T | null> {
    const value = this.store.get(key);
    return Promise.resolve(value ? JSON.parse(value) : null);
  }
  override delete(key: string): Promise<boolean> {
    return Promise.resolve(this.store.delete(key));
  }
  override exists(key: string): Promise<boolean> {
    return Promise.resolve(this.store.has(key));
  }
  override async getMultiple<T>(keys: string[]): Promise<Map<string, T>> {
    const result = new Map<string, T>();
    for (const key of keys) {
      const value = await this.get<T>(key);
      if (value !== null) result.set(key, value);
    }
    return Promise.resolve(result);
  }
  override async setMultiple<T>(
    entries: Array<{ key: string; value: T }>,
  ): Promise<boolean> {
    for (const { key, value } of entries) {
      await this.set(key, value);
    }
    return Promise.resolve(true);
  }
  override async deleteMultiple(keys: string[]): Promise<boolean> {
    for (const key of keys) {
      await this.delete(key);
    }
    return Promise.resolve(true);
  }
}

Deno.test('TopicModel - createTopic', async () => {
  const topicModel = new TopicModel(new MockMemcachedAdapter());

  const topicData = {
    name: 'Test Topic',
    content: 'Test content',
    parentTopicId: 'parent-1',
  };

  const result = await topicModel.createTopic(topicData);

  assertExists(result);
  assertEquals(result.name, topicData.name);
  assertEquals(result.content, topicData.content);
  assertEquals(result.parentTopicId, topicData.parentTopicId);
  assertExists(result.id);
  assertExists(result.createdAt);
  assertExists(result.updatedAt);
  assertEquals(result.version, 1);
});

Deno.test('TopicModel - findById', async () => {
  const topicModel = new TopicModel(new MockMemcachedAdapter());

  const topic = await topicModel.createTopic({
    name: 'Test Topic',
    content: 'Test content',
  });

  const result = await topicModel.findById(topic.id);

  assertExists(result);
  assertEquals(result?.id, topic.id);
  assertEquals(result?.name, topic.name);
});

Deno.test('TopicModel - findById non-existent', async () => {
  const topicModel = new TopicModel(new MockMemcachedAdapter());

  const result = await topicModel.findById('non-existent-id');

  assertEquals(result, null);
});

Deno.test('TopicModel - updateTopic creates new version', async () => {
  const topicModel = new TopicModel(new MockMemcachedAdapter());

  const topic = await topicModel.createTopic({
    name: 'Original Topic',
    content: 'Original content',
  });

  const updatedTopic = await topicModel.updateTopic(topic.id, {
    name: 'Updated Topic',
    content: 'Updated content',
  });

  assertExists(updatedTopic);
  assertEquals(updatedTopic?.name, 'Updated Topic');
  assertEquals(updatedTopic?.content, 'Updated content');
  assertEquals(updatedTopic?.version, 2); // New version
  assertEquals(updatedTopic?.id, topic.id); // Same ID
});

Deno.test('TopicModel - delete', async () => {
  const topicModel = new TopicModel(new MockMemcachedAdapter());

  const topic = await topicModel.createTopic({
    name: 'Test Topic',
    content: 'Test content',
  });

  const deleted = await topicModel.delete(topic.id);
  assertEquals(deleted, true);

  const retrieved = await topicModel.findById(topic.id);
  assertEquals(retrieved, null);
});

Deno.test('TopicModel - findAll', async () => {
  const topicModel = new TopicModel(new MockMemcachedAdapter());

  await topicModel.createTopic({
    name: 'Topic 1',
    content: 'Content 1',
  });

  await topicModel.createTopic({
    name: 'Topic 2',
    content: 'Content 2',
  });

  const topics = await topicModel.findAll() as Topic[];

  assertEquals(topics.length, 2);
  assertEquals(topics[0].name, 'Topic 1');
  assertEquals(topics[1].name, 'Topic 2');
});

Deno.test('TopicModel - getVersions', async () => {
  const topicModel = new TopicModel(new MockMemcachedAdapter());

  const topic = await topicModel.createTopic({
    name: 'Test Topic',
    content: 'Original content',
  });

  await topicModel.updateTopic(topic.id, {
    name: 'Updated Topic',
    content: 'Updated content',
  });

  const versions = await topicModel.getVersions(topic.id) as TopicVersion[];

  assertEquals(versions.length, 2);
  assertEquals(versions[0].version, 1);
  assertEquals(versions[1].version, 2);
});

Deno.test('TopicModel - getVersion', async () => {
  const topicModel = new TopicModel(new MockMemcachedAdapter());

  const topic = await topicModel.createTopic({
    name: 'Test Topic',
    content: 'Original content',
  });

  await topicModel.updateTopic(topic.id, {
    name: 'Updated Topic',
    content: 'Updated content',
  });

  const version1 = await topicModel.getVersion(topic.id, 1);
  const version2 = await topicModel.getVersion(topic.id, 2);

  assertExists(version1);
  assertExists(version2);
  assertEquals(version1?.content, 'Original content');
  assertEquals(version2?.content, 'Updated content');
});

Deno.test('TopicModel - getVersion non-existent', async () => {
  const topicModel = new TopicModel(new MockMemcachedAdapter());

  const topic = await topicModel.createTopic({
    name: 'Test Topic',
    content: 'Original content',
  });

  const version3 = await topicModel.getVersion(topic.id, 3);

  assertEquals(version3, null);
});

Deno.test('TopicModel - searchTopics', async () => {
  const topicModel = new TopicModel(new MockMemcachedAdapter());

  await topicModel.createTopic({
    name: 'JavaScript Fundamentals',
    content: 'JavaScript is a programming language',
  });

  await topicModel.createTopic({
    name: 'Python Basics',
    content: 'Python is another programming language',
  });

  const javascriptResults = await topicModel.searchTopics(
    'JavaScript',
  ) as Topic[];
  assertEquals(javascriptResults.length, 1);
  assertEquals(javascriptResults[0].name, 'JavaScript Fundamentals');

  const pythonResults = await topicModel.searchTopics('Python') as Topic[];
  assertEquals(pythonResults.length, 1);
  assertEquals(pythonResults[0].name, 'Python Basics');
});

Deno.test('TopicModel - getChildren', async () => {
  const topicModel = new TopicModel(new MockMemcachedAdapter());

  const parentTopic = await topicModel.createTopic({
    name: 'Parent Topic',
    content: 'Parent content',
  });

  const _childTopic = await topicModel.createTopic({
    name: 'Child Topic',
    content: 'Child content',
    parentTopicId: parentTopic.id,
  });

  const children = await topicModel.getChildren(parentTopic.id) as Topic[];

  assertEquals(children.length, 1);
  assertEquals(children[0].id, _childTopic.id);
});

Deno.test('TopicModel - getRootTopics', async () => {
  const topicModel = new TopicModel(new MockMemcachedAdapter());

  const rootTopic = await topicModel.createTopic({
    name: 'Root Topic',
    content: 'Root content',
  });

  const _childTopic = await topicModel.createTopic({
    name: 'Child Topic',
    content: 'Child content',
    parentTopicId: rootTopic.id,
  });

  const rootTopics = await topicModel.getRootTopics();

  assertEquals(rootTopics.length, 1);
  assertEquals(rootTopics![0]!.id, rootTopic.id);
});
