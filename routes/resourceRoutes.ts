import { Request, Response, Router } from 'express';
import { ResourceController } from '../controllers/ResourceController.ts';

export function createResourceRoutes(
  resourceController: ResourceController,
): Router {
  const router = Router();

  // Create a new resource
  router.post(
    '/',
    (req: Request, res: Response) =>
      resourceController.createResource(req, res),
  );

  // Get all resources for a specific topic
  router.get(
    '/topic/:topicId',
    (req: Request, res: Response) =>
      resourceController.getResourcesByTopic(req, res),
  );

  // Get all resources of a specific type
  router.get(
    '/type/:type',
    (req: Request, res: Response) =>
      resourceController.getResourcesByType(req, res),
  );

  // Search resources
  router.get(
    '/search',
    (req: Request, res: Response) =>
      resourceController.searchResources(req, res),
  );

  // Get a specific resource by ID
  router.get(
    '/:id',
    (req: Request, res: Response) => resourceController.getResource(req, res),
  );

  // Update a resource
  router.put(
    '/:id',
    (req: Request, res: Response) =>
      resourceController.updateResource(req, res),
  );

  // Delete a resource
  router.delete(
    '/:id',
    (req: Request, res: Response) =>
      resourceController.deleteResource(req, res),
  );

  return router;
}
