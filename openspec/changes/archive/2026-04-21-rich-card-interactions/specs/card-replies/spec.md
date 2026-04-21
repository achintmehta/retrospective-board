## ADDED Requirements

### Requirement: Reply to Card
The system SHALL allow users to create threaded replies to any existing card.

#### Scenario: User replies to a card
- **WHEN** user submits a text reply (and optionally an image) attached to a specific card
- **THEN** the reply is appended to the card's thread and displayed beneath the card

### Requirement: Delete Reply
The system SHALL allow users to delete a reply.

#### Scenario: User deletes a reply
- **WHEN** user requests deletion of a specific reply
- **THEN** the reply is permanently removed from the card's thread
