# Design - Reactive MCP Notifications

## 1. Architecture Overview
The core of this design is an "Event Bridge" that translates internal application events (already broadcasted via Socket.io) into MCP protocol notifications.

## 2. Component Design

### A. MCP Server Capability Update
- Modify `mcpServer.js` to set `capabilities.resources.subscribe = true`.
- This tells agents that they can use the `resources/subscribe` and `resources/unsubscribe` methods.

### B. Subscription Management
- We will leverage the `@modelcontextprotocol/sdk` built-in state management. 
- When an agent calls `subscribe(uri)`, the SDK handles tracking that session's interest.

### C. The Notification Interface
- Create a helper in `mcpServer.js`: `notifySubscribers(uri)`.
- It will call `mcpServer.sendResourceUpdatedNotification({ uri })`.

### D. The Trigger Bridge (index.js)
We will add hooks into the existing server event loop:
1.  **Board Content Change**: When a card is added, moved, or deleted, nudge `retro://boards/{id}/full` and `retro://boards/{id}/md`.
2.  **Workspace Change**: When a board is created or deleted, nudge `retro://boards` (`notifications/resources/list_changed`).

## 3. Data Flow

```
1.  Human Action (Browser) -> API -> DB Update
2.  Server -> Socket.io: emit("card_added", { boardId: "A" })
3.  (NEW) Server -> MCP: notifySubscribers("retro://boards/A/md")
4.  MCP SDK -> AI Sessions: notifications/resources/updated { uri: "retro://boards/A/md" }
```

## 4. Considerations
- **Stateless POST**: These clients will not receive notifications. This is expected.
- **Performance**: Notifications are lightweight; we only send the URI.
- **URI Accuracy**: Ensure the bridge constructs URIs that exactly match the resource templates defined in `mcpServer.js`.
