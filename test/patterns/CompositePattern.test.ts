import {
  assertEquals,
  assertExists,
  assertThrows,
} from 'https://deno.land/std@0.208.0/assert/mod.ts';
import {
  TopicComponentFactory,
  TopicComposite,
  TopicLeaf,
  TopicTreeBuilder,
} from '../../patterns/CompositePattern.ts';
import { Topic } from '../../types/index.ts';

Deno.test('Composite Pattern Tests', async (t) => {
  const mockTopic: Topic = {
    id: '1',
    name: 'Test Topic',
    content: 'Test content',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockChildTopic: Topic = {
    id: '2',
    name: 'Child Topic',
    content: 'Child content',
    version: 1,
    parentTopicId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await t.step('TopicLeaf Creation', () => {
    const leaf = new TopicLeaf(mockTopic);

    assertEquals(leaf.getTopic(), mockTopic);
    assertEquals(leaf.getChildren(), []);
    assertEquals(leaf.getDepth(), 0);
    assertEquals(leaf.getPath(), ['Test Topic']);
    assertEquals(leaf.isLeaf(), true);
  });

  await t.step('TopicComposite Creation', () => {
    const composite = new TopicComposite(mockTopic);

    assertEquals(composite.getTopic(), mockTopic);
    assertEquals(composite.getChildren(), []);
    assertEquals(composite.getDepth(), 0);
    assertEquals(composite.getPath(), ['Test Topic']);
    assertEquals(composite.isLeaf(), false);
    assertEquals(composite.getChildCount(), 0);
    assertEquals(composite.hasChildren(), false);
  });

  await t.step('Adding Children to Composite', () => {
    const composite = new TopicComposite(mockTopic);
    const child = new TopicLeaf(mockChildTopic);

    composite.addChild(child);

    assertEquals(composite.getChildCount(), 1);
    assertEquals(composite.hasChildren(), true);
    assertEquals(composite.getChildren(), [child]);
    assertEquals(composite.getDepth(), 1);
  });

  await t.step('Removing Children from Composite', () => {
    const composite = new TopicComposite(mockTopic);
    const child = new TopicLeaf(mockChildTopic);

    composite.addChild(child);
    assertEquals(composite.getChildCount(), 1);

    composite.removeChild(child);
    assertEquals(composite.getChildCount(), 0);
    assertEquals(composite.hasChildren(), false);
  });

  await t.step('Leaf Cannot Add Children', () => {
    const leaf = new TopicLeaf(mockTopic);
    const child = new TopicLeaf(mockChildTopic);

    assertThrows(
      () => leaf.addChild(child),
      Error,
      'Cannot add child to leaf topic',
    );
  });

  await t.step('Leaf Cannot Remove Children', () => {
    const leaf = new TopicLeaf(mockTopic);
    const child = new TopicLeaf(mockChildTopic);

    assertThrows(
      () => leaf.removeChild(child),
      Error,
      'Cannot remove child from leaf topic',
    );
  });

  await t.step('TopicComponentFactory - Create Leaf', () => {
    const component = TopicComponentFactory.createComponent(mockTopic, false);

    assertEquals(component.isLeaf(), true);
    assertEquals(component.getTopic(), mockTopic);
  });

  await t.step('TopicComponentFactory - Create Composite', () => {
    const component = TopicComponentFactory.createComponent(mockTopic, true);

    assertEquals(component.isLeaf(), false);
    assertEquals(component.getTopic(), mockTopic);
  });

  await t.step('TopicComponentFactory - Create from Topic List', () => {
    const topics = [mockTopic, mockChildTopic];
    const components = TopicComponentFactory.createFromTopicList(topics);

    assertEquals(components.length, 2);
    assertEquals(components[0].getTopic(), mockTopic);
    assertEquals(components[1].getTopic(), mockChildTopic);
  });

  await t.step('TopicTreeBuilder - Build Hierarchy', () => {
    const builder = new TopicTreeBuilder();

    builder
      .addTopic(mockTopic, true)
      .addTopic(mockChildTopic, false);

    const roots = builder.buildHierarchy();

    assertEquals(roots.length, 1);
    assertEquals(roots[0].getTopic(), mockTopic);
    assertEquals(roots[0].isLeaf(), false);

    const composite = roots[0] as TopicComposite;
    assertEquals(composite.getChildCount(), 1);
    assertEquals(composite.getChildren()[0].getTopic(), mockChildTopic);
  });

  await t.step('TopicTreeBuilder - Clear', () => {
    const builder = new TopicTreeBuilder();

    builder.addTopic(mockTopic, true);
    assertEquals(builder.buildHierarchy().length, 1);

    builder.clear();
    assertEquals(builder.buildHierarchy().length, 0);
  });

  await t.step('Composite - Find Child by Name', () => {
    const composite = new TopicComposite(mockTopic);
    const child = new TopicLeaf(mockChildTopic);

    composite.addChild(child);

    const found = composite.findChildByName('Child Topic');
    assertExists(found);
    assertEquals(found.getTopic(), mockChildTopic);

    const notFound = composite.findChildByName('Non-existent');
    assertEquals(notFound, null);
  });

  await t.step('Composite - Get All Descendants', () => {
    const composite = new TopicComposite(mockTopic);
    const child = new TopicLeaf(mockChildTopic);

    composite.addChild(child);

    const descendants = composite.getAllDescendants();
    assertEquals(descendants.length, 1);
    assertEquals(descendants[0].getTopic(), mockChildTopic);
  });

  await t.step('Composite - Get All Topics', () => {
    const composite = new TopicComposite(mockTopic);
    const child = new TopicLeaf(mockChildTopic);

    composite.addChild(child);

    const topics = composite.getAllTopics();
    assertEquals(topics.length, 2);
    assertEquals(topics[0], mockTopic);
    assertEquals(topics[1], mockChildTopic);
  });

  await t.step('Complex Hierarchy', () => {
    const rootTopic: Topic = {
      id: 'root',
      name: 'Root',
      content: 'Root content',
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const child1Topic: Topic = {
      id: 'child1',
      name: 'Child 1',
      content: 'Child 1 content',
      version: 1,
      parentTopicId: 'root',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const child2Topic: Topic = {
      id: 'child2',
      name: 'Child 2',
      content: 'Child 2 content',
      version: 1,
      parentTopicId: 'root',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const grandchildTopic: Topic = {
      id: 'grandchild',
      name: 'Grandchild',
      content: 'Grandchild content',
      version: 1,
      parentTopicId: 'child1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const builder = new TopicTreeBuilder();
    builder
      .addTopic(rootTopic, true)
      .addTopic(child1Topic, true)
      .addTopic(child2Topic, false)
      .addTopic(grandchildTopic, false);

    const roots = builder.buildHierarchy();
    assertEquals(roots.length, 1);

    const root = roots[0] as TopicComposite;
    assertEquals(root.getChildCount(), 2);
    assertEquals(root.getDepth(), 2);

    const child1 = root.getChildren()[0] as TopicComposite;
    assertEquals(child1.getChildCount(), 1);
    assertEquals(child1.getDepth(), 1);

    const child2 = root.getChildren()[1] as TopicLeaf;
    assertEquals(child2.getDepth(), 0);
  });
});
