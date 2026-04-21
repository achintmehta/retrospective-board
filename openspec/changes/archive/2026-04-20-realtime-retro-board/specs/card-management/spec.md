## ADDED Requirements

### Requirement: Add Anonymous Card
The system SHALL allow users to add cards to a column anonymously.

#### Scenario: User adds an anonymous card
- **WHEN** user creates a card without choosing/providing an author name
- **THEN** a card is created in the specified column without author attribution

### Requirement: Add Identified Card
The system SHALL allow users to add cards to a column with an author identifier.

#### Scenario: User adds an identified card
- **WHEN** user creates a card with an author name or session-stored signature
- **THEN** the card is created and displays the provided author identifier

### Requirement: Move Card
The system SHALL allow users to move a card between columns.

#### Scenario: User moves a card
- **WHEN** user drags or moves a card from Column A to Column B
- **THEN** the card's position updates to reflect its presence in Column B

### Requirement: Delete Card
The system SHALL allow users to delete a card.

#### Scenario: User deletes a card
- **WHEN** user requests deletion on a specific card
- **THEN** the card is permanently removed from its column
