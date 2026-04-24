## 1. OpenAPI Infrastructure

- [x] 1.1 Install `swagger-jsdoc` as a dev dependency in the `server` directory
- [x] 1.2 Create `server/src/swaggerOptions.js` to define the OpenAPI base info (title, version, server URLs)
- [x] 1.3 Add `gen-api` script to `server/package.json` to generate `openapi.json` from JSDoc
- [x] 1.4 Update root `package.json` to include a top-level `gen-api` command

## 2. API Documentation (JSDoc)

- [x] 2.1 Add `@swagger` documentation for Board management routes in `server/src/index.js`
- [x] 2.2 Add `@swagger` documentation for Column and Card routes in `server/src/index.js`
- [x] 2.3 Add `@swagger` documentation for Group and Subscription routes
- [x] 2.4 Add `@swagger` documentation for the MCP `/mcp` endpoint and specific tool schemas in `server/src/mcpServer.js`

## 3. README Overhaul

- [x] 3.1 Restructure root `README.md` to prioritize "Agentic Workspace" capabilities
- [x] 3.2 Add "MCP & AI Interaction" section explaining tools and resource patterns
- [x] 3.3 Add "Transport Configuration" guide (SSE vs. Stdio) for different AI clients
- [x] 3.4 Document the persistent Notification Center and how to query it

## 4. Discovery & Verification

- [x] 4.1 Implement `GET /openapi.json` route in `server/src/index.js` to serve the static specification file
- [x] 4.2 Run `npm run gen-api` and verify the generated `openapi.json` file is valid OpenAPI 3.0
- [x] 4.3 Manually verify `GET /openapi.json` returns the correctly rendered specification
