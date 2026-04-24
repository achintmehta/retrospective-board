## Purpose
Define the realtime synchronization capabilities of the board.

### Requirement: MCP Resource Subscription
The system SHALL support the Model Context Protocol (MCP) `resources/subscribe` capability. AI agents can "watch" generic board resources (Markdown and JSON) and receive proactive `notifications/resources/updated` alerts when board state changes.

#### Scenario: Proactive AI Notification
- **WHEN** any client (Web or AI) adds a card to a board
- **THEN** the system triggers standard Socket.io broadcasts to Web clients
- **AND** the system broadcasts a `notifications/resources/updated` event to all MCP clients subscribed to that board's resource URI

## Requirements
### Requirement: Broadcast Board Changes
The system SHALL instantly broadcast board mutations (cards added, moved, deleted; columns added, deleted) to all connected clients viewing that board.

#### Scenario: Real-time update on card mutation
- **WHEN** Client A performs an action (e.g., adds a card) on the board
- **THEN** the backend broadcasts the change event
- **THEN** Client B's UI reflects the new state instantly without a page refresh

### Requirement: State Hydration
The system SHALL provide the full initial board state to clients upon connection.

#### Scenario: Initial load of an active board
- **WHEN** a client successfully loads a board URL
- **THEN** the backend sends the complete structured state (columns and cards) via HTTP or WebSocket payload to render the UI

### Requirement: Broadcast Nested Data Additions
The system SHALL broadcast any additions or modifications of nested data (replies, reactions, images) in real-time.

#### Scenario: Client adds a reply
- **WHEN** Client A adds a reply or reaction to a card
- **THEN** the server immediately broadcasts the new nested data to Client B in the same room, without requiring a full board refresh

