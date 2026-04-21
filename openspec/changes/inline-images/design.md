## Context

We previously built support for file attachments which append onto Retro Board Cards and Replies as an `<img>` tag at the bottom via a structured `image_url` property. The team now requires standard inline-image parsing (`![alt](url)`) integrated natively into the text so users can embed external or internal images precisely where they want them within their paragraphs.

## Goals / Non-Goals

**Goals:**
- Provide client-side parsing of markdown image syntax within the `content` string.
- Render embedded images visually aligned without breaking card bounds.

**Non-Goals:**
- Full Markdown support (tables, headers, complex syntax highlighting).
- Server-side downloading or proxying of embedded external URLs.

## Decisions

- **Rendering Strategy**: We will implement a lightweight regex-based URL parse-and-replace hook inside `Card` and `CardReplies` instead of importing heavy markdown libraries (like `react-markdown`), keeping the client bundle tiny since we only want image parsing.
- **Parser Implementation**: A React helper function `renderTextWithImages(text)` will split the text via regex `(!\[.*?\]\(.*?\))` and dynamically return an array of React Nodes (Strings and `<img />` components).

## Risks / Trade-offs

- **Risk**: Large inline images breaking layout width on narrow columns.
  - **Mitigation**: Expand `.card-image` styled rules implicitly covering any inline `img` embedded in the text block to have `max-width: 100%` and `object-fit: cover`.
- **Risk**: Performance impact of regex evaluation on rendering multiple cards.
  - **Mitigation**: RegExp regex split operations are highly optimized. We will memoize or evaluate during render which takes less than 1ms per typical board.
