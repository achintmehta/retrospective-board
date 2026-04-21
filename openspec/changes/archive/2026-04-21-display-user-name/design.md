## Context

The Retro Board currently allows users to identify themselves via a prompt when joining a board. This identity is stored in `localStorage` as `retro_username`. While this works for attribution on cards and replies, it lacks a persistent "Logged in as" indicator for the user to confirm their current session identity.

## Goals / Non-Goals

**Goals:**
- Provide a clear, persistent visual indicator of the current user's session identifier.
- Update the UI immediately when the user provides their name via the prompt.
- Use a design consistent with the existing board header aesthetic.

**Non-Goals:**
- Implementing a persistent database-backed user account system.
- Allowing users to change their name *after* the initial prompt (this could be a follow-up feature).

## Decisions

- **Local Component State**: We will introduce a `username` state variable in `BoardPage.jsx`. 
  - **Rationale**: While `localStorage` is the source of truth, React state ensures that the header will re-render immediately when the user saves their name in the prompt modal.
- **Header Integration**: The username will be displayed on the right side of the header, to the left of the "Connection Status" (`Live / Reconnecting`).
  - **Style**: It will use a chip-like background with a "User" icon (👤) to differentiate it from meta-data counts.
- **Fallback Logic**: If `localStorage` is empty (user skipped), it will display "Anonymous".

## Risks / Trade-offs

- **Consistency**: If the user has multiple tabs open and changes their name in one, the other tab won't update until a refresh.
  - **Mitigation**: Accepted as a minor edge case for the current scope.
- **Space Constraints**: On very small screens, the header might become crowded.
  - **Mitigation**: We will use CSS media queries to hide the "Logged in as" label and only show the name/icon on mobile.
