## Requirements

### Requirement: Accent Color Customization
The system SHALL allow server administrators to configure the accent (brand highlight) color and its hover variant. These SHALL be persisted in `app_settings` and broadcast in real-time to all clients via WebSocket. Background, typography, and glass tokens are owned by the per-board theme class and are not configurable here.

#### Scenario: User applies a new accent color
- **WHEN** the admin sets a new accent color in Settings
- **THEN** the selection is persisted, broadcast in real-time, and injected as CSS variables `--accent`, `--accent-hover`, and `--accent-rgb`

### Requirement: Sticky & Scrollable Settings Interface
The system SHALL provide a professional settings layout that prevents viewport overflow and ensures navigation stability.

#### Scenario: Working with many settings
- **WHEN** the settings modal content exceeds the viewport height
- **THEN** an internal scrollbar SHALL appear for the content area, while the "Settings" title and "Save/Cancel" actions SHALL remain fixed and visible at the top and bottom respectively.

### Requirement: Responsive Branding Assets
The system SHALL provide configurable previews for branding assets.
- **Logo Preview**: A visual preview of the custom logo SHALL be displayed at a balanced scale (**56px**).

### Requirement: Factory Reset
The system SHALL allow users to restore all settings to their original factory defaults.

#### Scenario: Resetting branding
- **WHEN** the user triggers the "Reset" action and confirms
- **THEN** the accent color and branding fields SHALL revert to their base system values and the change SHALL be applied immediately.
