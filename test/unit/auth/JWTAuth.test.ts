import {
  assertEquals,
  assertExists,
} from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { JWTAuth } from '../../../auth/JWTAuth.ts';
import { User, UserRole } from '../../../types/index.ts';

Deno.test('JWTAuth - generateToken', () => {
  const user: User = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const token = JWTAuth.generateToken(user);

  assertExists(token);
  assertEquals(typeof token, 'string');
  assertEquals(token.split('.').length, 3); // JWT has 3 parts
});

Deno.test('JWTAuth - verifyToken valid', () => {
  const user: User = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const token = JWTAuth.generateToken(user);
  const payload = JWTAuth.verifyToken(token);

  assertExists(payload);
  assertEquals(payload?.userId, user.id);
  assertEquals(payload?.email, user.email);
  assertEquals(payload?.role, user.role);
});

Deno.test('JWTAuth - verifyToken invalid', () => {
  const invalidToken = 'invalid.token.here';
  const payload = JWTAuth.verifyToken(invalidToken);

  assertEquals(payload, null);
});

Deno.test('JWTAuth - verifyToken malformed', () => {
  const malformedToken = 'not-a-jwt-token';
  const payload = JWTAuth.verifyToken(malformedToken);

  assertEquals(payload, null);
});

Deno.test('JWTAuth - verifyToken empty', () => {
  const payload = JWTAuth.verifyToken('');

  assertEquals(payload, null);
});

Deno.test('JWTAuth - token contains user data', () => {
  const user: User = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.EDITOR,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  const token = JWTAuth.generateToken(user);
  const payload = JWTAuth.verifyToken(token);

  assertExists(payload);
  assertEquals(payload?.userId, 'user-123');
  assertEquals(payload?.email, 'john@example.com');
  assertEquals(payload?.role, UserRole.EDITOR);
});

Deno.test('JWTAuth - different users generate different tokens', () => {
  const user1: User = {
    id: 'user-1',
    name: 'User 1',
    email: 'user1@example.com',
    role: UserRole.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const user2: User = {
    id: 'user-2',
    name: 'User 2',
    email: 'user2@example.com',
    role: UserRole.VIEWER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const token1 = JWTAuth.generateToken(user1);
  const token2 = JWTAuth.generateToken(user2);

  assertEquals(token1 !== token2, true);
});

Deno.test('JWTAuth - token payload structure', () => {
  const user: User = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const token = JWTAuth.generateToken(user);
  const payload = JWTAuth.verifyToken(token);

  assertExists(payload);
  assertEquals(typeof payload?.userId, 'string');
  assertEquals(typeof payload?.email, 'string');
  assertEquals(typeof payload?.role, 'string');
  // Note: iat and exp are optional and may not be present in this implementation
});
