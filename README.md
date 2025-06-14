# Dynamic Knowledge Base API

A RESTful API for a Dynamic Knowledge Base System with version control and hierarchical topics, built with Deno, Express.js, and **Memcached** for high-performance in-memory storage.

## 🚀 Features

- **Hierarchical Topics**: Organize knowledge in a tree structure
- **Resource Management**: Attach various types of resources to topics
- **Version Control**: Track changes and maintain history
- **User Authentication**: Secure API with role-based access
- **RESTful Design**: Clean, intuitive API endpoints
- **TypeScript**: Full type safety and modern development experience
- **Memcached Database**: High-performance in-memory storage with persistence

## 🗄️ Database: Memcached

This project uses **Memcached** as the primary database for high-performance in-memory storage:

### **Benefits of Memcached**

- ⚡ **Ultra-fast**: In-memory storage for maximum performance
- 🔄 **Persistent**: Data survives container restarts (with proper configuration)
- 📈 **Scalable**: Can be clustered for high availability
- 🛡️ **Reliable**: Battle-tested in production environments
- 💾 **Memory Efficient**: Automatic eviction policies

### **Database Architecture**

- **Key-Value Storage**: Each entity stored with unique keys
- **Indexed Collections**: Maintains indexes for fast queries
- **JSON Serialization**: Complex objects stored as JSON strings
- **TTL Support**: Optional expiration for cache management
- **Health Monitoring**: Built-in health checks and statistics

### **Data Structure**

```
topics:index → [topic_id_1, topic_id_2, ...]
topics:topic_id_1 → { id, name, content, version, ... }
topics:topic_id_2 → { id, name, content, version, ... }

users:index → [user_id_1, user_id_2, ...]
users:user_id_1 → { id, name, email, role, ... }

resources:index → [resource_id_1, resource_id_2, ...]
resources:resource_id_1 → { id, topicId, url, type, ... }
```

## 🛠️ Development Tools

This project includes comprehensive Deno tooling for development, testing, and deployment:

### Available Tasks

```bash
# Development
deno task dev              # Start development server with hot reload
deno task start            # Start production server
deno task start:prod       # Start optimized production server
deno task preview          # Preview mode with watch

# Testing
deno task test             # Run all tests
deno task test:watch       # Run tests with watch mode
deno task test:coverage    # Run tests with coverage report
deno task test:unit        # Run unit tests only
deno task test:integration # Run integration tests only
deno task test:patterns    # Run pattern tests only

# Code Quality
deno task fmt              # Format code
deno task fmt:check        # Check code formatting
deno task lint             # Lint code
deno task lint:fix         # Fix linting issues
deno task check            # Type check main file
deno task check:all        # Type check all files

# Performance
deno task bench            # Run performance benchmarks

# Documentation
deno task doc              # Generate documentation
deno task doc:serve        # Serve documentation on port 8080

# Build & Deploy
deno task compile          # Compile to executable
deno task compile:release  # Compile for Linux deployment

# Cache Management
deno task cache            # Cache dependencies
deno task cache:reload     # Reload cache

# Validation & CI
deno task validate         # Run all validations (fmt, lint, check)
deno task ci               # Run CI checks with coverage

# Utilities
deno task upgrade          # Upgrade Deno
deno task info             # Show project info
deno task clean            # Clean cache and coverage
```

### Development Setup

Run the development setup script to validate your environment:

```bash
deno run --allow-env --allow-read scripts/dev-setup.ts
```

This will check:

- ✅ Deno version compatibility
- ✅ Environment variables
- ✅ Dependencies configuration
- ✅ File structure
- ✅ Required permissions
- ✅ Memcached connectivity

### Performance Benchmarks

Run performance benchmarks to measure API performance:

```bash
deno task bench
```

Benchmarks include:

- Topic creation and updates
- Resource management
- JSON serialization/deserialization
- UUID generation
- Array operations
- Memcached operations

### Development Utilities

The project includes a comprehensive development utilities module (`utils/dev-tools.ts`) with:

- **Logging**: Structured logging with configurable levels
- **Performance Monitoring**: Memory usage and system information
- **Environment Validation**: Check required environment variables
- **Health Checks**: Generate health check responses with database status
- **Performance Measurement**: Time function execution

## 📁 Project Structure

