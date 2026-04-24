## Why

As the number of retrospective boards grows, the home page becomes cluttered and difficult to navigate. Users currently have no way to organize related boards (e.g., by team, project, or month). Implementing "Board Groups" allows users to logically categorize their retrospectives, improving organization and reducing visual cognitive load on the dashboard.

## What Changes

- **Grouping Capability**: Introduce the ability to create named groups for boards.
- **Organization UI**: Implement a drag-and-drop interface on the home page to move boards into and between groups.
- **Interactive Groups**: Groups can be expanded or collapsed to save space.
- **Group Management**: Users can delete groups without deleting the underlying boards (boards will be returned to the un-grouped list).
- **Schema Updates**: **BREAKING** New `board_groups` table and a `group_id` reference in the `boards` table.

## Capabilities

### New Capabilities
- `board-grouping`: Manages the lifecycle of board groups and the associations between boards and groups.

### Modified Capabilities
- `board-management`: Requirements for board display and organization on the home page will be updated to support grouped views.
- `realtime-sync`: Broadcast group creation, deletion, and board movement events to all connected clients.

## Impact

- **Database**: Significant schema changes (new table and foreign key).
- **Backend API**: New Socket.IO events and database handlers for groups.
- **Frontend**: Major layout update to `HomePage.jsx` to support grouped cards and drag-and-drop state.
