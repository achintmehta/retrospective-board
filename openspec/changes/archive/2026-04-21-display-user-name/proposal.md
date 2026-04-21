## Why

Currently, while users are prompted to enter their name upon joining a board, there is no persistent visual indicator of who they are logged in as. Displaying the user's name at the top of the room provides essential confirmation of identity and improves the user experience by giving immediate feedback on their session status.

## What Changes

- Add a "User Session" indicator in the `BoardPage` header.
- Display the name stored in `localStorage` (`retro_username`) in this new indicator.
- If no name is set (Anonymous), display a default neutral indicator (e.g., "Anonymous").
- Ensure the name display updates immediately after the user completes the entry prompt.

## Capabilities

### New Capabilities
- `user-identity`: Requirements for displaying and managing the local user's identity within a session.

### Modified Capabilities
*(None)*

## Impact

- **Frontend**: `BoardPage.jsx` will be modified to include the name display logic and UI components.
- **CSS**: `BoardPage.css` will receive new styles for the user identity chip/indicator in the header.
- **State**: The component will need to re-read from `localStorage` or sync a local state when the name prompt is dismissed.
