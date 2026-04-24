# Proposal - AI Notification Center

## 1. Problem Statement
While the MCP server now has "Protocol-level" sync (nudging), these events are invisible to the LLM's reasoning engine. Claude (the agent) has no way to "look back" at what changed while it was offline, nor can it explicitly "subscribe" to topics in a way that is discoverable as a tool.

## 2. Proposed Solution
Implement a persistent **Notification Center** within the retro-board application:
1.  **Notification Log**: A new database table to store activity logs (boards created, cards added, etc.).
2.  **Activity Tracking**: Hooks into the existing event loop to record these events.
3.  **Discoverable Tools**:
    -   `get_recent_notifications`: A tool for the AI to fetch a human-readable activity feed.
    -   `subscribe_to_board_alerts`: A tool for the AI to "commit" to watching specific boards.
    -   `clear_notifications`: A way to manage the log state.

## 3. Goals
- Make "Notifications" discoverable as tools for AI agents.
- Provide a persistent activity feed that survives server restarts.
- Allow AI agents to act as proactive managers/watchers of the workspace.

## 4. Scope
- **Database**: Add `notifications` table.
- **Backend**: Update `boardHandlers.js` with notification CRUD logic.
- **MCP**: Add 3 new tools to `mcpServer.js`.
- **Bridge**: Update the `notifySubscribers` logic to also perform `DB log` operations.
