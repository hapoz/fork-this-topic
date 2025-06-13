import { TopicModel } from '../models/TopicModel.ts';
import {
  ShortestPathResult,
  Topic,
  TopicFilters,
  TopicTree,
  TopicVersion,
} from '../types/index.ts';
import { ITopicService } from './interfaces/ITopicService.ts';

export class TopicService implements ITopicService {
  private topicModel: TopicModel;

  constructor(topicModel: TopicModel) {
    this.topicModel = topicModel;
  }

  async createTopic(
    topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'version'>,
  ): Promise<Topic> {
    return await this.topicModel.createTopic(topicData);
  }

  async getTopic(id: string): Promise<Topic | null> {
    return await this.topicModel.findById(id);
  }

  async updateTopic(
    id: string,
    updates: Partial<Omit<Topic, 'id' | 'createdAt' | 'version'>>,
  ): Promise<Topic | null> {
    return await this.topicModel.updateTopic(id, updates);
  }

  async deleteTopic(id: string): Promise<boolean> {
    return await this.topicModel.delete(id);
  }

  async getAllTopics(filters?: TopicFilters): Promise<Topic[]> {
    let topics = await this.topicModel.findAll();

    if (filters?.parentTopicId) {
      topics = topics.filter((topic) =>
        topic.parentTopicId === filters.parentTopicId
      );
    }

    if (filters?.search) {
      topics = await this.topicModel.searchTopics(filters.search);
    }

    // Apply pagination
    if (filters?.page && filters?.limit) {
      const start = (filters.page - 1) * filters.limit;
      const end = start + filters.limit;
      topics = topics.slice(start, end);
    }

    return topics;
  }

  async getTopicVersions(topicId: string): Promise<TopicVersion[]> {
    return await this.topicModel.getVersions(topicId);
  }

  async getTopicVersion(
    topicId: string,
    version: number,
  ): Promise<TopicVersion | null> {
    return await this.topicModel.getVersion(topicId, version);
  }

  async getTopicTree(topicId: string): Promise<TopicTree | null> {
    const topic = await this.topicModel.findById(topicId);
    if (!topic) {
      return null;
    }

    return await this.buildTopicTree(topic);
  }

  private async buildTopicTree(topic: Topic): Promise<TopicTree> {
    const children = await this.topicModel.getChildren(topic.id);
    const childTrees = await Promise.all(
      children.map((child) => this.buildTopicTree(child)),
    );

    return {
      ...topic,
      children: childTrees,
    };
  }

  async findShortestPath(
    fromTopicId: string,
    toTopicId: string,
  ): Promise<ShortestPathResult> {
    // Custom algorithm to find shortest path between topics
    // Using Breadth-First Search (BFS) for unweighted graph
    const allTopics = await this.topicModel.findAll();
    const topicMap = new Map(allTopics.map((topic) => [topic.id, topic]));

    if (!topicMap.has(fromTopicId) || !topicMap.has(toTopicId)) {
      return { path: [], distance: -1, exists: false };
    }

    const queue: Array<{ id: string; path: string[] }> = [{
      id: fromTopicId,
      path: [fromTopicId],
    }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.id === toTopicId) {
        return {
          path: current.path,
          distance: current.path.length - 1,
          exists: true,
        };
      }

      if (visited.has(current.id)) {
        continue;
      }

      visited.add(current.id);
      const topic = topicMap.get(current.id)!;

      // Add parent to path
      if (topic.parentTopicId && !visited.has(topic.parentTopicId)) {
        queue.push({
          id: topic.parentTopicId,
          path: [...current.path, topic.parentTopicId],
        });
      }

      // Add children to path
      const children = allTopics.filter((t) => t.parentTopicId === current.id);
      for (const child of children) {
        if (!visited.has(child.id)) {
          queue.push({
            id: child.id,
            path: [...current.path, child.id],
          });
        }
      }
    }

    return { path: [], distance: -1, exists: false };
  }

  async searchTopics(searchTerm: string): Promise<Topic[]> {
    return await this.topicModel.searchTopics(searchTerm);
  }
}
