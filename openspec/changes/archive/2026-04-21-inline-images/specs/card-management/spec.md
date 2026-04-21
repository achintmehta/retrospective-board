## ADDED Requirements

### Requirement: Parse Inline Image Tokens in Cards
The system SHALL parse inline image tokens (`[Image: url]`) natively within the Card's text content.

#### Scenario: Card content features an inline image token
- **WHEN** user provides card textual content containing an auto-uploaded image token
- **THEN** the text string visually renders an `<img>` element instead of the text token, displaying the image
