## Context

The application currently has a hardcoded dark theme defined in `index.css` via CSS variables. While functional, users cannot change these colors to match their brand or preference without modifying the source code.

## Goals / Non-Goals

**Goals:**
- Provide a UI for users to change the primary background and font colors.
- Persist these choices across sessions for all users.
- Reflect changes instantly across all connected clients.
- Use CSS variables for a clean, non-invasive implementation.

**Non-Goals:**
- Full "light/dark" toggle system (this is a custom color picker approach).
- Multi-theme management (one global theme per installation).
- Per-board themes (theme is currently global).

## Decisions

### 1. Key-Value Persistence
We will leverage the existing `app_settings` table (key-value structure) instead of adding new columns. This maintains flexibility.
- **Rationale**: `app_settings` is already used for Title and Subtitle. Adding `theme_bg_color` and `theme_font_color` keys follows existing patterns.

### 2. Global CSS Variable Override & Settings Context
We will implement a `SettingsProvider` context that wraps the entire application. It fetches the colors and applies them to the `:root` element.
- **Variables Controlled**:
    - `--bg-primary` (from `theme_bg_color`)
    - `--text-primary` (from `theme_font_color`)
    - `--bg-secondary` (from `theme_dashboard_card_color`)
    - `--bg-card` (from `theme_retro_card_color`)
    - `--bg-column` (from `theme_column_color`)
    - `--accent`, `--accent-rgb`, and `--accent-hover` (from `theme_accent_color` and `theme_accent_hover_color`)
- **Implementation**: Real-time application using the `useTheme` hook with `document.documentElement.style.setProperty`. For the accent color, a hex-to-rgb conversion is applied to support components relying on transparency. Hover effects are updated by overriding the hover variable.

### 3. Real-time Synchronization
We will use the existing Socket.IO broadcast mechanism. When settings are updated, the server broadcasts a `settings_updated` event to all clients.
- **Rationale**: Ensures that visual identity changes are immediate and synchronized for all active collaborative sessions.

### 4. Reset to Defaults
We will provide a "Reset to Defaults" capability in the UI that reverts all custom colors to the application's base theme values.
- **Rationale**: Provides a safety mechanism for users to restore visibility if they choose poor contrast combinations.

## Risks / Trade-offs

- **[Risk] Contrast Issues** → **Mitigation**: The "Reset to Defaults" button allows users to quickly restore a legible state. We also use a known-good default color palette.
- **[Risk] Performance** → **Mitigation**: CSS variable overrides on `:root` are low-overhead and avoid expensive re-renders for every color change.

