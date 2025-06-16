import type { CodegenConfig } from 'graphql-codegen-cli';
import { TypeScriptPluginConfig } from 'npm:@graphql-codegen/typescript';
import { TypeScriptResolversPluginConfig } from 'npm:@graphql-codegen/typescript-resolvers';

const config: CodegenConfig = {
  schema: 'graphql/schema.graphql',
  generates: {
    './types/graphql.ts': {
      plugins: [
        '@graphql-codegen/typescript',
        '@graphql-codegen/typescript-resolvers',
      ],
      config: {
        // You can add TypeScript specific configurations here if needed
      } as TypeScriptPluginConfig & TypeScriptResolversPluginConfig,
    },
  },
};

export default config;
