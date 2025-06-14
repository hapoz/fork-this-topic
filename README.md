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
deno task openapi:serve    # Serve OpenAPI documentation on port 8081
deno task openapi:validate # Validate OpenAPI specification

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
│   ├── dev-setup.ts      # Development setup validation
│   ├── serve-openapi.ts  # OpenAPI documentation server
│   └── validate-openapi.ts # OpenAPI validation
└── docs/                 # Documentation
    └── openapi.yaml      # OpenAPI specification
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

### OpenAPI Documentation

The project includes comprehensive OpenAPI 3.0.3 specification that documents all API endpoints:

#### **Features:**

- **Complete API Coverage**: All endpoints documented with examples
- **Interactive Documentation**: Swagger UI for testing endpoints
- **Authentication**: JWT bearer token documentation
- **Request/Response Examples**: Detailed examples for all operations
- **Schema Definitions**: Complete data models and types
- **Error Responses**: All possible error scenarios documented

#### **Serve OpenAPI Documentation:**

```bash
deno task openapi:serve
```

This starts a documentation server at `http://localhost:8081` with:

- 📖 **Interactive Swagger UI**: Test endpoints directly in the browser
- 🔗 **OpenAPI Spec**: Raw YAML at `/openapi.yaml`
- 💚 **Health Check**: Server status at `/health`

#### **Validate OpenAPI Specification:**

```bash
deno task openapi:validate
```

This validates the OpenAPI specification for:

- ✅ **Structure**: Required fields and format
- ✅ **Schemas**: Data model consistency
- ✅ **References**: All schema references exist
- ✅ **Security**: Authentication schemes
- ✅ **Paths**: Endpoint definitions

#### **API Documentation Features:**

**Authentication:**

```yaml
security:
  - bearerAuth: []
```

**Rate Limiting:**

- 100 requests per 15 minutes per IP
- Documented in all endpoints

**Response Formats:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

**Error Handling:**

```json
{
  "success": false,
  "error": "Resource not found",
  "message": "The requested resource was not found"
}
```

#### **Documented Endpoints:**

**Health & System:**

- `GET /health` - System health check with database status

**Authentication:**

- `POST /api/users/login` - User authentication

**Users:**

- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `GET /api/users/role/{role}` - Get users by role

**Topics:**

- `POST /api/topics` - Create topic
- `GET /api/topics` - Get all topics (with filtering)
- `GET /api/topics/{id}` - Get topic by ID
- `PUT /api/topics/{id}` - Update topic (creates new version)
- `DELETE /api/topics/{id}` - Delete topic
- `GET /api/topics/{id}/tree` - Get topic tree structure
- `GET /api/topics/{id}/versions` - Get topic versions
- `GET /api/topics/{id}/versions/{version}` - Get specific version
- `GET /api/topics/search` - Search topics
- `GET /api/topics/path/{from}/{to}` - Find shortest path

**Resources:**

- `POST /api/resources` - Create resource
- `GET /api/resources` - Get all resources (with filtering)
- `GET /api/resources/{id}` - Get resource by ID
- `PUT /api/resources/{id}` - Update resource
- `DELETE /api/resources/{id}` - Delete resource
- `GET /api/resources/search` - Search resources

**Admin:**

- `GET /api/admin/users` - Get all users (admin only)

#### **Data Models:**

**User:**

```yaml
User:
  properties:
    id: string
    name: string
    email: string
    role: UserRole
    createdAt: date-time
    updatedAt: date-time
```

**Topic:**

```yaml
Topic:
  properties:
    id: string
    name: string
    content: string
    version: integer
    parentTopicId: string (nullable)
    createdAt: date-time
    updatedAt: date-time
```

**Resource:**

```yaml
Resource:
  properties:
    id: string
    topicId: string
    url: string
    description: string
    type: ResourceType
    createdAt: date-time
    updatedAt: date-time
```

#### **Integration with Development Tools:**

**VS Code Tasks:**

- `Deno: Serve OpenAPI` - Start documentation server
- `Deno: Validate OpenAPI` - Validate specification

**CI/CD Integration:**

```bash
# Validate OpenAPI spec in CI
deno task openapi:validate
```

**Development Workflow:**

1. Update API endpoints
2. Update OpenAPI specification
3. Validate with `deno task openapi:validate`
4. Serve documentation with `deno task openapi:serve`
5. Test endpoints in Swagger UI

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
