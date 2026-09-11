## ADDED Requirements

### Requirement: Server-Side Per-Board Presence Tracking
The server SHALL maintain an in-memory presence list per board, mapping socket IDs to usernames. The list SHALL be updated on join, leave, and disconnect events. Presence data is ephemeral and not persisted to the database.

#### Scenario: User joins a board
- **WHEN** a client emits `join_board` with `{ boardId, username }`
- **THEN** the server SHALL add `{ socketId, username }` to the presence list for that board
- **THEN** the server SHALL broadcast `presence_updated` to all sockets in the board room with the full current list
- **THEN** if `username` is non-empty, the server SHALL broadcast `user_joined` with `{ username }` to the board room

#### Scenario: User leaves a board
- **WHEN** a client emits `leave_board` with `{ boardId }` or disconnects
- **THEN** the server SHALL remove that socket's entry from the presence list
- **THEN** the server SHALL broadcast `presence_updated` to the board room with the updated list

#### Scenario: Presence list shape
- **WHEN** `presence_updated` is broadcast
- **THEN** the payload SHALL be `{ boardId, users: [{ username, isAnonymous }] }` where `isAnonymous` is `true` when username is empty
