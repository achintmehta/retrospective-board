# Design - Interactive MCP Board Data

## 1. Architecture
The `get_board_details` tool will serve as a structured data provider, sitting alongside the existing `generate_board_summary`. While the latter optimizes for user readability, this new tool optimizes for system interactivity.

## 2. Implementation Details

### A. New Tool Definition
In `mcpServer.js`, we will register:
- **Name**: `get_board_details`
- **Description**: "[read-only] Get the full board state in a structured JSON format including all card and column IDs."
- **Inputs**: `boardId` (string)

### B. Data Mapping
We will reuse the existing `getBoardState` logic from `boardHandlers.js`. The tool handler will transform the internal DB structure into the following public-facing schema:

```typescript
interface BoardDetails {
  id: string;
  name: string;
  columns: {
    id: string;
    name: string;
    cards: {
      id: string;
      content: string;
      author: string;
      reactions: { emoji: string; count: number }[];
      replies: { author: string; content: string; createdAt: string }[];
    }[];
  }[];
}
```

### C. Response Strategy
To avoid confusing LLMs that prefer plain text, we will return the JSON stringified within a standard MCP `text` block. However, we will clearly label it so that advanced agents (like Claude) can parse it for UI rendering.

## 3. Tool Synergies
- **`add_reaction_to_card`**: Will now have direct access to the `cardId`.
- **`reply_to_card`**: Will now have direct access to the `cardId`.
- **`add_feedback_card`**: Will now have direct access to valid `columnId` values directly from the board state.
