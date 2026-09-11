## MODIFIED Requirements

### Requirement: Add Column
The system SHALL allow users to add a new column to a board with a title and an optional color tint. The color tint defaults to none (inherits theme glass background).

#### Scenario: User adds a column with default color
- **WHEN** user selects "Add Column", provides a title, and leaves color as "Use default"
- **THEN** a new column is appended to the board layout with `color = NULL`
- **THEN** the column renders with the board theme's default glass background

#### Scenario: User adds a column with a custom color tint
- **WHEN** user selects "Add Column", provides a title, selects "Custom" color, and picks a hex color
- **THEN** a new column is appended with the chosen hex stored in `columns.color`
- **THEN** the column renders with the tinted glass background
