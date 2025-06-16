import { readFileSync, writeFileSync } from 'node:fs';

const schemaPath = 'graphql/schema.graphql';
const outputPath = 'graphql/schema.ts';

try {
  const graphqlSchema = readFileSync(schemaPath, 'utf8');

  // Use JSON.stringify to safely escape all characters for a JavaScript string literal
  const escapedForJsStringLiteral = JSON.stringify(graphqlSchema);

  // Wrap the escaped string in a TypeScript export statement
  const tsContent = `export const schemaString = ${escapedForJsStringLiteral};`;

  writeFileSync(outputPath, tsContent, 'utf8');
  console.log(`Successfully converted ${schemaPath} to ${outputPath}`);
} catch (error: any) {
  console.error(`Error converting GraphQL schema: ${error.message}`);
  Deno.exit(1);
}
