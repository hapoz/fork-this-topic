import {
  assertEquals,
  assertExists,
  assertRejects,
} from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { UserModel } from '../../models/UserModel.ts';
import { UserService } from '../../services/UserService.ts';
import { UserRole } from '../../types/index.ts';

Deno.test('UserService - createUser', async () => {
  const userModel = new UserModel();
  const userService = new UserService(userModel);

  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.EDITOR,
  };

  const result = await userService.createUser(userData);

  assertExists(result);
  assertEquals(result.name, userData.name);
  assertEquals(result.email, userData.email);
  assertEquals(result.role, userData.role);
  assertExists(result.id);
  assertExists(result.createdAt);
  assertExists(result.updatedAt);
});

Deno.test('UserService - createUser duplicate email', async () => {
  const userModel = new UserModel();
  const userService = new UserService(userModel);

  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.EDITOR,
  };

  await userService.createUser(userData);

  await assertRejects(
    async () => await userService.createUser(userData),
    Error,
    'User with this email already exists',
  );
});

Deno.test('UserService - getUser', async () => {
  const userModel = new UserModel();
  const userService = new UserService(userModel);

  const user = await userService.createUser({
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.EDITOR,
  });

  const result = await userService.getUser(user.id);

  assertExists(result);
  assertEquals(result?.id, user.id);
  assertEquals(result?.name, user.name);
});

Deno.test('UserService - getUser non-existent', async () => {
  const userModel = new UserModel();
  const userService = new UserService(userModel);

  const result = await userService.getUser('non-existent-id');

  assertEquals(result, null);
});

Deno.test('UserService - getUserByEmail', async () => {
  const userModel = new UserModel();
  const userService = new UserService(userModel);

  const user = await userService.createUser({
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.EDITOR,
  });

  const result = await userService.getUserByEmail('test@example.com');

  assertExists(result);
  assertEquals(result?.id, user.id);
  assertEquals(result?.email, user.email);
});

Deno.test('UserService - getUserByEmail non-existent', async () => {
  const userModel = new UserModel();
  const userService = new UserService(userModel);

  const result = await userService.getUserByEmail('nonexistent@example.com');

  assertEquals(result, null);
});

Deno.test('UserService - updateUser', async () => {
  const userModel = new UserModel();
  const userService = new UserService(userModel);

  const user = await userService.createUser({
    name: 'Original Name',
    email: 'test@example.com',
    role: UserRole.EDITOR,
  });

  const updatedUser = await userService.updateUser(user.id, {
    name: 'Updated Name',
    role: UserRole.ADMIN,
  });

  assertExists(updatedUser);
  assertEquals(updatedUser?.name, 'Updated Name');
  assertEquals(updatedUser?.role, UserRole.ADMIN);
  assertEquals(updatedUser?.email, user.email); // Should remain unchanged
});

Deno.test('UserService - deleteUser', async () => {
  const userModel = new UserModel();
  const userService = new UserService(userModel);

  const user = await userService.createUser({
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.EDITOR,
  });

  const deleted = await userService.deleteUser(user.id);
  assertEquals(deleted, true);

  const retrieved = await userService.getUser(user.id);
  assertEquals(retrieved, null);
});

Deno.test('UserService - getAllUsers', async () => {
  const userModel = new UserModel();
  const userService = new UserService(userModel);

  await userService.createUser({
    name: 'User 1',
    email: 'user1@example.com',
    role: UserRole.EDITOR,
  });

  await userService.createUser({
    name: 'User 2',
    email: 'user2@example.com',
    role: UserRole.VIEWER,
  });

  const users = await userService.getAllUsers();

  assertEquals(users.length, 2);
  assertEquals(users[0].name, 'User 1');
  assertEquals(users[1].name, 'User 2');
});

Deno.test('UserService - getUsersByRole', async () => {
  const userModel = new UserModel();
  const userService = new UserService(userModel);

  await userService.createUser({
    name: 'Editor 1',
    email: 'editor1@example.com',
    role: UserRole.EDITOR,
  });

  await userService.createUser({
    name: 'Editor 2',
    email: 'editor2@example.com',
    role: UserRole.EDITOR,
  });

  await userService.createUser({
    name: 'Viewer 1',
    email: 'viewer1@example.com',
    role: UserRole.VIEWER,
  });

  const editors = await userService.getUsersByRole(UserRole.EDITOR);
  assertEquals(editors.length, 2);
  assertEquals(editors[0].role, UserRole.EDITOR);
  assertEquals(editors[1].role, UserRole.EDITOR);

  const viewers = await userService.getUsersByRole(UserRole.VIEWER);
  assertEquals(viewers.length, 1);
  assertEquals(viewers[0].role, UserRole.VIEWER);
});

Deno.test('UserService - authenticateUser', async () => {
  const userModel = new UserModel();
  const userService = new UserService(userModel);

  const user = await userService.createUser({
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.EDITOR,
  });

  // For demo purposes, authentication succeeds if user exists
  const authenticatedUser = await userService.authenticateUser(
    'test@example.com',
    'password',
  );

  assertExists(authenticatedUser);
  assertEquals(authenticatedUser?.id, user.id);
  assertEquals(authenticatedUser?.email, user.email);
});

Deno.test('UserService - authenticateUser non-existent', async () => {
  const userModel = new UserModel();
  const userService = new UserService(userModel);

  const authenticatedUser = await userService.authenticateUser(
    'nonexistent@example.com',
    'password',
  );

  assertEquals(authenticatedUser, null);
});
