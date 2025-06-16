import {
  ShortestPathResult,
  Topic,
  TopicTree,
  TopicVersion,
} from '@/types/index.ts';
import { ITopicCrudService } from './ITopicCrudService.ts';

export interface ITopicService extends ITopicCrudService {
  getTopicVersions(topicId: string): Promise<TopicVersion[]>;
  getTopicVersion(
    topicId: string,
    version: number,
  ): Promise<TopicVersion | null>;
  getTopicTree(topicId: string): Promise<TopicTree | null>;
  findShortestPath(
    fromTopicId: string,
    toTopicId: string,
  ): Promise<ShortestPathResult>;
  searchTopics(searchTerm: string): Promise<Topic[]>;
}
