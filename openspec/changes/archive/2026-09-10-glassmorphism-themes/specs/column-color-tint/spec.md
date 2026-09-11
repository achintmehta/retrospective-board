## ADDED Requirements

### Requirement: Optional Per-Column Color Tint
The system SHALL allow users to set an optional hex color tint on a column at creation time. The tint SHALL be stored in the `columns.color` column as a hex string (e.g. `#00ffff`) or `NULL` for no tint. The default SHALL be `NULL`.

#### Scenario: Column created with no tint
- **WHEN** a user creates a column without selecting a custom color
- **THEN** `columns.color` is `NULL`
- **THEN** the column renders with the theme's default glass background (`--glass-bg`)

#### Scenario: Column created with a custom tint
- **WHEN** a user selects a hex color in the Add Column form and creates the column
- **THEN** `columns.color` is persisted as the chosen hex value
- **THEN** the column renders with a color-mixed background: 18% tint color blended with 82% of `--glass-bg`

### Requirement: Color Tint Rendered via CSS color-mix
The column color tint SHALL be applied using the CSS `color-mix(in srgb, var(--col-tint) 18%, var(--glass-bg) 82%)` pattern, where `--col-tint` is set as an inline CSS custom property from `column.color`. When `column.color` is `NULL`, the fallback SHALL be the theme's `--glass-bg` with no tint.

#### Scenario: Tint blends with theme glass background
- **WHEN** a column has `color = '#ff00ff'` and the board uses the vaporwave theme
- **THEN** the column background SHALL appear as the vaporwave glass tint blended with ~18% magenta

#### Scenario: Tint fallback for unsupported browsers
- **WHEN** `color-mix()` is not supported by the browser
- **THEN** the column SHALL fall back to rendering with `--glass-bg` (no tint, no broken layout)

### Requirement: Color Picker in Add Column Form
The Add Column form SHALL include an optional color tint picker with two modes: "Use default" (no tint, default selected) and "Custom" (reveals a hex color input). The picker SHALL be visually compact and not dominate the form.

#### Scenario: Default selected hides color picker
- **WHEN** the Add Column form is open and "Use default" is selected
- **THEN** no color input is shown

#### Scenario: Custom tint selection
- **WHEN** the user selects "Custom" in the Add Column form
- **THEN** a color input SHALL appear allowing hex color selection
- **THEN** a small swatch SHALL preview the chosen color
