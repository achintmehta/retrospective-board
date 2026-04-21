## 1. Project Initialization

- [x] 1.1 Scaffold the project structure with `server/` and `client/` directories.
- [x] 1.2 Initialize Node.js + Express backend in the `server/` directory and install `socket.io`, `sqlite3`, and `cors`.
- [x] 1.3 Initialize React frontend using Vite in the `client/` directory and install `socket.io-client` and a drag-and-drop library.

## 2. Database Schema Setup

- [x] 2.1 Set up SQLite connection and initialization logic in the backend.
- [x] 2.2 Create `boards` table (id, name, created_at).
- [x] 2.3 Create `columns` table (id, board_id, title, position).
- [x] 2.4 Create `cards` table (id, column_id, content, author, position).

## 3. Backend API & Real-Time Sync

- [x] 3.1 Implement Express endpoints for fetching initial board state (hydration).
- [x] 3.2 Setup Socket.IO server and establish client connection handling.
- [x] 3.3 Implement socket events and SQLite handlers for board management (`create_board`, `delete_board`).
- [x] 3.4 Implement socket events and SQLite handlers for column management (`add_column`, `delete_column`).
- [x] 3.5 Implement socket events and SQLite handlers for card management (`add_card`, `move_card`, `delete_card`).
- [x] 3.6 Ensure all mutation operations correctly broadcast the new state changes to connected clients in the room.

## 4. Frontend Core Setup

- [x] 4.1 Setup React Router for `/` (home) and `/board/:boardId` routes.
- [x] 4.2 Establish a Socket.IO context provider to make the socket connection available throughout the app.
- [x] 4.3 Create a central React hook/store to manage synchronization of local UI state with incoming socket events.

## 5. UI: Board & Column Management

- [x] 5.1 Build the Home view allowing users to create a new board.
- [x] 5.2 Build the Board view layout including header and horizontally scrolling column container.
- [x] 5.3 Implement UI for adding new columns to the board.
- [x] 5.4 Add delete capability to columns (header button/dropdown).

## 6. UI: Card Management

- [x] 6.1 Implement the individual Card component displaying content and author name (if provided).
- [x] 6.2 Build inline forms within columns for users to add new cards (anonymously or with a signature).
- [x] 6.3 Integrate Drag-and-Drop library to allow dragging cards between and within columns.
- [x] 6.4 Ensure appropriate socket events are emitted upon complete drag-and-drop, and handle optimistic state updates.
- [x] 6.5 Add card deletion capability on each card.

## 7. Containerization & Delivery

- [x] 7.1 Compose server Express app to serve the production build of the Vite React client alongside the API.
- [x] 7.2 Write a single `Dockerfile` that builds the React frontend, sets up the Node.js backend, and starts both.
- [x] 7.3 Define persistent storage volume binding for the SQLite database within Docker configuration to ensure data preservation across container restarts.
