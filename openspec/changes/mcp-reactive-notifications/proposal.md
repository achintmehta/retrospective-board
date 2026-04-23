# Proposal - Reactive MCP Notifications

## 1. Problem Statement
AI agents (like Claude Desktop) currently operate in a "stateless" or "polling" fashion when interacting with the retrospective board. They only discover changes if they explicitly re-run a tool or re-read a resource. This leads to stale information and a disconnect between the real-time web dashboard and the AI's understanding of the workspace.

## 2. Proposed Solution
Implement the full reactive lifecycle of the Model Context Protocol (MCP):
1.  **Enable Resource Subscriptions**: Allow agents to "watch" specific board URIs.
2.  **Event Bridge**: Tap into the existing Socket.io event stream (card added, deleted, moved) to trigger MCP notifications.
3.  **Standard Notifications**:
    - `notifications/resources/updated`: Nudge agents when board content shifts.
    - `notifications/resources/list_changed`: Signal when boards are added or removed.
    - `notifications/tools/list_changed`: (Future-proofing) Notify when tool capabilities change.

## 3. Goals
- AI agents stay in sync with human users in real-time.
- Minimal bandwidth usage (only URIs are sent, not payloads).
- Seamless integration with existing Node.js architecture.

## 4. Scope
- **Backend**: Update `mcpServer.js` and `index.js`.
- **Protocol**: Enable `resources: { subscribe: true }`.
- **Trigger**: Connect `io.emit` calls to `mcpServer.sendResourceUpdatedNotification`.
