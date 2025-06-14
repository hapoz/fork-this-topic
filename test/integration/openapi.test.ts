import { assertEquals, assertExists } from '@std/assert';
import { join } from 'https://deno.land/std@0.218.0/path/mod.ts';
import { parse } from 'https://deno.land/std@0.218.0/yaml/mod.ts';

Deno.test('OpenAPI Specification Tests', async (t) => {
  let spec: any;

  await t.step('Load and parse OpenAPI specification', async () => {
    const openapiPath = join(Deno.cwd(), 'docs/openapi.yaml');
    const content = await Deno.readTextFile(openapiPath);
    spec = parse(content);

    assertExists(spec, 'OpenAPI specification should be parsed');
  });

  await t.step('Validate basic structure', () => {
    assertEquals(spec.openapi, '3.0.3', 'Should be OpenAPI 3.0.3');
    assertExists(spec.info, 'Should have info section');
    assertExists(spec.info.title, 'Should have title');
    assertExists(spec.info.version, 'Should have version');
    assertExists(spec.paths, 'Should have paths section');
  });

  await t.step('Validate required paths exist', () => {
    const paths = Object.keys(spec.paths);
    assertEquals(paths.length > 0, true, 'Should have at least one path');

    // Check for essential endpoints
    const essentialPaths = [
      '/health',
      '/api/users',
      '/api/users/login',
      '/api/topics',
      '/api/resources',
    ];

    for (const path of essentialPaths) {
      assertEquals(paths.includes(path), true, `Should include path: ${path}`);
    }
  });

  await t.step('Validate components section', () => {
    assertExists(spec.components, 'Should have components section');
    assertExists(spec.components.schemas, 'Should have schemas');
    assertExists(
      spec.components.securitySchemes,
      'Should have security schemes',
    );

    // Check for essential schemas
    const essentialSchemas = [
      'User',
      'Topic',
      'Resource',
      'UserRole',
      'ResourceType',
    ];
    const schemas = Object.keys(spec.components.schemas);

    for (const schema of essentialSchemas) {
      assertEquals(
        schemas.includes(schema),
        true,
        `Should include schema: ${schema}`,
      );
    }
  });

  await t.step('Validate security schemes', () => {
    const securitySchemes = Object.keys(spec.components.securitySchemes);
    assertEquals(
      securitySchemes.includes('bearerAuth'),
      true,
      'Should have bearerAuth security scheme',
    );
  });

  await t.step('Validate servers configuration', () => {
    assertExists(spec.servers, 'Should have servers section');
    assertEquals(
      spec.servers.length > 0,
      true,
      'Should have at least one server',
    );

    for (const server of spec.servers) {
      assertExists(server.url, 'Server should have URL');
    }
  });

  await t.step('Validate response schemas', () => {
    // Check that all paths have proper response schemas
    const paths = Object.keys(spec.paths);

    for (const path of paths) {
      const pathObj = spec.paths[path];
      const methods = Object.keys(pathObj).filter((key) =>
        ['get', 'post', 'put', 'delete'].includes(key)
      );

      for (const method of methods) {
        const operation = pathObj[method];
        assertExists(
          operation.responses,
          `Operation ${method.toUpperCase()} ${path} should have responses`,
        );

        // Check for at least one success response
        const hasSuccessResponse = Object.keys(operation.responses).some(
          (code) => code.startsWith('2'),
        );
        assertEquals(
          hasSuccessResponse,
          true,
          `Operation ${method.toUpperCase()} ${path} should have a success response`,
        );
      }
    }
  });

  await t.step('Validate schema references', () => {
    // Check that all schema references exist
    const allSchemas = new Set(Object.keys(spec.components.schemas));
    const referencedSchemas = new Set<string>();

    // Simple regex to find schema references
    const refRegex = /#\/components\/schemas\/([^"'\s]+)/g;
    const contentStr = JSON.stringify(spec);
    let match;

    while ((match = refRegex.exec(contentStr)) !== null) {
      if (match[1]) {
        referencedSchemas.add(match[1]);
      }
    }

    for (const ref of referencedSchemas) {
      assertEquals(
        allSchemas.has(ref),
        true,
        `Referenced schema '${ref}' should exist`,
      );
    }
  });

  console.log('✅ OpenAPI specification validation completed successfully!');
});
