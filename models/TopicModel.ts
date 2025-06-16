import { TopicVersionFactory } from '@/factories/TopicVersionFactory.ts';
import { BaseModel } from '@/models/BaseModel.ts';
import { Topic, TopicVersion } from '@/types/index.ts';
import { ITopicModel } from '@/types/interfaces/ITopicModel.ts';

export class TopicModel extends BaseModel<Topic> implements ITopicModel {
  private topicVersions: Map<string, TopicVersion[]> = new Map();

  async createTopic(
    topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'version'>,
  ): Promise<Topic> {
    const newTopic = await this.create({ ...topicData, version: 1 });
    this.topicVersions.set(newTopic.id, [
      TopicVersionFactory.createInitialVersion(newTopic),
    ]);
    return newTopic;
  }

  async updateTopic(
    id: string,
    updates: Partial<Omit<Topic, 'id' | 'createdAt' | 'version'>>,
  ): Promise<Topic | null> {
    const existingTopic = await this.findById(id);
    if (!existingTopic) {
      return null;
    }

    const latestVersion = this.getLatestVersionNumber(id);
    const newVersionNumber = latestVersion + 1;

    const updatedTopic = await this.update(id, {
      ...updates,
      version: newVersionNumber,
    });

    if (updatedTopic) {
      this.addNewVersion(updatedTopic);
    }

    return updatedTopic;
  }

  private getLatestVersionNumber(topicId: string): number {
    const versions = this.topicVersions.get(topicId);
    if (!versions || versions.length === 0) {
      return 0; // Or throw an error, depending on desired behavior
    }
    return Math.max(...versions.map((v) => v.version));
  }

  private addNewVersion(topic: Topic): void {
    const versions = this.topicVersions.get(topic.id) || [];
    versions.push(TopicVersionFactory.createNextVersion(topic));
    this.topicVersions.set(topic.id, versions);
  }

  getVersions(topicId: string): Promise<TopicVersion[]> {
    return Promise.resolve(this.topicVersions.get(topicId) || []);
  }

  getVersion(
    topicId: string,
    version: number,
  ): Promise<TopicVersion | null> {
    const versions = this.topicVersions.get(topicId);
    if (!versions) {
      return Promise.resolve(null);
    }
    return Promise.resolve(versions.find((v) => v.version === version) || null);
  }

  async getChildren(parentTopicId: string): Promise<Topic[]> {
    const allTopics = await this.findAll();
    return allTopics.filter((topic) => topic.parentTopicId === parentTopicId);
  }

  async searchTopics(searchTerm: string): Promise<Topic[]> {
    const allTopics = await this.findAll();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allTopics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        topic.content.toLowerCase().includes(lowerCaseSearchTerm),
    );
  }

  override async delete(id: string): Promise<boolean> {
    const deleted = await super.delete(id);
    if (deleted) {
      this.topicVersions.delete(id);
    }
    return deleted;
  }
}
