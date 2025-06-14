import { MemcachedAdapter } from '@/database/MemcachedAdapter.ts';
import { ResourceModel } from '@/models/ResourceModel.ts';
import { TopicModel } from '@/models/TopicModel.ts';
import { UserModel } from '@/models/UserModel.ts';
import { ResourceType, UserRole } from '@/types/index.ts';
import { assertEquals, assertExists } from '@std/assert';

// Test configuration
const testConfig = {
  host: Deno.env.get('MEMCACHED_HOST') || 'localhost',
  port: parseInt(Deno.env.get('MEMCACHED_PORT') || '11211'),
  timeout: 5000,
  retries: 3,
};

Deno.test('Memcached Integration Tests', async (t) => {
  let db: MemcachedAdapter;
  let topicModel: TopicModel;
  let userModel: UserModel;
  let resourceModel: ResourceModel;

  // Setup before all tests
  await t.step('Setup database connection', async () => {
    db = new MemcachedAdapter(testConfig);
    await db.connect();

    topicModel = new TopicModel(db);
    userModel = new UserModel(db);
    resourceModel = new ResourceModel(db);
  });

  await t.step('Database health check', async () => {
    const health = await db.healthCheck();
    assertEquals(health.status, 'healthy', 'Database should be healthy');
  });

  await t.step('Topic CRUD operations', async () => {
    // Create topic
    const topicData = {
      name: 'Test Topic',
      content: 'This is a test topic',
    };

    const createdTopic = await topicModel.createTopic(topicData);
    assertExists(createdTopic.id, 'Topic should have an ID');
    assertEquals(createdTopic.name, topicData.name);
    assertEquals(createdTopic.content, topicData.content);
    assertEquals(createdTopic.version, 1);

    // Find by ID
    const foundTopic = await topicModel.findById(createdTopic.id);
    assertExists(foundTopic, 'Topic should be found by ID');
    assertEquals(foundTopic!.name, topicData.name);

    // Update topic
    const updatedTopic = await topicModel.updateTopic(createdTopic.id, {
      name: 'Updated Test Topic',
    });
    assertExists(updatedTopic, 'Topic should be updated');
    assertEquals(updatedTopic!.name, 'Updated Test Topic');
    assertEquals(updatedTopic!.version, 2);

    // Find all topics
    const allTopics = await topicModel.findAll();
    assertEquals(allTopics.length, 1, 'Should find one topic');

    // Delete topic
    const deleted = await topicModel.delete(createdTopic.id);
    assertEquals(deleted, true, 'Topic should be deleted');

    const deletedTopic = await topicModel.findById(createdTopic.id);
    assertEquals(deletedTopic, null, 'Topic should not exist after deletion');
  });

  await t.step('User CRUD operations', async () => {
    // Create user
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      role: UserRole.EDITOR,
    };

    const createdUser = await userModel.create(userData);
    assertExists(createdUser.id, 'User should have an ID');
    assertEquals(createdUser.name, userData.name);
    assertEquals(createdUser.email, userData.email);
    assertEquals(createdUser.role, userData.role);

    // Find by email
    const foundUser = await userModel.findByEmail(userData.email);
    assertExists(foundUser, 'User should be found by email');
    assertEquals(foundUser!.name, userData.name);

    // Find by role
    const editors = await userModel.findByRole(UserRole.EDITOR);
    assertEquals(editors.length, 1, 'Should find one editor');

    // Search users
    const searchResults = await userModel.searchUsers('Test');
    assertEquals(searchResults.length, 1, 'Should find user by search');

    // Delete user
    const deleted = await userModel.delete(createdUser.id);
    assertEquals(deleted, true, 'User should be deleted');
  });

  await t.step('Resource CRUD operations', async () => {
    // Create a topic first for the resource
    const topic = await topicModel.createTopic({
      name: 'Resource Topic',
      content: 'Topic for resources',
    });

    // Create resource
    const resourceData = {
      topicId: topic.id,
      url: 'https://example.com',
      description: 'Test resource',
      type: ResourceType.ARTICLE,
    };

    const createdResource = await resourceModel.create(resourceData);
    assertExists(createdResource.id, 'Resource should have an ID');
    assertEquals(createdResource.topicId, topic.id);
    assertEquals(createdResource.url, resourceData.url);
    assertEquals(createdResource.type, resourceData.type);

    // Find by topic ID
    const topicResources = await resourceModel.findByTopicId(topic.id);
    assertEquals(
      topicResources.length,
      1,
      'Should find one resource for topic',
    );

    // Find by type
    const articles = await resourceModel.findByType(ResourceType.ARTICLE);
    assertEquals(articles.length, 1, 'Should find one article');

    // Search resources
    const searchResults = await resourceModel.searchResources('Test');
    assertEquals(searchResults.length, 1, 'Should find resource by search');

    // Clean up
    await resourceModel.delete(createdResource.id);
    await topicModel.delete(topic.id);
  });

  await t.step('Database statistics', async () => {
    const stats = await db.getStats();
    assertExists(stats, 'Should return database stats');
    assertEquals(typeof stats.status, 'string', 'Stats should have status');
  });

  // Cleanup after all tests
  await t.step('Cleanup', async () => {
    await db.disconnect();
  });
});
