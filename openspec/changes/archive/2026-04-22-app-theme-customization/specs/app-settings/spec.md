## MODIFIED Requirements

### Requirement: Manage Application Branding
The system SHALL provide an interface to configure global application branding elements, specifically the Application Title, Subtitle, Logo Icon, Background Color, Font Color, Dashboard Color, Retro Card Color, Column Color, Highlight Color, and Highlight Hover Color.

#### Scenario: User updates application title
- **WHEN** the user submits a new Title through the application settings interface
- **THEN** the application title is updated in the database and shown on the home page upon the next refresh/load

#### Scenario: User updates application theme colors
- **WHEN** the user submits any of the seven supported theme colors through the settings interface
- **THEN** the colors are updated in the database and applied to the application UI immediately across all active sessions via real-time sync

#### Scenario: User resets theme to defaults
- **WHEN** the user clicks the "Reset to Defaults" button in the settings interface
- **THEN** the application reverts all branding and theme settings (colors, title, subtitle, icon) to their original baseline values
- **AND** the changes are applied immediately across all active sessions via real-time sync
