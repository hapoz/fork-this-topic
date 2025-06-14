import { ApiResponse } from '@/types/index.ts';
import { IResourceService } from '@/types/interfaces/IResourceService.ts';
import { Request, Response } from 'express';

export class ResourceController {
  private resourceService: IResourceService;

  constructor(resourceService: IResourceService) {
    this.resourceService = resourceService;
  }

  async createResource(req: Request, res: Response): Promise<void> {
    try {
      const { topicId, url, description, type } = req.body;

      if (!topicId || !url || !description || !type) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: topicId, url, description, type',
        } as ApiResponse);
        return;
      }

      const resource = await this.resourceService.createResource({
        topicId,
        url,
        description,
        type,
      });

      res.status(201).json({
        success: true,
        data: resource,
        message: 'Resource created successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async getResource(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const resource = await this.resourceService.getResource(id);

      if (!resource) {
        res.status(404).json({
          success: false,
          error: 'Resource not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: resource,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async updateResource(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const resource = await this.resourceService.updateResource(id, updates);

      if (!resource) {
        res.status(404).json({
          success: false,
          error: 'Resource not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: resource,
        message: 'Resource updated successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async deleteResource(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.resourceService.deleteResource(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Resource not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Resource deleted successfully',
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async getResourcesByTopic(req: Request, res: Response): Promise<void> {
    try {
      const { topicId } = req.params;
      const resources = await this.resourceService.getResourcesByTopic(topicId);

      res.status(200).json({
        success: true,
        data: resources,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async getResourcesByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const resources = await this.resourceService.getResourcesByType(type);

      res.status(200).json({
        success: true,
        data: resources,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }

  async searchResources(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Search query is required',
        } as ApiResponse);
        return;
      }

      const resources = await this.resourceService.searchResources(q);

      res.status(200).json({
        success: true,
        data: resources,
      } as ApiResponse);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      } as ApiResponse);
    }
  }
}
