## Context

Currently, the RetroBoard application supports simple text cards with author metadata. To enable richer communication, we want to introduce threaded replies (allowing discussion on specific topics), emoji reactions (to upvote or agree rapidly), and image support. 

## Goals / Non-Goals

**Goals:**
- Implement 1-level-deep threaded replies on any card.
- Allow users to click emojis to react to a card, incrementing a shared counter.
- Allow users to include images in cards and replies via file upload or URL.
- Ensure all states sync in real-time.

**Non-Goals:**
- Multi-level deep threading (replies to replies are out of scope).
- Tracking *which* users reacted to an emoji (simple counters are sufficient).
- General file attachments (PDFs, docs); specifically focusing on images.

## Decisions

### 1. Database Schema Additions
- **Images in Cards**: Add an `image_url` TEXT column to `cards`.
- **Replies Table**: Create a `replies` table: `id`, `card_id`, `content`, `image_url`, `author`, `created_at`.
- **Reactions Table**: Create a `reactions` table: `id`, `card_id`, `emoji`, `count`.
*Rationale*: A relational model is highly efficient with SQLite. We track reply items in a related table to keep `cards` rows clean, and aggregate reaction counts via a simple integer tally per emoji-type per card.

### 2. Image Storage Mechanism
We will support image uploading. Because the app runs in Docker with a mounted `/app/data` volume, we will create a new `uploads/` directory inside `data/` to store images.
*Rationale*: Storing base64 encoded strings in SQLite can bloat the database and slow down initial page loads. Local file storage with static serving is much more performant. We will create a REST endpoint `POST /api/upload` that saves the file and returns a static path (e.g., `/uploads/filename.jpg`), which the client will then include in its `add_card` or `add_reply` socket payload.

### 3. Redesigned Socket Payloads
- `getBoardState`: Now joins/fetches `replies` and `reactions` and embeds them as nested arrays inside their parent card objects.
- `add_reaction` / `remove_reaction`: Increments/decrements the count for `(cardId, emoji)` and broadcasts the delta.
- `add_reply` / `delete_reply`: Modifies the replies table and broadcasts the specific nested items.

## Risks / Trade-offs

- **Risk: Oversized image uploads draining disk space.** → Mitigation: Implement a file size limit (e.g., 5MB) on the `POST /api/upload` route.
- **Risk: Increased hydration payload size for large boards.** → Mitigation: Ensure `getBoardState` is properly optimized via indexed queries on `card_id` in the `replies` and `reactions` tables.
