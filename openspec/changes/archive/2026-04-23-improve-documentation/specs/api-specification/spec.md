## ADDED Requirements

### Requirement: Automated OpenAPI Generation
The system SHALL support the automated generation of an OpenAPI 3.0 specification from the server source code.

#### Scenario: Generation of API contract
- **WHEN** the `npm run gen-api` script is executed
- **THEN** the system parses JSDoc comments in the `server` directory
- **AND** generates a valid `openapi.json` file in the project root

### Requirement: Documentation-Ready Endpoints
Every external REST and MCP endpoint in the `server` SHALL be decorated with compliant JSDoc `@swagger` or `@openapi` tags.

#### Scenario: Metadata validation
- **WHEN** a developer adds a new route
- **THEN** they MUST include JSDoc defining the summary, description, parameters, and response schemas
- **AND** these details MUST appear in the generated `openapi.json`

### Requirement: API Discovery Endpoint
The server SHALL expose the generated specification via a public HTTP endpoint for automated discovery.

#### Scenario: AI agent discovery
- **WHEN** an AI tool or developer requests `GET /openapi.json`
- **THEN** the server returns the contents of the latest `openapi.json` file with `application/json` mime-type
