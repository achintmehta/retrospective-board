## ADDED Requirements

### Requirement: Column Colors Reset on Board Theme Change
When a board's theme is changed via `update_board_theme`, all column color tints SHALL be overwritten with the new theme's default palette. Prior user customisations SHALL be discarded.

#### Scenario: Custom color discarded on theme change
- **WHEN** a column has a user-set color (e.g. `#ff00ff`) and the board theme is changed
- **THEN** the column's color SHALL be replaced with the theme-default color for its position
- **THEN** the prior custom color SHALL not be retained
