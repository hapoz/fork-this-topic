import { TopicController } from '@/controllers/TopicController.ts';
import { Request, Response, Router } from 'express';

export function createTopicRoutes(topicController: TopicController): Router {
  const router = Router();

  // CRUD operations
  router.post(
    '/',
    (req: Request, res: Response) => topicController.createTopic(req, res),
  );
  router.get(
    '/',
    (req: Request, res: Response) => topicController.getAllTopics(req, res),
  );
  router.get(
    '/search',
    (req: Request, res: Response) => topicController.searchTopics(req, res),
  );
  router.get(
    '/:id',
    (req: Request, res: Response) => topicController.getTopic(req, res),
  );
  router.put(
    '/:id',
    (req: Request, res: Response) => topicController.updateTopic(req, res),
  );
  router.delete(
    '/:id',
    (req: Request, res: Response) => topicController.deleteTopic(req, res),
  );

  // Version control
  router.get(
    '/:topicId/versions',
    (req: Request, res: Response) => topicController.getTopicVersions(req, res),
  );
  router.get(
    '/:topicId/versions/:version',
    (req: Request, res: Response) => topicController.getTopicVersion(req, res),
  );

  // Hierarchical operations
  router.get(
    '/:topicId/tree',
    (req: Request, res: Response) => topicController.getTopicTree(req, res),
  );
  router.get(
    '/:fromTopicId/path/:toTopicId',
    (req: Request, res: Response) => topicController.findShortestPath(req, res),
  );

  return router;
}
