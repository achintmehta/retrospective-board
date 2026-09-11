## Purpose
Define the board-level management capabilities.

## Requirements

### Requirement: Create New Board
The system SHALL allow users to create a new retrospective board with a name, a visual theme, and a board template. The theme SHALL be selected from the 22 built-in options at creation time. The template determines the initial column set and is applied once at creation only — it is not stored and cannot be changed. The theme may be changed after creation via the board header theme picker. The default theme is `classic-dark` and the default template is `standard`.

#### Scenario: User creates a board with a theme and template
- **WHEN** user initiates "Create Board", provides a name, selects a theme and a template
- **THEN** system generates a new board with columns from the selected template, each with a per-theme color tint
- **THEN** system navigates user to the new board

#### Scenario: User creates a board with default selections
- **WHEN** user initiates "Create Board" without changing theme or template
- **THEN** system uses `classic-dark` theme and `standard` template
- **THEN** board is created with Went Well / Needs Improvement / Action Items columns

#### Scenario: Theme and template pickers shown at creation
- **WHEN** the board creation form is open
- **THEN** a collapsible theme picker and a collapsible template picker SHALL both be shown, collapsed by default
- **THEN** the theme picker reveals all 11 theme families with dark and light variants
- **THEN** the template picker reveals all 8 templates as a card grid with column previews

### Requirement: Delete Board
The system SHALL allow users to delete an existing retrospective board.

#### Scenario: User deletes a board
- **WHEN** user requests deletion of the board
- **THEN** all columns and cards associated with the board are removed
- **THEN** the board is removed from the database permanently
