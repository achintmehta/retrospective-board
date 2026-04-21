## Why

We need a self-hosted, shared real-time retrospective board to allow teams to collaborate effectively during sprint retrospectives. External tools might not meet privacy, cost, or self-hosting requirements. Building an open-source, local or server-hosted alternative with no need for user authentication ensures ease of deployment (as a Docker image) and lowers the barrier to collaboration.

## What Changes

- Create a new web application for real-time retrospective boards.
- Implement board creation and deletion.
- Allow adding and deleting columns on the board.
- Allow adding, moving, and deleting cards on the columns.
- Support anonymous and non-anonymous card creation.
- Ensure persistence of board data.
- Ensure real-time synchronization across clients.
- Use an MIT or open-source stack.
- Containerize the application as a Docker image for easy hosting.

## Capabilities

### New Capabilities
- `board-management`: Creating and deleting boards, including managing board persistence.
- `column-management`: Adding and deleting columns within a board.
- `card-management`: Adding (anonymous/non-anonymous), moving, and deleting cards within columns.
- `realtime-sync`: Real-time synchronization of board state across connected clients.

### Modified Capabilities

None.

## Impact

- **New Systems**: Real-time Node.js web server, UI client, persistent lightweight database.
- **Dependencies**: Introduction of full-stack dependencies (e.g., React, Socket.IO, SQLite) and Docker configuration.
