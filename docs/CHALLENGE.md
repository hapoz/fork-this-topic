**![][image1]**

**Objective:**

Build a RESTful API for a Dynamic Knowledge Base System. This system should
manage interconnected topics and resources with version control, user roles, and
permissions. The challenge will assess the candidate’s ability to implement
complex business logic, use advanced OOP concepts, design patterns, and
algorithms, as well as maintain high code quality and testing standards.

**Requirements:**

**Project Setup:**\
Create a new Node.js project using TypeScript.\
Set up an Express server.\
Use a database (an in-memory database or a simple file-based database like JSON)
for persistence.

1. **Core Functionality:**

**Entities:**

- **Topic**: Represents a subject or concept within the knowledge base.
  - Properties: `id`, `name`, `content`, `createdAt`, `updatedAt`, `version`,
    `parentTopicId` (for hierarchical structure).
- **Resource**: Represents an external link or document associated with a topic.
  - Properties: `id`, `topicId`, `url`, `description`, `type` (e.g., video,
    article, pdf), `createdAt`, `updatedAt`.
- **User**: Represents a user who can access the knowledge base.
  - Properties: `id`, `name`, `email`, `role` (Admin, Editor, Viewer),
    `createdAt`.

**Topic Management:**

- Implement CRUD operations for **Topics** with version control. Each update to
  a topic should create a new version, keeping the previous versions intact.
- Support hierarchical topics, allowing each topic to have parent and child
  topics

## 

2. ## Complex Business Logic:

## Topic Version Control and Retrieval:

- Create a versioning system for topics where each update does not overwrite the
  existing topic but instead creates a new version. Implement functionality to
  retrieve a specific version of a topic.

## Recursive Topic Retrieval:

- Implement an API endpoint that, given a topic ID, retrieves the topic and all
  its subtopics recursively. The response should include a tree structure
  representing the hierarchy of topics.

## Custom Algorithms:

- Implement a custom algorithm to find the shortest path between two topics in
  the topic hierarchy. This algorithm should not use common graph traversal
  libraries; it should be written from scratch to assess the candidate's
  problem-solving skills.

3. ## Advanced Object-Oriented Design:

- Use **abstract classes** and **interfaces** to model the entities and their
  behaviors.
- Implement design patterns like **Factory** (to create different versions of
  topics), **Strategy** (for different user roles and permissions), and
  **Composite** (for hierarchical topics).

4. ## Code Structure and Quality:

- Organize the code into well-defined modules, such as controllers, services,
  models, routes, and middleware.
- Follow SOLID principles and apply design patterns to ensure code
  maintainability and scalability.

5. ## Error Handling and Validation:

- Implement comprehensive error handling for all endpoints and business logic.

6. ## Unit and Integration Testing (Bonus):

- Write unit tests for all services and controllers using a testing framework
  like Jest or Mocha.
- Create integration tests to test the overall flow of the application,
  including user permissions and topic retrieval.
- Ensure high test coverage and demonstrate how to mock dependencies.

## Submission:

- Please submit your project as a GitHub repository. Ensure the repository
  includes a README file with instructions on how to run the project, set up the
  database, and perform authentication.

## Evaluation Criteria:

- Correctness and completeness of functionality.
- Proper use of advanced object-oriented programming principles and design
  patterns.
- Ability to implement complex business logic and custom algorithms.
- Clean, readable, and well-structured code with appropriate modularization.
- Robust error handling, logging, and validation.
- Quality, coverage, and depth of unit and integration tests.

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABlCAYAAAC/S5bMAAADwUlEQVR4Xu2YvYrWQBSGP9DrsbITL8Bq0UIRYUvZKxDEZhWsRC0tbLb+qgXFC7DwIgQ7ywV/1n5lwEB8ki+ZTM6ZmSTvA0+zm8yc875F4NvthBBCCCGEEEIU4ejkzd0g/y4KcuPo6VVb/l8UgKWonApgGZTPiwywhEPyPeEIwx+T7wsHGHqsPEcYwrCnyvOEAQw5VZ4rZsBw58rzRQIM1UreIybAMK3lfSIChugl7xUDMDxveb/ogaHlknOIFgwrt5xH7MqX0si5Ng3DKS3n2yQMpRY556ZgGCleXv4ZlM9PkfNuAoYwRYYfK8+JkXOvGi4fK4NOleeOyflXCZeOleHOleePyT1WBZeNlaFaefPes85dQ3KfVcAlY2WYfZ5//HJ1//Gr/3x39qnzXJ+8b0zutWi4XKwMkbKMQ/I9ynvH5H6LhEvFyvBSCqE8Z7PlcJlYv3773glubikq5x9cYooMzKqURp6bWkyQe1cNh5/i2/cfOoFZF3Nx8aNz9urL4dBTZVDWpTTy/DnFBJlDVXDYFBnUUooJMo8q4JCpMiiPUhp5z9xigsylKBwuVYZUopjVlMOh5siAllpMkDll4/T09DqHmSsDWnIxwZARc3Nlv99f4xAWMqClFxMMWTE/N3i5lQxoDcUEmZ8LvNRSBuRZzpPnZ507gneOX3bmspA5msLLrGVInsXw/EbOZCnznI3XN4UypLYPT153wp0jz89RTND0m8PDvWRIlOGmynNzFhNkvsnwYC8ZUp8Meao8L3cpQeabDA/2kkEdkmHHynMo5/GS+SZTwzeGPugJfki+TzmLl6bfmAZeYi3DipUlxJbRyDm8ZJ6m8DJLGVgOf/763ZnDQ+boAi+1kqHlkDN4yPzc8PrmMDRP9+efO/d76PJNGSLnr8vW8l4vs/+63IbDzJEBWsv7PGVOReBQqTJIK3mPt8ynKBwuRQYaI88oLXOpAg45VYY+Jt8vLfOoCg47RQY/JN8tLXOoEg4dK8M/JN8rLfevGg4fIwvok++UlnsvAi4xJkugfL603HdRcJkhWYRKcYZLHZJlqJQMcLk+WYhKyQSXpCqlIFy2rUopDJduVCkVwOWDKqUSGEJtct5NwTBqkXNuEoZSWs63aRhOKTmX2JUvh/OIFgwrl5xD9MDQvOX9YgCG5yXvFREwRGt5n5gAw7SS94gEGOpceb6YAcNNlecKAxjyVHmeMIRhx8pzhAMMfUy+Lxxh+IfkeyIDLIHyeZERlqFSKkKlVMztRy9uBfl3IYQQQgghhBB5+AtM5ZFlDp0flgAAAABJRU5ErkJggg==>
