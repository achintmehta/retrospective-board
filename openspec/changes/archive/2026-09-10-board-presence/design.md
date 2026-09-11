## Context

The board currently uses Socket.IO rooms (`board:${boardId}`) for real-time sync. When a client calls `join_board`, the server adds the socket to the room but discards all identity information. `username` is stored in `localStorage('retro_username')` on the client — empty string means anonymous. The "Live" status is a pure boolean from `useSocket()`.

## Goals / Non-Goals

**Goals:**
- Server tracks who is in each board room (ephemeral, in-memory)
- Hover on Live status shows full presence list
- Named user joins trigger a dismissing toast (stacked, max 3)
- Toast does not fire for own join
- Simultaneous joins show as separate stacked toasts with independent timers

**Non-Goals:**
- Persisting presence to DB
- Showing presence on the home page
- "User is typing" indicators
- Presence on anonymous users' joins (toasts only for named users)

## Decisions

### Decision: Presence stored as server-side in-memory Map

**Chosen**: `const presence = new Map()` in `index.js`, keyed by `boardId`, value is an array of `{ socketId, username }`. Cleaned up on `leave_board` and `disconnect`.

**Why**: Presence is ephemeral — no value in persisting it. A Map per process is simple, zero-dependency, and consistent with the existing pattern (no external store). Multi-instance deployments would need a Redis pub/sub layer, but that's out of scope.

---

### Decision: `join_board` event changes from scalar to object

**Chosen**: Client emits `socket.emit('join_board', { boardId, username })`. Server handler updated accordingly.

**Why**: The server needs `username` to populate the presence list. This is a breaking change to the event payload — client and server must be deployed together, which is normal for this app.

---

### Decision: Two server events — `presence_updated` and `user_joined`

**Chosen**:
- `presence_updated`: emitted to room with `{ boardId, users: [{username, isAnonymous}] }` — full snapshot, fired on every join/leave/disconnect. Client replaces its local presence list entirely.
- `user_joined`: emitted to room with `{ username }` — fired only on join, only for named users (non-empty username). Client uses this to trigger toasts.

**Why**: Separating the full-list sync (`presence_updated`) from the join notification (`user_joined`) keeps responsibilities clear. Toasts only care about "someone just arrived", not the full state.

---

### Decision: Toast stack — Option B (simultaneous, max 3, independent timers)

**Chosen**: React state holds an array of toast objects `{ id, username, createdAt }`. Each toast schedules its own `setTimeout(3000)` to call a `removeToast(id)` action. Max 3 visible; if a 4th arrives while 3 are showing, it's silently dropped.

**Why**: The user explicitly asked for simultaneous toasts. Queue approach (Option A) delays notifications. Batching (Option C) adds debounce complexity. The 3-toast cap prevents screen clutter on large team joins.

**Own-join suppression**: Client compares `user_joined.username` against `localStorage('retro_username')`. If equal, no toast is created. Edge case: two users with the same name — they both see a toast for "the other one" but that's acceptable.

---

### Decision: `usePresence` hook owns all presence state

**Chosen**: New `client/src/hooks/usePresence.js` accepts `(boardId, username)`, registers the `presence_updated` and `user_joined` socket listeners, and returns `{ presenceList, toasts, removeToast }`. `BoardPage` passes username to it.

**Why**: Keeps `BoardPage` lean. The hook can be tested independently. Mirrors the pattern of `useBoard`.

---

### Decision: Popover on hover, not click

**Chosen**: CSS `:hover` + `position: absolute` popover. No state needed — pure CSS show/hide.

**Why**: Hover is lower friction for a read-only informational panel. No risk of a stale open state. The popover closes automatically on mouse-leave.

## Risks / Trade-offs

- **In-memory presence lost on server restart** → fine, clients reconnect and re-emit `join_board`, rebuilding the list within seconds.
- **`disconnect` without `leave_board`** → handled: `disconnect` handler iterates all presence entries and removes the socket, broadcasts `presence_updated`.
- **Same name used by two users** → own-join suppression may suppress a legitimate toast for the other user. Acceptable for now.
- **Max 3 toast cap drops fast-join overflow** → acceptable UX tradeoff.
