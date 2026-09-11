## MODIFIED Requirements

### Requirement: Board Room Membership
The system SHALL allow clients to join and leave board-specific socket rooms to receive real-time updates. The `join_board` event SHALL carry both the board ID and the user's display name so the server can maintain presence information.

#### Scenario: Client joins a board room
- **WHEN** a client navigates to a board page
- **THEN** the client SHALL emit `join_board` with `{ boardId, username }` where `username` may be empty for anonymous users
- **THEN** the server SHALL add the socket to the `board:${boardId}` room
- **THEN** the server SHALL update presence tracking for that board

#### Scenario: Client leaves a board room
- **WHEN** a client navigates away from a board page or disconnects
- **THEN** the socket SHALL be removed from the board room
- **THEN** presence tracking SHALL be updated and broadcast to remaining members
