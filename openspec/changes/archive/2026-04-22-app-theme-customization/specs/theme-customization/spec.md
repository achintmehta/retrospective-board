## Requirements

### Requirement: Seven-Point Theme Customization
The system SHALL allow users to configure granular branding colors across seven specific application points:
- **Primary Background**: Global platform background.
- **Primary Font**: Global text color.
- **Dashboard Cards**: Background for cards on the home page.
- **Retro Cards**: Background for cards on individual boards.
- **Column Color**: Background for retro board columns.
- **Highlight (Accent)**: Primary action and branding color (e.g., buttons, active states).
- **Highlight Hover**: Interaction color used when hovering over highlight elements.

#### Scenario: User applies a full brand refresh
- **WHEN** the user selects new values for any of the 7 color points
- **THEN** the selection is persisted, broadcast in real-time, and injected as CSS variables (`--bg`, `--text`, `--card-dash`, `--card-retro`, `--column`, `--accent`, `--accent-hover`).

### Requirement: Sticky & Scrollable Settings Interface
The system SHALL provide a professional settings layout that prevents viewport overflow and ensures navigation stability.

#### Scenario: Working with many settings
- **WHEN** the settings modal content exceeds the viewport height
- **THEN** an internal scrollbar SHALL appear for the content area, while the "Settings" title and "Save/Cancel" actions SHALL remain fixed and visible at the top and bottom respectively.

### Requirement: Responsive Branding Assets
The system SHALL provide configurable previews for branding assets.
- **Logo Preview**: A visual preview of the custom logo SHALL be displayed at a balanced scale (**56px**).

### Requirement: Factory Reset
The system SHALL allow users to restore all theme settings to their original factory defaults.

#### Scenario: Resetting branding
- **WHEN** the user triggers the "Reset" action and confirms
- **THEN** all seven theme points SHALL revert to their base system hex values and the change SHALL be applied immediately.
