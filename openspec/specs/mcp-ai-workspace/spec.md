## Purpose
Define the capabilities required for AI agents to participate as first-class citizens in the retrospective workspace via the Model Context Protocol (MCP).

## Requirements

### Requirement: Persistent Activity Heartbeat
The system SHALL maintain a persistent log of all workspace activity that is discoverable by AI agents.

#### Scenario: Catching up on missed activity
- **WHEN** an AI agent has been disconnected or inactive
- **THEN** it can call `get_recent_notifications` to retrieve a human-readable and machine-parsable history of board mutations (e.g., card additions, deletions)
- **THEN** the system returns a timestamped list from the `notifications` table

### Requirement: Structured Interactive Tools
The system SHALL provide tools that return structured JSON data with explicit identifiers (e.g., `cardId`, `columnId`) to enable programmatic interaction.

#### Scenario: Building an interactive agent summary
- **WHEN** an agent calls `get_board_details`
- **THEN** it receives a JSON response that maps readable content to internal IDs
- **THEN** the agent can use those IDs to target specific cards for replies or reactions

### Requirement: Universal Transport Support
The system SHALL support both stateful (SSE) and stateless (Direct Stdio) communication channels.

#### Scenario: Terminal-based agent interaction
- **WHEN** a CLI agent starts the server with the `--stdio` flag
- **THEN** the system bypasses the HTTP/Express layer and provides a direct Stdio-to-MCP bridge for instant local tool access
## ADDED Requirements

### Requirement: High-Fidelity AI Onboarding
The system SHALL provide a machine-readable and human-readable `README.md` that explicitly documents MCP surface area and connectivity options.

#### Scenario: Documentation-first agent setup
- **WHEN** an AI agent reads the project root `README.md`
- **THEN** it MUST find a section dedicated to "MCP & AI Interaction"
- **AND** that section MUST define the tool list, resource URI patterns, and how to configure Stdio vs. SSE transports
