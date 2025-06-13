import { BaseModel } from '@/models/BaseModel.ts';
import { Topic, TopicVersion } from '@/types/index.ts';

export class TopicModel extends BaseModel<Topic> {
  private versions: Map<string, TopicVersion[]> = new Map();

  async createTopic(
    topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'version'>,
  ): Promise<Topic> {
    const topic = await this.create({
      ...topicData,
      version: 1,
    });

    // Create initial version
    await this.createVersion(topic.id, topic);
    return topic;
  }

  async updateTopic(
    id: string,
    updates: Partial<Omit<Topic, 'id' | 'createdAt' | 'version'>>,
  ): Promise<Topic | null> {
    const existingTopic = await this.findById(id);
    if (!existingTopic) {
      return null;
    }

    // Create new version before updating
    await this.createVersion(id, existingTopic);

    const updatedTopic = await this.update(id, {
      ...updates,
      version: existingTopic.version + 1,
    });

    return updatedTopic;
  }

  async createVersion(topicId: string, topic: Topic): Promise<TopicVersion> {
    const version: TopicVersion = {
      id: this.generateId(),
      topicId,
      name: topic.name,
      content: topic.content,
      version: topic.version,
      parentTopicId: topic.parentTopicId,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
    };

    if (!this.versions.has(topicId)) {
      this.versions.set(topicId, []);
    }

    this.versions.get(topicId)!.push(version);
    return version;
  }

  async getVersions(topicId: string): Promise<TopicVersion[]> {
    return this.versions.get(topicId) || [];
  }

  async getVersion(
    topicId: string,
    version: number,
  ): Promise<TopicVersion | null> {
    const versions = await this.getVersions(topicId);
    return versions.find((v) => v.version === version) || null;
  }

  async getChildren(parentId: string): Promise<Topic[]> {
    const allTopics = await this.findAll();
    return allTopics.filter((topic) => topic.parentTopicId === parentId);
  }

  async getRootTopics(): Promise<Topic[]> {
    const allTopics = await this.findAll();
    return allTopics.filter((topic) => !topic.parentTopicId);
  }

  async searchTopics(searchTerm: string): Promise<Topic[]> {
    const allTopics = await this.findAll();
    const term = searchTerm.toLowerCase();
    return allTopics.filter((topic) =>
      topic.name.toLowerCase().includes(term) ||
      topic.content.toLowerCase().includes(term)
    );
  }
}
