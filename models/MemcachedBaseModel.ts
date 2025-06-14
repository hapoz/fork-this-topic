import { MemcachedAdapter } from '@/database/MemcachedAdapter.ts';
import { BaseEntity } from '@/types/index.ts';

export abstract class MemcachedBaseModel<T extends BaseEntity> {
  protected db: MemcachedAdapter;
  protected collectionPrefix: string;

  constructor(db: MemcachedAdapter, collectionPrefix: string) {
    this.db = db;
    this.collectionPrefix = collectionPrefix;
  }

  protected generateId(): string {
    return crypto.randomUUID();
  }

  protected createBaseEntity(): Omit<BaseEntity, 'id'> {
    const now = new Date();
    return {
      createdAt: now,
      updatedAt: now,
    };
  }

  protected getKey(id: string): string {
    return `${this.collectionPrefix}:${id}`;
  }

  protected getIndexKey(): string {
    return `${this.collectionPrefix}:index`;
  }

  async findAll(): Promise<T[]> {
    try {
      const indexKey = this.getIndexKey();
      const index = await this.db.get<string[]>(indexKey) || [];

      if (index.length === 0) {
        return [];
      }

      const keys = index.map((id) => this.getKey(id));
      const entities = await this.db.getMultiple<T>(keys);

      return Array.from(entities.values());
    } catch (error) {
      console.error('❌ Error finding all entities:', error);
      return [];
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      const key = this.getKey(id);
      return await this.db.get<T>(key);
    } catch (error) {
      console.error(`❌ Error finding entity by id ${id}:`, error);
      return null;
    }
  }

  async create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    try {
      const id = this.generateId();
      const baseEntity = this.createBaseEntity();

      const newEntity = {
        ...entity,
        ...baseEntity,
        id,
      } as T;

      const key = this.getKey(id);

      // Save the entity
      const saved = await this.db.set(key, newEntity);
      if (!saved) {
        throw new Error('Failed to save entity to Memcached');
      }

      // Update the index
      await this.addToIndex(id);

      return newEntity;
    } catch (error) {
      console.error('❌ Error creating entity:', error);
      throw error;
    }
  }

  async update(
    id: string,
    updates: Partial<Omit<T, 'id' | 'createdAt'>>,
  ): Promise<T | null> {
    try {
      const existingEntity = await this.findById(id);
      if (!existingEntity) {
        return null;
      }

      const updatedEntity = {
        ...existingEntity,
        ...updates,
        updatedAt: new Date(),
      } as T;

      const key = this.getKey(id);
      const saved = await this.db.set(key, updatedEntity);

      if (!saved) {
        throw new Error('Failed to update entity in Memcached');
      }

      return updatedEntity;
    } catch (error) {
      console.error(`❌ Error updating entity ${id}:`, error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const key = this.getKey(id);
      const deleted = await this.db.delete(key);

      if (deleted) {
        // Remove from index
        await this.removeFromIndex(id);
      }

      return deleted;
    } catch (error) {
      console.error(`❌ Error deleting entity ${id}:`, error);
      return false;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const key = this.getKey(id);
      return await this.db.exists(key);
    } catch (error) {
      console.error(`❌ Error checking existence of entity ${id}:`, error);
      return false;
    }
  }

  async count(): Promise<number> {
    try {
      const indexKey = this.getIndexKey();
      const index = await this.db.get<string[]>(indexKey) || [];
      return index.length;
    } catch (error) {
      console.error('❌ Error counting entities:', error);
      return 0;
    }
  }

  private async addToIndex(id: string): Promise<void> {
    try {
      const indexKey = this.getIndexKey();
      const index = await this.db.get<string[]>(indexKey) || [];

      if (!index.includes(id)) {
        index.push(id);
        await this.db.set(indexKey, index);
      }
    } catch (error) {
      console.error(`❌ Error adding ${id} to index:`, error);
    }
  }

  private async removeFromIndex(id: string): Promise<void> {
    try {
      const indexKey = this.getIndexKey();
      const index = await this.db.get<string[]>(indexKey) || [];

      const filteredIndex = index.filter((indexId) => indexId !== id);
      await this.db.set(indexKey, filteredIndex);
    } catch (error) {
      console.error(`❌ Error removing ${id} from index:`, error);
    }
  }

  /**
   * Search entities by a custom filter function
   */
  async search(filterFn: (entity: T) => boolean): Promise<T[]> {
    try {
      const allEntities = await this.findAll();
      return allEntities.filter(filterFn);
    } catch (error) {
      console.error('❌ Error searching entities:', error);
      return [];
    }
  }

  /**
   * Get entities by a specific field value
   */
  async findByField<K extends keyof T>(field: K, value: T[K]): Promise<T[]> {
    try {
      return await this.search((entity) => entity[field] === value);
    } catch (error) {
      console.error(
        `❌ Error finding entities by field ${String(field)}:`,
        error,
      );
      return [];
    }
  }

  /**
   * Get a single entity by a specific field value
   */
  async findOneByField<K extends keyof T>(
    field: K,
    value: T[K],
  ): Promise<T | null> {
    try {
      const entities = await this.findByField(field, value);
      return entities.length > 0 ? entities[0] || null : null;
    } catch (error) {
      console.error(
        `❌ Error finding entity by field ${String(field)}:`,
        error,
      );
      return null;
    }
  }
}
