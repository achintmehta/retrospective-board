## ADDED Requirements

### Requirement: Eight Built-In Board Templates
The system SHALL provide eight built-in board templates selectable at board creation time. Each template defines an ordered list of column titles. Templates are applied once at creation and cannot be changed afterwards. The default template is `standard`.

| Template ID | Display Name | Columns |
|---|---|---|
| `standard` | Standard Retro | Went Well, Needs Improvement, Action Items |
| `4ls` | 4Ls | Liked, Learned, Lacked, Longed For |
| `start-stop-continue` | Start Stop Continue | Start, Stop, Continue |
| `mad-sad-glad` | Mad Sad Glad | Mad, Sad, Glad |
| `kalm` | KALM | Keep, Add, Less, More |
| `sailboat` | Sailboat | Anchors, Wind, Rocks, Island |
| `rose-bud-thorn` | Rose Bud Thorn | Rose, Bud, Thorn |
| `empty` | Empty Board | *(no columns)* |

#### Scenario: Board created with a template
- **WHEN** a user creates a board with template `4ls`
- **THEN** the board SHALL be created with exactly four columns: Liked, Learned, Lacked, Longed For
- **THEN** each column SHALL receive a distinct color tint from the chosen theme's palette

#### Scenario: Unknown template falls back to standard
- **WHEN** an unknown template ID is passed to `createBoard`
- **THEN** the system SHALL fall back to the `standard` template

#### Scenario: Empty board template
- **WHEN** a user selects the `empty` template
- **THEN** the board SHALL be created with zero columns

### Requirement: Template Picker in Board Creation Form
The board creation form SHALL include a collapsible template picker displaying all 8 templates as a card grid. Each card SHALL show the template display name and its column titles. The picker SHALL be collapsed by default showing the selected template name. Selecting a template updates the selection immediately.

#### Scenario: Template picker collapsed by default
- **WHEN** the board creation form is opened
- **THEN** the template picker SHALL be collapsed showing "Template: Standard Retro"

#### Scenario: Expanded picker shows card grid
- **WHEN** the user clicks the template picker toggle
- **THEN** a card grid SHALL expand showing all 8 templates
- **THEN** each card SHALL display the template name and column list
- **THEN** the currently selected template SHALL have an accent border ring

#### Scenario: Selecting a template
- **WHEN** the user clicks a template card
- **THEN** that template SHALL become selected and the panel SHALL collapse
- **THEN** the toggle label SHALL update to show the new template name
