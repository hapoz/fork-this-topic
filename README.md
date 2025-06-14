# Dynamic Knowledge Base API

A RESTful API for a Dynamic Knowledge Base System with version control and hierarchical topics, built with Deno and Express.js.

## 🚀 Features

- **Hierarchical Topics**: Organize knowledge in a tree structure
- **Resource Management**: Attach various types of resources to topics
- **Version Control**: Track changes and maintain history
- **User Authentication**: Secure API with role-based access
- **RESTful Design**: Clean, intuitive API endpoints
- **TypeScript**: Full type safety and modern development experience

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

### Development Utilities

The project includes a comprehensive development utilities module (`utils/dev-tools.ts`) with:

- **Logging**: Structured logging with configurable levels
- **Performance Monitoring**: Memory usage and system information
- **Environment Validation**: Check required environment variables
- **Health Checks**: Generate health check responses
- **Performance Measurement**: Time function execution

## 📁 Project Structure

```
├── main.ts                 # Application entry point
├── deno.json              # Deno configuration and tasks
├── deno.lock              # Dependency lock file
├── models/                # Data models
├── services/              # Business logic services
├── controllers/           # Request handlers
├── routes/                # API route definitions
├── auth/                  # Authentication middleware
├── utils/                 # Utility functions
│   └── dev-tools.ts      # Development utilities
├── test/                  # Test files
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
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

### Performance Measurement

```typescript
import { devTools } from '@/utils/dev-tools.ts';

const result = await devTools.measurePerformance('API Call', async () => {
  // Your async operation here
  return await someApiCall();
});
```

## 🚀 Deployment

### Development

```bash
deno task dev
```

### Production

```bash
deno task start:prod
```

### Compile to Executable

```bash
deno task compile:release
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
