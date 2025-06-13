import { TopicModel } from '@/models/TopicModel.ts';
import { TopicService } from '@/services/TopicService.ts';
import {
  assertEquals,
  assertExists,
  assertNull,
} from 'https://deno.land/std@0.208.0/assert/mod.ts';

Deno.test('TopicService - createTopic', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);

  const topicData = {
    name: 'Test Topic',
    content: 'Test content',
  };

  const result = await topicService.createTopic(topicData);

  assertExists(result);
  assertEquals(result.name, topicData.name);
  assertEquals(result.content, topicData.content);
  assertEquals(result.version, 1);
  assertExists(result.id);
  assertExists(result.createdAt);
  assertExists(result.updatedAt);
});

Deno.test('TopicService - createTopic with parent', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);

  const parentTopic = await topicService.createTopic({
    name: 'Parent Topic',
    content: 'Parent content',
  });

  const childTopic = await topicService.createTopic({
    name: 'Child Topic',
    content: 'Child content',
    parentTopicId: parentTopic.id,
  });

  assertEquals(childTopic.parentTopicId, parentTopic.id);
});

Deno.test('TopicService - getTopic', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);

  const topic = await topicService.createTopic({
    name: 'Test Topic',
    content: 'Test content',
  });

  const result = await topicService.getTopic(topic.id);

  assertExists(result);
  assertEquals(result?.id, topic.id);
  assertEquals(result?.name, topic.name);
});

Deno.test('TopicService - getTopic non-existent', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);

  const result = await topicService.getTopic('non-existent-id');

  assertNull(result);
});

Deno.test('TopicService - updateTopic', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);

  const topic = await topicService.createTopic({
    name: 'Original Name',
    content: 'Original content',
  });

  const updatedTopic = await topicService.updateTopic(topic.id, {
    name: 'Updated Name',
    content: 'Updated content',
  });

  assertExists(updatedTopic);
  assertEquals(updatedTopic?.name, 'Updated Name');
  assertEquals(updatedTopic?.content, 'Updated content');
  assertEquals(updatedTopic?.version, topic.version + 1);
});

Deno.test('TopicService - getTopicVersions', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);

  const topic = await topicService.createTopic({
    name: 'Test Topic',
    content: 'Original content',
  });

  await topicService.updateTopic(topic.id, {
    name: 'Updated Topic',
    content: 'Updated content',
  });

  const versions = await topicService.getTopicVersions(topic.id);

  assertEquals(versions.length, 2);
  assertEquals(versions[0].version, 1);
  assertEquals(versions[1].version, 2);
});

Deno.test('TopicService - getTopicTree', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);

  const parent = await topicService.createTopic({
    name: 'Parent',
    content: 'Parent content',
  });

  const child1 = await topicService.createTopic({
    name: 'Child 1',
    content: 'Child 1 content',
    parentTopicId: parent.id,
  });

  const child2 = await topicService.createTopic({
    name: 'Child 2',
    content: 'Child 2 content',
    parentTopicId: parent.id,
  });

  const tree = await topicService.getTopicTree(parent.id);

  assertExists(tree);
  assertEquals(tree?.children.length, 2);
  assertEquals(tree?.children[0].id, child1.id);
  assertEquals(tree?.children[1].id, child2.id);
});

Deno.test('TopicService - findShortestPath', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);

  const root = await topicService.createTopic({
    name: 'Root',
    content: 'Root content',
  });

  const child1 = await topicService.createTopic({
    name: 'Child 1',
    content: 'Child 1 content',
    parentTopicId: root.id,
  });

  const child2 = await topicService.createTopic({
    name: 'Child 2',
    content: 'Child 2 content',
    parentTopicId: root.id,
  });

  const result = await topicService.findShortestPath(child1.id, child2.id);

  assertEquals(result.exists, true);
  assertEquals(result.path.includes(root.id), true);
  assertEquals(result.distance, 2);
});

Deno.test('TopicService - findShortestPath non-existent', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);

  const result = await topicService.findShortestPath(
    'non-existent-1',
    'non-existent-2',
  );

  assertEquals(result.exists, false);
  assertEquals(result.path.length, 0);
  assertEquals(result.distance, -1);
});
