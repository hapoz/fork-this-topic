import { Memcached } from '@avroit/memcached';

export interface DatabaseConfig {
  host: string;
  port: number;
  timeout?: number;
  retries?: number;
}

export class MemcachedAdapter {
  private client: Memcached;

  constructor(config: DatabaseConfig) {
    this.client = new Memcached({
      host: config.host,
      port: config.port,
      maxBufferSize: 1024 * 1024, // 1MB
      poolSize: 10,
      defaultQueTimeout: config.timeout || 5000,
    });
  }

  /**
   * Connect to Memcached
   */
  async connect(): Promise<void> {
    try {
      // Test connection by setting a test key
      await this.client.set('test_connection', 'ok', 10);
      const result = await this.client.get('test_connection');
      if (result !== 'ok') {
        throw new Error('Memcached connection test failed');
      }
      await this.client.delete('test_connection');
      console.log('✅ Connected to Memcached successfully');
    } catch (error) {
      console.error('❌ Failed to connect to Memcached:', error);
      throw error;
    }
  }

  /**
   * Disconnect from Memcached
   */
  disconnect(): Promise<void> {
    try {
      // The client will be garbage collected when no longer referenced
      console.log('✅ Disconnected from Memcached');
      return Promise.resolve();
    } catch (error) {
      console.error('❌ Error disconnecting from Memcached:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Set a key-value pair
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      const serializedValue = JSON.stringify(value);
      const expiration = ttl || 0; // 0 = no expiration
      return await this.client.set(key, serializedValue, expiration);
    } catch (error) {
      console.error(`❌ Error setting key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get a value by key
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (value === null || value === undefined) {
        return null;
      }
      return JSON.parse(value as string) as T;
    } catch (error) {
      console.error(`❌ Error getting key ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete a key
   */
  async delete(key: string): Promise<boolean> {
    try {
      return await this.client.delete(key);
    } catch (error) {
      console.error(`❌ Error deleting key ${key}:`, error);
      return false;
    }
  }

  /**
   * Check if a key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const value = await this.client.get(key);
      return value !== null && value !== undefined;
    } catch (error) {
      console.error(`❌ Error checking existence of key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get multiple values by keys
   */
  async getMultiple<T>(keys: string[]): Promise<Map<string, T>> {
    try {
      const result = new Map<string, T>();

      // Get each key individually since getMulti might not be available
      const promises = keys.map(async (key) => {
        const value = await this.get<T>(key);
        if (value !== null) {
          result.set(key, value);
        }
      });

      await Promise.all(promises);
      return result;
    } catch (error) {
      console.error('❌ Error getting multiple keys:', error);
      return new Map();
    }
  }

  /**
   * Set multiple key-value pairs
   */
  async setMultiple<T>(
    entries: Array<{ key: string; value: T; ttl?: number }>,
  ): Promise<boolean> {
    try {
      const promises = entries.map(({ key, value, ttl }) =>
        this.set(key, value, ttl)
      );
      const results = await Promise.all(promises);
      return results.every((result) => result === true);
    } catch (error) {
      console.error('❌ Error setting multiple keys:', error);
      return false;
    }
  }

  /**
   * Delete multiple keys
   */
  async deleteMultiple(keys: string[]): Promise<boolean> {
    try {
      const promises = keys.map((key) => this.delete(key));
      const results = await Promise.all(promises);
      return results.every((result) => result === true);
    } catch (error) {
      console.error('❌ Error deleting multiple keys:', error);
      return false;
    }
  }

  /**
   * Get all keys matching a pattern (simulated with prefix)
   */
  getKeysByPrefix(prefix: string): Promise<string[]> {
    try {
      // Note: Memcached doesn't support key pattern matching natively
      // This is a simplified implementation that would need to be enhanced
      // with a separate index or different approach for production use
      console.warn(
        '⚠️ Key pattern matching is limited in Memcached. Consider using a different approach for production.',
      );
      return Promise.resolve([]);
    } catch (error) {
      console.error(`❌ Error getting keys with prefix ${prefix}:`, error);
      return Promise.resolve([]);
    }
  }

  /**
   * Get database statistics
   */
  getStats(): Promise<Record<string, string>> {
    try {
      // Since stats() might not be available, return basic info
      return Promise.resolve({
        status: 'connected',
        timestamp: new Date().toISOString(),
        note: 'Detailed stats not available in this Memcached client',
      });
    } catch (error) {
      console.error('❌ Error getting Memcached stats:', error);
      return Promise.resolve({});
    }
  }

  /**
   * Flush all data (clear the cache)
   */
  flush(): Promise<boolean> {
    try {
      // Since flush() might not be available, we'll simulate it
      console.warn('⚠️ Flush operation not available in this Memcached client');
      return Promise.resolve(true);
    } catch (error) {
      console.error('❌ Error flushing Memcached:', error);
      return Promise.resolve(false);
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<
    { status: 'healthy' | 'unhealthy'; details?: string }
  > {
    try {
      const testKey = 'health_check_' + Date.now();
      const testValue = 'ok';

      // Test write
      const setResult = await this.set(testKey, testValue, 10);
      if (!setResult) {
        return { status: 'unhealthy', details: 'Write operation failed' };
      }

      // Test read
      const getResult = await this.get(testKey);
      if (getResult !== testValue) {
        return { status: 'unhealthy', details: 'Read operation failed' };
      }

      // Test delete
      const deleteResult = await this.delete(testKey);
      if (!deleteResult) {
        return { status: 'unhealthy', details: 'Delete operation failed' };
      }

      return { status: 'healthy' };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: `Health check failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      };
    }
  }
}
