import { Resource } from '@/types/index.ts';

export interface IResourceService {
  createResource(
    resourceData: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Resource>;
  getResource(id: string): Promise<Resource | null>;
  updateResource(
    id: string,
    updates: Partial<Omit<Resource, 'id' | 'createdAt'>>,
  ): Promise<Resource | null>;
  deleteResource(id: string): Promise<boolean>;
  getResourcesByTopic(topicId: string): Promise<Resource[]>;
  getResourcesByType(type: string): Promise<Resource[]>;
  searchResources(searchTerm: string): Promise<Resource[]>;
}
