## 1. Database Migrations

- [x] 1.1 Add `ALTER TABLE boards ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'default'` to `SCHEMA_STATEMENTS` in `server/src/db/database.js`
- [x] 1.2 Add `ALTER TABLE columns ADD COLUMN IF NOT EXISTS color TEXT` to `SCHEMA_STATEMENTS` in `server/src/db/database.js`

## 2. Server — Board & Column Handlers

- [x] 2.1 Update `createBoard(name)` in `boardHandlers.js` to accept `theme` param and INSERT it into `boards`
- [x] 2.2 Update `addColumn(boardId, title)` in `boardHandlers.js` to accept `color` param and INSERT it into `columns`
- [x] 2.3 Verify `getBoardWithColumns` (the SELECT in `boardHandlers.js`) returns `theme` on board and `color` on each column
- [x] 2.4 Update `create_board` socket handler in `index.js` to pass `theme` from payload to `createBoard`
- [x] 2.5 Update `add_column` socket handler in `index.js` to pass `color` from payload to `addColumn`

## 3. CSS — Theme System Foundation

- [x] 3.1 Add Google Fonts `@import` to `index.css` for Inter, Cinzel, Cormorant Garamond, Share Tech Mono, Raleway
- [x] 3.2 Define CSS token set on `:root` (fallback defaults matching current default theme): `--glass-bg`, `--glass-border`, `--glass-blur`, `--glass-shadow`, `--font-body`, `--font-display`, `--font-mono`, `--bg-gradient`, `--bg-page`, `--transition-speed`
- [x] 3.3 Write `.theme-default` class block with full token set (dark blue, subtle glass, Inter font)
- [x] 3.4 Write `.theme-light` class block (white/grey, white frosted glass, Inter font)
- [x] 3.5 Write `.theme-cyberpunk` class block (deep purple/black gradient, neon-tinted glass, Share Tech Mono)
- [x] 3.6 Write `.theme-vaporwave` class block (pink→purple gradient, pink/lavender glass tint, Raleway italic)
- [x] 3.7 Write `.theme-art-nouveau` class block (dark forest green, warm ivory glass, Cormorant Garamond)
- [x] 3.8 Write `.theme-renaissance` class block (deep burgundy, warm amber glass, Cinzel display)
- [x] 3.9 Add `body::before` pattern to CSS: positioned fixed full-bleed, uses `var(--bg-gradient)`, `z-index: -1`

## 4. CSS — Glassmorphism Component Refactor

- [x] 4.1 Update `.column` in `Column.css` to use `background: var(--glass-bg)`, `backdrop-filter: blur(var(--glass-blur))`, `border: 1px solid var(--glass-border)`, `box-shadow: var(--glass-shadow)`
- [x] 4.2 Add column tint rule: `.column[style*='--col-tint'] { background: color-mix(in srgb, var(--col-tint) 18%, var(--glass-bg) 82%) }`
- [x] 4.3 Update `.card` in `Card.css` to use glass tokens (lighter glass, less blur than columns)
- [x] 4.4 Update `.board-header` and `.home-header` in page CSS files to use glass tokens
- [x] 4.5 Update `.modal-content` to use glass tokens
- [x] 4.6 Audit all `background: var(--bg-card)` and `background: var(--bg-secondary)` usages — replace with appropriate glass tokens
- [x] 4.7 Replace all `transition: all 0.15s ease` with `transition: all var(--transition-speed) ease` across component CSS files
- [x] 4.8 Remove any persistent `@keyframes` that run while page is idle (audit all CSS files)

## 5. Client — useTheme Hook & SettingsContext

- [x] 5.1 Update `useTheme` hook to only set `--accent`, `--accent-hover`, `--accent-rgb` from server settings (remove the other 5 CSS variable assignments)
- [x] 5.2 Remove `theme_bg_color`, `theme_dashboard_card_color`, `theme_retro_card_color`, `theme_column_color`, `theme_accent_hover_color` from the default state in `SettingsContext`

## 6. Client — SettingsModal

- [x] 6.1 Remove the 5 deprecated color pickers from `SettingsModal.jsx`: Background Color, Dashboard Card Color, Retro Card Color, Column Color, Highlight Hover Color
- [x] 6.2 Keep Accent Color picker and Font Color picker; update labels if needed
- [x] 6.3 Update `performReset` in `SettingsModal.jsx` to only reset accent and font color fields
- [x] 6.4 Update `handleSubmit` to only send retained fields

## 7. Client — BoardPage Theme Application

- [x] 7.1 In `BoardPage.jsx`, read `board.theme` from the loaded board data
- [x] 7.2 Apply `theme-${board.theme}` as a class on the `.board-page` wrapper div (use `board.theme || 'default'` as fallback)

## 8. Client — AddColumnForm Color Picker

- [x] 8.1 Add color tint state to `AddColumnForm.jsx`: `colorMode` (`'default' | 'custom'`) and `colorValue` (hex string)
- [x] 8.2 Add UI to `AddColumnForm`: radio/toggle for "Use default" / "Custom", color input shown only when Custom selected
- [x] 8.3 Pass `color: colorMode === 'custom' ? colorValue : null` to the `onAdd` callback
- [x] 8.4 Update `onAddCard` → `onAddColumn` chain in `BoardPage.jsx` to pass `color` through the socket emit `add_column` payload
- [x] 8.5 Update `Column.jsx` to pass `style={{ '--col-tint': column.color || undefined }}` on the column div when `column.color` is set

## 9. Client — Board Creation Theme Picker

- [x] 9.1 Add `selectedTheme` state (default `'default'`) to `HomePage.jsx`
- [x] 9.2 Build theme swatch card component (inline or small component) showing 6 theme previews with selection ring
- [x] 9.3 Add theme swatch picker to the create board form in `HomePage.jsx`
- [x] 9.4 Pass `theme: selectedTheme` in the `create_board` socket emit payload

## 10. Client — Theme Swatch Styling

- [x] 10.1 Add `.theme-swatch` CSS in `HomePage.css`: small card with gradient preview background, border-radius, selection ring on active
- [x] 10.2 Define inline `background` gradients for each of the 6 theme swatches (matching their `--bg-gradient` token)
- [x] 10.3 Add label text below each swatch (theme display name)

## 11. Verification

- [ ] 11.1 Create a board with each theme; verify theme class applies and visual looks correct
- [ ] 11.2 Create a column with a custom color tint; verify tint blends with theme glass background
- [ ] 11.3 Create a column with default (no tint); verify it uses theme glass background
- [ ] 11.4 Verify HomePage always renders in default style (no theme class applied)
- [ ] 11.5 Verify Settings modal only shows accent color picker; save and verify `--accent` updates live
- [ ] 11.6 Verify no idle animations running on any theme (check Chrome DevTools Animations panel)
- [ ] 11.7 Verify card drag, modal open, and button hover transitions work across all themes

<!-- 11.1–11.7 are manual browser verification tasks -->
