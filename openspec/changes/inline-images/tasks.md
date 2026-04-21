## 1. Parsing Utility

- [x] 1.1 Create `client/src/utils/textParser.jsx` holding an exported `renderTextWithImages(text)` function.
- [x] 1.2 Implement regex `(!\[.*?\]\(.*?\))` to search for markdown images inside the `renderTextWithImages` function.
- [x] 1.3 Split the string into fragments to correctly generate a safe array of Text elements and React `<img />` tags mapped to the matched URL and Alt strings.

## 2. Frontend Render Updates

- [x] 2.1 Update `client/src/components/Card.jsx` to import `renderTextWithImages`.
- [x] 2.2 Replace paragraph wrapper `<p className="card-content">{card.content}</p>` with a div wrapper parsing the text: `<div className="card-content">{renderTextWithImages(card.content)}</div>`.
- [x] 2.3 Update `client/src/components/CardReplies.jsx` to import `renderTextWithImages`.
- [x] 2.4 Replace reply string content to use `{renderTextWithImages(reply.content)}`.

## 3. CSS Adjustments

- [x] 3.1 Update CSS stylesheets (`Card.css`, `CardReplies.css`) to ensure inline `img` tags have `max-width: 100%`, `border-radius: var(--radius-sm)`, and appropriate margin/padding so large embedded images respect the column boundaries.
