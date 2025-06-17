import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../types/index.ts';
import { JWTAuth, JWTPayload } from './JWTAuth.ts';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export class AuthMiddleware {
  static authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
      const token = JWTAuth.extractTokenFromHeader(req.headers.authorization);

      if (!token) {
        res.status(401).json({
          success: false,
          error: 'No token provided',
        } as ApiResponse);
        return;
      }

      const decoded = JWTAuth.verifyToken(token);
      if (!decoded) {
        res.status(401).json({
          success: false,
          error: 'Invalid or expired token',
        } as ApiResponse);
        return;
      }

      // Add user info to request
      req.user = decoded;
      next();
    } catch (_error) {
      res.status(401).json({
        success: false,
        error: 'Authentication failed',
      } as ApiResponse);
    }
  }

  static requireRole(
    allowedRoles: string[],
  ): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        } as ApiResponse);
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
        } as ApiResponse);
        return;
      }

      next();
    };
  }

  static requireAdmin(req: Request, res: Response, next: NextFunction): void {
    this.requireRole(['Admin'])(req, res, next);
  }

  static requireEditor(req: Request, res: Response, next: NextFunction): void {
    this.requireRole(['Admin', 'Editor'])(req, res, next);
  }

  static requireViewer(req: Request, res: Response, next: NextFunction): void {
    this.requireRole(['Admin', 'Editor', 'Viewer'])(req, res, next);
  }
}
