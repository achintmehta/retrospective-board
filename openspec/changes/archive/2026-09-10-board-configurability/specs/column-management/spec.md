## ADDED Requirements

### Requirement: Unambiguous Column Delete Button
The column delete button SHALL use the `✕` glyph (not `⋯` three dots). The two-step confirm interaction (click once to arm, click again to confirm) SHALL be retained.

#### Scenario: Delete button shows correct glyph
- **WHEN** the user hovers over a column
- **THEN** the delete button SHALL display `✕`
- **WHEN** the user clicks it once
- **THEN** the button SHALL switch to the confirm state (`✓?`)
