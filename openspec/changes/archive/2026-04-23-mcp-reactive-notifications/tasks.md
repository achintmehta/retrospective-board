# Tasks - Reactive MCP Notifications

## 1. Capability Setup
- [x] 1.1 Update `mcpServer.js` to enable `resources: { subscribe: true }`.
- [x] 1.2 Verify that the SDK handles `resources/subscribe` and `resources/unsubscribe` automatically or implement simple stubs if required.

## 2. Notification Implementation
- [x] 2.1 Export a `notifySubscribers(uri)` helper from `mcpServer.js`.
- [x] 2.2 Implement `mcpServer.sendResourceUpdatedNotification({ uri })` integration.
- [x] 2.3 Implement `mcpServer.sendToolListChangedNotification()` for consistency.

## 3. Event Bridging (index.js)
- [x] 3.1 Locate `card_added` / `card_deleted` Socket.io emitters.
- [x] 3.2 Add `notifySubscribers` calls for specific board URIs.
- [x] 3.3 Locate `board_created` / `board_deleted` emitters.
- [x] 3.4 Add `mcpServer.sendResourceListChangedNotification()` calls.

## 4. Verification
- [x] 4.1 Use MCP Inspector to verify "subscribe" capability is advertised.
- [x] 4.2 Simulate a card add and verify receipt of `notifications/resources/updated` in a stateful session.
- [x] 4.3 Verify that stateless clients continue to work without errors.
