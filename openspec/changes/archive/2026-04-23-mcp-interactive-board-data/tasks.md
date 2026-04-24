# Tasks - Interactive MCP Board Data

## 1. Tool Implementation
- [x] 1.1 Add `get_board_details` to the `listTools` handler in `mcpServer.js`.
- [x] 1.2 Implement the `get_board_details` logic in the `callTool` handler.
- [x] 1.3 Ensure the response perfectly maps `id` to `cardId` and `column_id` to `columnId` as requested by the AI agent logic.

## 2. Refinement & Documentation
- [x] 2.1 Add the `[read-only]` tag to the tool description to satisfy Claude's UI badging.
- [x] 2.2 Verify that reactions and replies are properly nested within the card objects in the JSON response.

## 3. Verification
- [x] 3.1 Call `get_board_details` via an MCP client (Claude Desktop or CLI).
- [x] 3.2 Verify that the returned JSON contains valid IDs for a known board.
- [x] 3.3 Test the end-to-end flow: Use the IDs from the JSON response to call `add_reaction_to_card` and verify success.
