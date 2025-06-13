import { Request, Response, Router } from 'express';
import { UserController } from '../controllers/UserController.ts';

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  // Create a new user
  router.post(
    '/',
    (req: Request, res: Response) => userController.createUser(req, res),
  );

  // User login
  router.post(
    '/login',
    (req: Request, res: Response) => userController.login(req, res),
  );

  // Get all users
  router.get(
    '/',
    (req: Request, res: Response) => userController.getAllUsers(req, res),
  );

  // Get users by role
  router.get(
    '/role/:role',
    (req: Request, res: Response) => userController.getUsersByRole(req, res),
  );

  // Get a specific user by ID
  router.get(
    '/:id',
    (req: Request, res: Response) => userController.getUser(req, res),
  );

  // Update a user
  router.put(
    '/:id',
    (req: Request, res: Response) => userController.updateUser(req, res),
  );

  // Delete a user
  router.delete(
    '/:id',
    (req: Request, res: Response) => userController.deleteUser(req, res),
  );

  return router;
}
