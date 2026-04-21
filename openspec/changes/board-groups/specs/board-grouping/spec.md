## ADDED Requirements

### Requirement: Create Board Group
The system SHALL allow users to create named groups to organize boards on the home page.

#### Scenario: User creates a new group
- **WHEN** user provides a name and initiates "Create Group"
- **THEN** a new board group is created and displayed on the dashboard

### Requirement: Categorize Board in Group
The system SHALL allow users to move boards into a group using drag-and-drop.

#### Scenario: User drags a board into a group
- **WHEN** user drags a board card over a group container and releases
- **THEN** the board is associated with that group and displayed within its container

### Requirement: Remove Board from Group
The system SHALL allow users to remove a board from a group, returning it to the "Un-grouped" list.

#### Scenario: User removes board from group
- **WHEN** user initiates "Remove from Group" on a card inside a group container
- **THEN** the board's group association is cleared and it returns to the main list

### Requirement: Delete Board Group
The system SHALL allow users to delete a group, which MUST NOT delete the boards contained within it.

#### Scenario: User deletes a group
- **WHEN** user initiates "Delete Group"
- **THEN** the group container is removed
- **THEN** all boards previously in that group are returned to the "Un-grouped" list
- **THEN** the boards themselves remain active and accessible

### Requirement: Collapse/Expand Groups
The system SHALL allow users to collapse and expand group containers to manage dashboard space.

#### Scenario: User toggles group visibility
- **WHEN** user clicks the collapse/expand toggle on a group header
- **THEN** the group's child boards are hidden or shown accordingly
