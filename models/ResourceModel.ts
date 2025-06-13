import { Resource } from '../types/index.ts';
import { BaseModel } from './BaseModel.ts';

export class ResourceModel extends BaseModel<Resource> {
  async findByTopicId(topicId: string): Promise<Resource[]> {
    const allResources = await this.findAll();
    return allResources.filter((resource) => resource.topicId === topicId);
  }

  async findByType(type: string): Promise<Resource[]> {
    const allResources = await this.findAll();
    return allResources.filter((resource) => resource.type === type);
  }

  async searchResources(searchTerm: string): Promise<Resource[]> {
    const allResources = await this.findAll();
    const term = searchTerm.toLowerCase();
    return allResources.filter((resource) =>
      resource.description.toLowerCase().includes(term) ||
      resource.url.toLowerCase().includes(term)
    );
  }
}
