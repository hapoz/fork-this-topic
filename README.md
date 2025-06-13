# Dynamic Knowledge Base API

A RESTful API for managing interconnected topics and resources with version
control, user roles, and permissions. Built with Express.js, TypeScript, and
following advanced OOP principles and design patterns.

## Features

- **Topic Management**: CRUD operations with hierarchical structure
- **Version Control**: Automatic versioning for all topic updates
- **Custom Algorithms**: Shortest path finding between topics
- **Recursive Topic Trees**: Get complete topic hierarchies
- **Advanced OOP Design**: Abstract classes, interfaces, and design patterns
- **Comprehensive Testing**: Unit and integration tests
- **Security**: Rate limiting, CORS, and Helmet protection

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Architecture**: MVC with Service Layer
- **Design Patterns**: Factory, Strategy, Composite
- **Testing**: Jest with TypeScript support
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
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
src/
├── models/          # Data models and database abstraction
├── services/        # Business logic layer
├── controllers/     # HTTP request handlers
├── routes/          # API route definitions
├── middleware/      # Express middleware
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── test/            # Test files
```

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
