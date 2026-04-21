## ADDED Requirements

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
