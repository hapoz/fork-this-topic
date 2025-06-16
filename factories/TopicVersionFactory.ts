import { Topic, TopicVersion } from '@/types/index.ts';

export class TopicVersionFactory {
  private static generateId = (): string =>
    Math.random().toString(36).substring(2, 11);

  static createVersion(topic: Topic, versionNumber: number): TopicVersion {
    return {
      id: this.generateId(),
      topicId: topic.id,
      name: topic.name,
      content: topic.content,
      version: versionNumber,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
      parentTopicId: topic.parentTopicId || undefined,
    };
  }

  static createInitialVersion = (topic: Topic): TopicVersion =>
    this.createVersion(topic, 1);

  static createNextVersion = (topic: Topic): TopicVersion =>
    this.createVersion(topic, topic.version + 1);
}
