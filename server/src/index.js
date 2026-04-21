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
      callback?.({ ok: true, board });
    } catch (err) {
      callback?.({ ok: false, error: err.message });
    }
  });

  socket.on('delete_board', async ({ boardId }, callback) => {
    try {
      await deleteBoard(boardId);
      io.emit('board_deleted', { boardId });
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
});
