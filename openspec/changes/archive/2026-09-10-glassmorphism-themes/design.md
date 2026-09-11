## Context

The current UI uses hard solid backgrounds and a flat color palette. All boards look identical. The theme system today is server-side, stored in `app_settings` as key-value pairs, and applies 7 CSS custom properties globally via `useTheme`. Every connected client sees the same theme instantly via WebSocket broadcast.

The codebase uses React + Vite on the client, Express + Socket.IO + PostgreSQL on the server. CSS custom properties are set imperatively on `:root` via `useTheme`. The board page is a full-page React component at `/board/:id`.

## Goals / Non-Goals

**Goals:**
- Six built-in themes, each a coherent visual language (glassmorphism backgrounds, fonts, motion speed)
- Theme selected at board creation, locked thereafter, applied as a CSS class scoped to `.board-page`
- Per-column optional hex color tint, free picker, stored in DB, rendered via CSS custom property
- Accent color remains server-configurable (branding); all other visual tokens owned by theme class
- Transition-only animations (no idle keyframes)
- Google Fonts loaded via CSS `@import` (all theme fonts declared upfront; browser caches unused)

**Non-Goals:**
- User-local theme overrides (localStorage)
- Changing a board's theme after creation
- Custom theme builder / theme editor UI
- Dark/light mode toggle independent of theme
- Animated backgrounds (gradient drift, particles)

## Decisions

### Decision: Theme as CSS class on `.board-page`, not `:root`

**Chosen**: Apply `theme-<name>` class to the `.board-page` wrapper div. CSS tokens scoped under `.theme-*` selectors.

**Why**: Theme is per-board. The HomePage must always render in the default visual style (admins haven't "themed" the homepage). Scoping to `.board-page` gives clean isolation — no leakage to modals or the home view.

**Alternative considered**: Apply class to `<html>` when entering a board, remove on exit. Simpler, but requires lifecycle management and could cause flash if navigation is instant. Class on a wrapper div is declarative and React-friendly.

---

### Decision: CSS class blocks own all visual tokens except accent

**Chosen**: Each `.theme-*` block declares `--bg-gradient`, `--glass-bg`, `--glass-border`, `--glass-blur`, `--glass-shadow`, `--font-body`, `--font-display`, `--font-mono`, `--text-primary`, `--text-secondary`, `--text-muted`, `--bg-page`, `--radius-sm/md/lg`, `--transition-speed`.

`--accent`, `--accent-hover`, `--accent-rgb` remain on `:root` and are set by `useTheme` from server settings (Option A from design exploration).

**Why**: Themes provide a coherent visual language. Allowing server settings to repaint the background would fight the theme. Accent is a brand color — legitimately server-configurable per board instance.

**Alternative considered**: Server settings override all tokens. Rejected — too much power, too easy to break theme coherence.

---

### Decision: Column color stored as hex, applied via CSS custom property inline style

**Chosen**: `column.color` stores a hex string (e.g. `#00ffff`) or `null`. Column component renders `style={{ '--col-tint': column.color }}` when color is set. CSS: `.column { background: color-mix(in srgb, var(--col-tint, transparent) 18%, var(--glass-bg) 82%) }`.

**Why**: `color-mix()` has broad modern browser support (Chrome 111+, Firefox 113+, Safari 16.2+). Fallback is `var(--glass-bg)` (null tint = transparent = theme default). This approach requires zero JS color math.

**Alternative considered**: Apply tint via `background: rgba(r,g,b,0.18)` computed in JS from the hex. Works but adds JS color parsing; `color-mix` is cleaner and entirely declarative.

---

### Decision: Google Fonts loaded via single `@import` in `index.css`

**Chosen**: All theme fonts declared in one `@import` URL with `family=` params for Inter, Cinzel, Cormorant+Garamond, Share+Tech+Mono, Raleway. Browser loads and caches; unused families are fetched but small (subset by Google).

**Why**: Lazy font injection (inserting `<link>` at runtime) causes FOUT on theme switch. Single `@import` eliminates that — all fonts ready before any board loads. Total additional weight is ~30-50kb across all families (subset).

**Alternative considered**: Inject `<link>` only for the active board's font. Avoids unused font download but introduces FOUT on first board visit.

---

### Decision: `boards.theme` column, `columns.color` column — added via `IF NOT EXISTS` migration

**Chosen**: Add both via `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` in the `SCHEMA_STATEMENTS` array, consistent with the existing `group_id` migration pattern in `database.js`.

**Why**: Pattern already used in the codebase. Safe for existing deployments — adds with default, no data loss.

---

### Decision: Board theme locked at creation, no edit path

**Chosen**: No UI to change theme after creation. `boards.theme` is set once at `INSERT` time.

**Why**: Agreed requirement. Changing theme mid-session would be jarring for all connected participants since the change would broadcast via WebSocket. Simplifies implementation.

## Risks / Trade-offs

- **`color-mix()` browser support** → Mitigation: fallback to `var(--glass-bg)` is built into the CSS declaration; older browsers silently get no tint.
- **Glassmorphism requires a background layer to blur through** — solid dark pages don't show blur effect → Mitigation: each theme's `--bg-gradient` is a CSS gradient or pattern on `body::before`, giving the glass panels something to blur against.
- **`backdrop-filter` performance on low-end hardware** → Mitigation: keep blur radius ≤ 16px; avoid applying to animated elements; `--glass-blur` token lets us tune per theme.
- **Removing 5 server-side color pickers is a BREAKING change** → Mitigation: document in proposal; existing `theme_bg_color` etc. values in DB are simply ignored after deploy (no migration needed to remove them).

## Migration Plan

1. Deploy server with new `ALTER TABLE` migrations — safe, additive only.
2. Deploy client. New boards get theme picker. Existing boards default to `theme = 'default'` (DB default), which matches current visual exactly.
3. No rollback complexity — old boards still render correctly under `theme-default`.

## Open Questions

- None — all decisions made during explore phase.
