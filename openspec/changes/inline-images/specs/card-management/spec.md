## ADDED Requirements

### Requirement: Parse Inline Images in Cards
The system SHALL parse standard markdown image syntax (`![alt text](url)`) natively within the Card's text content.

#### Scenario: Card content features an inline image
- **WHEN** user provides card textual content containing markdown image syntax
- **THEN** the text string visually renders an `<img>` element instead of raw syntax, displaying the image
