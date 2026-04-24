## Context

The current Home Page displays all boards in a flat responsive grid. As boards accumulate, the dashboard becomes disorganized. We need a way to cluster related boards into containers ("Groups") that can be collapsed or expanded.

## Goals / Non-Goals

**Goals:**
- Provide a persistent organizational layer for boards.
- Enable intuitive drag-and-drop movement of boards into groups.
- Ensure group state (collapsed/expanded) is handled gracefully in the UI.
- Support real-time updates for group membership changes.

**Non-Goals:**
- Nested groups or folders.
- Role-based permissions for groups (it remains a trusted/open environment).
- Automatic grouping based on metadata (must be manual).

## Decisions

- **Database Schema**:
  - New `board_groups` table with `id`, `name`, and `position`.
  - Update `boards` table to include an optional `group_id` column.
  - *Rationale*: This is a classic one-to-many relationship that integrates cleanly with existing SQLite logic.
- **API Strategy**:
  - We will extend the Socket.IO event set to include `create_group`, `delete_group`, and `move_board_to_group`.
  - *Rationale*: Maintains the real-time synchronization pattern used throughout the app.
- **Frontend Drag-and-Drop**:
  - Reuse `@hello-pangea/dnd`.
  - Each Group will be a `Droppable` region. The "Un-grouped" section will also be a `Droppable`.
  - *Rationale*: We already use this library for card movement on the board page; using it for the home page maintains consistent UX and code reuse.
- **Group Deletion Logic**:
  - Deleting a group will execute an `UPDATE boards SET group_id = NULL WHERE group_id = ?`.
  - *Rationale*: Explicitly required by the user to prevent accidental board deletion when cleaning up groups.

## Risks / Trade-offs

- **Risk**: Drag-and-drop in a responsive grid can be visually jarring if the grid items shift unpredictably.
  - **Mitigation**: Use controlled placeholder widths and clear drop indicators.
- **Risk**: Collapsed groups hide boards, making them harder to find if forgotten.
  - **Mitigation**: Show a badge count of boards inside collapsed groups.
- **Risk**: Race conditions if two users move the same board to different groups simultaneously.
  - **Mitigation**: The last-write-wins approach common to the rest of the board state, broadcasted instantly via Socket.IO.
