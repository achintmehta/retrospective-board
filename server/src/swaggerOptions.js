const path = require('path');

module.exports = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Retro Board API & MCP Node',
      version: '1.0.0',
      description: 'Unified API and MCP tool documentation for the Self-hosted Retrospective Board. This specification covers both traditional REST endpoints and the Agentic Workspace capabilities.',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        // Reserved for future auth implementation
      }
    }
  },
  // Paths to files containing OpenAPI definitions (JSDoc)
  apis: [
    path.join(__dirname, './index.js'),
    path.join(__dirname, './mcpServer.js'),
    path.join(__dirname, './boardHandlers.js'),
  ],
};
