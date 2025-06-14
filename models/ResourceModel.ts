import { MemcachedAdapter } from '@/database/MemcachedAdapter.ts';
import { ResourceFactory } from '@/factories/ResourceFactory.ts';
import { MemcachedBaseModel } from '@/models/MemcachedBaseModel.ts';
import { Resource, ResourceType } from '@/types/index.ts';

export class ResourceModel extends MemcachedBaseModel<Resource> {
  constructor(db: MemcachedAdapter) {
    super(db, 'resources');
  }

  override async create(
    resourceData: Omit<Resource, 'id' | 'createdAt' | 'updated' | 'updatedAt'>,
  ): Promise<Resource> {
    const newResource = ResourceFactory.createResource(resourceData);
    return await super.create(newResource);
  }

  async findByTopicId(topicId: string): Promise<Resource[]> {
    return await this.findByField('topicId', topicId);
  }

  async findByType(type: ResourceType): Promise<Resource[]> {
    return await this.findByField('type', type);
  }

  async searchResources(searchTerm: string): Promise<Resource[]> {
    const term = searchTerm.toLowerCase();
    return await this.search((resource) =>
      resource.description.toLowerCase().includes(term) ||
      resource.url.toLowerCase().includes(term)
    );
  }
}
