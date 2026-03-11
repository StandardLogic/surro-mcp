#!/usr/bin/env node

/**
 * Surro Management MCP Server
 *
 * A thin adapter that exposes Surro Dashboard operations as MCP tools.
 * Enables developers to manage issuers, passports, and gates directly from Claude.
 *
 * Usage:
 *   SURRO_API_KEY=sk_xxx npx surro-mcp
 *   SURRO_API_KEY=uni_xxx npx surro-mcp
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { ApiClient } from './api-client.js';
import { allTools, handleToolCall } from './tools/index.js';

// Configuration from environment
const SURRO_API_URL = process.env.SURRO_API_URL || 'https://surro.io';
const SURRO_API_KEY = process.env.SURRO_API_KEY;

async function main() {
  // Validate configuration
  if (!SURRO_API_KEY) {
    console.error('Error: SURRO_API_KEY environment variable is required');
    console.error('');
    console.error('Usage:');
    console.error('  SURRO_API_KEY=sk_xxx npx surro-mcp');
    console.error('');
    console.error('Or for local development:');
    console.error('  SURRO_API_KEY=uni_xxx npx surro-mcp');
    process.exit(1);
  }

  // Initialize API client
  const api = new ApiClient({
    baseUrl: SURRO_API_URL,
    apiKey: SURRO_API_KEY,
  });

  // Create MCP server
  const server = new Server(
    {
      name: 'surro-manage',
      version: '1.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handle list_tools request
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: allTools };
  });

  // Handle call_tool request
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      const result = await handleToolCall(api, name, args || {});

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      return {
        content: [
          {
            type: 'text',
            text: `Error: ${message}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Start server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr (stdout is reserved for MCP protocol)
  console.error(`Surro Management MCP Server started`);
  console.error(`  API URL: ${SURRO_API_URL}`);
  console.error(`  API Key: ${SURRO_API_KEY.slice(0, 10)}...`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
