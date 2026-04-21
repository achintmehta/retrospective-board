## 1. Database Updates

- [x] 1.1 Alter `cards` table to include an `image_url` column.
- [x] 1.2 Create the `reactions` table (id, card_id, emoji, count).
- [x] 1.3 Create the `replies` table (id, card_id, content, image_url, author, created_at).
- [x] 1.4 Update the `getBoardState` query in `database.js` to correctly fetch and nest reactions and replies into the cards objects.

## 2. File Upload Infrastructure

- [x] 2.1 Set up a multipart/form endpoint `POST /api/upload` in Express (e.g., using `multer`).
- [x] 2.2 Ensure uploaded files are saved to `server/data/uploads/` directory.
- [x] 2.3 Expose the `server/data/uploads/` path statically via Express so clients can load images at `/uploads/filename.ext`.

## 3. Backend Sockets & Handlers

- [x] 3.1 Implement generic DB handler functions for `addReply`, `deleteReply`, `addReaction`, and `removeReaction`.
- [x] 3.2 Add socket event listeners (`add_reply`, `delete_reply`, `add_reaction`, `remove_reaction`) in `index.js` passing the changes via DB then broadcasting to the room.
- [x] 3.3 Update the `addCard` handler to accept an `image_url` parameter and save it to the database.

## 4. Frontend Hook Enhancements

- [x] 4.1 Update the `useBoard` hook to provide functions like `addReply`, `deleteReply`, `toggleReaction`.
- [x] 4.2 Add socket listeners in `useBoard` specifically for modifying deeply nested replies and reactions for optimisitic updates across connected clients.

## 5. Frontend UI: Image Uploads

- [x] 5.1 Upgrade `AddCardForm` to include an image attachment button, hitting the new `POST /api/upload` before emitting the socket event.
- [x] 5.2 Update the `Card` component UI to render the `image_url` cleanly inside the card space.

## 6. Frontend UI: Reactions

- [x] 6.1 Create or import an Emoji Picker component to attach to cards.
- [x] 6.2 Render current reaction tallies on the bottom of the `Card`.
- [x] 6.3 Wire up clicking an existing reaction or picking a new one to the `toggleReaction` function.

## 7. Frontend UI: Threaded Replies

- [x] 7.1 Build a nested `CardReplies` list to render inside/below a `Card`.
- [x] 7.2 Provide a small inline input to write a reply (passing standard Username or Anonymous logic).
- [x] 7.3 Ensure replied images also render successfully in the reply section.
- [x] 7.4 Add delete buttons on replies.
