import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts';

Deno.test('Health endpoint should return 200', async () => {
  const response = await fetch('http://localhost:3000/health');
  assertEquals(response.status, 200);

  const data = await response.json();
  assertEquals(data.success, true);
  assertEquals(typeof data.timestamp, 'string');
});
