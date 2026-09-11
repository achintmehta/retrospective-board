## 1. Server — BOARD_TEMPLATES constant

- [x] 1.1 Add `BOARD_TEMPLATES` constant to `boardHandlers.js` (module-level, after `VALID_THEMES`): object keyed by template ID, value is array of column title strings; include all 8 templates with an empty array for `empty`

## 2. Server — Extend DEFAULT_COLUMN_COLORS to 6 colors per theme

- [x] 2.1 Extend every theme entry in `DEFAULT_COLUMN_COLORS` from 3 to 6 colors — add 3 harmonious accent colors to each theme's existing palette

## 3. Server — Update createBoard to accept template

- [x] 3.1 Update `createBoard(name, theme, template = 'standard')` signature to accept `template` param
- [x] 3.2 Replace the hardcoded 3-column creation with: look up `BOARD_TEMPLATES[template] ?? BOARD_TEMPLATES['standard']`, then loop through column titles calling `addColumn(id, title, colors[i % colors.length])`
- [x] 3.3 Remove the old destructured `const [c1, c2, c3] = ...` line and the three hardcoded `addColumn` calls

## 4. Server — Socket handler

- [x] 4.1 Update `create_board` socket handler in `index.js` to pass `template` from payload to `createBoard(name, theme, template)`

## 5. Client — TemplatePicker component

- [x] 5.1 Create `client/src/components/TemplatePicker.jsx` — accepts `{ selectedTemplate, onSelect, buttonType }` props; renders a collapsible toggle button showing the selected template's display name and a card grid panel
- [x] 5.2 Define `TEMPLATES` array in `TemplatePicker.jsx`: each entry has `id`, `name`, `columns[]`; include all 8 templates
- [x] 5.3 Toggle button: shows `📋 Template: <display name>` with chevron; `buttonType` prop controls `type` attribute (default `"button"`)
- [x] 5.4 Collapsed panel uses `grid-template-rows: 0fr` / `1fr` CSS transition (same pattern as ThemePicker)
- [x] 5.5 Card grid: each card shows template name bold + columns as small list; selected card has accent ring; clicking selects and collapses panel
- [x] 5.6 Create `client/src/components/TemplatePicker.css`: toggle button styles (match ThemePicker toggle), collapsible panel with grid transition, card grid layout, card styles with selection ring

## 6. Client — HomePage wiring

- [x] 6.1 Import `TemplatePicker` in `HomePage.jsx`
- [x] 6.2 Add `selectedTemplate` state initialised to `'standard'`
- [x] 6.3 Render `<TemplatePicker selectedTemplate={selectedTemplate} onSelect={setSelectedTemplate} buttonType="button" />` below `<ThemePicker>` in the create board form
- [x] 6.4 Pass `template: selectedTemplate` in the `create_board` socket emit payload
- [x] 6.5 Reset `selectedTemplate` to `'standard'` after successful board creation

## 7. Verification

- [x] 7.1 Create a board with each template — verify correct columns are created
- [x] 7.2 Verify empty board template creates board with zero columns
- [x] 7.3 Verify 4Ls template (4 columns) each gets a distinct color
- [x] 7.4 Verify default creation (no template selected) still uses standard 3 columns
- [x] 7.5 Verify template picker card grid shows all 8 templates with correct column lists
- [x] 7.6 Verify selecting a template collapses the panel and updates the toggle label
