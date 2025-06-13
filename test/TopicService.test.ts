import { TopicModel } from '../models/TopicModel.ts';
import { TopicService } from '../services/TopicService.ts';

describe('TopicService', () => {
  let topicService: TopicService;
  let topicModel: TopicModel;

  beforeEach(() => {
    topicModel = new TopicModel();
    topicService = new TopicService(topicModel);
  });

  describe('createTopic', () => {
    it('should create a new topic with version 1', async () => {
      const topicData = {
        name: 'Test Topic',
        content: 'Test content',
      };

      const result = await topicService.createTopic(topicData);

      expect(result).toBeDefined();
      expect(result.name).toBe(topicData.name);
      expect(result.content).toBe(topicData.content);
      expect(result.version).toBe(1);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should create a topic with parent topic ID', async () => {
      const parentTopic = await topicService.createTopic({
        name: 'Parent Topic',
        content: 'Parent content',
      });

      const childTopic = await topicService.createTopic({
        name: 'Child Topic',
        content: 'Child content',
        parentTopicId: parentTopic.id,
      });

      expect(childTopic.parentTopicId).toBe(parentTopic.id);
    });
  });

  describe('getTopic', () => {
    it('should return topic by ID', async () => {
      const topic = await topicService.createTopic({
        name: 'Test Topic',
        content: 'Test content',
      });

      const result = await topicService.getTopic(topic.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(topic.id);
      expect(result?.name).toBe(topic.name);
    });

    it('should return null for non-existent topic', async () => {
      const result = await topicService.getTopic('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('updateTopic', () => {
    it('should update topic and increment version', async () => {
      const topic = await topicService.createTopic({
        name: 'Original Name',
        content: 'Original content',
      });

      const updatedTopic = await topicService.updateTopic(topic.id, {
        name: 'Updated Name',
        content: 'Updated content',
      });

      expect(updatedTopic).toBeDefined();
      expect(updatedTopic?.name).toBe('Updated Name');
      expect(updatedTopic?.content).toBe('Updated content');
      expect(updatedTopic?.version).toBe(topic.version + 1);
    });

    it('should return null for non-existent topic', async () => {
      const result = await topicService.updateTopic('non-existent-id', {
        name: 'Updated Name',
      });

      expect(result).toBeNull();
    });
  });

  describe('getTopicVersions', () => {
    it('should return all versions of a topic', async () => {
      const topic = await topicService.createTopic({
        name: 'Test Topic',
        content: 'Original content',
      });

      await topicService.updateTopic(topic.id, {
        name: 'Updated Topic',
        content: 'Updated content',
      });

      const versions = await topicService.getTopicVersions(topic.id);

      expect(versions).toHaveLength(2);
      expect(versions[0].version).toBe(1);
      expect(versions[1].version).toBe(2);
    });
  });

  describe('getTopicTree', () => {
    it('should return topic tree with children', async () => {
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

      expect(tree).toBeDefined();
      expect(tree?.children).toHaveLength(2);
      expect(tree?.children[0].id).toBe(child1.id);
      expect(tree?.children[1].id).toBe(child2.id);
    });
  });

  describe('findShortestPath', () => {
    it('should find shortest path between topics', async () => {
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

      expect(result.exists).toBe(true);
      expect(result.path).toContain(root.id);
      expect(result.distance).toBe(2);
    });

    it('should return false for non-existent path', async () => {
      const result = await topicService.findShortestPath('non-existent-1', 'non-existent-2');

      expect(result.exists).toBe(false);
      expect(result.path).toHaveLength(0);
      expect(result.distance).toBe(-1);
    });
  });
}); 