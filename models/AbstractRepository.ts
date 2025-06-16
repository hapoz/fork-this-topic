import { BaseEntity } from '@/types/index.ts';
import { IRepository } from '@/types/interfaces/IRepository.ts';

export abstract class AbstractRepository<T extends BaseEntity>
  implements IRepository<T> {
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

  abstract findAll(): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract create(
    entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<T>;
  abstract update(
    id: string,
    updates: Partial<Omit<T, 'id' | 'createdAt'>>,
  ): Promise<T | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract exists(id: string): Promise<boolean>;
  abstract count(): Promise<number>;
}
