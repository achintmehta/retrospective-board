## Why

Currently, the home page displays the list of retrospective boards in a single-column vertical list. As the number of boards grows, this layout becomes inefficient and feels dated. A grid layout will better utilize the available screen space, providing a more modern and visually appealing overview of all rooms.

## What Changes

- **Grid Layout**: Transform the "All Boards" section from a vertical list into a responsive grid.
- **Card Styling**: Update the card design to be more prominent, moving away from a "table row" look to a distinct "card" feel.
- **Responsiveness**: Ensure the grid adapts from multiple columns on desktop to a single column on mobile devices.

## Capabilities

### New Capabilities
- `home-grid-view`: Implementation of a responsive grid-based room selection interface on the home page.

### Modified Capabilities
*(None)*

## Impact

- **Frontend**: Significant CSS changes in `HomePage.css`. Minor markup refinements in `HomePage.jsx` to ensure data is structured for card-based display.
