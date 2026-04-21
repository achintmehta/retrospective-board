## Context

The Home Page currently renders fixed strings and icons for the platform name ("RetroBoard") and its description. To enable self-hosted personalization, these must be transformed into dynamic elements driven by a central settings store.

## Goals / Non-Goals

**Goals:**
- Dynamically render the Home Page title, subtitle, and logo icon.
- Provide a simple UI for a user to update these settings.
- Support both emoji-based icons and custom image uploads for the branding logo.

**Non-Goals:**
- Per-board branding (branding remains global for the instance).
- User authentication for the settings panel (currently assumes a trusted self-hosted environment).
- Multi-theme support (background colors, fonts, etc.).

## Decisions

- **Storage**: A new SQLite table `app_settings` will be created.
  - Schema: `id TEXT PRIMARY KEY, key TEXT UNIQUE, value TEXT`.
  - Keys to be supported: `app_title`, `app_subtitle`, `app_icon_type` (emoji|image), `app_icon_value`.
- **API Endpoints**: 
  - `GET /api/settings`: Returns a key-value object of all app settings.
  - `POST /api/settings`: Accepts an object of settings to update.
- **Icon Rendering Logic**:
  - If `app_icon_type` is `emoji`, render the value as a span with the emoji.
  - If `app_icon_type` is `image`, render an `<img>` tag pointing to the value (URL).
- **Settings UI**:
  - A gear icon will be added to the `HomePage` header.
  - Clicking this icons opens a `SettingsModal` component.
  - This modal uses the existing `POST /api/upload` endpoint for site logo uploads.

## Risks / Trade-offs

- **Risk**: Deleting uploaded images used for the site logo.
  - **Mitigation**: Once an image is used for the site logo, we don't have a cleanup mechanism yet, which is acceptable for a site-wide branding asset.
- **Risk**: UI Clutter in the header.
  - **Mitigation**: The settings gear will be placed discreetly near the connection status dot.
