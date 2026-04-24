## MODIFIED Requirements

### Requirement: Create New Board
The system SHALL allow users to create a new retrospective board.

#### Scenario: User creates a board
- **WHEN** user initiates "Create Board"
- **THEN** system generates a new board with a unique ID and default columns
- **THEN** system navigates user to the new board

### Requirement: Delete Board
The system SHALL allow users to delete an existing retrospective board.

#### Scenario: User deletes a board
- **WHEN** user requests deletion of the board
- **THEN** all columns and cards associated with the board are removed
- **THEN** the board is removed from the database permanently

## ADDED Requirements

### Requirement: Grouped Board Display
The system SHALL display boards organized by their assigned groups on the home page dashboard.

#### Scenario: Displaying grouped dashbord
- **WHEN** the dashboard loads
- **THEN** boards with a group assignment are rendered within their respective group containers
- **THEN** boards without a group assignment are rendered in a "General" or "Un-grouped" section
