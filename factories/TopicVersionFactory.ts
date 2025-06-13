import { Topic, TopicVersion } from '@/types/index.ts';

export class TopicVersionFactory {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static createVersion(topic: Topic, versionNumber: number): TopicVersion {
    return {
      id: this.generateId(),
      topicId: topic.id,
      name: topic.name,
      content: topic.content,
      version: versionNumber,
      parentTopicId: topic.parentTopicId,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
    };
  }

  static createInitialVersion(topic: Topic): TopicVersion {
    return this.createVersion(topic, 1);
  }

  static createNextVersion(topic: Topic): TopicVersion {
    return this.createVersion(topic, topic.version + 1);
  }
}
