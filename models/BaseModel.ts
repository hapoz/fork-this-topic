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

  override async findAll(): Promise<T[]> {
    return Promise.resolve(Array.from(this.data.values()));
  }

  override async findById(id: string): Promise<T | null> {
    return Promise.resolve(this.data.get(id) || null);
  }

  override async create(
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

  override async update(
    id: string,
    updates: Partial<Omit<T, 'id' | 'createdAt'>>,
  ): Promise<T | null> {
    const entity = this.data.get(id);
    if (!entity) {
      return null;
    }

    const updatedEntity = {
      ...entity,
      ...updates,
      updatedAt: new Date(),
    } as T;

    this.data.set(id, updatedEntity);
    return Promise.resolve(updatedEntity);
  }

  override async delete(id: string): Promise<boolean> {
    return Promise.resolve(this.data.delete(id));
  }

  override async exists(id: string): Promise<boolean> {
    return Promise.resolve(this.data.has(id));
  }

  override async count(): Promise<number> {
    return Promise.resolve(this.data.size);
  }
}
