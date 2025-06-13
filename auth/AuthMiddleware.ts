import {
  PermissionStrategy,
  PermissionStrategyFactory,
} from './PermissionStrategy.ts';

export class AuthMiddleware {
  static authenticate(req: Request, res: Response, next: NextFunction): void {
    // JWT token validation
    // User role extraction
    // Permission checking
  }

  static checkPermission(requiredPermission: keyof PermissionStrategy) {
    return (req: Request, res: Response, next: NextFunction) => {
      const userRole = req.user?.role || 'viewer';
      const permissionStrategy = PermissionStrategyFactory.createStrategy(
        userRole,
      );

      if (!permissionStrategy[requiredPermission]()) {
        res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
        });
        return;
      }

      next();
    };
  }
}
