import { MemcachedAdapter } from '@/database/MemcachedAdapter.ts';
import { MemcachedBaseModel } from '@/models/MemcachedBaseModel.ts';
import { Resource, ResourceType } from '@/types/index.ts';

export class ResourceModel extends MemcachedBaseModel<Resource> {
  constructor(db: MemcachedAdapter) {
    super(db, 'resources');
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
