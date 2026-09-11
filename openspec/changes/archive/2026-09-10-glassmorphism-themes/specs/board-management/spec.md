## MODIFIED Requirements

### Requirement: Create New Board
The system SHALL allow users to create a new retrospective board with a name and a visual theme. The theme SHALL be selected from the six built-in options at creation time and locked for the lifetime of the board.

#### Scenario: User creates a board with a theme
- **WHEN** user initiates "Create Board", provides a name, and selects a theme (e.g. `cyberpunk`)
- **THEN** system generates a new board with a unique ID, the chosen theme stored in `boards.theme`, and default columns
- **THEN** system navigates user to the new board

#### Scenario: User creates a board without selecting a theme
- **WHEN** user initiates "Create Board" and does not select a theme
- **THEN** system uses `default` as the theme
- **THEN** system generates the board and navigates the user to it

#### Scenario: Theme picker displayed at creation
- **WHEN** the board creation form is open
- **THEN** six theme swatch cards SHALL be displayed, each showing a visual preview of the theme
- **THEN** `default` SHALL be pre-selected
