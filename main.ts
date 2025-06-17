import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Database
import { MemcachedAdapter } from '@/database/MemcachedAdapter.ts';

// Models
import { ResourceModel } from '@/models/ResourceModel.ts';
import { TopicModel } from '@/models/TopicModel.ts';
import { UserModel } from '@/models/UserModel.ts';

// Services
import { ResourceService } from '@/services/ResourceService.ts';
import { TopicService } from '@/services/TopicService.ts';
import { UserService } from '@/services/UserService.ts';

// Controllers
import { ResourceController } from '@/controllers/ResourceController.ts';
import { TopicController } from '@/controllers/TopicController.ts';
import { UserController } from '@/controllers/UserController.ts';

// Routes
import { createResourceRoutes } from '@/routes/resourceRoutes.ts';
import { createTopicRoutes } from '@/routes/topicRoutes.ts';
import { createUserRoutes } from '@/routes/userRoutes.ts';

// Auth Middleware
import { AuthMiddleware } from '@/auth/AuthMiddleware.ts';

// Development tools
import { devTools } from '@/utils/dev-tools.ts';

// Initialize Memcached database
const memcachedConfig = {
  host: Deno.env.get('MEMCACHED_HOST') || 'localhost',
  port: parseInt(Deno.env.get('MEMCACHED_PORT') || '11211'),
  timeout: 5000,
  retries: 3,
};

const db = new MemcachedAdapter(memcachedConfig);

// Initialize models with Memcached
const topicModel = new TopicModel(db);
const resourceModel = new ResourceModel(db);
const userModel = new UserModel(db);

// Initialize services
const topicService = new TopicService(topicModel);
const resourceService = new ResourceService(resourceModel);
const userService = new UserService(userModel);

// Initialize controllers
const topicController = new TopicController(topicService);
const resourceController = new ResourceController(resourceService);
const userController = new UserController(userService);

// Create Express app
const app = express();
const PORT = Deno.env.get('PORT') || '3000';

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint with database status
app.get('/health', async (_req: express.Request, res: express.Response) => {
  try {
    const dbHealth = await db.healthCheck();
    const healthResponse = devTools.createHealthResponse();

    res.status(200).json({
      ...healthResponse,
      database: dbHealth,
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
    });
  } catch (_error: unknown) {
    console.error('❌ Failed to start server:', _error);
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      timestamp: new Date().toISOString(),
    });
  }
});

// Public routes (no authentication required)
app.use('/api/users', createUserRoutes(userController));

// Protected routes (authentication required)
app.use(
  '/api/topics',
  AuthMiddleware.authenticate,
  createTopicRoutes(topicController),
);
app.use(
  '/api/resources',
  AuthMiddleware.authenticate,
  createResourceRoutes(resourceController),
);

// Admin-only routes
app.use(
  '/api/admin/users',
  AuthMiddleware.authenticate,
  AuthMiddleware.requireAdmin,
  createUserRoutes(userController),
);

// 404 handler
app.use('*', (_req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error('Error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  },
);

// Start server with database connection
async function startServer() {
  try {
    // Connect to Memcached
    await db.connect();
    devTools.info('Connected to Memcached database');

    // Start Express server
    app.listen(parseInt(PORT), () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📚 Dynamic Knowledge Base API`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📖 API docs:`);
      console.log(`   - Topics: http://localhost:${PORT}/api/topics`);
      console.log(`   - Resources: http://localhost:${PORT}/api/resources`);
      console.log(`   - Users: http://localhost:${PORT}/api/users`);
      console.log(`   - Admin: http://localhost:${PORT}/api/admin/users`);
      console.log(
        `💾 Database: Memcached (${memcachedConfig.host}:${memcachedConfig.port})`,
      );
    });
  } catch (_error: unknown) {
    console.error('❌ Failed to start server:', _error);
    // Deno.exit(1);
  }
}

// Graceful shutdown
Deno.addSignalListener('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await db.disconnect();
  Deno.exit(0);
});

Deno.addSignalListener('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await db.disconnect();
  Deno.exit(0);
});

// Start the server
startServer();

export default app;
