const { dbAll, dbGet, dbRun } = require('./db/database');
const { v4: uuidv4 } = require('uuid');

// --- Shared Constants ---

const VALID_THEMES = [
  'classic-dark', 'classic-light',
  'cyberpunk-dark', 'cyberpunk-light',
  'vaporwave-dark', 'vaporwave-light',
  'sunset-dark', 'sunset-light',
  'desert-dark', 'desert-light',
  'artnouveau-dark', 'artnouveau-light',
  'renaissance-dark', 'renaissance-light',
  'highcontrast-dark', 'highcontrast-light',
  'gruvbox-dark', 'gruvbox-light',
  'nord-dark', 'nord-light',
  'solarized-dark', 'solarized-light',
];

const DEFAULT_COLUMN_COLORS = {
  'classic-dark':       ['#22c55e', '#f59e0b', '#6366f1'],
  'classic-light':      ['#16a34a', '#d97706', '#4f46e5'],
  'cyberpunk-dark':     ['#00ffcc', '#ff00ff', '#00bfff'],
  'cyberpunk-light':    ['#00b4dc', '#e000a0', '#0070cc'],
  'vaporwave-dark':     ['#ff6ec7', '#b48eff', '#72efdd'],
  'vaporwave-light':    ['#d050c0', '#8040e0', '#40b8c0'],
  'sunset-dark':        ['#ff6b35', '#ff4477', '#ffaa00'],
  'sunset-light':       ['#e05020', '#c03060', '#d08000'],
  'desert-dark':        ['#e8a020', '#c06030', '#80a040'],
  'desert-light':       ['#c07810', '#a04820', '#608030'],
  'artnouveau-dark':    ['#8fbc5a', '#c8a96e', '#7da87b'],
  'artnouveau-light':   ['#5a8030', '#a07030', '#407850'],
  'renaissance-dark':   ['#c4862a', '#a63228', '#6b4c9a'],
  'renaissance-light':  ['#a06010', '#802010', '#503080'],
  'highcontrast-dark':  ['#ffff00', '#ff4444', '#44ffff'],
  'highcontrast-light': ['#0000cc', '#cc0000', '#007700'],
  'gruvbox-dark':       ['#98971a', '#d79921', '#458588'],
  'gruvbox-light':      ['#79740e', '#b57614', '#076678'],
  'nord-dark':          ['#a3be8c', '#ebcb8b', '#88c0d0'],
  'nord-light':         ['#4c7a3c', '#9a7a1c', '#2a6a88'],
  'solarized-dark':     ['#859900', '#b58900', '#268bd2'],
  'solarized-light':    ['#859900', '#b58900', '#268bd2'],
};

// --- Board Handlers ---

async function createBoard(name, theme = 'default') {
  const id = uuidv4();
  const now = new Date().toISOString();
  const validTheme = VALID_THEMES.includes(theme) ? theme : 'classic-dark';
  await dbRun('INSERT INTO boards (id, name, created_at, theme) VALUES (?, ?, ?, ?)', [id, name, now, validTheme]);

  const [c1, c2, c3] = DEFAULT_COLUMN_COLORS[validTheme] || DEFAULT_COLUMN_COLORS['classic-dark'];
  await addColumn(id, 'Went Well', c1);
  await addColumn(id, 'Needs Improvement', c2);
  await addColumn(id, 'Action Items', c3);

  return dbGet('SELECT * FROM boards WHERE id = ?', [id]);
}

async function deleteBoard(boardId) {
  await dbRun('DELETE FROM boards WHERE id = ?', [boardId]);
}

async function listBoards() {
  return dbAll('SELECT * FROM boards ORDER BY created_at DESC');
}

// --- Board Group Handlers ---

async function createBoardGroup(name) {
  const id = uuidv4();
  await dbRun('INSERT INTO board_groups (id, name) VALUES (?, ?)', [id, name]);
  return dbGet('SELECT * FROM board_groups WHERE id = ?', [id]);
}

async function deleteBoardGroup(groupId) {
  // Dissociate boards first (handled by ON DELETE SET NULL in migration but good to be explicit/safe)
  await dbRun('UPDATE boards SET group_id = NULL WHERE group_id = ?', [groupId]);
  await dbRun('DELETE FROM board_groups WHERE id = ?', [groupId]);
}

async function listBoardGroups() {
  return dbAll('SELECT * FROM board_groups ORDER BY position ASC, name ASC');
}

async function moveBoardToGroup(boardId, groupId) {
  await dbRun('UPDATE boards SET group_id = ? WHERE id = ?', [groupId, boardId]);
  return dbGet('SELECT * FROM boards WHERE id = ?', [boardId]);
}

