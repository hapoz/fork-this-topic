import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { PermissionStrategyFactory } from '../../../auth/PermissionStrategy.ts';
import { UserRole } from '../../../types/index.ts';

Deno.test('PermissionStrategy - Admin permissions', () => {
  const adminStrategy = PermissionStrategyFactory.createStrategy(
    UserRole.ADMIN,
  );

  assertEquals(adminStrategy.canCreateTopic(), true);
  assertEquals(adminStrategy.canUpdateTopic(), true);
  assertEquals(adminStrategy.canDeleteTopic(), true);
  assertEquals(adminStrategy.canCreateResource(), true);
  assertEquals(adminStrategy.canUpdateResource(), true);
  assertEquals(adminStrategy.canDeleteResource(), true);
  assertEquals(adminStrategy.canManageUsers(), true);
});

Deno.test('PermissionStrategy - Editor permissions', () => {
  const editorStrategy = PermissionStrategyFactory.createStrategy(
    UserRole.EDITOR,
  );

  assertEquals(editorStrategy.canCreateTopic(), true);
  assertEquals(editorStrategy.canUpdateTopic(), true);
  assertEquals(editorStrategy.canDeleteTopic(), false);
  assertEquals(editorStrategy.canCreateResource(), true);
  assertEquals(editorStrategy.canUpdateResource(), true);
  assertEquals(editorStrategy.canDeleteResource(), false);
  assertEquals(editorStrategy.canManageUsers(), false);
});

Deno.test('PermissionStrategy - Viewer permissions', () => {
  const viewerStrategy = PermissionStrategyFactory.createStrategy(
    UserRole.VIEWER,
  );

  assertEquals(viewerStrategy.canCreateTopic(), false);
  assertEquals(viewerStrategy.canUpdateTopic(), false);
  assertEquals(viewerStrategy.canDeleteTopic(), false);
  assertEquals(viewerStrategy.canCreateResource(), false);
  assertEquals(viewerStrategy.canUpdateResource(), false);
  assertEquals(viewerStrategy.canDeleteResource(), false);
  assertEquals(viewerStrategy.canManageUsers(), false);
});

Deno.test('PermissionStrategy - Factory creates correct strategy', () => {
  const adminStrategy = PermissionStrategyFactory.createStrategy(
    UserRole.ADMIN,
  );
  const editorStrategy = PermissionStrategyFactory.createStrategy(
    UserRole.EDITOR,
  );
  const viewerStrategy = PermissionStrategyFactory.createStrategy(
    UserRole.VIEWER,
  );

  // Verify different strategies have different permissions
  assertEquals(adminStrategy.canDeleteTopic(), true);
  assertEquals(editorStrategy.canDeleteTopic(), false);
  assertEquals(viewerStrategy.canDeleteTopic(), false);

  assertEquals(adminStrategy.canManageUsers(), true);
  assertEquals(editorStrategy.canManageUsers(), false);
  assertEquals(viewerStrategy.canManageUsers(), false);
});

Deno.test('PermissionStrategy - Strategy methods return boolean', () => {
  const adminStrategy = PermissionStrategyFactory.createStrategy(
    UserRole.ADMIN,
  );

  assertEquals(typeof adminStrategy.canCreateTopic(), 'boolean');
  assertEquals(typeof adminStrategy.canUpdateTopic(), 'boolean');
  assertEquals(typeof adminStrategy.canDeleteTopic(), 'boolean');
  assertEquals(typeof adminStrategy.canCreateResource(), 'boolean');
  assertEquals(typeof adminStrategy.canUpdateResource(), 'boolean');
  assertEquals(typeof adminStrategy.canDeleteResource(), 'boolean');
  assertEquals(typeof adminStrategy.canManageUsers(), 'boolean');
});

Deno.test('PermissionStrategy - Only admin can manage users', () => {
  const adminStrategy = PermissionStrategyFactory.createStrategy(
    UserRole.ADMIN,
  );
  const editorStrategy = PermissionStrategyFactory.createStrategy(
    UserRole.EDITOR,
  );
  const viewerStrategy = PermissionStrategyFactory.createStrategy(
    UserRole.VIEWER,
  );

  assertEquals(adminStrategy.canManageUsers(), true);
  assertEquals(editorStrategy.canManageUsers(), false);
  assertEquals(viewerStrategy.canManageUsers(), false);
});

Deno.test('PermissionStrategy - Delete permissions are restricted', () => {
  const adminStrategy = PermissionStrategyFactory.createStrategy(
    UserRole.ADMIN,
  );
  const editorStrategy = PermissionStrategyFactory.createStrategy(
    UserRole.EDITOR,
  );
  const viewerStrategy = PermissionStrategyFactory.createStrategy(
    UserRole.VIEWER,
  );

  // Only admin can delete topics and resources
  assertEquals(adminStrategy.canDeleteTopic(), true);
  assertEquals(editorStrategy.canDeleteTopic(), false);
  assertEquals(viewerStrategy.canDeleteTopic(), false);

  assertEquals(adminStrategy.canDeleteResource(), true);
  assertEquals(editorStrategy.canDeleteResource(), false);
  assertEquals(viewerStrategy.canDeleteResource(), false);
});
