## Why

Currently, images are only supported as separate block-level attachments appended to the bottom of the card or reply. Retrospective boards often benefit from rich-text explanations, and allowing inline images directly within the content text flow (e.g., via Markdown syntax) enables users to write more expressive and contextual feedback.

## What Changes

- Add a markdown parser (or simple regex-based syntax parser) to the frontend text rendering logic for `Card` and `CardReplies`.
- Render standard markdown image tags (`![alt](url)`) as inline HTML `<img>` elements within the text block.
- Maintain backwards compatibility with the existing structural attachment feature. 
- Apply basic responsive CSS styling so inline images scale down and don't break the card components' layout.

## Capabilities

### New Capabilities
*(None)*

### Modified Capabilities
- `card-management`: The card rendering requirement is changing to include parsing inline image syntax within the card's text content.
- `card-replies`: The reply rendering requirement is changing to include parsing inline image syntax within the reply's string content.

## Impact

- **Frontend**: The React components responsible for displaying `card.content` and `reply.content` will be updated (likely adopting a library like `react-markdown` or a custom string interpreter).
- **CSS**: Minor scoped updates to ensure inline images `.card-content img` have a `max-width: 100%` attribute.
- **Backend**: No database schema changes are required since the content string seamlessly holds the markdown.
