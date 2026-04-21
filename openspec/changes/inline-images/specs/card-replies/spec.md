## ADDED Requirements

### Requirement: Parse Inline Image Tokens in Replies
The system SHALL parse inline image tokens (`[Image: url]`) natively within a Reply's text content.

#### Scenario: Reply content features an inline image token
- **WHEN** user provides reply textual content containing an auto-uploaded image token
- **THEN** the text string visually renders an `<img>` element inline within the thread instead of the text token, displaying the image
