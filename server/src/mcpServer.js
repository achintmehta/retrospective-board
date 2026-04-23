const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { SSEServerTransport } = require("@modelcontextprotocol/sdk/server/sse.js");
const {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");
const {
  createBoard, deleteBoard, listBoards,
  addColumn, deleteColumn,
  addCard, moveCard, deleteCard,
  addReply, deleteReply,
  addReaction, removeReaction,
  getBoardState,
  getAppSettings, updateAppSetting,
  createBoardGroup, deleteBoardGroup, listBoardGroups, moveBoardToGroup,
} = require('./boardHandlers');
const { boardToMarkdown } = require("./utils/markdownGenerator");
const sqlite3 = require("sqlite3");
const path = require("path");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "../data/retro.db");
const db = new sqlite3.Database(DB_PATH);

const dbAll = (query, params = []) => new Promise((resolve, reject) => {
  db.all(query, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

const mcpServer = new Server(
  {
    name: "retro-board-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

/**
 * Logic handlers for reuse across SSE and Stateless flows
 */
const handlers = {
  listResources: async () => {
    const boards = await dbAll("SELECT id, name FROM boards");
    const groups = await dbAll("SELECT id, name FROM board_groups");
    
    return {
      resources: [
        {
          uri: "retro://boards",
          name: "All Boards List",
          mimeType: "application/json",
          description: "A list of all retrospective boards in the system",
        },
        {
          uri: "retro://groups",
          name: "Workspace Groups",
          mimeType: "application/json",
          description: "All board groups with their assigned boards",
        },
        ...boards.flatMap(b => [
          {
            uri: `retro://boards/${b.id}/md`,
            name: `${b.name} (Markdown)`,
            mimeType: "text/markdown",
            description: `The contents of ${b.name} formatted as Markdown`,
          },
          {
            uri: `retro://boards/${b.id}/full`,
            name: `${b.name} (JSON)`,
            mimeType: "application/json",
            description: `The complete raw state of ${b.name}`,
          }
        ])
      ],
    };
  },

  listTools: async () => {
    return {
      tools: [
        {
          name: "list_workspace_contents",
          description: "[read-only] Get a paginated list of all board groups and their boards",
          inputSchema: {
            type: "object",
            properties: {
              page: { type: "number", default: 1 },
              pageSize: { type: "number", default: 10 },
            },
          },
        },
        {
          name: "create_new_retro_board",
          description: "Create a new retrospective board",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string" },
              groupId: { type: "string", description: "Optional group ID to add the board to" },
            },
            required: ["name"],
          },
        },
        {
          name: "delete_retro_board",
          description: "Delete a retrospective board",
          inputSchema: {
            type: "object",
            properties: {
              boardId: { type: "string" },
            },
            required: ["boardId"],
          },
        },
        {
          name: "create_board_group",
          description: "Create a new board group (folder/workspace)",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string" },
            },
            required: ["name"],
          },
        },
        {
          name: "delete_board_group",
          description: "Delete a board group",
          inputSchema: {
            type: "object",
            properties: {
              groupId: { type: "string" },
            },
            required: ["groupId"],
          },
        },
        {
          name: "move_board_to_group",
          description: "Move a board into or out of a group",
          inputSchema: {
            type: "object",
            properties: {
              boardId: { type: "string" },
              groupId: { type: "string", description: "Set to null to remove from group" },
            },
            required: ["boardId", "groupId"],
          },
        },
        {
          name: "add_feedback_card",
          description: "Add a new card to a board column",
          inputSchema: {
            type: "object",
            properties: {
              boardId: { type: "string" },
              columnId: { type: "string" },
              content: { type: "string" },
              author: { type: "string" },
            },
            required: ["boardId", "columnId", "content"],
          },
        },
        {
          name: "delete_card_from_board",
          description: "Delete a card by ID",
          inputSchema: {
            type: "object",
            properties: {
              boardId: { type: "string", description: "The board ID to broadcast the delete event to" },
              cardId: { type: "string" },
            },
            required: ["boardId", "cardId"],
          },
        },
        {
          name: "add_reaction_to_card",
          description: "Add an emoji reaction (like, etc.) to a card",
          inputSchema: {
            type: "object",
            properties: {
              boardId: { type: "string", description: "The board ID to broadcast the change to" },
              cardId: { type: "string" },
              emoji: { type: "string", description: "The emoji to add (e.g. 👍, ❤️)" },
            },
            required: ["boardId", "cardId", "emoji"],
          },
        },
        {
          name: "reply_to_card",
          description: "Add a threaded reply to a card",
          inputSchema: {
            type: "object",
            properties: {
              boardId: { type: "string", description: "The board ID to broadcast the change to" },
              cardId: { type: "string" },
              content: { type: "string" },
              author: { type: "string", description: "Optional author name" },
            },
            required: ["boardId", "cardId", "content"],
          },
        },
        {
          name: "generate_board_summary",
          description: "[read-only] Get a summarized view of a board in Markdown format",
          inputSchema: {
            type: "object",
            properties: {
              boardId: { type: "string" },
            },
            required: ["boardId"],
          },
        }
      ],
    };
  },

  callTool: async (name, args, io) => {
    if (name === "generate_board_summary") {
      const board = await getBoardState(args.boardId);
      const md = boardToMarkdown(board);
      return { content: [{ type: "text", text: md }] };
    }
    if (name === "list_workspace_contents") {
      const { page = 1, pageSize = 10 } = args;
      const offset = (page - 1) * pageSize;
      const groups = await dbAll("SELECT * FROM board_groups ORDER BY position ASC, name ASC LIMIT ? OFFSET ?", [pageSize, offset]);
      const boards = await dbAll("SELECT id, name, group_id FROM boards");
      const result = groups.map(g => ({ ...g, boards: boards.filter(b => b.group_id === g.id) }));
      const ungrouped = boards.filter(b => !b.group_id);
      return {
        content: [{ type: "text", text: JSON.stringify({ groups: result, ungroupedBoards: ungrouped, page, pageSize }, null, 2) }]
      };
    }
    // For mutating tools, we need to handle DB and IO
    if (name === "create_new_retro_board") {
      const board = await createBoard(args.name);
      if (args.groupId) await moveBoardToGroup(board.id, args.groupId);
      io.emit("board_created", board);
      return { content: [{ type: "text", text: `Board created: ${board.id}` }] };
    }
    if (name === "delete_retro_board") {
      await deleteBoard(args.boardId);
      io.emit("board_deleted", { boardId: args.boardId });
      return { content: [{ type: "text", text: `Board ${args.boardId} deleted` }] };
    }
    if (name === "create_board_group") {
      const group = await createBoardGroup(args.name);
      io.emit("group_created", group);
      return { content: [{ type: "text", text: `Group created: ${group.id}` }] };
    }
    if (name === "delete_board_group") {
      await deleteBoardGroup(args.groupId);
      io.emit("group_deleted", { groupId: args.groupId });
      return { content: [{ type: "text", text: `Group ${args.groupId} deleted` }] };
    }
    if (name === "move_board_to_group") {
      await moveBoardToGroup(args.boardId, args.groupId);
      io.emit("board_moved_to_group", { boardId: args.boardId, groupId: args.groupId });
      return { content: [{ type: "text", text: `Board ${args.boardId} moved to group ${args.groupId}` }] };
    }
    if (name === "add_feedback_card") {
      const card = await addCard(args.columnId, args.content, args.author, null);
      io.to(`board:${args.boardId}`).emit("card_added", card);
      return { content: [{ type: "text", text: `Card added successfully: ${card.id}` }] };
    }
    if (name === "delete_card_from_board") {
      await deleteCard(args.cardId);
      io.to(`board:${args.boardId}`).emit("card_deleted", { cardId: args.cardId });
      return { content: [{ type: "text", text: `Card ${args.cardId} deleted` }] };
    }
    if (name === "add_reaction_to_card") {
      const reaction = await addReaction(args.cardId, args.emoji);
      io.to(`board:${args.boardId}`).emit("reaction_added", { cardId: args.cardId, reaction });
      return { content: [{ type: "text", text: `Reaction ${args.emoji} added to card ${args.cardId}` }] };
    }
    if (name === "reply_to_card") {
      const reply = await addReply(args.cardId, args.content, args.author || "AI Assistant", null);
      io.to(`board:${args.boardId}`).emit("reply_added", { cardId: args.cardId, reply });
      return { content: [{ type: "text", text: `Reply added successfully: ${reply.id}` }] };
    }

    throw new Error(`Tool ${name} logic not implemented in direct handler`);
  },

  readResource: async (uri) => {
    if (uri === "retro://boards") {
      const boards = await dbAll("SELECT * FROM boards");
      return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(boards, null, 2) }] };
    }
    if (uri === "retro://groups") {
      const groups = await dbAll("SELECT * FROM board_groups ORDER BY position ASC, name ASC");
      const boards = await dbAll("SELECT id, name, group_id FROM boards");
      const result = groups.map(g => ({ ...g, boards: boards.filter(b => b.group_id === g.id) }));
      return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(result, null, 2) }] };
    }
    const boardMatch = uri.match(/^retro:\/\/boards\/([^\/]+)\/(md|full)$/);
    if (boardMatch) {
      const [_, boardId, format] = boardMatch;
      const board = await getBoardState(boardId);
      if (format === "md") {
        return { contents: [{ uri, mimeType: "text/markdown", text: boardToMarkdown(board) }] };
      }
      return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(board, null, 2) }] };
    }
    throw new Error(`Resource not found: ${uri}`);
  }
};

/**
 * Resources
 */
mcpServer.setRequestHandler(ListResourcesRequestSchema, handlers.listResources);

mcpServer.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  return handlers.readResource(request.params.uri);
});

/**
 * Tools
 */
mcpServer.setRequestHandler(ListToolsRequestSchema, handlers.listTools);

// We'll expose a function to register tool executors with access to the Socket.IO instance
function setupToolHandlers(io) {
  mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    return handlers.callTool(request.params.name, request.params.arguments, io);
  });
}

module.exports = { mcpServer, setupToolHandlers, handlers };
