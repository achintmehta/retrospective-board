## 1. Backend Integration

- [x] 1.1 Update backend settings handlers to support multiple `theme_*` keys.
- [x] 1.2 Ensure settings are persisted to the database on update.
- [x] 1.3 Add Socket.IO broadcast for `settings_updated` events.

## 2. Frontend Settings UI

- [x] 2.1 Add color picker inputs for Background and Font colors in `SettingsModal.jsx`.
- [x] 2.2 Add granular inputs for Dashboard Cards, Retro Cards, and Columns.
- [x] 2.3 Implement the "Reset to Defaults" button and logic.
- [x] 2.4 Wire up inputs to the centralized `SettingsContext` update logic.

## 3. Dynamic Styling Engine

- [x] 3.1 Implement a global `SettingsProvider` and `useTheme` hook to apply variable overrides.
- [x] 3.2 Update page-specific styles (e.g., `HomePage.css` subtitle) to use customization variables.
- [x] 3.3 Add real-time listener for `settings_updated` to refresh theme instantly.

## 4. Polishing & Testing

- [x] 4.1 Verify all seven theme points persist across page reloads.
- [x] 4.2 Test real-time synchronization between multiple browser tabs.
- [x] 4.3 Verify the "Reset" functionality restores the base theme (including highlight hover color).