// --- Column Handlers ---

async function addColumn(boardId, title, color = null) {
  const id = uuidv4();
  const rows = await dbAll('SELECT COALESCE(MAX(position), -1) as "maxPos" FROM columns WHERE board_id = ?', [boardId]);
  const position = (rows[0]?.maxPos ?? -1) + 1;
  const colorValue = color && color.trim() ? color.trim() : null;
  await dbRun('INSERT INTO columns (id, board_id, title, position, color) VALUES (?, ?, ?, ?, ?)', [id, boardId, title, position, colorValue]);
  return dbGet('SELECT * FROM columns WHERE id = ?', [id]);
}

async function deleteColumn(columnId) {
  await dbRun('DELETE FROM columns WHERE id = ?', [columnId]);
}

async function updateColumnColor(columnId, color) {
  const colorValue = color && color.trim() ? color.trim() : null;
  await dbRun('UPDATE columns SET color = ? WHERE id = ?', [colorValue, columnId]);
  return dbGet('SELECT * FROM columns WHERE id = ?', [columnId]);
}

async function renameColumn(columnId, title) {
  const trimmed = title && title.trim();
  if (!trimmed) return dbGet('SELECT * FROM columns WHERE id = ?', [columnId]);
  await dbRun('UPDATE columns SET title = ? WHERE id = ?', [trimmed, columnId]);
  return dbGet('SELECT * FROM columns WHERE id = ?', [columnId]);
}

async function updateBoardTheme(boardId, theme) {
  const validTheme = VALID_THEMES.includes(theme) ? theme : 'classic-dark';
  await dbRun('UPDATE boards SET theme = ? WHERE id = ?', [validTheme, boardId]);
  const palette = DEFAULT_COLUMN_COLORS[validTheme] || DEFAULT_COLUMN_COLORS['classic-dark'];
  const columns = await dbAll('SELECT id, position FROM columns WHERE board_id = ? ORDER BY position ASC', [boardId]);
  for (const col of columns) {
    const color = palette[col.position % 3];
    await dbRun('UPDATE columns SET color = ? WHERE id = ?', [color, col.id]);
  }
  return dbAll('SELECT * FROM columns WHERE board_id = ? ORDER BY position ASC', [boardId]);
}

// --- Card Handlers ---

async function addCard(columnId, content, author, imageUrl) {
  const id = uuidv4();
  const rows = await dbAll('SELECT COALESCE(MAX(position), -1) as "maxPos" FROM cards WHERE column_id = ?', [columnId]);
  const position = (rows[0]?.maxPos ?? -1) + 1;
  const authorValue = author && author.trim() ? author.trim() : null;
  const imageValue = imageUrl && imageUrl.trim() ? imageUrl.trim() : null;
  await dbRun('INSERT INTO cards (id, column_id, content, author, image_url, position) VALUES (?, ?, ?, ?, ?, ?)', [id, columnId, content, authorValue, imageValue, position]);
  return dbGet('SELECT * FROM cards WHERE id = ?', [id]);
}

async function moveCard(cardId, toColumnId, toPosition) {
  await dbRun('UPDATE cards SET column_id = ?, position = ? WHERE id = ?', [toColumnId, toPosition, cardId]);
  // Reorder remaining cards in destination column
  const cards = await dbAll('SELECT id FROM cards WHERE column_id = ? ORDER BY position ASC', [toColumnId]);
  for (let i = 0; i < cards.length; i++) {
    await dbRun('UPDATE cards SET position = ? WHERE id = ?', [i, cards[i].id]);
  }
}

async function deleteCard(cardId) {
  await dbRun('DELETE FROM cards WHERE id = ?', [cardId]);
}

// --- Reply Handlers ---

async function addReply(cardId, content, author, imageUrl) {
  const id = uuidv4();
  const authorValue = author && author.trim() ? author.trim() : null;
  const imageValue = imageUrl && imageUrl.trim() ? imageUrl.trim() : null;
  await dbRun('INSERT INTO replies (id, card_id, content, image_url, author) VALUES (?, ?, ?, ?, ?)', [id, cardId, content, imageValue, authorValue]);
  return dbGet('SELECT * FROM replies WHERE id = ?', [id]);
}

async function deleteReply(replyId) {
  await dbRun('DELETE FROM replies WHERE id = ?', [replyId]);
}

// --- Reaction Handlers ---

