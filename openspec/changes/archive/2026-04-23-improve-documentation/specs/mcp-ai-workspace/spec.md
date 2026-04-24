## ADDED Requirements

### Requirement: High-Fidelity AI Onboarding
The system SHALL provide a machine-readable and human-readable `README.md` that explicitly documents MCP surface area and connectivity options.

#### Scenario: Documentation-first agent setup
- **WHEN** an AI agent reads the project root `README.md`
- **THEN** it MUST find a section dedicated to "MCP & AI Interaction"
- **AND** that section MUST define the tool list, resource URI patterns, and how to configure Stdio vs. SSE transports
