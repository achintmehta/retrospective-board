# Proposal - Interactive MCP Board Data

## 1. Problem Statement
The current `generate_board_summary` tool returns a Markdown summary of the board. While this is great for human reading, it lacks the unique identifiers (`cardId`, `columnId`) required to use other tools like `add_reaction_to_card` or `reply_to_card`. This prevents AI agents from building rich, interactive interfaces where users can click a button to react or reply.

## 2. Proposed Solution
Implement a new MCP tool, `get_board_details`, that returns a strictly structured JSON representation of the board state. This response will explicitly include:
-   **cardId**: Allowing precise targeting for reactions and replies.
-   **columnId**: Enabling "Add card" actions to be correctly routed.
-   **metadata**: Detailed state of reactions and replies for each card.

## 3. Goals
-   Enable AI agents to build interactive UIs with "React" and "Reply" buttons.
-   Provide a machine-first alternative to the existing Markdown-first summaries.
-   Maintain 100% compatibility with the existing social interaction tools.

## 4. Scope
-   **New Tool**: `get_board_details` added to the MCP server.
-   **Enhancement**: Update `mcpServer.js` to handle this new tool and format the response according to the interactive-friendly schema.
-   **Discovery**: Ensure the new tool is advertised with clear documentation on how to use its IDs.
