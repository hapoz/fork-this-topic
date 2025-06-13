import { ShortestPathResult, Topic, TopicFilters, TopicTree, TopicVersion } from '../../types/index.ts';

export interface ITopicService {
  createTopic(topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Topic>;
  getTopic(id: string): Promise<Topic | null>;
  updateTopic(id: string, updates: Partial<Omit<Topic, 'id' | 'createdAt' | 'version'>>): Promise<Topic | null>;
  deleteTopic(id: string): Promise<boolean>;
  getAllTopics(filters?: TopicFilters): Promise<Topic[]>;
  getTopicVersions(topicId: string): Promise<TopicVersion[]>;
  getTopicVersion(topicId: string, version: number): Promise<TopicVersion | null>;
  getTopicTree(topicId: string): Promise<TopicTree | null>;
  findShortestPath(fromTopicId: string, toTopicId: string): Promise<ShortestPathResult>;
  searchTopics(searchTerm: string): Promise<Topic[]>;
} 