# card-replies Specification

## Purpose
TBD - created by archiving change rich-card-interactions. Update Purpose after archive.
## Requirements
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

### Requirement: Parse Inline Image Tokens in Replies
The system SHALL parse inline image tokens (`[Image: url]`) natively within a Reply's text content.

#### Scenario: Reply content features an inline image token
- **WHEN** user provides reply textual content containing an auto-uploaded image token
- **THEN** the text string visually renders an `<img>` element inline within the thread instead of the text token, displaying the image