async function addReaction(cardId, emoji) {
  // Insert or update count
  const existing = await dbGet('SELECT id, count FROM reactions WHERE card_id = ? AND emoji = ?', [cardId, emoji]);
  if (existing) {
    await dbRun('UPDATE reactions SET count = count + 1 WHERE id = ?', [existing.id]);
    return dbGet('SELECT * FROM reactions WHERE id = ?', [existing.id]);
  } else {
    const id = uuidv4();
    await dbRun('INSERT INTO reactions (id, card_id, emoji, count) VALUES (?, ?, ?, 1)', [id, cardId, emoji]);
    return dbGet('SELECT * FROM reactions WHERE id = ?', [id]);
  }
}

async function removeReaction(cardId, emoji) {
  const existing = await dbGet('SELECT id, count FROM reactions WHERE card_id = ? AND emoji = ?', [cardId, emoji]);
  if (existing) {
    if (existing.count > 1) {
      await dbRun('UPDATE reactions SET count = count - 1 WHERE id = ?', [existing.id]);
    } else {
      await dbRun('DELETE FROM reactions WHERE id = ?', [existing.id]);
      return { id: existing.id, card_id: cardId, emoji, count: 0 }; // Return zeroed to help client
    }
    return dbGet('SELECT * FROM reactions WHERE id = ?', [existing.id]);
  }
  return null;
}

// --- Board State Hydration ---

async function getBoardState(boardId) {
  const board = await dbGet('SELECT * FROM boards WHERE id = ?', [boardId]);
  if (!board) return null;
  const columns = await dbAll('SELECT * FROM columns WHERE board_id = ? ORDER BY position ASC', [boardId]);
  const allCards = await dbAll(
    'SELECT cards.* FROM cards JOIN columns ON cards.column_id = columns.id WHERE columns.board_id = ? ORDER BY cards.position ASC',
    [boardId]
  );
  
  const allReactions = await dbAll(
    'SELECT reactions.* FROM reactions JOIN cards ON reactions.card_id = cards.id JOIN columns ON cards.column_id = columns.id WHERE columns.board_id = ?',
    [boardId]
  );
  
  const allReplies = await dbAll(
    'SELECT replies.* FROM replies JOIN cards ON replies.card_id = cards.id JOIN columns ON cards.column_id = columns.id WHERE columns.board_id = ? ORDER BY replies.created_at ASC',
    [boardId]
  );

  const cardsWithExtras = allCards.map(card => ({
    ...card,
    reactions: allReactions.filter(r => r.card_id === card.id),
    replies: allReplies.filter(r => r.card_id === card.id)
  }));

  const columnsWithCards = columns.map((col) => ({
    ...col,
    cards: cardsWithExtras.filter((c) => c.column_id === col.id),
  }));
  return { ...board, columns: columnsWithCards };
}

// --- App Settings Handlers ---

async function getAppSettings() {
  const rows = await dbAll('SELECT key, value FROM app_settings');
  // Convert array to key-value object
  return rows.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

async function updateAppSetting(key, value) {
  await dbRun('INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value', [key, value]);
  return { key, value };
}

// --- Notification & Subscription Handlers ---

async function createNotification(eventType, message, boardId = null) {
  const id = uuidv4();
  await dbRun('INSERT INTO notifications (id, board_id, event_type, message) VALUES (?, ?, ?, ?)', [id, boardId, eventType, message]);
  return dbGet('SELECT * FROM notifications WHERE id = ?', [id]);
}

async function getRecentNotifications(limit = 20, boardId = null) {
  let sql = 'SELECT * FROM notifications';
  const params = [];
  if (boardId) {
    sql += ' WHERE board_id = ? OR board_id IS NULL';
    params.push(boardId);
  }
  sql += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit);
  return dbAll(sql, params);
}

async function markNotificationAsRead(id) {
  await dbRun('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
  return dbGet('SELECT * FROM notifications WHERE id = ?', [id]);
}

async function subscribeToBoardAlerts(boardId, clientId, alertType = 'all') {
  const id = uuidv4();
  await dbRun('INSERT INTO mcp_subscriptions (id, board_id, client_id, alert_type) VALUES (?, ?, ?, ?) ON CONFLICT (board_id, client_id) DO UPDATE SET alert_type = EXCLUDED.alert_type', [id, boardId, clientId, alertType]);
  return dbGet('SELECT * FROM mcp_subscriptions WHERE board_id = ? AND client_id = ?', [boardId, clientId]);
}

module.exports = {
  createBoard, deleteBoard, listBoards,
  addColumn, deleteColumn, updateColumnColor, renameColumn, updateBoardTheme,
  addCard, moveCard, deleteCard,
  addReply, deleteReply,
  addReaction, removeReaction,
  getBoardState,
  getAppSettings, updateAppSetting,
  createBoardGroup, deleteBoardGroup, listBoardGroups, moveBoardToGroup,
  createNotification, getRecentNotifications, markNotificationAsRead, subscribeToBoardAlerts
};
