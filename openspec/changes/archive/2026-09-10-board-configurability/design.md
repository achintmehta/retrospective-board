## Context

The board page currently has a fixed column header (static `<h3>` title), a delete button using `⋯` (three-dot ellipsis — conventionally "more options"), and no mechanism to change a board's theme after creation. The theme is locked at board creation and stored in `boards.theme`. Column colors are stored in `columns.color` and already support per-column customisation via `update_column_color`. The `defaultColors` palette object already exists in `boardHandlers.js`, keyed by theme ID.

## Goals / Non-Goals

**Goals:**
- Inline click-to-edit column title with real-time sync
- Fix delete button glyph from `⋯` to `✕`
- Post-creation board theme change via a picker in the board header
- On theme change: reset all column colors to the new theme's default palette, discarding any prior customisation

**Non-Goals:**
- Board rename (separate concern, not in scope)
- Column reorder by drag (already exists)
- Per-column title lock / permissions
- Undo/redo for theme changes

## Decisions

### Decision: Click title to edit (not an edit button)

**Chosen**: Clicking the `.column-title` element directly switches it to a controlled `<input>`. The input auto-focuses and selects all text. Enter or blur saves; Escape cancels and restores the original value.

**Why**: Fewer buttons in the header, matches modern tool conventions (Notion, Linear). The hover state shows a subtle cursor:text hint.

**Alternative considered**: Pencil icon button. Rejected — adds visual noise and a second interaction to reach an edit that should be immediate.

---

### Decision: `rename_column` as a dedicated socket event

**Chosen**: New `rename_column` socket event (`{ boardId, columnId, title }`) → server `UPDATE columns SET title = ? WHERE id = ?` → broadcasts `column_renamed` to the board room. Optimistic update in `useBoard`: update local state immediately, server confirms.

**Why**: Consistent with `update_column_color` pattern already in place. Keeps handlers small and explicit.

---

### Decision: Theme change resets ALL column colors unconditionally

**Chosen**: When `update_board_theme` fires, the server updates `boards.theme` and bulk-updates all columns in the board to the new theme's default palette (cycling through positions 0→1→2→0... for >3 columns). No column's prior custom color survives.

**Why**: The user explicitly chose a new theme. Theme default colors are carefully tuned to look good together — preserving user-overridden colors from a different theme would likely produce visual mismatches. "Forget prior colors" is the stated requirement.

**Column cycling**: `defaultColors[theme]` has 3 colors. Column at DB position `i` gets `colors[i % 3]`. Consistent, deterministic, no state needed.

**Alternative considered**: Only reset columns whose color matches a prior theme default (i.e., skip user-customised ones). Rejected — hard to distinguish "was default" from "user happened to pick the same color"; also violates the stated requirement.

---

### Decision: Theme picker lives in the board header

**Chosen**: A small `🎨` button in the board header right area opens a compact dropdown with the same grouped swatch grid used at board creation (11 families × 2 variants). Selecting a theme immediately updates the board; a confirmation step is not needed since the action is reversible (change to another theme).

**Why**: Always accessible without entering a separate settings flow. Compact — the swatch grid is already built in `HomePage.jsx` and can be extracted to a shared component.

**Alternative considered**: Board settings modal. Overhead for a single control; modal pattern is better suited to ≥3 settings.

---

### Decision: `ThemePicker` extracted as a shared component

**Chosen**: The theme groups array and swatch rendering extracted from `HomePage.jsx` into a `ThemePicker.jsx` component, used in both `HomePage` (board creation) and `BoardPage` (board header dropdown).

**Why**: The groups array is ~100 lines of data. Duplicating it would create a maintenance burden when themes are added/renamed.

## Risks / Trade-offs

- **Optimistic rename then server error** → Column title snaps back to original. Acceptable — same pattern as card moves.
- **Theme change affects all connected clients simultaneously** → Intended. All clients on the board see the theme and column colors update live via WebSocket.
- **`defaultColors` palette for >3 columns cycles** → Position-based cycling is predictable but the 4th column gets the same color as the 1st. Acceptable for now.

## Migration Plan

No schema changes. Purely additive server handlers + client changes. Safe to deploy alongside existing boards — existing boards with `classic-dark` theme are unaffected until a user explicitly triggers `update_board_theme`.
