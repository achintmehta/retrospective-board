## ADDED Requirements

### Requirement: Display Current User Identity
The system SHALL display the current user's session name or anonymous status in the board header for immediate session visibility.

#### Scenario: User has a persistent name set
- **WHEN** the board page loads and `localStorage` contains a non-empty `retro_username`
- **THEN** the header displays a user indicator with the text "👤 [Name]"

#### Scenario: User enters a name during the session
- **WHEN** the user saves a name via the entry prompt
- **THEN** the header user indicator immediately updates to reflect the new name

#### Scenario: User is anonymous
- **WHEN** the user skips the name entry or has an empty `retro_username` in `localStorage`
- **THEN** the header user indicator displays "👤 Anonymous"
