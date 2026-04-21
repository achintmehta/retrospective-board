## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Broadcast Grouping Events
The system SHALL broadcast all group-related mutations (group created, deleted; board moved to group) to all clients currently viewing the home page.

#### Scenario: Real-time group creation
- **WHEN** Client A creates a new board group
- **THEN** the backend broadcasts the new group state
- **THEN** Client B's dashboard UI is updated to show the new group without a refresh
