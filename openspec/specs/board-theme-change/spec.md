## ADDED Requirements

### Requirement: Post-Creation Board Theme Change
The system SHALL allow users to change a board's visual theme after creation via a theme picker in the board header. Selecting a new theme SHALL update `boards.theme`, reset all column colors to the new theme's default palette, and broadcast the change to all connected clients.

#### Scenario: User changes board theme from header
- **WHEN** the user opens the theme picker in the board header and selects a new theme
- **THEN** the board page SHALL immediately apply the new theme class
- **THEN** all column colors SHALL reset to the new theme's default palette
- **THEN** all connected clients on the board SHALL see the same theme and column color changes

#### Scenario: Theme picker is accessible in the board header
- **WHEN** the user is on a board page
- **THEN** a theme picker button SHALL be visible in the header
- **THEN** clicking it SHALL open a grouped swatch panel showing all 22 themes
- **THEN** the current theme SHALL be highlighted as selected

### Requirement: Column Color Reset on Theme Change
When a board's theme is changed, ALL column colors SHALL be reset to the new theme's default palette regardless of whether they were previously user-customised. Columns are assigned colors from the theme palette by cycling through position index modulo 3.

#### Scenario: Column colors reset on theme change
- **WHEN** the user changes the board theme
- **THEN** every column's color SHALL be overwritten with the corresponding default color for the new theme
- **THEN** no column SHALL retain its prior color

#### Scenario: More than 3 columns cycle through palette
- **WHEN** a board has more than 3 columns and the theme is changed
- **THEN** columns at positions 0, 3, 6... SHALL receive palette color 1
- **THEN** columns at positions 1, 4, 7... SHALL receive palette color 2
- **THEN** columns at positions 2, 5, 8... SHALL receive palette color 3
