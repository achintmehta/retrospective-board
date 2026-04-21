## 1. Database & Backend Infrastructure

- [x] 1.1 Create the `board_groups` table in `server/src/db/database.js`.
- [x] 1.2 Add the `group_id` column to the `boards` table in `server/src/db/database.js`.
- [x] 1.3 Implement `board_group` handlers (create, list, delete, move) in `server/src/boardHandlers.js`.
- [x] 1.4 Register group-related Socket.IO listeners in `server/src/index.js`.
- [x] 1.5 Update the `GET /api/boards` endpoint to include group data in the response.

## 2. Frontend Layout & State

- [x] 2.1 Refactor `HomePage.jsx` to fetch and store `groups` in state.
- [x] 2.2 Create a `BoardGroup` component that handles expansion/collapse and naming.
- [x] 2.3 Implement the "Un-grouped" section for boards not currently in a group.
- [x] 2.4 Add UI for creating new board groups on the home page dashboard.

## 3. Drag and Drop Implementation

- [x] 3.1 Wrap the home page content in a `DragDropContext` from `@hello-pangea/dnd`.
- [x] 3.2 Define `Droppable` regions for each board group and the un-grouped section.
- [x] 3.3 Update `handleDragEnd` logic to emit `move_board_to_group` when a board is dropped into a group.
- [x] 3.4 Ensure optimistic UI updates for board movement between groups.

## 4. Polishing & Interactions

- [x] 4.1 Implement group deletion logic (dissociating boards instead of deleting them).
- [x] 4.2 Add "Remove from Group" action directly on board cards.
- [x] 4.3 Add board count badges to group headers.
- [x] 4.4 Style the drag-and-drop indicators and group containers in `HomePage.css`.
