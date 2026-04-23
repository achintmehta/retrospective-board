# Tasks - Reactive MCP Notifications

## 1. Capability Setup
- [ ] 1.1 Update `mcpServer.js` to enable `resources: { subscribe: true }`.
- [ ] 1.2 Verify that the SDK handles `resources/subscribe` and `resources/unsubscribe` automatically or implement simple stubs if required.

## 2. Notification Implementation
- [ ] 2.1 Export a `notifySubscribers(uri)` helper from `mcpServer.js`.
- [ ] 2.2 Implement `mcpServer.sendResourceUpdatedNotification({ uri })` integration.
- [ ] 2.3 Implement `mcpServer.sendToolListChangedNotification()` for consistency.

## 3. Event Bridging (index.js)
- [ ] 3.1 Locate `card_added` / `card_deleted` Socket.io emitters.
- [ ] 3.2 Add `notifySubscribers` calls for specific board URIs.
- [ ] 3.3 Locate `board_created` / `board_deleted` emitters.
- [ ] 3.4 Add `mcpServer.sendResourceListChangedNotification()` calls.

## 4. Verification
- [ ] 4.1 Use MCP Inspector to verify "subscribe" capability is advertised.
- [ ] 4.2 Simulate a card add and verify receipt of `notifications/resources/updated` in a stateful session.
- [ ] 4.3 Verify that stateless clients continue to work without errors.
