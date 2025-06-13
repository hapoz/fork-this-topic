import {
  assertEquals,
  assertExists,
} from 'https://deno.land/std@0.208.0/assert/mod.ts';

// Import the app (we'll need to adjust for testing)

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  role: 'Editor',
};

const testTopic = {
  name: 'Test Topic',
  content: 'Test content for integration testing',
  parentTopicId: undefined,
};

const testResource = {
  topicId: '', // Will be set after topic creation
  url: 'https://example.com',
  description: 'Test resource for integration testing',
  type: 'link',
};

// Helper function to make authenticated requests
async function makeAuthenticatedRequest(
  url: string,
  options: RequestInit = {},
  token?: string,
): Promise<Response> {
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Content-Type', 'application/json');

  return await fetch(url, {
    ...options,
    headers,
  });
}

Deno.test('API Integration Tests', async (t) => {
  let authToken: string;
  let createdTopicId: string;
  let createdResourceId: string;
  let createdUserId: string;

  await t.step('Health Check', async () => {
    const response = await fetch('http://localhost:3000/health');
    assertEquals(response.status, 200);

    const data = await response.json();
    assertEquals(data.success, true);
    assertEquals(data.message, 'API is running');
    assertExists(data.timestamp);
  });

  await t.step('User Registration', async () => {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    assertEquals(response.status, 201);

    const data = await response.json();
    assertEquals(data.success, true);
    assertEquals(data.data.name, testUser.name);
    assertEquals(data.data.email, testUser.email);
    assertEquals(data.data.role, testUser.role);

    createdUserId = data.data.id;
    assertExists(createdUserId);
  });

  await t.step('User Login', async () => {
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: 'password', // Assuming simple auth for demo
      }),
    });

    assertEquals(response.status, 200);

    const data = await response.json();
    assertEquals(data.success, true);
    assertEquals(data.data.user.email, testUser.email);
    assertExists(data.data.token);

    authToken = data.data.token;
  });

  await t.step('Create Topic (Authenticated)', async () => {
    const response = await makeAuthenticatedRequest(
      'http://localhost:3000/api/topics',
      {
        method: 'POST',
        body: JSON.stringify(testTopic),
      },
      authToken,
    );

    assertEquals(response.status, 201);

    const data = await response.json();
    assertEquals(data.success, true);
    assertEquals(data.data.name, testTopic.name);
    assertEquals(data.data.content, testTopic.content);
    assertEquals(data.data.version, 1);

    createdTopicId = data.data.id;
    assertExists(createdTopicId);
  });

  await t.step('Get Topic (Authenticated)', async () => {
    const response = await makeAuthenticatedRequest(
      `http://localhost:3000/api/topics/${createdTopicId}`,
      {},
      authToken,
    );

    assertEquals(response.status, 200);

    const data = await response.json();
    assertEquals(data.success, true);
    assertEquals(data.data.id, createdTopicId);
    assertEquals(data.data.name, testTopic.name);
  });

  await t.step('Create Resource (Authenticated)', async () => {
    const resourceData = {
      ...testResource,
      topicId: createdTopicId,
    };

    const response = await makeAuthenticatedRequest(
      'http://localhost:3000/api/resources',
      {
        method: 'POST',
        body: JSON.stringify(resourceData),
      },
      authToken,
    );

    assertEquals(response.status, 201);

    const data = await response.json();
    assertEquals(data.success, true);
    assertEquals(data.data.topicId, createdTopicId);
    assertEquals(data.data.url, testResource.url);
    assertEquals(data.data.description, testResource.description);

    createdResourceId = data.data.id;
    assertExists(createdResourceId);
  });

  await t.step('Get Resources by Topic (Authenticated)', async () => {
    const response = await makeAuthenticatedRequest(
      `http://localhost:3000/api/resources/topic/${createdTopicId}`,
      {},
      authToken,
    );

    assertEquals(response.status, 200);

    const data = await response.json();
    assertEquals(data.success, true);
    assertEquals(Array.isArray(data.data), true);
    assertEquals(data.data.length, 1);
    assertEquals(data.data[0].id, createdResourceId);
  });

  await t.step('Update Topic (Authenticated)', async () => {
    const updateData = {
      name: 'Updated Test Topic',
      content: 'Updated content for integration testing',
    };

    const response = await makeAuthenticatedRequest(
      `http://localhost:3000/api/topics/${createdTopicId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updateData),
      },
      authToken,
    );

    assertEquals(response.status, 200);

    const data = await response.json();
    assertEquals(data.success, true);
    assertEquals(data.data.name, updateData.name);
    assertEquals(data.data.content, updateData.content);
    assertEquals(data.data.version, 2); // Version should be incremented
  });

  await t.step('Search Topics (Authenticated)', async () => {
    const response = await makeAuthenticatedRequest(
      'http://localhost:3000/api/topics/search?q=Updated',
      {},
      authToken,
    );

    assertEquals(response.status, 200);

    const data = await response.json();
    assertEquals(data.success, true);
    assertEquals(Array.isArray(data.data), true);
    assertEquals(data.data.length, 1);
    assertEquals(data.data[0].id, createdTopicId);
  });

  await t.step('Unauthorized Access (No Token)', async () => {
    const response = await fetch('http://localhost:3000/api/topics');
    assertEquals(response.status, 401);

    const data = await response.json();
    assertEquals(data.success, false);
    assertEquals(data.error, 'No token provided');
  });

  await t.step('Invalid Token', async () => {
    const response = await makeAuthenticatedRequest(
      'http://localhost:3000/api/topics',
      {},
      'invalid-token',
    );

    assertEquals(response.status, 401);

    const data = await response.json();
    assertEquals(data.success, false);
    assertEquals(data.error, 'Invalid or expired token');
  });

  await t.step('Delete Resource (Authenticated)', async () => {
    const response = await makeAuthenticatedRequest(
      `http://localhost:3000/api/resources/${createdResourceId}`,
      {
        method: 'DELETE',
      },
      authToken,
    );

    assertEquals(response.status, 200);

    const data = await response.json();
    assertEquals(data.success, true);
    assertEquals(data.message, 'Resource deleted successfully');
  });

  await t.step('Delete Topic (Authenticated)', async () => {
    const response = await makeAuthenticatedRequest(
      `http://localhost:3000/api/topics/${createdTopicId}`,
      {
        method: 'DELETE',
      },
      authToken,
    );

    assertEquals(response.status, 200);

    const data = await response.json();
    assertEquals(data.success, true);
    assertEquals(data.message, 'Topic deleted successfully');
  });

  await t.step('Delete User (Authenticated)', async () => {
    const response = await makeAuthenticatedRequest(
      `http://localhost:3000/api/users/${createdUserId}`,
      {
        method: 'DELETE',
      },
      authToken,
    );

    assertEquals(response.status, 200);

    const data = await response.json();
    assertEquals(data.success, true);
    assertEquals(data.message, 'User deleted successfully');
  });

  await t.step('404 Handler', async () => {
    const response = await fetch('http://localhost:3000/api/nonexistent');
    assertEquals(response.status, 404);

    const data = await response.json();
    assertEquals(data.success, false);
    assertEquals(data.error, 'Route not found');
  });
});
