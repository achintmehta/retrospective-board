## Why

The board UI uses plain solid backgrounds and no visual hierarchy, making every board feel identical and utilitarian. A glassmorphism theme system with per-board theme selection gives each board a distinct identity and makes the tool feel modern and polished.

## What Changes

- **New**: Six built-in visual themes (Default, Light, Cyberpunk, Vaporwave, Art Nouveau, Renaissance), each defining a full CSS token set including background gradient, glass panel styling, typography (Google Fonts), and motion speed.
- **New**: Theme is selected at board creation time and locked for the lifetime of the board.
- **New**: Per-column custom color tint — free hex color picker at column creation, stored in DB, rendered as a tinted glass overlay on the column.
- **Modified**: Server `app_settings` theme color pickers are reduced to accent color only (brand color); theme classes now own background, glass, and typography tokens. **BREAKING** — existing `theme_bg_color`, `theme_dashboard_card_color`, `theme_retro_card_color`, `theme_column_color`, `theme_accent_hover_color` settings are removed from the settings UI and no longer applied as CSS variables.
- **Modified**: Board creation form gains a theme picker (visual swatch cards).
- **Modified**: Column creation form gains an optional color tint picker.
- **Modified**: `boards` table gains a `theme` column; `columns` table gains a `color` column.

## Capabilities

### New Capabilities

- `board-themes`: Six built-in visual themes selectable at board creation, applied as a CSS class scoped to the board page, each defining the full visual language (glass, gradients, fonts, motion).
- `column-color-tint`: Optional per-column hex color tint, selected at column creation, rendered as a glass tint overlay independent of the board theme.

### Modified Capabilities

- `theme-customization`: Scope reduced to accent color only. Background/typography/glass tokens are now owned by the board theme. Removes 5 of the 7 existing color pickers; retains accent color and font color.
- `board-management`: Board creation now accepts a `theme` parameter. Default is `default`.
- `column-management`: Column creation now accepts an optional `color` parameter. Default is `null` (no tint).

## Impact

- **DB**: `ALTER TABLE boards ADD COLUMN theme TEXT DEFAULT 'default'`; `ALTER TABLE boards ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'default'`; `ALTER TABLE columns ADD COLUMN IF NOT EXISTS color TEXT`
- **Server**: `boardHandlers.js` — `createBoard(name, theme)`, `addColumn(boardId, title, color)`; `index.js` socket handlers accept new params
- **Client CSS**: `index.css` gains theme class blocks and glassmorphism tokens; `Column.css` gains tint overlay pattern
- **Client JS**: `SettingsContext` / `useTheme` hook reduced to accent-only; `BoardPage` applies theme class; `HomePage` board creation form adds theme picker; `AddColumnForm` adds color picker
- **Dependencies**: Google Fonts (Cinzel, Cormorant Garamond, Share Tech Mono, Raleway) — loaded via existing `@import` in CSS