```
├── main.ts                 # Application entry point
├── deno.json              # Deno configuration and tasks
├── deno.lock              # Dependency lock file
├── database/              # Database layer
│   └── MemcachedAdapter.ts # Memcached database adapter
├── models/                # Data models
│   ├── MemcachedBaseModel.ts # Base model for Memcached
│   ├── TopicModel.ts      # Topic model
│   ├── UserModel.ts       # User model
│   └── ResourceModel.ts   # Resource model
├── services/              # Business logic services
├── controllers/           # Request handlers
├── routes/                # API route definitions
├── auth/                  # Authentication middleware
├── utils/                 # Utility functions
│   └── dev-tools.ts      # Development utilities
├── test/                  # Test files
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   │   └── memcached.test.ts # Memcached integration tests
│   └── patterns/         # Pattern tests
├── benchmarks/           # Performance benchmarks
│   └── simple.bench.ts   # Simple benchmarks
├── scripts/              # Development scripts
│   └── dev-setup.ts      # Development setup validation
└── docs/                 # Documentation
```

## 🔧 Configuration

### Environment Variables

```bash
PORT=3000                 # Server port
NODE_ENV=development      # Environment (development/production)
DEBUG=true               # Enable debug logging
LOG_LEVEL=info          # Log level (debug/info/warn/error)
HOST=localhost          # Server host

# Memcached Configuration
MEMCACHED_HOST=localhost # Memcached server host
MEMCACHED_PORT=11211    # Memcached server port
```

### Deno Configuration

The `deno.json` file includes:

- **Tasks**: Comprehensive development and deployment commands
- **Imports**: Dependency management with version pinning
- **Compiler Options**: Strict TypeScript configuration
- **Linting**: Recommended rules with custom exclusions
- **Formatting**: Consistent code style configuration
- **Testing**: Test file patterns and exclusions

## 🧪 Testing

The project supports multiple testing approaches:

### Unit Tests

```bash
deno task test:unit
```

### Integration Tests

```bash
deno task test:integration
```

### Memcached Integration Tests

```bash
deno task test:integration
```

### Pattern Tests

```bash
deno task test:patterns
```

### Coverage Reports

```bash
deno task test:coverage
```

## 📊 Performance Monitoring

### Memory Usage

```typescript
import { devTools } from '@/utils/dev-tools.ts';

const memory = devTools.getMemoryUsage();
console.log(`Memory usage: ${memory.heapUsed}MB`);
```

### Database Health

```typescript
import { db } from '@/database/MemcachedAdapter.ts';

const health = await db.healthCheck();
console.log(`Database status: ${health.status}`);
```

### Performance Measurement

```typescript
import { devTools } from '@/utils/dev-tools.ts';

const result = await devTools.measurePerformance('API Call', async () => {
  // Your async operation here
  return await someApiCall();
});
```

## 🚀 Deployment

### Development with Docker

```bash
# Start with Memcached
docker-compose up

# Or run in detached mode
docker-compose up -d
```

### Production with Docker

```bash
# Set environment variables
export JWT_SECRET=your-production-secret-key
export NODE_ENV=production

# Start production services with Memcached
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Local Development

```bash
# Start Memcached locally
docker run -d -p 11211:11211 --name memcached memcached:1.6-alpine

# Start the API
deno task dev
```

## 🔍 Code Quality

### Formatting

```bash
deno task fmt
```

### Linting

```bash
deno task lint
```

### Type Checking

```bash
deno task check:all
```

### Full Validation

```bash
deno task validate
```

## 📚 Documentation

### Generate Documentation

```bash
deno task doc
```

### Serve Documentation

```bash
deno task doc:serve
```

## 🤝 Contributing

1. **Setup**: Run `deno run --allow-env --allow-read scripts/dev-setup.ts`
2. **Development**: Use `deno task dev` for development
3. **Testing**: Run `deno task test` before committing
4. **Validation**: Run `deno task validate` to ensure code quality
5. **Benchmarks**: Run `deno task bench` to check performance

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

1. Check the development setup: `deno run --allow-env --allow-read scripts/dev-setup.ts`
2. Run validation: `deno task validate`
3. Check documentation: `deno task doc:serve`
4. Verify Memcached connectivity: Check health endpoint `/health`
