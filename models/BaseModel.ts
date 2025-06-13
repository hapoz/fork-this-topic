import { BaseEntity } from '../types/index.ts';

export abstract class BaseModel<T extends BaseEntity> {
  protected data: Map<string, T> = new Map();

  protected generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  protected createBaseEntity(): Omit<BaseEntity, 'id'> {
    const now = new Date();
    return {
      createdAt: now,
      updatedAt: now,
    };
  }

  async findAll(): Promise<T[]> {
    return Array.from(this.data.values());
  }

  async findById(id: string): Promise<T | null> {
    return this.data.get(id) || null;
  }

  async create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const id = this.generateId();
    const baseEntity = this.createBaseEntity();
    
    const newEntity = {
      ...entity,
      ...baseEntity,
      id,
    } as T;

    this.data.set(id, newEntity);
    return newEntity;
  }

  async update(id: string, updates: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | null> {
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
    return updatedEntity;
  }

  async delete(id: string): Promise<boolean> {
    return this.data.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.data.has(id);
  }

  async count(): Promise<number> {
    return this.data.size;
  }
} 