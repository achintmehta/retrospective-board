## Why

Every new board starts with the same three columns regardless of what kind of retrospective is being run. Teams use many different retro formats (4Ls, Start/Stop/Continue, Sailboat, etc.) and currently have to manually rename or recreate columns after creation. Board templates eliminate that friction by letting users pick the right column structure at creation time.

## What Changes

- **New**: `BOARD_TEMPLATES` constant in `boardHandlers.js` — 8 named templates each defining an ordered list of column titles.
- **Modified**: `DEFAULT_COLUMN_COLORS` extended from 3 to 6 colors per theme, so templates with up to 6 columns each get a distinct color.
- **Modified**: `createBoard(name, theme, template)` accepts a `template` param; columns are created from `BOARD_TEMPLATES[template]` instead of the hardcoded 3-column default. Colors cycle through `DEFAULT_COLUMN_COLORS[theme]` by position index.
- **Modified**: `create_board` socket handler passes `template` from payload to `createBoard`.
- **New**: `TemplatePicker` client component — collapsible panel showing a card grid. Each card displays the template name and its column list. Pre-selects `standard`.
- **Modified**: `HomePage.jsx` board creation form — adds `selectedTemplate` state and renders `TemplatePicker` below `ThemePicker`; passes `template` in the `create_board` emit.

## Capabilities

### New Capabilities

- `board-templates`: Eight built-in board templates selectable at creation time, each defining a specific column set for different retrospective formats.

### Modified Capabilities

- `board-management`: Board creation now accepts a `template` parameter in addition to `name` and `theme`.

## Impact

- **Server**: `boardHandlers.js` — `BOARD_TEMPLATES` constant, extended `DEFAULT_COLUMN_COLORS`, updated `createBoard`; `index.js` — `create_board` socket handler passes `template`.
- **Client**: New `TemplatePicker.jsx` + `TemplatePicker.css`; `HomePage.jsx` — new state + emit field.
- **No DB changes** — template is applied at creation only, not stored.
