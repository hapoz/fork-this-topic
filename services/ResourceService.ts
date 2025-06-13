import { ResourceModel } from '../models/ResourceModel.ts';
import { Resource } from '../types/index.ts';
import { IResourceService } from './interfaces/IResourceService.ts';

export class ResourceService implements IResourceService {
  private resourceModel: ResourceModel;

  constructor(resourceModel: ResourceModel) {
    this.resourceModel = resourceModel;
  }

  async createResource(
    resourceData: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Resource> {
    return await this.resourceModel.create(resourceData);
  }

  async getResource(id: string): Promise<Resource | null> {
    return await this.resourceModel.findById(id);
  }

  async updateResource(
    id: string,
    updates: Partial<Omit<Resource, 'id' | 'createdAt'>>,
  ): Promise<Resource | null> {
    return await this.resourceModel.update(id, updates);
  }

  async deleteResource(id: string): Promise<boolean> {
    return await this.resourceModel.delete(id);
  }

  async getResourcesByTopic(topicId: string): Promise<Resource[]> {
    return await this.resourceModel.findByTopicId(topicId);
  }

  async getResourcesByType(type: string): Promise<Resource[]> {
    return await this.resourceModel.findByType(type);
  }

  async searchResources(searchTerm: string): Promise<Resource[]> {
    return await this.resourceModel.searchResources(searchTerm);
  }
}
