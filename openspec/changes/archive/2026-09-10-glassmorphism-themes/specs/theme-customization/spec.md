## MODIFIED Requirements

### Requirement: Accent Color Customization
The system SHALL allow server administrators to configure the accent (brand highlight) color and its hover variant. These SHALL be persisted in `app_settings` and broadcast in real-time to all clients via WebSocket.

#### Scenario: User applies a new accent color
- **WHEN** the admin sets a new accent color in Settings
- **THEN** the selection is persisted, broadcast in real-time, and injected as CSS variables `--accent`, `--accent-hover`, and `--accent-rgb`

#### Scenario: Working with settings modal
- **WHEN** the settings modal content exceeds the viewport height
- **THEN** an internal scrollbar SHALL appear for the content area, while the title and actions remain fixed

## REMOVED Requirements

### Requirement: Seven-Point Theme Customization
**Reason**: Replaced by built-in theme classes (`board-themes` capability). Background, card, column, and font colors are now owned by the per-board theme CSS class. Only accent color customization is retained.
**Migration**: Existing `theme_bg_color`, `theme_dashboard_card_color`, `theme_retro_card_color`, `theme_column_color`, `theme_accent_hover_color` values in `app_settings` are ignored after this change. The color picker UI for those five fields is removed from SettingsModal. Boards use their selected theme for all visual language.
