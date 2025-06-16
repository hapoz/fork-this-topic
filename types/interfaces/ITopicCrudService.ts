import { Topic, TopicFilters } from '@/types/index.ts';

export interface ITopicCrudService {
  createTopic(
    topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'version'>,
  ): Promise<Topic>;
  getTopic(id: string): Promise<Topic | null>;
  updateTopic(
    id: string,
    updates: Partial<Omit<Topic, 'id' | 'createdAt' | 'version'>>,
  ): Promise<Topic | null>;
  deleteTopic(id: string): Promise<boolean>;
  getAllTopics(filters?: TopicFilters): Promise<Topic[]>;
}
