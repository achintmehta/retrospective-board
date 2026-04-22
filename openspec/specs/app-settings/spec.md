# app-settings Specification

## Purpose
The Application Settings specification defines the requirements for global platform configuration, specifically focused on branding elements, visual themes, and real-time synchronization of these settings across all connected users.

## Requirements

### Requirement: Manage Application Branding
The system SHALL provide an interface to configure global application branding elements:
- **Application Title**: The main platform name.
- **Subtitle / Description**: The platform's tagline or purpose.
- **Logo Icon**: Standard emoji or custom image file.

#### Scenario: User updates branding
- **WHEN** the user submits new branding values through the settings interface
- **THEN** the values are persisted to the database and updated in the UI across all active sessions.

### Requirement: Seven-Point Theme Customization
The system SHALL allow users to configure granular branding colors across seven specific application points:
- **Primary Background**: Global platform background.
- **Primary Font**: Global text color.
- **Dashboard Cards**: Background for cards on the home page.
- **Retro Cards**: Background for cards on individual boards.
- **Column Color**: Background for retro board columns.
- **Highlight (Accent)**: Primary branding and button color.
- **Highlight Hover**: Interaction color for highlight elements.

#### Scenario: Real-time theme update
- **WHEN** the user submits any of the seven supported theme colors
- **THEN** the colors are broadcast in real-time and injected as CSS variables (`--bg`, `--text`, `--card-dash`, `--card-retro`, `--column`, `--accent`, `--accent-hover`) on all active clients.

### Requirement: Sticky & Scrollable Settings Interface
The system SHALL provide a professional settings layout that prevents viewport overflow.
- **Modal Width**: The settings modal SHALL be **650px wide**.
- **Internal Overflow**: Content SHALL be scrollable within an internal area.
- **Fixed Actions**: The header and action buttons SHALL remain fixed in place while scrolling.

### Requirement: Factory Reset
The system SHALL allow users to restore all branding and theme settings (title, icon, colors) to their baseline values in a single confirmed action.

