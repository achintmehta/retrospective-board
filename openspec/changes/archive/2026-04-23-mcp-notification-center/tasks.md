# Tasks - AI Notification Center

## 1. Database & Persistence Layer
- [x] 1.1 Create `notifications` table in `server/src/db/database.js`.
- [x] 1.2 Export a `createNotification(type, message, boardId)` helper from `boardHandlers.js`.
- [x] 1.3 Export a `getNotifications(limit, boardId)` helper from `boardHandlers.js`.

## 2. Event Bridge Integration
- [x] 2.1 Update the `notifySubscribers` and `notifyResourceListChanged` helpers in `mcpServer.js` (or `index.js`) to call the new persistence logic.
- [x] 2.2 Ensure that every significant Socket.io event also creates a human-readable notification log entry.

## 3. Tool Implementation
- [x] 3.1 Implement `get_recent_notifications` tool in `mcpServer.js`.
- [x] 3.2 Implement `subscribe_to_board_alerts` tool (Preferences/Log).
- [x] 3.3 Implement `clear_notifications` (or `mark_as_read`) tool.

## 4. Verification
- [x] 4.1 Perform an action (e.g., add a card) and verify a row is created in the `notifications` table.
- [x] 4.2 Call `get_recent_notifications` via Claude Desktop and verify the AI can see the history.
- [x] 4.3 Verify that the tool names are "discoverable" by asking the AI about its notification suite.
