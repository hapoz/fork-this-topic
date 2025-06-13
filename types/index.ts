export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic extends BaseEntity {
  name: string;
  content: string;
  version: number;
  parentTopicId?: string;
}

export interface TopicVersion extends BaseEntity {
  topicId: string;
  name: string;
  content: string;
  version: number;
  parentTopicId?: string;
}

export interface Resource extends BaseEntity {
  topicId: string;
  url: string;
  description: string;
  type: ResourceType;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'Admin',
  EDITOR = 'Editor',
  VIEWER = 'Viewer'
}

export enum ResourceType {
  VIDEO = 'video',
  ARTICLE = 'article',
  PDF = 'pdf',
  LINK = 'link'
}

export interface TopicTree extends Topic {
  children: TopicTree[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface TopicFilters extends PaginationParams {
  parentTopicId?: string;
  search?: string;
}

export interface ShortestPathResult {
  path: string[];
  distance: number;
  exists: boolean;
} 