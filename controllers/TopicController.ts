import { ITopicService } from '@/services/interfaces/ITopicService.ts';
import { ApiResponse, TopicFilters } from '@/types/index.ts';
import { Request, Response } from 'express';
import { PermissionStrategyFactory } from '../auth/PermissionStrategy.ts';

export class TopicController {
  private topicService: ITopicService;

  constructor(topicService: ITopicService) {
    this.topicService = topicService;
  }

  async createTopic(req: Request, res: Response): Promise<void> {
    try {
      const { name, content, parentTopicId, user } = req.body;
      // Get user role from request (after authentication)
      const userRole = user?.role || 'viewer';
      const permissionStrategy = PermissionStrategyFactory.createStrategy(
        userRole,
      );

      if (!permissionStrategy.canCreateTopic()) {
        res.status(403).json({
          success: false,
          error: 'Insufficient permissions to create topics',
        });
        return;
      }

      if (!name || !content) {
        res.status(400).json({
          success: false,
          error: 'Name and content are required',
        } as ApiResponse);
        return;
      }

      const topic = await this.topicService.createTopic({
        name,
        content,
        parentTopicId,
      });

      res.status(201).json({
        success: true,
        data: topic,
        message: 'Topic created successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async getTopic(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const topic = await this.topicService.getTopic(id);

      if (!topic) {
        res.status(404).json({
          success: false,
          error: 'Topic not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: topic,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async updateTopic(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const topic = await this.topicService.updateTopic(id, updates);

      if (!topic) {
        res.status(404).json({
          success: false,
          error: 'Topic not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: topic,
        message: 'Topic updated successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async deleteTopic(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.topicService.deleteTopic(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Topic not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Topic deleted successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async getAllTopics(req: Request, res: Response): Promise<void> {
    try {
      const filters: TopicFilters = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit
          ? parseInt(req.query.limit as string)
          : undefined,
        parentTopicId: req.query.parentTopicId as string,
        search: req.query.search as string,
      };

      const topics = await this.topicService.getAllTopics(filters);

      res.status(200).json({
        success: true,
        data: topics,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async getTopicVersions(req: Request, res: Response): Promise<void> {
    try {
      const { topicId } = req.params;
      const versions = await this.topicService.getTopicVersions(topicId);

      res.status(200).json({
        success: true,
        data: versions,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async getTopicVersion(req: Request, res: Response): Promise<void> {
    try {
      const { topicId, version } = req.params;
      const topicVersion = await this.topicService.getTopicVersion(
        topicId,
        parseInt(version),
      );

      if (!topicVersion) {
        res.status(404).json({
          success: false,
          error: 'Topic version not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: topicVersion,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async getTopicTree(req: Request, res: Response): Promise<void> {
    try {
      const { topicId } = req.params;
      const topicTree = await this.topicService.getTopicTree(topicId);

      if (!topicTree) {
        res.status(404).json({
          success: false,
          error: 'Topic not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: topicTree,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async findShortestPath(req: Request, res: Response): Promise<void> {
    try {
      const { fromTopicId, toTopicId } = req.params;
      const result = await this.topicService.findShortestPath(
        fromTopicId,
        toTopicId,
      );

      res.status(200).json({
        success: true,
        data: result,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async searchTopics(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Search query is required',
        } as ApiResponse);
        return;
      }

      const topics = await this.topicService.searchTopics(q);

      res.status(200).json({
        success: true,
        data: topics,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }
}
