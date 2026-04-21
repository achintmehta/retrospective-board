## ADDED Requirements

### Requirement: Broadcast Nested Data Additions
The system SHALL broadcast any additions or modifications of nested data (replies, reactions, images) in real-time.

#### Scenario: Client adds a reply
- **WHEN** Client A adds a reply or reaction to a card
- **THEN** the server immediately broadcasts the new nested data to Client B in the same room, without requiring a full board refresh
