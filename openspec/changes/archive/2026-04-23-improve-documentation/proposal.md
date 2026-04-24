## Why

As the project evolves with advanced AI features like the Notification Center and MCP interactive tools, the API surface and operational instructions need to be formal, discoverable, and always up-to-date. Manually maintained documentation often lags behind code; implementing a dedicated OpenAPI pipeline ensures that the API contract is automatically synchronized with the implementation. Furthermore, a detailed README is critical for onboarding both human developers and AI agents to the new agentic workspace capabilities.

## What Changes

- **Automated API Specification**: Integration of `swagger-jsdoc` to extract OpenAPI definitions directly from JSDoc comments in the codebase.
- **API Documentation Pipeline**: Addition of a `gen-api` script and integration into the development workflow to ensure `openapi.json` is always current.
- **README Overhaul**: Comprehensive expansion of the root `README.md` to document MCP tool signatures, transport configurations (SSE vs. Stdio), and the Notification Center persistent logic.
- **Discovery Endpoints**: Addition of a `/api-docs` or `/openapi.json` endpoint for automated discovery by AI tools and developers.

## Capabilities

### New Capabilities
- `api-specification`: Formal definition and automated generation of the REST and MCP service contracts using OpenAPI 3.0.

### Modified Capabilities
- `mcp-ai-workspace`: Update the specification to include requirements for automated documentation and schema-first discovery.

## Impact

- **Server**: New dependencies (`swagger-jsdoc`), updated `package.json` scripts, and addition of JSDoc documentation across `src/index.js` and `src/boardHandlers.js`.
- **Project Structure**: Addition of a generative `openapi.json` file.
- **Developer Experience**: Significantly improved onboarding and tool-discovery via the expanded `README.md`.
