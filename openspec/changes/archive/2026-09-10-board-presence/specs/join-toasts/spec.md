## ADDED Requirements

### Requirement: Join Toast Notifications
The system SHALL display a brief toast notification when a named user joins the board. Toasts SHALL stack vertically (max 3 simultaneous), each auto-dismissing after 3 seconds with their own independent timers. The current user's own join SHALL NOT trigger a toast for themselves.

#### Scenario: Named user joins
- **WHEN** the server broadcasts `user_joined` with a non-empty username
- **AND** the username does not match the current user's own username
- **THEN** a toast SHALL appear showing "👋 [username] joined"
- **THEN** the toast SHALL auto-dismiss after 3 seconds

#### Scenario: Two users join simultaneously
- **WHEN** two `user_joined` events arrive within the same render cycle
- **THEN** both toasts SHALL be visible simultaneously, stacked vertically
- **THEN** each toast SHALL have its own independent 3-second timer

#### Scenario: More than 3 simultaneous joins
- **WHEN** a 4th `user_joined` event arrives while 3 toasts are already visible
- **THEN** the 4th toast SHALL be silently dropped (not queued)

#### Scenario: Own join suppressed
- **WHEN** the `user_joined` username matches the current user's stored username
- **THEN** no toast SHALL be shown

#### Scenario: Anonymous user joins
- **WHEN** a user joins with an empty username
- **THEN** no toast SHALL be shown (anonymous joins are silent)
