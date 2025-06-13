import { Request, Response } from 'express';
import {
  assertEquals,
  assertExists,
} from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { TopicController } from '../../../controllers/TopicController.ts';
import { TopicModel } from '../../../models/TopicModel.ts';
import { TopicService } from '../../../services/TopicService.ts';

// Mock Response class
class MockResponse {
  statusCode = 200;
  body: any = null;
  headers: Record<string, string> = {};

  status(code: number) {
    this.statusCode = code;
    return this;
  }

  json(data: any) {
    this.body = data;
    return this;
  }
}

Deno.test('TopicController - createTopic', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);
  const topicController = new TopicController(topicService);

  const req = {
    body: {
      name: 'Test Topic',
      content: 'Test content',
      parentTopicId: 'parent-1',
    },
  } as Request;

  const res = new MockResponse() as unknown as Response;

  await topicController.createTopic(req, res);

  assertEquals((res as any).statusCode, 201);
  assertEquals((res as any).body.success, true);
  assertExists((res as any).body.data);
  assertEquals((res as any).body.data.name, 'Test Topic');
  assertEquals((res as any).body.data.content, 'Test content');
});

Deno.test('TopicController - createTopic missing fields', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);
  const topicController = new TopicController(topicService);

  const req = {
    body: {
      name: 'Test Topic',
      // Missing content
    },
  } as Request;

  const res = new MockResponse() as unknown as Response;

  await topicController.createTopic(req, res);

  assertEquals((res as any).statusCode, 400);
  assertEquals((res as any).body.success, false);
  assertEquals(
    (res as any).body.error,
    'Missing required fields: name, content',
  );
});

Deno.test('TopicController - getTopic', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);
  const topicController = new TopicController(topicService);

  // First create a topic
  const createReq = {
    body: {
      name: 'Test Topic',
      content: 'Test content',
    },
  } as Request;

  const createRes = new MockResponse() as unknown as Response;
  await topicController.createTopic(createReq, createRes);
  const topicId = (createRes as any).body.data.id;

  // Then get the topic
  const req = {
    params: { id: topicId },
  } as unknown as Request;

  const res = new MockResponse() as unknown as Response;

  await topicController.getTopic(req, res);

  assertEquals((res as any).statusCode, 200);
  assertEquals((res as any).body.success, true);
  assertEquals((res as any).body.data.id, topicId);
});

Deno.test('TopicController - getTopic not found', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);
  const topicController = new TopicController(topicService);

  const req = {
    params: { id: 'non-existent-id' },
  } as unknown as Request;

  const res = new MockResponse() as unknown as Response;

  await topicController.getTopic(req, res);

  assertEquals((res as any).statusCode, 404);
  assertEquals((res as any).body.success, false);
  assertEquals((res as any).body.error, 'Topic not found');
});

Deno.test('TopicController - updateTopic', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);
  const topicController = new TopicController(topicService);

  // First create a topic
  const createReq = {
    body: {
      name: 'Original Topic',
      content: 'Original content',
    },
  } as Request;

  const createRes = new MockResponse() as unknown as Response;
  await topicController.createTopic(createReq, createRes);
  const topicId = (createRes as any).body.data.id;

  // Then update the topic
  const req = {
    params: { id: topicId },
    body: {
      name: 'Updated Topic',
      content: 'Updated content',
    },
  } as unknown as Request;

  const res = new MockResponse() as unknown as Response;

  await topicController.updateTopic(req, res);

  assertEquals((res as any).statusCode, 200);
  assertEquals((res as any).body.success, true);
  assertEquals((res as any).body.data.name, 'Updated Topic');
  assertEquals((res as any).body.data.content, 'Updated content');
});

Deno.test('TopicController - deleteTopic', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);
  const topicController = new TopicController(topicService);

  // First create a topic
  const createReq = {
    body: {
      name: 'Test Topic',
      content: 'Test content',
    },
  } as Request;

  const createRes = new MockResponse() as unknown as Response;
  await topicController.createTopic(createReq, createRes);
  const topicId = (createRes as any).body.data.id;

  // Then delete the topic
  const req = {
    params: { id: topicId },
  } as unknown as Request;

  const res = new MockResponse() as unknown as Response;

  await topicController.deleteTopic(req, res);

  assertEquals((res as any).statusCode, 200);
  assertEquals((res as any).body.success, true);
  assertEquals((res as any).body.message, 'Topic deleted successfully');
});

Deno.test('TopicController - getAllTopics', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);
  const topicController = new TopicController(topicService);

  // Create some topics
  await topicController.createTopic({
    body: { name: 'Topic 1', content: 'Content 1' },
  } as Request, new MockResponse() as unknown as Response);

  await topicController.createTopic({
    body: { name: 'Topic 2', content: 'Content 2' },
  } as Request, new MockResponse() as unknown as Response);

  const req = {
    query: { page: '1', limit: '10' },
  } as unknown as Request;

  const res = new MockResponse() as unknown as Response;

  await topicController.getAllTopics(req, res);

  assertEquals((res as any).statusCode, 200);
  assertEquals((res as any).body.success, true);
  assertExists((res as any).body.data);
});

Deno.test('TopicController - searchTopics', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);
  const topicController = new TopicController(topicService);

  // Create a topic with specific content
  await topicController.createTopic({
    body: { name: 'JavaScript', content: 'JavaScript programming language' },
  } as Request, new MockResponse() as unknown as Response);

  const req = {
    query: { q: 'JavaScript' },
  } as unknown as Request;

  const res = new MockResponse() as unknown as Response;

  await topicController.searchTopics(req, res);

  assertEquals((res as any).statusCode, 200);
  assertEquals((res as any).body.success, true);
  assertExists((res as any).body.data);
});

Deno.test('TopicController - searchTopics missing query', async () => {
  const topicModel = new TopicModel();
  const topicService = new TopicService(topicModel);
  const topicController = new TopicController(topicService);

  const req = {
    query: {},
  } as unknown as Request;

  const res = new MockResponse() as unknown as Response;

  await topicController.searchTopics(req, res);

  assertEquals((res as any).statusCode, 400);
  assertEquals((res as any).body.success, false);
  assertEquals((res as any).body.error, 'Search query is required');
});
