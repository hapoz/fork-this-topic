import { Topic } from '../types/index.ts';

// Abstract component for the composite pattern
export abstract class TopicComponent {
  protected topic: Topic;

  constructor(topic: Topic) {
    this.topic = topic;
  }

  abstract getChildren(): TopicComponent[];
  abstract addChild(child: TopicComponent): void;
  abstract removeChild(child: TopicComponent): void;
  abstract getTopic(): Topic;
  abstract getDepth(): number;
  abstract getPath(): string[];
  abstract isLeaf(): boolean;
}

// Leaf component (topic without children)
export class TopicLeaf extends TopicComponent {
  constructor(topic: Topic) {
    super(topic);
  }

  getChildren(): TopicComponent[] {
    return [];
  }

  addChild(child: TopicComponent): void {
    throw new Error('Cannot add child to leaf topic');
  }

  removeChild(child: TopicComponent): void {
    throw new Error('Cannot remove child from leaf topic');
  }

  getTopic(): Topic {
    return this.topic;
  }

  getDepth(): number {
    return 0;
  }

  getPath(): string[] {
    return [this.topic.name];
  }

  isLeaf(): boolean {
    return true;
  }
}

// Composite component (topic with children)
export class TopicComposite extends TopicComponent {
  private children: TopicComponent[] = [];

  constructor(topic: Topic) {
    super(topic);
  }

  getChildren(): TopicComponent[] {
    return this.children;
  }

  addChild(child: TopicComponent): void {
    this.children.push(child);
  }

  removeChild(child: TopicComponent): void {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }

  getTopic(): Topic {
    return this.topic;
  }

  getDepth(): number {
    if (this.children.length === 0) {
      return 0;
    }
    return Math.max(...this.children.map((child) => child.getDepth())) + 1;
  }

  getPath(): string[] {
    return [this.topic.name];
  }

  isLeaf(): boolean {
    return false;
  }

  getChildCount(): number {
    return this.children.length;
  }

  hasChildren(): boolean {
    return this.children.length > 0;
  }

  // Find a child by topic name
  findChildByName(name: string): TopicComponent | null {
    for (const child of this.children) {
      if (child.getTopic().name === name) {
        return child;
      }
      // Recursively search in composite children
      if (!child.isLeaf()) {
        const found = (child as TopicComposite).findChildByName(name);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  // Get all descendants (flattened list)
  getAllDescendants(): TopicComponent[] {
    const descendants: TopicComponent[] = [];

    for (const child of this.children) {
      descendants.push(child);
      if (!child.isLeaf()) {
        descendants.push(...(child as TopicComposite).getAllDescendants());
      }
    }

    return descendants;
  }

  // Get all topics in this subtree
  getAllTopics(): Topic[] {
    const topics: Topic[] = [this.topic];

    for (const child of this.children) {
      topics.push(child.getTopic());
      if (!child.isLeaf()) {
        topics.push(...(child as TopicComposite).getAllTopics());
      }
    }

    return topics;
  }
}

// Factory for creating topic components
export class TopicComponentFactory {
  static createComponent(
    topic: Topic,
    hasChildren: boolean = false,
  ): TopicComponent {
    if (hasChildren) {
      return new TopicComposite(topic);
    } else {
      return new TopicLeaf(topic);
    }
  }

  static createFromTopicList(topics: Topic[]): TopicComponent[] {
    return topics.map((topic) => {
      // Determine if topic has children based on parentTopicId
      const hasChildren = topics.some((t) => t.parentTopicId === topic.id);
      return this.createComponent(topic, hasChildren);
    });
  }
}

// Builder for constructing topic trees
export class TopicTreeBuilder {
  private components: Map<string, TopicComponent> = new Map();

  addTopic(topic: Topic, hasChildren: boolean = false): TopicTreeBuilder {
    const component = TopicComponentFactory.createComponent(topic, hasChildren);
    this.components.set(topic.id, component);
    return this;
  }

  buildHierarchy(): TopicComponent[] {
    const roots: TopicComponent[] = [];
    const children: TopicComponent[] = [];

    // Separate roots and children
    for (const component of this.components.values()) {
      const topic = component.getTopic();
      if (topic.parentTopicId) {
        children.push(component);
      } else {
        roots.push(component);
      }
    }

    // Build the hierarchy
    for (const child of children) {
      const parent = this.components.get(child.getTopic().parentTopicId!);
      if (parent && !parent.isLeaf()) {
        (parent as TopicComposite).addChild(child);
      }
    }

    return roots;
  }

  clear(): void {
    this.components.clear();
  }
}
