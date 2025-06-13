# Dynamic Knowledge Base API

A RESTful API for managing interconnected topics and resources with version
control, user roles, and permissions. Built with **Deno 2**, Express.js, TypeScript, and
following advanced OOP principles and design patterns.

## Features

- **Topic Management**: CRUD operations with hierarchical structure
- **Version Control**: Automatic versioning for all topic updates
- **Custom Algorithms**: Shortest path finding between topics
- **Recursive Topic Trees**: Get complete topic hierarchies
- **Advanced OOP Design**: Abstract classes, interfaces, and design patterns
- **Comprehensive Testing**: Unit and integration tests using Deno's built-in test runner
- **Security**: Rate limiting, CORS, and Helmet protection
- **Deno 2 Integration**: Leveraging Deno's embedded features and modern tooling

## Tech Stack

- **Runtime**: Deno 2 with TypeScript
- **Framework**: Express.js
- **Architecture**: MVC with Service Layer
- **Design Patterns**: Factory, Strategy, Composite
- **Testing**: Deno's built-in test runner with assertions
- **Security**: Helmet, CORS, Rate Limiting
- **Package Management**: Deno's import maps and npm compatibility

## Prerequisites

- **Deno 2** (latest version)
- No Node.js or npm required!

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dynamic-knowledge-base-api
   ```

2. **Start the development server**
   ```bash
   deno task dev
   ```

3. **Run tests**
   ```bash
   deno task test
   ```

4. **Start production server**
   ```bash
   deno task start
   ```

## Available Tasks

```bash
# Development
deno task dev          # Start development server with watch mode
deno task start        # Start production server

# Testing
deno task test         # Run all tests
deno task test:watch   # Run tests in watch mode
deno task test:coverage # Run tests with coverage

# Code Quality
deno task fmt          # Format code
deno task lint         # Lint code
deno task check        # Type check
```

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Health Check

```
GET /health
```

### Topics

#### Create Topic

```
POST /topics
Content-Type: application/json

{
  "name": "JavaScript Fundamentals",
  "content": "JavaScript is a programming language...",
  "parentTopicId": "optional-parent-id"
}
```

#### Get All Topics

```
GET /topics?page=1&limit=10&parentTopicId=parent-id&search=javascript
```

#### Get Topic by ID

```
GET /topics/:id
```

#### Update Topic

```
PUT /topics/:id
Content-Type: application/json

{
  "name": "Updated JavaScript Fundamentals",
  "content": "Updated content..."
}
```

#### Delete Topic

```
DELETE /topics/:id
```

#### Get Topic Versions

```
GET /topics/:topicId/versions
```

#### Get Specific Version

```
GET /topics/:topicId/versions/:version
```

#### Get Topic Tree (Recursive)

```
GET /topics/:topicId/tree
```

#### Find Shortest Path

```
GET /topics/:fromTopicId/path/:toTopicId
```

#### Search Topics

```
GET /topics/search?q=javascript
```

## Architecture

### Design Patterns Used

1. **Factory Pattern**: For creating different versions of topics
2. **Strategy Pattern**: For different user roles and permissions
3. **Composite Pattern**: For hierarchical topic structures
4. **Repository Pattern**: For data access abstraction

### Project Structure

```
├── models/          # Data models and database abstraction
├── services/        # Business logic layer
├── controllers/     # HTTP request handlers
├── routes/          # API route definitions
├── middleware/      # Express middleware
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── test/            # Test files
├── deno.json        # Deno configuration
└── main.ts          # Application entry point
```

## Deno 2 Features Used

- **Import Maps**: Clean dependency management without package.json
- **Built-in Testing**: No external test runner needed
- **Built-in Formatting**: `deno fmt` for consistent code style
- **Built-in Linting**: `deno lint` for code quality
- **Type Checking**: `deno check` for compile-time type safety
- **Permissions**: Secure by default with explicit permissions
- **npm Compatibility**: Seamless use of npm packages

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "error": "Error message if success is false"
}
```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for Express
- **Input Validation**: Request body validation
- **Error Handling**: Comprehensive error handling without exposing internals
- **Deno Permissions**: Secure by default with explicit network and file access

## Environment Variables

The application uses Deno's environment variable access:

```bash
# Set port (optional, defaults to 3000)
export PORT=3000
```

## Testing Strategy

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **Deno Test Runner**: Built-in testing framework
- **Assertions**: Using Deno's standard library assertions
- **High Coverage**: Comprehensive test coverage

## Deployment

1. **Using Deno Deploy** (recommended):
   ```bash
   # Deploy to Deno Deploy
   deno deploy --project=your-project-name main.ts
   ```

2. **Self-hosted**:
   ```bash
   # Run in production
   deno task start
   ```

## Why Deno 2?

- **Modern Runtime**: Built with Rust, faster than Node.js
- **Security First**: Secure by default with explicit permissions
- **Built-in Tools**: No need for external tooling (testing, formatting, linting)
- **TypeScript Native**: First-class TypeScript support
- **Import Maps**: Clean dependency management
- **npm Compatibility**: Can use existing npm packages
- **Single Binary**: Easy deployment and distribution

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `deno task test`
6. Format code: `deno task fmt`
7. Submit a pull request

## License

This project is licensed under the MIT License.
