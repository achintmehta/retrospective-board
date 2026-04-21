## Why

Cards on the retro board currently only support plain text and anonymous/named posting. To facilitate better team collaboration during retrospectives, users need the ability to react to ideas with emojis, reply in threads to discuss specific points, and provide visual context via images in their cards or replies.

## What Changes

- **Emoji Reactions**: Users can add or increment emoji reactions on any card.
- **Card Replies (Threading)**: Users can reply to existing cards, creating a nested thread of discussion.
- **Image Support**: Users can attach images as part of a card or a reply to embed it in the content. 
- **Real-time Sync Support**: All the above interactions must sync in real-time across connected clients.

## Capabilities

### New Capabilities
- `card-replies`: Adds threaded reply functionality to cards, including author tracking and content.
- `card-reactions`: Adds the ability to react to cards with emojis and see aggregate reaction counts.

### Modified Capabilities
- `card-management`: Requirements changing to support image attachments/inclusions in standard cards.
- `realtime-sync`: Requirements changing to ensure reactions, replies, and image data are broadcasted seamlessly.

## Impact

- **Database**: Needs new tables for `reactions` and `replies`, and schema alterations to `cards` for image support. Image storage requires file upload handling or URL input fields.
- **Frontend Components**: The `Card` component needs UI upgrades to show/handle replies, a reaction picker, and image rendering. 
- **Backend API & WebSockets**: Will need new socket events (e.g., `add_reaction`, `add_reply`) and hydration adjustments in `getBoardState` to fetch nested replies and reactions when a board loads.
