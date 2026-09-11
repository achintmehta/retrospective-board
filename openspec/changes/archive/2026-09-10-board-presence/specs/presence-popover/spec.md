## ADDED Requirements

### Requirement: Presence Popover on Live Status Hover
The system SHALL display a popover when the user hovers over the "Live" status indicator in the board header. The popover SHALL show all currently connected named users individually, the current user marked as "(you)", and anonymous users aggregated as a count. The popover SHALL close when the mouse leaves the hover target.

#### Scenario: Hovering Live status with named users present
- **WHEN** the user hovers over the Live status indicator
- **THEN** a glassmorphic popover SHALL appear below the indicator
- **THEN** each named user SHALL be listed individually
- **THEN** the current user's entry SHALL be suffixed with "(you)"
- **THEN** anonymous users SHALL be shown as a single line "N anonymous" (hidden if 0)

#### Scenario: Hovering Live status alone
- **WHEN** the user hovers over the Live status and is the only connected user
- **THEN** the popover SHALL show only the current user marked "(you)"

#### Scenario: Popover not shown when disconnected
- **WHEN** the connection status is not "Live"
- **THEN** hovering the status indicator SHALL NOT show the presence popover
