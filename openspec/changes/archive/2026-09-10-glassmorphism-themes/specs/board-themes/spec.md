## ADDED Requirements

### Requirement: Six Built-In Visual Themes
The system SHALL provide six built-in visual themes: `default`, `light`, `cyberpunk`, `vaporwave`, `art-nouveau`, and `renaissance`. Each theme SHALL define a complete set of CSS custom properties covering background gradient, glassmorphism panel styling, typography (font families), text colors, border radii, and transition speed.

#### Scenario: Theme tokens applied on board load
- **WHEN** a user navigates to a board with `theme = 'cyberpunk'`
- **THEN** the `.board-page` element SHALL have the class `theme-cyberpunk` applied
- **THEN** all CSS custom properties for that theme SHALL be active for all child components

#### Scenario: HomePage unaffected by board theme
- **WHEN** a user is on the HomePage
- **THEN** no theme class is applied and the default visual style is used

### Requirement: Glassmorphism Panel Language
Each theme SHALL render columns, cards, and header panels using a glassmorphism visual language: semi-transparent backgrounds (`--glass-bg`), a backdrop blur (`--glass-blur`), and a subtle border (`--glass-border`). The page background SHALL use a gradient or layered visual (`--bg-gradient`) applied via `body::before` so that glass panels have something to blur against.

#### Scenario: Glass effect visible on columns
- **WHEN** a board page loads with any theme
- **THEN** column backgrounds SHALL appear as translucent glass panels over the page gradient

#### Scenario: No idle animations
- **WHEN** the board is idle (no user interaction)
- **THEN** no persistent CSS keyframe animations SHALL be running (no blinking, pulsing, drifting, or scanning effects)

### Requirement: Transition-Only Animations
The system SHALL use CSS transitions (not keyframe animations) for all interactive state changes. Permitted animations are limited to: card drag/drop, modal open/close, column appear, button hover lift, and theme-switch crossfade.

#### Scenario: Card hover uses transition
- **WHEN** a user hovers over a card
- **THEN** the card SHALL lift via a CSS `transition` (not a `@keyframes` animation)

### Requirement: Per-Theme Google Font Typography
Each theme SHALL specify `--font-body` and `--font-display` CSS custom properties mapped to Google Fonts. All required font families SHALL be declared in a single CSS `@import` in `index.css` so fonts are pre-loaded.

#### Scenario: Cyberpunk theme uses monospace font
- **WHEN** a board with theme `cyberpunk` is loaded
- **THEN** body text SHALL render in Share Tech Mono

#### Scenario: Renaissance theme uses serif font
- **WHEN** a board with theme `renaissance` is loaded
- **THEN** display text SHALL render in Cinzel
