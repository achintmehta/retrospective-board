## Why

Users want more control over the visual identity of their retrospective boards to align with team branding or personal preference. Providing a way to customize background and font colors enhances the user experience and makes the application feel more personalized and premium.

## What Changes

- Add color picker settings and hex text inputs for Background, Font, Dashboard Cards, Retro Cards, and Column colors.
- Implement a "Reset to Defaults" button to quickly revert all visual customizations.
- Update the global styling system to use dynamic CSS variables derived from user settings.
- Persist theme customization settings in the existing `app_settings` database table.
- Implement real-time theme updates across the application when settings are changed.

## Capabilities

### New Capabilities
- `theme-customization`: Requirements for dynamic theme application and live preview support.

### Modified Capabilities
- `app-settings`: Extend the branding requirements to include color-based appearance settings.

## Impact

- **Database**: New keys in `app_settings` for:
    - `theme_bg_color`
    - `theme_font_color`
    - `theme_dashboard_card_color`
    - `theme_retro_card_color`
    - `theme_column_color`
    - `theme_accent_color`
    - `theme_accent_hover_color`
- **Frontend**: `SettingsModal.jsx` (new inputs, reset logic), `SettingsContext.jsx` (state management), `HomePage.jsx` and `BoardPage.jsx` (applying styles via global provider).
- **CSS**: Refactor `index.css` and page-specific styles to handle comprehensive variable overrides (including `--accent`, `--accent-rgb`, and `--accent-hover`).
- **REST/Socket**: Update settings endpoints and broadcast events (`settings_updated`) to include all color data.
