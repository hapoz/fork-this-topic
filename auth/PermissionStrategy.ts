export interface PermissionStrategy {
  canCreateTopic(): boolean;
  canUpdateTopic(): boolean;
  canDeleteTopic(): boolean;
  canCreateResource(): boolean;
  canUpdateResource(): boolean;
  canDeleteResource(): boolean;
  canManageUsers(): boolean;
}

export class AdminPermissionStrategy implements PermissionStrategy {
  canCreateTopic() {
    return true;
  }
  canUpdateTopic() {
    return true;
  }
  canDeleteTopic() {
    return true;
  }
  canCreateResource() {
    return true;
  }
  canUpdateResource() {
    return true;
  }
  canDeleteResource() {
    return true;
  }
  canManageUsers() {
    return true;
  }
}

export class EditorPermissionStrategy implements PermissionStrategy {
  canCreateTopic() {
    return true;
  }
  canUpdateTopic() {
    return true;
  }
  canDeleteTopic() {
    return false;
  }
  canCreateResource() {
    return true;
  }
  canUpdateResource() {
    return true;
  }
  canDeleteResource() {
    return false;
  }
  canManageUsers() {
    return false;
  }
}

export class ViewerPermissionStrategy implements PermissionStrategy {
  canCreateTopic() {
    return false;
  }
  canUpdateTopic() {
    return false;
  }
  canDeleteTopic() {
    return false;
  }
  canCreateResource() {
    return false;
  }
  canUpdateResource() {
    return false;
  }
  canDeleteResource() {
    return false;
  }
  canManageUsers() {
    return false;
  }
}

export class PermissionStrategyFactory {
  static createStrategy(role: string): PermissionStrategy {
    switch (role.toLowerCase()) {
      case 'admin':
        return new AdminPermissionStrategy();
      case 'editor':
        return new EditorPermissionStrategy();
      case 'viewer':
        return new ViewerPermissionStrategy();
      default:
        return new ViewerPermissionStrategy(); // Default to most restrictive
    }
  }
}
