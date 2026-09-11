## MODIFIED Requirements

### Requirement: Create New Board
The system SHALL allow users to create a new retrospective board with a name and a visual theme. The theme SHALL be selected from the 22 built-in options at creation time. Unlike previously, the theme is NOT locked after creation — it may be changed via the board header theme picker.

#### Scenario: User creates a board with a theme
- **WHEN** user initiates "Create Board", provides a name, and selects a theme (e.g. `cyberpunk-dark`)
- **THEN** system generates a new board with a unique ID, the chosen theme stored in `boards.theme`, and default columns with per-theme tint colors
- **THEN** system navigates user to the new board

#### Scenario: User creates a board without selecting a theme
- **WHEN** user initiates "Create Board" and does not select a theme
- **THEN** system uses `classic-dark` as the theme
- **THEN** system generates the board and navigates the user to it

#### Scenario: Theme picker displayed at creation
- **WHEN** the board creation form is open
- **THEN** a collapsible theme picker SHALL be shown, collapsed by default
- **THEN** expanding it reveals all 11 theme families with dark and light variants
