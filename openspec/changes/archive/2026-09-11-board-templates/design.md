## Context

Board creation currently calls `createBoard(name, theme)` which hardcodes three columns and uses `DEFAULT_COLUMN_COLORS[theme]` (3 colors per theme) for tints. The `create_board` socket event carries `{ name, theme }`. The client form has a `ThemePicker` collapsible and a board name input.

## Goals / Non-Goals

**Goals:**
- 8 hardcoded templates selectable at board creation
- Templates with up to 6 columns each get a distinct per-theme color
- Card-grid template picker UI, collapsible, pre-selects `standard`
- Template applied once at creation — not stored, not changeable

**Non-Goals:**
- Custom/user-defined templates
- Editing template after board creation
- Storing template ID on the board record
- Templates affecting the theme or vice versa

## Decisions

### Decision: Templates hardcoded server-side (Option A)

**Chosen**: `BOARD_TEMPLATES` constant object in `boardHandlers.js`, same file as `DEFAULT_COLUMN_COLORS` and `VALID_THEMES`. `createBoard` accepts `template` param, looks up columns, and creates them.

**Why**: Consistent with how themes are handled. Zero DB complexity. Easy to add templates by editing one constant. Server is the source of truth so all clients (web, MCP) get the same behaviour.

---

### Decision: Extend DEFAULT_COLUMN_COLORS to 6 colors per theme

**Chosen**: Add 3 more colors to each theme's palette. Colors cycle: column at position `i` gets `colors[i % colors.length]`. This already works for `updateBoardTheme` (cycling logic already in place).

**Why**: Sailboat and KALM have 4 columns; 4Ls has 4; some future templates may have more. 6 colors gives enough variety without over-engineering. Cycling beyond 6 is acceptable (unlikely to have >6 column templates in this batch).

---

### Decision: TemplatePicker — card grid, separate component

**Chosen**: `client/src/components/TemplatePicker.jsx` + `TemplatePicker.css`. Toggle button shows selected template name (collapsed by default). Expanded: responsive grid of cards, each showing template name as heading and column titles as a small list.

**Why**: The card-grid with column preview makes the template choice immediately informative — users can see what columns they'll get without clicking into anything. A flat list (like ThemePicker's groups) would hide the column information.

**Card layout**: 3 cards per row on wide viewports, 2 on narrow. Each card: name in bold, column names as small grey text. Selected card gets accent border ring.

---

### Decision: Template not stored in DB

**Chosen**: Template is used only during `createBoard` to generate columns. It is not saved to `boards` table.

**Why**: The template is a creation-time convenience. Once columns exist, they're fully editable (rename, recolor, delete, add). Storing the template adds a column for no benefit — you can't "re-apply" a template, and it doesn't affect board behaviour after creation.

## Template Catalog

| ID | Display Name | Columns |
|---|---|---|
| `standard` | Standard Retro | Went Well, Needs Improvement, Action Items |
| `4ls` | 4Ls | Liked, Learned, Lacked, Longed For |
| `start-stop-continue` | Start Stop Continue | Start, Stop, Continue |
| `mad-sad-glad` | Mad Sad Glad | Mad, Sad, Glad |
| `kalm` | KALM | Keep, Add, Less, More |
| `sailboat` | Sailboat | Anchors, Wind, Rocks, Island |
| `rose-bud-thorn` | Rose Bud Thorn | Rose, Bud, Thorn |
| `empty` | Empty Board | *(no columns)* |

## Risks / Trade-offs

- **Empty board template** creates a board with no columns — user must add their own. This is intentional and useful but could be confusing if selected by accident. Mitigation: card description says "Start from scratch".
- **Color cycling beyond 6** — if a future template has >6 columns, later columns repeat earlier colors. Acceptable for this scope.
- **Template name collision** — if someone passes an unknown `template` ID, fallback to `standard`.
