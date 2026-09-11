## 1. Server — Column Rename

- [x] 1.1 Add `renameColumn(columnId, title)` to `boardHandlers.js`: `UPDATE columns SET title = ? WHERE id = ?`, returns updated column
- [x] 1.2 Export `renameColumn` from `boardHandlers.js`
- [x] 1.3 Import `renameColumn` in `index.js`
- [x] 1.4 Add `rename_column` socket handler in `index.js`: accepts `{ boardId, columnId, title }`, broadcasts `column_renamed` to board room

## 2. Server — Board Theme Change

- [x] 2.1 Extract `defaultColors` from `createBoard` into a module-level constant in `boardHandlers.js` so it can be reused
- [x] 2.2 Add `updateBoardTheme(boardId, theme)` to `boardHandlers.js`: validates theme against `VALID_THEMES`, updates `boards.theme`, bulk-updates all column colors using `defaultColors[theme][position % 3]`, returns updated board with columns
- [x] 2.3 Export `updateBoardTheme` from `boardHandlers.js`
- [x] 2.4 Import `updateBoardTheme` in `index.js`
- [x] 2.5 Add `update_board_theme` socket handler in `index.js`: accepts `{ boardId, theme }`, broadcasts `board_theme_updated` (with `{ boardId, theme, columns }`) to board room

## 3. Client — Shared ThemePicker Component

- [x] 3.1 Create `client/src/components/ThemePicker.jsx`: extract the theme groups data array and swatch rendering from `HomePage.jsx` into a reusable component that accepts `selectedTheme`, `onSelect` props
- [x] 3.2 Create `client/src/components/ThemePicker.css`: move theme picker styles (`.theme-picker`, `.theme-group`, `.theme-swatch`, etc.) from `HomePage.css` into this file
- [x] 3.3 Update `HomePage.jsx` to import and use `ThemePicker` instead of the inline implementation, removing the extracted CSS classes from `HomePage.css`

## 4. Client — useBoard Hook Updates

- [x] 4.1 Add `renameColumn(columnId, title)` action to `useBoard.js`: optimistic update of `board.columns`, emits `rename_column` socket event
- [x] 4.2 Add `column_renamed` socket listener in `useBoard.js`: updates the matching column's title in local state
- [x] 4.3 Add `updateBoardTheme(theme)` action to `useBoard.js`: emits `update_board_theme` socket event (no optimistic update — wait for server broadcast)
- [x] 4.4 Add `board_theme_updated` socket listener in `useBoard.js`: updates `board.theme` and all `column.color` values from the received columns array
- [x] 4.5 Export `renameColumn` and `updateBoardTheme` from `useBoard.js` return value

## 5. Client — Column.jsx Rename + Delete Fix

- [x] 5.1 Add `editingTitle` boolean state and `draftTitle` string state to `Column.jsx`
- [x] 5.2 Make `.column-title` clickable: `onClick={() => { setDraftTitle(column.title); setEditingTitle(true); }}`
- [x] 5.3 When `editingTitle` is true, render a controlled `<input>` instead of `<h3>`, auto-focused, with `onKeyDown` handling Enter (save) and Escape (cancel) and `onBlur` (save if non-empty)
- [x] 5.4 On save: call `onRenameColumn(column.id, draftTitle.trim())` if non-empty, then `setEditingTitle(false)`
- [x] 5.5 On cancel: `setEditingTitle(false)`, restore `draftTitle` to `column.title`
- [x] 5.6 Change delete button glyph from `⋯` to `✕` (normal state); keep `✓?` for confirm state
- [x] 5.7 Add `onRenameColumn` to `Column.jsx` prop destructuring
- [x] 5.8 Add `.column-title` hover cursor style (`cursor: text`) and inline input styles to `Column.css`

## 6. Client — BoardPage Theme Picker in Header

- [x] 6.1 Import `ThemePicker` and `updateBoardTheme` into `BoardPage.jsx`
- [x] 6.2 Add `showThemePicker` boolean state to `BoardPage.jsx`
- [x] 6.3 Add a theme button (`🎨`) to the board header right section that toggles `showThemePicker`
- [x] 6.4 Render `ThemePicker` as a dropdown positioned below the button when `showThemePicker` is true; close on outside click (`useEffect` with document click listener or `onBlur`)
- [x] 6.5 Wire `ThemePicker`'s `onSelect` to call `updateBoardTheme(theme)` then close the picker
- [x] 6.6 Pass `board.theme` as `selectedTheme` to `ThemePicker` so the current theme is highlighted
- [x] 6.7 Pass `onRenameColumn={renameColumn}` to each `<Column>` in `BoardPage.jsx`
- [x] 6.8 Add `.theme-picker-dropdown` positioning styles to `BoardPage.css`: `position: absolute`, `top: 100%`, `right: 0`, `z-index: 50`, `background: var(--glass-bg)`, `border`, `border-radius`, `padding`, `box-shadow`

## 7. Verification

- [ ] 7.1 Click a column title → input appears with text selected; type new name → Enter → title updates live for all clients
- [ ] 7.2 Click column title → edit → Escape → original title restored, no server call
- [ ] 7.3 Clear column title → Enter → original title restored (empty not saved)
- [ ] 7.4 Verify delete button shows `✕` on hover and `✓?` on first click
- [ ] 7.5 Change board theme from header → all column colors reset, new theme class applied live
- [ ] 7.6 Verify second connected client sees theme + column color change immediately
- [ ] 7.7 Verify `ThemePicker` on HomePage still works after extraction
<!-- 7.x = manual browser verification -->
