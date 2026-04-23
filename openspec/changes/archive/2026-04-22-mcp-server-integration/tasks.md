# Tasks - MCP Server Integration

## 1. Setup & Foundations
- [x] 1.1 Install `@modelcontextprotocol/sdk` in the `server` directory.
- [x] 1.2 Refactor `MarkdownExport` logic into a shared utility reachable by the server (if client-only) or implement a server-side mirror.
- [x] 1.3 Initialize the MCP `Server` instance in `server/src/index.js`.

## 2. Transports & Routes
- [x] 2.1 Implement the `/mcp` SSE endpoint for connection establishment.
- [x] 2.2 Implement the `/mcp/messages` POST endpoint for JSON-RPC communication.
- [x] 2.3 Verify basic connection with an MCP inspector.

## 3. Resources & Tools
- [x] 3.1 Expose `retro://boards` resource.
- [x] 3.2 Expose `retro://boards/{id}/md` resource.
- [x] 3.3 Implement `add_card` tool with Socket.io broadcast.
- [x] 3.4 Implement `delete_card` tool with Socket.io broadcast.
- [x] 3.5 Implement `get_board_summary` tool.

## 4. Documentation & UX
- [x] 4.1 Test the end-to-end flow with Claude Desktop or similar agent.
- [x] 4.2 Add "AI Agent Connectivity" section to `README.md` with Claude Desktop config snippet.
- [x] 4.3 Add a visual indicator or system message when an AI agent connects (optional/polish).
