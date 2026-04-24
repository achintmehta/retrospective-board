## Context

The Retro Board server is an Express-based backend that manages both REST endpoints (for board operations, groups, and settings) and a Model Context Protocol (MCP) interface for AI agents. Currently, there is no centralized, formal specification of these interfaces, making it difficult for external tools and new developers to understand the full capability surface.

## Goals / Non-Goals

**Goals:**
- **Automated Specification**: Use a "Spec-as-Code" approach where OpenAPI documentation is generated from JSDoc comments.
- **Agent-First README**: Restructure the project documentation to highlight MCP capabilities and "Agentic" workflows.
- **Workflow Integration**: Ensure the API specification is updated automatically during development.

**Non-Goals:**
- **Runtime Swagger UI**: We will not implement a runtime Swagger UI (to keep the production bundle small and avoid security surface area); we will focus on generating the static `openapi.json` artifact.
- **Client SDK Generation**: Automatic generation of client SDKs is out of scope for this change.

## Decisions

### 1. JSDoc-based OpenAPI Generation
- **Choice**: `swagger-jsdoc`
- **Rationale**: Keeping documentation within JSDoc comments ensures that developers are more likely to update it alongside logic changes. It avoids the "split-brain" problem of maintaining a separate YAML file.
- **Alternative**: Manual YAML file. *Rejected* due to high maintenance burden and risk of documentation rot.

### 2. Static JSON Generation via Build Script
- **Choice**: A dedicated `npm run gen-api` script in the server package.
- **Rationale**: Generating a static `openapi.json` allows for easy versioning in Git and simplifies deployment to environments (like Docker) where runtime discovery tools are preferred.

### 3. README Restructuring
- **Choice**: Introduce a "MCP & AI Interaction" top-level section.
- **Rationale**: The unique value of this project is its agentic nature. Modern developers and AI users need a clear "contract" of how to connect and interact with the Notification Center.

## Risks / Trade-offs

- **[Risk] JSDoc Clutter** → **Mitigation**: Use concise @swagger definitions and potentially move complex model schemas to a dedicated `docs/schemas.js` file if files become too large.
- **[Risk] Outdated Spec** → **Mitigation**: Add a check to the `npm test` or `build` pipeline to verify the spec is fresh.
