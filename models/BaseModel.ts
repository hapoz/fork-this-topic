import { BaseEntity } from '@/types/index.ts';
import { AbstractRepository } from './AbstractRepository.ts';

export class BaseModel<T extends BaseEntity> extends AbstractRepository<T> {
  protected data: Map<string, T> = new Map();

  protected override generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  protected override createBaseEntity(): Omit<BaseEntity, 'id'> {
    const now = new Date();
    return {
      createdAt: now,
      updatedAt: now,
    };
  }

  override findAll(): Promise<T[]> {
    return Promise.resolve(Array.from(this.data.values()));
  }

  override findById(id: string): Promise<T | null> {
    return Promise.resolve(this.data.get(id) || null);
  }

  override create(
    entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<T> {
    const id = this.generateId();
    const baseEntity = this.createBaseEntity();

    const newEntity = {
      ...entity,
      ...baseEntity,
      id,
    } as T;

    this.data.set(id, newEntity);
    return Promise.resolve(newEntity);
  }

  override update(
    id: string,
    updates: Partial<Omit<T, 'id' | 'createdAt'>>,
  ): Promise<T | null> {
    const entity = this.data.get(id);
    if (!entity) {
      return Promise.resolve(null);
    }

    const updatedEntity = {
      ...entity,
      ...updates,
      updatedAt: new Date(),
    } as T;

    this.data.set(id, updatedEntity);
    return Promise.resolve(updatedEntity);
  }

  override delete(id: string): Promise<boolean> {
    return Promise.resolve(this.data.delete(id));
  }

  override exists(id: string): Promise<boolean> {
    return Promise.resolve(this.data.has(id));
  }

  override count(): Promise<number> {
    return Promise.resolve(this.data.size);
  }
}
