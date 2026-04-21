## ADDED Requirements

### Requirement: Parse Inline Images in Replies
The system SHALL parse standard markdown image syntax (`![alt text](url)`) natively within a Reply's text content.

#### Scenario: Reply content features an inline image
- **WHEN** user provides reply textual content containing markdown image syntax
- **THEN** the text string visually renders an `<img>` element inline within the thread instead of raw syntax, displaying the image
