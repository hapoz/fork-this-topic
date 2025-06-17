// Simple performance benchmarks for the API
// Run with: deno task bench

// Mock data for benchmarking
const mockTopic = {
  id: 'test-topic-1',
  title: 'Test Topic',
  content: 'This is a test topic for benchmarking',
  parentId: null,
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockResource = {
  id: 'test-resource-1',
  title: 'Test Resource',
  content: 'This is a test resource for benchmarking',
  topicId: 'test-topic-1',
  type: 'article',
  url: 'https://example.com',
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Simple benchmark runner
async function runBenchmark(
  name: string,
  fn: () => void,
  iterations = 1000,
): Promise<void> {
  await Promise.resolve();
  console.log(`\n🏃 Running benchmark: ${name}`);
  console.log(`   Iterations: ${iterations}`);

  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const end = performance.now();
  const duration = end - start;
  const avgDuration = duration / iterations;

  console.log(`   Total time: ${duration.toFixed(2)}ms`);
  console.log(`   Average time: ${avgDuration.toFixed(4)}ms`);
  console.log(`   Operations/sec: ${(1000 / avgDuration).toFixed(2)}`);
}

// Benchmark functions
function benchmarkTopicCreation(): void {
  const topic = { ...mockTopic, id: `topic-${Date.now()}` };
  if (typeof topic.id !== 'string') throw new Error('Invalid topic ID');
}

function benchmarkTopicUpdate(): void {
  const updatedTopic = { ...mockTopic, version: mockTopic.version + 1 };
  if (updatedTopic.version !== mockTopic.version + 1) {
    throw new Error('Invalid version update');
  }
}

function benchmarkResourceCreation(): void {
  const resource = { ...mockResource, id: `resource-${Date.now()}` };
  if (typeof resource.id !== 'string') throw new Error('Invalid resource ID');
}

function benchmarkJsonSerialization(): void {
  const json = JSON.stringify(mockTopic);
  if (typeof json !== 'string') throw new Error('Invalid JSON serialization');
}

function benchmarkJsonDeserialization(): void {
  const jsonString = JSON.stringify(mockTopic);
  const parsed = JSON.parse(jsonString);
  if (typeof parsed !== 'object') {
    throw new Error('Invalid JSON deserialization');
  }
}

function benchmarkUuidGeneration(): void {
  const uuid = crypto.randomUUID();
  if (typeof uuid !== 'string' || uuid.length !== 36) {
    throw new Error('Invalid UUID');
  }
}

function benchmarkArrayOperations(): void {
  const topics = Array.from({ length: 100 }, (_, i) => ({
    ...mockTopic,
    id: `topic-${i}`,
    title: `Topic ${i}`,
  }));

  const filtered = topics.filter((t) => t.title.includes('Topic'));
  const mapped = topics.map((t) => ({ ...t, version: t.version + 1 }));

  if (filtered.length !== 100 || mapped.length !== 100) {
    throw new Error('Invalid array operations');
  }
}

// Main benchmark runner
async function runAllBenchmarks(): Promise<void> {
  console.log('🚀 Starting API Performance Benchmarks\n');
  console.log('='.repeat(50));

  await runBenchmark('Topic Creation', benchmarkTopicCreation);
  await runBenchmark('Topic Update', benchmarkTopicUpdate);
  await runBenchmark('Resource Creation', benchmarkResourceCreation);
  await runBenchmark('JSON Serialization', benchmarkJsonSerialization);
  await runBenchmark('JSON Deserialization', benchmarkJsonDeserialization);
  await runBenchmark('UUID Generation', benchmarkUuidGeneration);
  await runBenchmark('Array Operations', benchmarkArrayOperations);

  console.log('\n' + '='.repeat(50));
  console.log('✅ All benchmarks completed!');
}

// Run benchmarks if this file is executed directly
if (import.meta.main) {
  await runAllBenchmarks();
}
