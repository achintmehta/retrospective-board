## 1. Frontend State Management

- [x] 1.1 Add `username` state variable to the `BoardPage` component.
- [x] 1.2 Initialize the `username` state from `localStorage` inside the existing `useEffect` (or a dedicated one).
- [x] 1.3 Update `handleSaveName` to synchronize the `username` state immediately when the user saves their name.
- [x] 1.4 Update `handleSkipName` to synchronize the `username` state (setting it to an empty string) when the user skips the prompt.

## 2. UI Implementation

- [x] 2.1 Integrate the `user-indicator` element into the `<header className="board-header">` in `BoardPage.jsx`.
- [x] 2.2 Implement logic to display "Anonymous" if the `username` state is empty or null.
- [x] 2.3 Add a decorative icon (👤) to the user indicator for better visual hierarchy.

## 3. Styling & Responsive Design

- [x] 3.1 Add styles to `BoardPage.css` for the `.user-indicator` (background color, padding, border radius, flex alignment).
- [x] 3.2 Implement a media query to hide non-essential text like "Logged in as:" on mobile devices, showing only the name/icon.
