## 1. Server — Presence Tracking

- [x] 1.1 Add `const presence = new Map()` near the top of `index.js` (module-level, keyed by boardId, value is array of `{ socketId, username }`)
- [x] 1.2 Add helper `function broadcastPresence(io, boardId)` that emits `presence_updated` to `board:${boardId}` with `{ boardId, users: presence.get(boardId).map(u => ({ username: u.username, isAnonymous: !u.username })) }`
- [x] 1.3 Update `join_board` socket handler to accept `{ boardId, username }` instead of scalar `boardId`; add entry to `presence`, call `broadcastPresence`, and if `username` is non-empty emit `user_joined` with `{ username }` to the room
- [x] 1.4 Update `leave_board` socket handler to accept `{ boardId }` instead of scalar; remove matching entry from `presence[boardId]`, call `broadcastPresence`
- [x] 1.5 In the `disconnect` handler, iterate all boards in `presence` and remove entries matching `socket.id`, call `broadcastPresence` for each affected board

## 2. Client — useBoard join_board update

- [x] 2.1 In `useBoard.js`, update the `join_board` emit from `s.emit('join_board', boardId)` to `s.emit('join_board', { boardId, username })` — `username` must be passed into the hook
- [x] 2.2 Update the `useBoard` function signature to accept `(boardId, username)` and thread `username` through to the emit
- [x] 2.3 Update `BoardPage.jsx` to pass `username` as second arg to `useBoard(boardId, username)`

## 3. Client — usePresence Hook

- [x] 3.1 Create `client/src/hooks/usePresence.js` accepting `(boardId, username)` — returns `{ presenceList, toasts, removeToast }`
- [x] 3.2 Add `presenceList` state (array of `{ username, isAnonymous }`) and `toasts` state (array of `{ id, username }`)
- [x] 3.3 In a `useEffect` on `socket`/`connected`, register `presence_updated` listener: replace `presenceList` with payload `users`
- [x] 3.4 Register `user_joined` listener: if `username !== ownUsername` and `toasts.length < 3`, push `{ id: Date.now(), username }` to toasts; schedule `removeToast(id)` via `setTimeout(3000)`
- [x] 3.5 Implement `removeToast(id)` to filter toast out of state
- [x] 3.6 Clean up listeners on unmount

## 4. Client — PresencePopover Component

- [x] 4.1 Create `client/src/components/PresencePopover.jsx` accepting `{ presenceList, ownUsername, connected }`
- [x] 4.2 Render nothing if `!connected`
- [x] 4.3 Render named users as individual list items; append "(you)" if `user.username === ownUsername`
- [x] 4.4 Count anonymous users and render "N anonymous" line at the bottom if count > 0
- [x] 4.5 Wrap in a `position: relative` container on `.header-status` using CSS `:hover` to show/hide the popover (no JS state needed)

## 5. Client — JoinToastStack Component

- [x] 5.1 Create `client/src/components/JoinToastStack.jsx` accepting `{ toasts, onRemove }`
- [x] 5.2 Render a fixed-position container in bottom-right of viewport; map `toasts` to individual toast divs showing "👋 {username} joined"
- [x] 5.3 Each toast has a slide-in + fade-out CSS animation; fade-out triggered by adding a class when the toast is near removal (optional — basic fade is sufficient)

## 6. Client — BoardPage Wiring

- [x] 6.1 Import `usePresence` in `BoardPage.jsx`
- [x] 6.2 Call `const { presenceList, toasts, removeToast } = usePresence(boardId, username)`
- [x] 6.3 Wrap `.header-status` in a `presence-wrap` div that is `position: relative`
- [x] 6.4 Render `<PresencePopover presenceList={presenceList} ownUsername={username} connected={connected} />` inside the wrap
- [x] 6.5 Render `<JoinToastStack toasts={toasts} onRemove={removeToast} />` at the bottom of the `board-page` div

## 7. Styles

- [x] 7.1 Add `.presence-wrap` to `BoardPage.css`: `position: relative; display: flex; align-items: center; gap: 6px;`
- [x] 7.2 Add `.presence-popover` styles: `position: absolute; top: calc(100% + 8px); right: 0; min-width: 180px; background: var(--glass-bg); backdrop-filter: blur(var(--glass-blur)); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 10px 14px; z-index: 200; display: none;`
- [x] 7.3 Add `.presence-wrap:hover .presence-popover { display: block; }` — pure CSS show/hide
- [x] 7.4 Add `.presence-popover-title`, `.presence-user`, `.presence-anon` styles: small font, muted colors, list items
- [x] 7.5 Create `client/src/components/JoinToastStack.css`: fixed bottom-right container, individual toast styles with glassmorphism, slide-up entry animation (`@keyframes toastIn`)
- [x] 7.6 Toast: `position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 8px; z-index: 300;` for container; each toast: glass bg, border, radius, padding, font, animation

## 8. Verification

- [ ] 8.1 Open board in two tabs — hover Live in tab 1, see tab 2's user listed
- [ ] 8.2 Open board in tab 2 — verify toast appears in tab 1 with tab 2's username
- [ ] 8.3 Open board in 3 tabs simultaneously — verify 2 toasts stack (own join suppressed)
- [ ] 8.4 Close tab — verify user disappears from presence popover in remaining tab
- [ ] 8.5 Verify anonymous user joins don't show a toast
- [ ] 8.6 Verify 4th simultaneous join is dropped (no 4th toast)
<!-- 8.x = manual browser verification -->
