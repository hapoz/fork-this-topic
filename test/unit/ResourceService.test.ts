import {
  assertEquals,
  assertExists,
} from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { MemcachedAdapter } from '../../database/MemcachedAdapter.ts';
import { ResourceModel } from '../../models/ResourceModel.ts';
import { ResourceService } from '../../services/ResourceService.ts';
import { Resource, ResourceType } from '../../types/index.ts';

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

Deno.test('ResourceService - createResource', async () => {
  const resourceModel = new ResourceModel(new MockMemcachedAdapter());
  const resourceService = new ResourceService(resourceModel);

  const resourceData = {
    topicId: 'topic-1',
    url: 'https://example.com',
    description: 'Test resource',
    type: ResourceType.ARTICLE,
  };

  const result = await resourceService.createResource(resourceData);

  assertExists(result);
  assertEquals(result.topicId, resourceData.topicId);
  assertEquals(result.url, resourceData.url);
  assertEquals(result.description, resourceData.description);
  assertEquals(result.type, resourceData.type);
  assertExists(result.id);
  assertExists(result.createdAt);
  assertExists(result.updatedAt);
});

Deno.test('ResourceService - getResource', async () => {
  const resourceModel = new ResourceModel(new MockMemcachedAdapter());
  const resourceService = new ResourceService(resourceModel);

  const resource = await resourceService.createResource({
    topicId: 'topic-1',
    url: 'https://example.com',
    description: 'Test resource',
    type: ResourceType.ARTICLE,
  });

  const result = await resourceService.getResource(resource.id);

  assertExists(result);
  assertEquals(result?.id, resource.id);
  assertEquals(result?.topicId, resource.topicId);
});

Deno.test('ResourceService - getResource non-existent', async () => {
  const resourceModel = new ResourceModel(new MockMemcachedAdapter());
  const resourceService = new ResourceService(resourceModel);

  const result = await resourceService.getResource('non-existent-id');

  assertEquals(result, null);
});

Deno.test('ResourceService - updateResource', async () => {
  const resourceModel = new ResourceModel(new MockMemcachedAdapter());
  const resourceService = new ResourceService(resourceModel);

  const resource = await resourceService.createResource({
    topicId: 'topic-1',
    url: 'https://example.com',
    description: 'Original description',
    type: ResourceType.ARTICLE,
  });

  const updatedResource = await resourceService.updateResource(resource.id, {
    description: 'Updated description',
    type: ResourceType.VIDEO,
  });

  assertExists(updatedResource);
  assertEquals(updatedResource?.description, 'Updated description');
  assertEquals(updatedResource?.type, ResourceType.VIDEO);
  assertEquals(updatedResource?.url, resource.url); // Should remain unchanged
});

Deno.test('ResourceService - deleteResource', async () => {
  const resourceModel = new ResourceModel(new MockMemcachedAdapter());
  const resourceService = new ResourceService(resourceModel);

  const resource = await resourceService.createResource({
    topicId: 'topic-1',
    url: 'https://example.com',
    description: 'Test resource',
    type: ResourceType.ARTICLE,
  });

  const deleted = await resourceService.deleteResource(resource.id);
  assertEquals(deleted, true);

  const retrieved = await resourceService.getResource(resource.id);
  assertEquals(retrieved, null);
});

Deno.test('ResourceService - getResourcesByTopic', async () => {
  const resourceModel = new ResourceModel(new MockMemcachedAdapter());
  const resourceService = new ResourceService(resourceModel);

  const topicId = 'topic-1';

  await resourceService.createResource({
    topicId,
    url: 'https://example1.com',
    description: 'Resource 1',
    type: ResourceType.ARTICLE,
  });

  await resourceService.createResource({
    topicId,
    url: 'https://example2.com',
    description: 'Resource 2',
    type: ResourceType.VIDEO,
  });

  await resourceService.createResource({
    topicId: 'topic-2',
    url: 'https://example3.com',
    description: 'Resource 3',
    type: ResourceType.PDF,
  });

  const resources = await resourceService.getResourcesByTopic(
    topicId,
  ) as Resource[];

  assertEquals(resources.length, 2);
  assertEquals(resources[0].topicId, topicId);
  assertEquals(resources[1].topicId, topicId);
});

Deno.test('ResourceService - getResourcesByType', async () => {
  const resourceModel = new ResourceModel(new MockMemcachedAdapter());
  const resourceService = new ResourceService(resourceModel);

  await resourceService.createResource({
    topicId: 'topic-1',
    url: 'https://example1.com',
    description: 'Article 1',
    type: ResourceType.ARTICLE,
  });

  await resourceService.createResource({
    topicId: 'topic-2',
    url: 'https://example2.com',
    description: 'Article 2',
    type: ResourceType.ARTICLE,
  });

  await resourceService.createResource({
    topicId: 'topic-3',
    url: 'https://example3.com',
    description: 'Video 1',
    type: ResourceType.VIDEO,
  });

  const articles = await resourceService.getResourcesByType(
    ResourceType.ARTICLE,
  ) as Resource[];
  assertEquals(articles.length, 2);
  assertEquals(articles[0].type, ResourceType.ARTICLE);
  assertEquals(articles[1].type, ResourceType.ARTICLE);

  const videos = await resourceService.getResourcesByType(
    ResourceType.VIDEO,
  ) as Resource[];
  assertEquals(videos.length, 1);
  assertEquals(videos[0].type, ResourceType.VIDEO);
});

Deno.test('ResourceService - searchResources', async () => {
  const resourceModel = new ResourceModel(new MockMemcachedAdapter());
  const resourceService = new ResourceService(resourceModel);

  await resourceService.createResource({
    topicId: 'topic-1',
    url: 'https://example.com/javascript',
    description: 'JavaScript tutorial',
    type: ResourceType.ARTICLE,
  });

  await resourceService.createResource({
    topicId: 'topic-2',
    url: 'https://example.com/python',
    description: 'Python guide',
    type: ResourceType.VIDEO,
  });

  const javascriptResults = await resourceService.searchResources('javascript');
  assertEquals(javascriptResults.length, 1);
  assertEquals(javascriptResults[0].description, 'JavaScript tutorial');

  const pythonResults = await resourceService.searchResources('python');
  assertEquals(pythonResults.length, 1);
  assertEquals(pythonResults[0].description, 'Python guide');

  const noResults = await resourceService.searchResources('nonexistent');
  assertEquals(noResults.length, 0);
});
