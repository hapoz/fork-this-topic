import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

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

// Initialize models
const topicModel = new TopicModel();
const resourceModel = new ResourceModel();
const userModel = new UserModel();

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
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
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error('Error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  },
);

// Start server
app.listen(parseInt(PORT), () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 Dynamic Knowledge Base API`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 API docs:`);
  console.log(`   - Topics: http://localhost:${PORT}/api/topics`);
  console.log(`   - Resources: http://localhost:${PORT}/api/resources`);
  console.log(`   - Users: http://localhost:${PORT}/api/users`);
  console.log(`   - Admin: http://localhost:${PORT}/api/admin/users`);
});

export default app;
