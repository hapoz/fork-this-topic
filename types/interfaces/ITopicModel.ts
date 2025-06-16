import { Topic, TopicVersion } from '@/types/index.ts';
import { IRepository } from '@/types/interfaces/IRepository.ts';

export interface ITopicModel extends IRepository<Topic> {
  createTopic(
    topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'version'>,
  ): Promise<Topic>;
  updateTopic(
    id: string,
    updates: Partial<Omit<Topic, 'id' | 'createdAt' | 'version'>>,
  ): Promise<Topic | null>;
  getVersions(topicId: string): Promise<TopicVersion[]>;
  getVersion(topicId: string, version: number): Promise<TopicVersion | null>;
  getChildren(topicId: string): Promise<Topic[]>;
  searchTopics(searchTerm: string): Promise<Topic[]>;
}
