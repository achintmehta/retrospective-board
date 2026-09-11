## MODIFIED Requirements

### Requirement: Create New Board
The system SHALL allow users to create a new retrospective board with a name, a visual theme, and a board template. The template determines the initial column set. The theme may be changed after creation; the template is applied once at creation only and is not stored.

#### Scenario: User creates a board with a template
- **WHEN** user initiates "Create Board", provides a name, selects a theme, and selects a template
- **THEN** system generates a new board with columns from the selected template
- **THEN** each column receives a distinct color tint from the theme palette (cycling if >6 columns)
- **THEN** system navigates user to the new board

#### Scenario: User creates a board with default selections
- **WHEN** user initiates "Create Board" without changing theme or template
- **THEN** system uses `classic-dark` theme and `standard` template
- **THEN** board is created with Went Well / Needs Improvement / Action Items columns

#### Scenario: Theme and template pickers shown at creation
- **WHEN** the board creation form is open
- **THEN** a collapsible theme picker and a collapsible template picker SHALL both be shown, collapsed by default
