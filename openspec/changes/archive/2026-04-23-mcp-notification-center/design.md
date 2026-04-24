# Design - AI Notification Center

## 1. Data Model

### A. Notifications Table
A persistent log of all "Events of Interest" in the workspace.
- `id`: UUID (Primary Key)
- `board_id`: UUID (Nullable, for board-specific events)
- `event_type`: TEXT (e.g., 'card_added', 'reply_posted')
- `message`: TEXT (Human-readable summary, e.g., "Achint added a card to Sprint 42")
- `is_read`: BOOLEAN (Default: false)
- `created_at`: DATETIME (Default: CURRENT_TIMESTAMP)

### B. Subscriptions Table (Optional/Future)
For now, we will simulate "subscriptions" by allowing the AI to record its intent in a preferences table.

## 2. Component Design

### A. The Logger Bridge
We will enhance the existing notification bridge in `mcpServer.js` (or `index.js`) to perform a dual action:
1.  **Protocol Sync**: `sendResourceUpdatedNotification` (Nudge).
2.  **Persistence**: `db.run("INSERT INTO notifications...")` (Log).

### B. MCP Tool Definitions

#### `get_recent_notifications`
- **Purpose**: Allows the AI to "catch up" on missed work.
- **Input**: `limit` (default 20), `boardId` (optional filter).
- **Return**: Array of notification objects.

#### `subscribe_to_board_alerts`
- **Purpose**: Satisfies the LLM's desire for a "subscription" tool.
- **Input**: `boardId`, `alertType` (e.g., 'all', 'mentions').
- **Logic**: Records the AI's "Interest" in the system log.

#### `clear_notifications`
- **Purpose**: Allows the AI to "ack" or clean up its feed.
- **Input**: `notificationId` or `all: true`.

## 3. Interaction Flow

```
[System Event] ────▶ [Event Bridge] ───┬──▶ [MCP Nudge (SSE)]
                                       │
                                       └──▶ [DB Notification Log]
                                                   │
                                                   ▼
                                        AI Agent: `get_recent_notifications`
```
