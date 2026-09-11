## ADDED Requirements

### Requirement: Inline Column Title Editing
The system SHALL allow users to rename a column by clicking its title. Clicking the title SHALL replace it with a focused text input pre-populated with the current title. Pressing Enter or blurring the input SHALL save the new title if non-empty; pressing Escape SHALL cancel and restore the original title. The change SHALL be persisted via a `rename_column` socket event and broadcast to all connected clients on the board as `column_renamed`.

#### Scenario: User renames a column by clicking title
- **WHEN** the user clicks the column title
- **THEN** the title SHALL become an editable input with the current text selected
- **WHEN** the user types a new title and presses Enter
- **THEN** the column title SHALL update immediately (optimistic) and persist to the server

#### Scenario: User cancels rename
- **WHEN** the user clicks the column title, edits it, then presses Escape
- **THEN** the input SHALL close and the original title SHALL be restored with no server call

#### Scenario: Empty title not saved
- **WHEN** the user clears the column title input and presses Enter or blurs
- **THEN** the rename SHALL be cancelled and the original title SHALL be restored

#### Scenario: Real-time rename visible to other clients
- **WHEN** one client renames a column
- **THEN** all other clients on the same board SHALL see the updated title without refreshing
