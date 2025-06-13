import { Request, Response } from 'express';
import { JWTAuth } from '../auth/JWTAuth.ts';
import { IUserService } from '../services/interfaces/IUserService.ts';
import { ApiResponse, UserRole } from '../types/index.ts';

export class UserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, role } = req.body;

      if (!name || !email || !role) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: name, email, role',
        } as ApiResponse);
        return;
      }

      // Validate role
      if (!Object.values(UserRole).includes(role)) {
        res.status(400).json({
          success: false,
          error: 'Invalid role. Must be one of: Admin, Editor, Viewer',
        } as ApiResponse);
        return;
      }

      const user = await this.userService.createUser({
        name,
        email,
        role,
      });

      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully',
      } as ApiResponse);
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({
          success: false,
          error: error.message,
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUser(id);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Validate role if provided
      if (updates.role && !Object.values(UserRole).includes(updates.role)) {
        res.status(400).json({
          success: false,
          error: 'Invalid role. Must be one of: Admin, Editor, Viewer',
        } as ApiResponse);
        return;
      }

      const user = await this.userService.updateUser(id, updates);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
        message: 'User updated successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.userService.deleteUser(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();

      res.status(200).json({
        success: true,
        data: users,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async getUsersByRole(req: Request, res: Response): Promise<void> {
    try {
      const { role } = req.params;

      if (!Object.values(UserRole).includes(role as UserRole)) {
        res.status(400).json({
          success: false,
          error: 'Invalid role. Must be one of: Admin, Editor, Viewer',
        } as ApiResponse);
        return;
      }

      const users = await this.userService.getUsersByRole(role as UserRole);

      res.status(200).json({
        success: true,
        data: users,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required',
        } as ApiResponse);
        return;
      }

      const user = await this.userService.authenticateUser(email, password);

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        } as ApiResponse);
        return;
      }

      // Generate JWT token
      const token = JWTAuth.generateToken(user);

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
          message: 'Login successful',
        },
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }
}
