/**
 * Development utilities for the Dynamic Knowledge Base API
 */

export interface DevConfig {
  port: number;
  host: string;
  debug: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export class DevTools {
  private static instance: DevTools;
  private config: DevConfig;

  private constructor() {
    this.config = {
      port: parseInt(Deno.env.get('PORT') || '3000'),
      host: Deno.env.get('HOST') || 'localhost',
      debug: Deno.env.get('DEBUG') === 'true',
      logLevel: (Deno.env.get('LOG_LEVEL') as DevConfig['logLevel']) || 'info',
    };
  }

  static getInstance(): DevTools {
    if (!DevTools.instance) {
      DevTools.instance = new DevTools();
    }
    return DevTools.instance;
  }

  /**
   * Get current configuration
   */
  getConfig(): DevConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<DevConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Log message with appropriate level
   */
  log(level: DevConfig['logLevel'], message: string, data?: unknown): void {
    if (this.shouldLog(level)) {
      const timestamp = new Date().toISOString();
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

      if (data) {
        console.log(`${prefix} ${message}`, data);
      } else {
        console.log(`${prefix} ${message}`);
      }
    }
  }

  /**
   * Debug logging
   */
  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  /**
   * Info logging
   */
  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  /**
   * Warning logging
   */
  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  /**
   * Error logging
   */
  error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }

  /**
   * Check if should log based on current log level
   */
  private shouldLog(level: DevConfig['logLevel']): boolean {
    const levels: DevConfig['logLevel'][] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Get memory usage information
   */
  getMemoryUsage(): {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  } {
    const usage = Deno.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024), // MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
      external: Math.round(usage.external / 1024 / 1024), // MB
    };
  }

  /**
   * Get system information
   */
  getSystemInfo(): {
    denoVersion: string;
    platform: string;
    arch: string;
    cwd: string;
  } {
    return {
      denoVersion: Deno.version.deno,
      platform: Deno.build.os,
      arch: Deno.build.arch,
      cwd: Deno.cwd(),
    };
  }

  /**
   * Validate environment variables
   */
  validateEnv(): { valid: boolean; missing: string[]; warnings: string[] } {
    const required = ['PORT', 'NODE_ENV'];
    const optional = ['DEBUG', 'LOG_LEVEL', 'HOST'];
    const missing: string[] = [];
    const warnings: string[] = [];

    // Check required env vars
    for (const env of required) {
      if (!Deno.env.get(env)) {
        missing.push(env);
      }
    }

    // Check optional env vars
    for (const env of optional) {
      if (!Deno.env.get(env)) {
        warnings.push(`${env} not set, using default value`);
      }
    }

    return { valid: missing.length === 0, missing, warnings };
  }

  /**
   * Generate a simple performance measurement
   */
  async measurePerformance<T>(
    name: string,
    fn: () => Promise<T> | T,
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const end = performance.now();
      const duration = Math.round(end - start);
      this.info(`Performance [${name}]: ${duration}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      const duration = Math.round(end - start);
      this.error(`Performance [${name}] failed after ${duration}ms:`, error);
      throw error;
    }
  }

  /**
   * Create a health check response
   */
  createHealthResponse(): {
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    uptime: number;
    memory: ReturnType<typeof this.getMemoryUsage>;
    system: ReturnType<typeof this.getSystemInfo>;
  } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: performance.now(),
      memory: this.getMemoryUsage(),
      system: this.getSystemInfo(),
    };
  }
}

// Export singleton instance
export const devTools = DevTools.getInstance();

// Utility functions
export function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  return `${Math.round(ms / 60000)}m`;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve: () => void) => setTimeout(resolve, ms));
}
