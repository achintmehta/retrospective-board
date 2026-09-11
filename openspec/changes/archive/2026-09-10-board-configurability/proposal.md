## Why

The retro board's column headers are static — titles can't be changed after creation, the delete button is ambiguous (three dots), and there's no way to change a board's theme post-creation. These gaps make the board feel unfinished and force users to delete and recreate columns or boards just to make basic adjustments.

## What Changes

- **New**: Click-to-edit column title — clicking the column title switches it to an inline input; Enter saves, Escape cancels. Persisted via a new `rename_column` socket event.
- **Fix**: Delete button glyph changed from `⋯` (three dots, means "more") to `✕` (unambiguous remove).
- **New**: Board theme change — a theme picker in the board header allows changing the board's theme after creation. On change, all column colors are reset to the new theme's default palette regardless of prior user customisation.
- **Modified**: `column-management` — columns are now renameable.
- **Modified**: `board-management` — board theme is now mutable post-creation.
- **Modified**: `column-color-tint` — column colors reset to theme defaults when board theme changes.

## Capabilities

### New Capabilities

- `column-rename`: Inline click-to-edit column title with optimistic UI and real-time sync.
- `board-theme-change`: Post-creation board theme switching with automatic column color reset.

### Modified Capabilities

- `column-management`: Add renameable requirement to the Add Column spec.
- `column-color-tint`: Column colors reset to theme defaults on board theme change.
- `board-management`: Board theme is mutable after creation (was locked).

## Impact

- **DB**: No schema changes — `boards.theme` and `columns.color` already exist.
- **Server**: New `rename_column` handler + socket event; new `update_board_theme` handler that also resets all column colors; `boardHandlers.js`, `index.js`.
- **Client**: `Column.jsx` — title click-to-edit, delete glyph fix; `BoardPage.jsx` — theme picker in header; `useBoard.js` — new socket listeners/emitters; `BoardPage.css` / `Column.css` — minor styling.
- **Shared**: `defaultColors` palette object in `boardHandlers.js` already exists — reused for the reset.
