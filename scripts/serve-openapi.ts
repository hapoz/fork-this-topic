#!/usr/bin/env -S deno run --allow-net --allow-read

/**
 * Serve OpenAPI documentation
 * Run with: deno run --allow-net --allow-read scripts/serve-openapi.ts
 */

import { serve } from 'https://deno.land/std@0.218.0/http/server.ts';
import { join } from 'https://deno.land/std@0.218.0/path/mod.ts';

const PORT = 8081;
const OPENAPI_FILE = 'docs/openapi.yaml';

// HTML template for Swagger UI
const swaggerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Dynamic Knowledge Base API Documentation" />
    <title>Dynamic Knowledge Base API - Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin:0;
            background: #fafafa;
        }
        .swagger-ui .topbar {
            background-color: #2c3e50;
        }
        .swagger-ui .topbar .download-url-wrapper .select-label {
            color: #fff;
        }
        .swagger-ui .topbar .download-url-wrapper input[type=text] {
            border: 2px solid #34495e;
        }
        .swagger-ui .info .title {
            color: #2c3e50;
        }
        .swagger-ui .info .title small {
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js" crossorigin></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js" crossorigin></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: '/openapi.yaml',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                validatorUrl: null,
                tryItOutEnabled: true,
                requestInterceptor: function(request) {
                    // Add CORS headers for try-it-out functionality
                    request.headers = request.headers || {};
                    return request;
                }
            });
        };
    </script>
</body>
</html>
`;

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  try {
    if (path === '/' || path === '/index.html') {
      return new Response(swaggerHtml, {
        headers: {
          'content-type': 'text/html; charset=utf-8',
        },
      });
    }

    if (path === '/openapi.yaml') {
      const openapiPath = join(Deno.cwd(), OPENAPI_FILE);
      const content = await Deno.readTextFile(openapiPath);

      return new Response(content, {
        headers: {
          'content-type': 'application/x-yaml; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    if (path === '/health') {
      return new Response(
        JSON.stringify({
          status: 'healthy',
          service: 'OpenAPI Documentation Server',
          timestamp: new Date().toISOString(),
          uptime: performance.now(),
        }),
        {
          headers: {
            'content-type': 'application/json; charset=utf-8',
          },
        },
      );
    }

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    return new Response('Not Found', { status: 404 });
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

console.log(`🚀 OpenAPI Documentation Server starting...`);
console.log(`📖 Documentation: http://localhost:${PORT}`);
console.log(`🔗 OpenAPI Spec: http://localhost:${PORT}/openapi.yaml`);
console.log(`💚 Health Check: http://localhost:${PORT}/health`);
console.log(`\nPress Ctrl+C to stop the server`);

await serve(handleRequest, { port: PORT });
