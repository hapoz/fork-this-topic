import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Models
import { ResourceModel } from './src/models/ResourceModel.ts';
import { TopicModel } from './src/models/TopicModel.ts';
import { UserModel } from './src/models/UserModel.ts';

// Services
import { TopicService } from './src/services/TopicService.ts';

// Controllers
import { TopicController } from './src/controllers/TopicController.ts';

// Routes
import { createTopicRoutes } from './src/routes/topicRoutes.ts';

// Initialize models
const topicModel = new TopicModel();
const resourceModel = new ResourceModel();
const userModel = new UserModel();

// Initialize services
const topicService = new TopicService(topicModel);

// Initialize controllers
const topicController = new TopicController(topicService);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

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

// API routes
app.use('/api/topics', createTopicRoutes(topicController));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 Dynamic Knowledge Base API`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 API docs: http://localhost:${PORT}/api/topics`);
});

export default app; 