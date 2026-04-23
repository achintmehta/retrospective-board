# Proposal - MCP Server Integration

## Goal
Expose the retrospective board's functionality to AI agents via the Model Context Protocol (MCP), enabling automated summarization, direct interaction via conversational agents, and cross-platform collaboration.

## Context
Agile teams often use AI assistants for summarizing meetings and managing tasks. By making the retrospective board "MCP-aware," we turn the board into a queryable data source and an actionable toolset for LLMs.

## Requirements
- **Integrated Server**: The MCP server must coexist with the existing web backend (Node/Express).
- **Dual Transport Support**: Support both standard REST/Socket.IO for web users and SSE for MCP clients.
- **Data Access**: Expose board states as Markdown (for high-fidelity context) and JSON.
- **Action Tools**: Agents must be able to add/delete cards, with changes reflecting instantly in the web UI.
- **Local Connectivity**: Allow local AI clients (e.g., Claude Desktop) to connect to the retro board server.

## User Review Required
> [!IMPORTANT]
> The MCP server will expose board content to any connected AI client. We must ensure that the AI agent's actions (like adding a card) are clearly labeled (e.g., "By: AI Assistant") to prevent confusion with human contributors.

## Proposed Changes
- **Backend Integrations**: Add `@modelcontextprotocol/sdk` to `server`.
- **New Endpoints**: Implement `/mcp/sse` and `/mcp/messages` routes.
- **MCP Components**: Define Resources (Boards, Markdown) and Tools (AddCard, DeleteCard).
- **Socket.io Sync**: Bridge MCP tool calls to Socket.io broadcasts.

## Success Criteria
- [ ] An AI agent can list all retrospective boards.
- [ ] An AI agent can read a board in Markdown format.
- [ ] An AI agent can add a card, and it appears instantly in the web browser.
- [ ] Documentation is provided for connecting Claude Desktop.
