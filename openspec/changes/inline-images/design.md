## Context

We previously built support for generic file attachments which appeared appendaged onto Retro Board Cards and Replies as an `<img>` tag at the bottom. We are transitioning to an auto-insertion token system to seamlessly embed inline images natively into the text content.

## Goals / Non-Goals

**Goals:**
- Auto-upload selected images immediately and append `[Image: URL]` to the message string.
- Provide client-side parsing of `[Image: ...]` syntax within the text field.
- Render embedded images visually aligned.

**Non-Goals:**
- Supporting generic markdown syntax.
- Blocking the UI waiting for generic markdown support libraries.

## Decisions

- **Rendering Strategy**: Implement a lightweight regex loop based on `\[Image: (.*?)\]` hook inside `Card` and `CardReplies`.
- **Parsing Logic**: A helper function `renderTextWithImages(text)` splices `[Image... ]` blocks out into React Fragments containing `<img>` tags natively inline!

## Risks / Trade-offs

- **Risk**: Creating orphaned server images if auto-upload completes but user abandons the form.
  - **Mitigation**: Simple cleanup script run periodically on the server or accepted as standard artifact bloat for self-hosted utility.
