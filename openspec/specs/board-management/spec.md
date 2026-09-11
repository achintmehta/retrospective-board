## Purpose
Define the board-level management capabilities.

## Requirements

### Requirement: Create New Board
The system SHALL allow users to create a new retrospective board with a name and a visual theme. The theme SHALL be selected from the 22 built-in options at creation time and locked for the lifetime of the board. The default theme is `classic-dark`.

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

### Requirement: Delete Board
The system SHALL allow users to delete an existing retrospective board.

#### Scenario: User deletes a board
- **WHEN** user requests deletion of the board
- **THEN** all columns and cards associated with the board are removed
- **THEN** the board is removed from the database permanently
