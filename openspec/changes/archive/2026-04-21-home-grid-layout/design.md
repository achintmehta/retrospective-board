## Context

The `HomePage.jsx` currently renders boards in a `<ul>` with the class `.boards-grid`. However, the CSS defines this as a `flex-direction: column` list. This layout is narrow and leaves a lot of empty space on the right side of the screen on desktop.

## Goals / Non-Goals

**Goals:**
- Transition the board list to a multi-column CSS Grid.
- Pivot board cards to have a more distinct "card-like" appearance (higher verticality).
- Maintain responsiveness (automatic column adjustment).

**Non-Goals:**
- Pagination or search filtering for boards (out of scope for this UI pivot).
- Changes to any other page or board logic.

## Decisions

- **Layout engine**: We will use `display: grid;` on `.boards-grid`. 
  - *Rationale*: CSS Grid is the native and most efficient tool for creating 2D responsive layouts without media query overhead for basic column wrapping.
- **Column Strategy**: Use `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));`.
  - *Rationale*: This is a classic "fluid grid" pattern that ensures cards stay at a readable width (min 280px) and fill the row (1fr) as space allows.
- **Visual Pivot**: We will increase the padding on `.board-card` and center-align some information to make them feel less like "rows" and more like "objects".

## Risks / Trade-offs

- **Risk**: Long board names might wrap awkwardly in smaller grid cells.
  - **Mitigation**: Use `text-overflow: ellipsis` or ensure cards have enough height to accommodate wrapping.
- **Risk**: Card heights might be uneven if names wrap.
  - **Mitigation**: The CSS grid will default to stretching items to the tallest in the row, or we can set a fixed/min height.
