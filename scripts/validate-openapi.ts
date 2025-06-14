#!/usr/bin/env -S deno run --allow-net --allow-read

/**
 * Validate OpenAPI specification
 * Run with: deno run --allow-net --allow-read scripts/validate-openapi.ts
 */

import { join } from 'https://deno.land/std@0.218.0/path/mod.ts';
import { parse } from 'https://deno.land/std@0.218.0/yaml/mod.ts';

const OPENAPI_FILE = 'docs/openapi.yaml';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

async function validateOpenAPI(): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  try {
    console.log('🔍 Validating OpenAPI specification...\n');

    // Read and parse the OpenAPI file
    const openapiPath = join(Deno.cwd(), OPENAPI_FILE);
    const content = await Deno.readTextFile(openapiPath);

    console.log('📖 Reading OpenAPI file...');
    const spec = parse(content) as any;

    // Basic structure validation
    console.log('🔧 Validating basic structure...');

    if (!spec.openapi) {
      result.errors.push('Missing required field: openapi');
      result.valid = false;
    }

    if (!spec.info) {
      result.errors.push('Missing required field: info');
      result.valid = false;
    }

    if (!spec.info.title) {
      result.errors.push('Missing required field: info.title');
      result.valid = false;
    }

    if (!spec.info.version) {
      result.errors.push('Missing required field: info.version');
      result.valid = false;
    }

    if (!spec.paths) {
      result.errors.push('Missing required field: paths');
      result.valid = false;
    }

    // Validate paths
    console.log('🛣️  Validating paths...');
    const paths = Object.keys(spec.paths);

    if (paths.length === 0) {
      result.warnings.push('No paths defined in the specification');
    }

    for (const path of paths) {
      const pathObj = spec.paths[path];
      const methods = Object.keys(pathObj).filter((key) =>
        ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'trace']
          .includes(key)
      );

      if (methods.length === 0) {
        result.warnings.push(`Path ${path} has no HTTP methods defined`);
      }

      for (const method of methods) {
        const operation = pathObj[method];

        if (!operation.summary && !operation.description) {
          result.warnings.push(
            `Operation ${method.toUpperCase()} ${path} should have a summary or description`,
          );
        }

        if (operation.security && !spec.components?.securitySchemes) {
          result.warnings.push(
            `Operation ${method.toUpperCase()} ${path} uses security but no security schemes are defined`,
          );
        }
      }
    }

    // Validate components
    console.log('🧩 Validating components...');
    if (spec.components) {
      if (spec.components.schemas) {
        const schemas = Object.keys(spec.components.schemas);
        console.log(`   Found ${schemas.length} schemas`);

        for (const schemaName of schemas) {
          const schema = spec.components.schemas[schemaName];
          if (
            !schema.type && !schema.$ref && !schema.allOf && !schema.oneOf &&
            !schema.anyOf
          ) {
            result.warnings.push(
              `Schema ${schemaName} should have a type or reference`,
            );
          }
        }
      }

      if (spec.components.securitySchemes) {
        const schemes = Object.keys(spec.components.securitySchemes);
        console.log(`   Found ${schemes.length} security schemes`);
      }
    }

    // Validate servers
    console.log('🌐 Validating servers...');
    if (spec.servers) {
      console.log(`   Found ${spec.servers.length} servers`);
      for (const server of spec.servers) {
        if (!server.url) {
          result.errors.push('Server must have a URL');
          result.valid = false;
        }
      }
    } else {
      result.warnings.push('No servers defined (will use relative URLs)');
    }

    // Check for common issues
    console.log('🔍 Checking for common issues...');

    // Check if all referenced schemas exist
    const allSchemas = new Set(Object.keys(spec.components?.schemas || {}));
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
      if (!allSchemas.has(ref)) {
        result.errors.push(`Referenced schema '${ref}' does not exist`);
        result.valid = false;
      }
    }

    console.log('\n✅ Validation completed!\n');
  } catch (error) {
    result.valid = false;
    result.errors.push(
      `Failed to parse OpenAPI file: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }

  return result;
}

function printResults(result: ValidationResult): void {
  console.log('📋 Validation Results:\n');

  if (result.errors.length > 0) {
    console.log('❌ Errors:');
    for (const error of result.errors) {
      console.log(`   • ${error}`);
    }
    console.log('');
  }

  if (result.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    for (const warning of result.warnings) {
      console.log(`   • ${warning}`);
    }
    console.log('');
  }

  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log('🎉 No issues found! Your OpenAPI specification is valid.');
  }

  console.log(`Overall Status: ${result.valid ? '✅ Valid' : '❌ Invalid'}`);
}

// Run validation
if (import.meta.main) {
  const result = await validateOpenAPI();
  printResults(result);

  if (!result.valid) {
    Deno.exit(1);
  }
}
