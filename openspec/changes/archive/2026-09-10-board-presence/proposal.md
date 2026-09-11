## Why

The board header shows a "Live" status dot but gives no information about who else is on the board. Users have no way to know if teammates are viewing the same board, and new arrivals happen silently. Adding presence visibility makes collaboration feel alive.

## What Changes

- **New**: `join_board` socket event updated to carry `{ boardId, username }` so the server knows who each connected socket is.
- **New**: Server tracks a per-board presence list in memory (`Map<boardId, Set<{socketId, username}>>`). Broadcasts `presence_updated` (full list) and `user_joined` (individual) to the board room on join/leave/disconnect.
- **New**: "Live" status area in the board header becomes hoverable — a glassmorphic popover lists named users individually and aggregates anonymous users as "N anonymous". The current user is marked "(you)".
- **New**: Join toast notifications — a stack (max 3 simultaneous) in the bottom-right corner of the board. Each toast shows "👋 [Name] joined" and auto-dismisses after 3 seconds. Does not fire for the current user's own join. Toasts have independent timers so simultaneous joins stack visually.

## Capabilities

### New Capabilities

- `board-presence`: Server-side per-board presence tracking, broadcast on join/leave/disconnect.
- `presence-popover`: Hover-triggered popover on the Live indicator showing named and anonymous users.
- `join-toasts`: Auto-dismissing stacked toast notifications when named users join the board.

### Modified Capabilities

- `realtime-sync`: `join_board` event now carries username alongside boardId.

## Impact

- **Server**: `index.js` — presence Map, updated `join_board`/`leave_board`/`disconnect` handlers; no DB changes.
- **Client**: New `usePresence` hook; `BoardPage.jsx` — pass username to `join_board`, wire presence; new `PresencePopover.jsx` + `JoinToastStack.jsx` components; `BoardPage.css` — popover + toast styles.
- **No schema migration** — presence is ephemeral in-memory only.
