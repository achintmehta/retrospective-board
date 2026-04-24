const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

// Load DB (triggers table creation)
require('./db/database');

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

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || '*';

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// ─── Logging Middleware ───────────────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} [${req.method}] ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});




// ─── REST: Hydration & board list ─────────────────────────────────────────────

app.get('/api/boards', async (req, res) => {
  try {
    const boards = await listBoards();
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/groups', async (req, res) => {
  try {
    const groups = await listBoardGroups();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/boards/:boardId', async (req, res) => {
  try {
    const state = await getBoardState(req.params.boardId);
    if (!state) return res.status(404).json({ error: 'Board not found' });
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const settings = await getAppSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const updates = req.body;
    const currentSettings = await getAppSettings();

    for (const [key, value] of Object.entries(updates)) {
      // If we are updating the icon value and it's an image, clean up the old one
      if (key === 'app_icon_value' && currentSettings.app_icon_value !== value) {
        const oldVal = currentSettings.app_icon_value;
        if (oldVal && oldVal.startsWith('/uploads/')) {
          const filename = oldVal.replace('/uploads/', '');
          const filePath = path.join(UPLOADS_DIR, filename);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
              console.log(`Cleaned up old logo: ${filename}`);
            } catch (err) {
              console.error(`Failed to delete old logo file: ${filePath}`, err);
            }
          }
        }
      }
      await updateAppSetting(key, value);
    }
    const settings = await getAppSettings();
    io.emit('settings_updated', settings);
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── File Uploads ─────────────────────────────────────────────────────────────
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const UPLOADS_DIR = process.env.DATA_DIR ? path.join(process.env.DATA_DIR, 'uploads') : path.join(__dirname, '../../data/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const uploadParams = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

app.post('/api/upload', uploadParams.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.use('/uploads', express.static(UPLOADS_DIR));

// ─── MCP Integration ──────────────────────────────────────────────────────────
const { SSEServerTransport } = require("@modelcontextprotocol/sdk/server/sse.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { mcpServer, setupToolHandlers, handlers, notifySubscribers, notifyResourceListChanged } = require("./mcpServer");
const { ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, CallToolRequestSchema } = require("@modelcontextprotocol/sdk/types.js");

setupToolHandlers(io);

// Store active transports to route post messages correctly
const transports = new Map();

app.get("/mcp", async (req, res) => {
  const transport = new SSEServerTransport("/mcp", res);
  await mcpServer.connect(transport);
  
  const sessionId = transport.sessionId;
  transports.set(sessionId, transport);
  
  console.log(`MCP client connected. Session: ${sessionId}`);
  
  res.on("close", () => {
    transports.delete(sessionId);
    console.log(`MCP client disconnected. Session: ${sessionId}`);
  });
});

app.post("/mcp", async (req, res) => {
  const sessionId = req.query.sessionId;
  
  if (!sessionId) {
    // Direct JSON-RPC handling for clients like Claude Code
    console.log("Processing direct MCP JSON-RPC message...");
    try {
      // For one-off HTTP POSTs, we'll use the server's message processing logic
      // but without the stateful 'connect' call.
      // We'll manually handle the initialize/discovery methods for now
      // as they are the most common stateless requests.
      if (req.body.method === 'initialize') {
        return res.json({
          jsonrpc: "2.0",
          id: req.body.id,
          result: {
            protocolVersion: "2025-11-25",
            capabilities: {
              resources: { subscribe: true, listChanged: true },
              tools: { listChanged: true }
            },
            serverInfo: { name: "retro-board-server", version: "1.0.0" }
          }
        });
      }


      if (req.body.method === 'notifications/initialized') {
        return res.status(200).end();
      }

      if (req.body.method === 'tools/list') {
        const result = await handlers.listTools();
        return res.json({ jsonrpc: "2.0", id: req.body.id, result });
      }

      if (req.body.method === 'resources/list') {
        const result = await handlers.listResources();
        return res.json({ jsonrpc: "2.0", id: req.body.id, result });
      }

      if (req.body.method === 'tools/call') {
        const result = await handlers.callTool(req.body.params.name, req.body.params.arguments, io);
        return res.json({ jsonrpc: "2.0", id: req.body.id, result });
      }

      if (req.body.method === 'resources/read') {
        const result = await handlers.readResource(req.body.params.uri);
        return res.json({ jsonrpc: "2.0", id: req.body.id, result });
      }

      // Fallback for other methods
      console.log("Stateless request for method:", req.body.method);
      return res.status(400).json({
        jsonrpc: "2.0",
        id: req.body.id,
        error: { code: -32601, message: `Method ${req.body.method} not supported in stateless mode` }
      });

    } catch (err) {
      console.error("Direct MCP POST failed:", err);
      if (!res.headersSent) {
        res.status(500).json({ jsonrpc: "2.0", id: req.body.id, error: { code: -32603, message: "Internal error" } });
      }
      return;
    }
  }


  const transport = transports.get(sessionId);
  if (!transport) {
    return res.status(404).send(`Session not found: ${sessionId}`);
  }
  await transport.handlePostMessage(req, res);
});


// Also keep /mcp/messages just in case
app.post("/mcp/messages", async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports.get(sessionId);
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(404).send(`Session not found: ${sessionId}`);
  }
});


// ─── Static files (production) ────────────────────────────────────────────────

const CLIENT_BUILD = path.join(__dirname, '../../client/dist');
app.use(express.static(CLIENT_BUILD));
app.get('*', (req, res) => {
  res.sendFile(path.join(CLIENT_BUILD, 'index.html'));
});

// ─── Socket.IO ────────────────────────────────────────────────────────────────

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Join a board room on connect
  socket.on('join_board', (boardId) => {
    socket.join(`board:${boardId}`);
    console.log(`${socket.id} joined board:${boardId}`);
  });

  socket.on('leave_board', (boardId) => {
    socket.leave(`board:${boardId}`);
  });

  // ── Boards ──────────────────────────────────────────────────────────────────

  socket.on('create_board', async ({ name }, callback) => {
    try {
      const board = await createBoard(name || 'Untitled Retro');
      io.emit('board_created', board);
      notifyResourceListChanged();
      callback?.({ ok: true, board });
    } catch (err) {
      callback?.({ ok: false, error: err.message });
    }
  });

  socket.on('delete_board', async ({ boardId }, callback) => {
    try {
      await deleteBoard(boardId);
      io.emit('board_deleted', { boardId });
      notifyResourceListChanged();
      callback?.({ ok: true });
    } catch (err) {
      callback?.({ ok: false, error: err.message });
    }
  });

  // ── Groups ──────────────────────────────────────────────────────────────────

  socket.on('create_group', async ({ name }, callback) => {
    try {
      const group = await createBoardGroup(name);
      io.emit('group_created', group);
      callback?.({ ok: true, group });
    } catch (err) {
      callback?.({ ok: false, error: err.message });
    }
  });

  socket.on('delete_group', async ({ groupId }, callback) => {
    try {
      await deleteBoardGroup(groupId);
      io.emit('group_deleted', { groupId });
      callback?.({ ok: true });
    } catch (err) {
      callback?.({ ok: false, error: err.message });
    }
  });

  socket.on('move_board_to_group', async ({ boardId, groupId }, callback) => {
    try {
      const board = await moveBoardToGroup(boardId, groupId);
      io.emit('board_moved_to_group', { boardId, groupId });
      callback?.({ ok: true, board });
    } catch (err) {
      callback?.({ ok: false, error: err.message });
    }
  });

  // ── Columns ─────────────────────────────────────────────────────────────────

  socket.on('add_column', async ({ boardId, title }, callback) => {
    try {
      const column = await addColumn(boardId, title || 'New Column');
      io.to(`board:${boardId}`).emit('column_added', column);
      callback?.({ ok: true, column });
    } catch (err) {
      callback?.({ ok: false, error: err.message });
    }
  });

  socket.on('delete_column', async ({ boardId, columnId }, callback) => {
    try {
      await deleteColumn(columnId);
      io.to(`board:${boardId}`).emit('column_deleted', { columnId });
      callback?.({ ok: true });
    } catch (err) {
      callback?.({ ok: false, error: err.message });
    }
  });

  // ── Cards ───────────────────────────────────────────────────────────────────

  socket.on('add_card', async ({ boardId, columnId, content, author, imageUrl }, callback) => {
    try {
      const card = await addCard(columnId, content, author, imageUrl);
      io.to(`board:${boardId}`).emit('card_added', card);
      notifySubscribers(`retro://boards/${boardId}/md`);
      notifySubscribers(`retro://boards/${boardId}/full`);
      callback?.({ ok: true, card });
    } catch (err) {
      callback?.({ ok: false, error: err.message });
    }
  });

  socket.on('move_card', async ({ boardId, cardId, toColumnId, toPosition }, callback) => {
    try {
      await moveCard(cardId, toColumnId, toPosition);
      const state = await getBoardState(boardId);
      io.to(`board:${boardId}`).emit('board_state', state);
      callback?.({ ok: true });
    } catch (err) {
      callback?.({ ok: false, error: err.message });
    }
  });

  socket.on('delete_card', async ({ boardId, cardId }, callback) => {
    try {
      await deleteCard(cardId);
      io.to(`board:${boardId}`).emit('card_deleted', { cardId });
      notifySubscribers(`retro://boards/${boardId}/md`);
      notifySubscribers(`retro://boards/${boardId}/full`);
      callback?.({ ok: true });
    } catch (err) {
      callback?.({ ok: false, error: err.message });
    }
  });

  // ── Replies ─────────────────────────────────────────────────────────────────

  socket.on('add_reply', async ({ boardId, cardId, content, author, imageUrl }, callback) => {
    try {
      const reply = await addReply(cardId, content, author, imageUrl);
      io.to(`board:${boardId}`).emit('reply_added', reply);
      notifySubscribers(`retro://boards/${boardId}/md`);
      notifySubscribers(`retro://boards/${boardId}/full`);
      callback?.({ ok: true, reply });
    } catch (err) {
      callback?.({ ok: false, error: err.message });
    }
  });

  socket.on('delete_reply', async ({ boardId, cardId, replyId }, callback) => {
    try {
      await deleteReply(replyId);
      io.to(`board:${boardId}`).emit('reply_deleted', { cardId, replyId });
      callback?.({ ok: true });
    } catch (err) {
      callback?.({ ok: false, error: err.message });
    }
  });

  // ── Reactions ───────────────────────────────────────────────────────────────

  socket.on('add_reaction', async ({ boardId, cardId, emoji }, callback) => {
    try {
      const reaction = await addReaction(cardId, emoji);
      io.to(`board:${boardId}`).emit('reaction_added', reaction);
      notifySubscribers(`retro://boards/${boardId}/md`);
      notifySubscribers(`retro://boards/${boardId}/full`);
      callback?.({ ok: true, reaction });
    } catch (err) {
      callback?.({ ok: false, error: err.message });
    }
  });

  socket.on('remove_reaction', async ({ boardId, cardId, emoji }, callback) => {
    try {
      const reaction = await removeReaction(cardId, emoji);
      // reaction might be null or {count: 0} if it was fully deleted
      if (reaction) {
        io.to(`board:${boardId}`).emit('reaction_updated', reaction);
      }
      callback?.({ ok: true, reaction });
    } catch (err) {
      callback?.({ ok: false, error: err.message });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// ─── Start ───────────────────────────────────────────────────────────────────

const PORT = parseInt(process.env.PORT || '3001', 10);

server.listen(PORT, () => {
  console.log(`Retro board server listening on port ${PORT}`);
  
  // Also start Stdio transport if requested (common for CLI tools like Claude Code)
  if (process.env.MCP_STDIO === 'true' || process.argv.includes('--stdio')) {
    const stdioTransport = new StdioServerTransport();
    mcpServer.connect(stdioTransport).catch(err => {
      console.error("Failed to connect Stdio transport:", err);
    });
    console.log("MCP Stdio transport active");
  }
});
