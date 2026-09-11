## Requirements

### Requirement: Twenty-Two Built-In Visual Themes
The system SHALL provide 22 built-in visual themes across 11 families, each with a dark and light variant. Theme IDs follow the pattern `{family}-dark` / `{family}-light`. Families: `classic`, `cyberpunk`, `vaporwave`, `sunset`, `desert`, `artnouveau`, `renaissance`, `highcontrast`, `gruvbox`, `nord`, `solarized`. Each theme SHALL define a complete set of CSS custom properties covering background gradient, glassmorphism panel styling, typography (Google Font families), text colors, border tokens, and transition speed.

#### Scenario: Theme tokens applied on board load
- **WHEN** a user navigates to a board with `theme = 'cyberpunk-dark'`
- **THEN** the `.board-page` element SHALL have the class `theme-cyberpunk-dark` applied
- **THEN** all CSS custom properties for that theme SHALL be active for all child components

#### Scenario: Theme locked at creation
- **WHEN** a board is created with a selected theme
- **THEN** the theme SHALL be stored in `boards.theme` and cannot be changed after creation

#### Scenario: HomePage unaffected by board theme
- **WHEN** a user is on the HomePage
- **THEN** no theme class is applied and the default visual style (`classic-dark`) is used

### Requirement: Grouped Theme Picker at Board Creation
The board creation form SHALL display a collapsible theme picker. The picker SHALL be collapsed by default, showing a preview swatch of the currently selected theme and its name. When expanded, themes SHALL be presented in labelled family groups, each row showing the dark and light variant side by side.

#### Scenario: Picker collapsed by default
- **WHEN** the board creation form is opened
- **THEN** the theme picker SHALL be collapsed, showing only the toggle button with the current selection
- **THEN** `classic-dark` SHALL be pre-selected

#### Scenario: Picker expansion
- **WHEN** the user clicks the theme picker toggle
- **THEN** the grouped theme panel SHALL expand with a smooth CSS transition
- **THEN** all 11 family groups SHALL be visible, each with a dark and light swatch

### Requirement: Glassmorphism Panel Language
Each theme SHALL render columns, cards, and header panels using a glassmorphism visual language: semi-transparent backgrounds (`--glass-bg`), a backdrop blur (`--glass-blur`), and a subtle border (`--glass-border`). The page background SHALL use a gradient (`--bg-gradient`) applied via `body::before` so that glass panels have something to blur against.

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
Each theme SHALL specify `--font-body` and `--font-display` CSS custom properties mapped to Google Fonts. All required font families SHALL be declared in a single CSS `@import` in `index.css` so fonts are pre-loaded. Vim-inspired themes (gruvbox, solarized) use Source Code Pro; cyberpunk uses Share Tech Mono; artnouveau uses Cormorant Garamond; renaissance uses Cinzel; all others use Inter or Raleway.

#### Scenario: Gruvbox theme uses monospace font
- **WHEN** a board with theme `gruvbox-dark` is loaded
- **THEN** body text SHALL render in Source Code Pro

#### Scenario: Renaissance theme uses serif font
- **WHEN** a board with theme `renaissance-dark` is loaded
- **THEN** display text SHALL render in Cinzel
