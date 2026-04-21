const { dbAll, dbGet, dbRun } = require('./db/database');
const { v4: uuidv4 } = require('uuid');

// --- Board Handlers ---

async function createBoard(name) {
  const id = uuidv4();
  const now = new Date().toISOString();
  await dbRun('INSERT INTO boards (id, name, created_at) VALUES (?, ?, ?)', [id, name, now]);
  
  // Add default columns automatically
  await addColumn(id, 'Went Well');
  await addColumn(id, 'Needs Improvement');
  await addColumn(id, 'Action Items');
  
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

async function addColumn(boardId, title) {
  const id = uuidv4();
  const rows = await dbAll('SELECT MAX(position) as maxPos FROM columns WHERE board_id = ?', [boardId]);
  const position = (rows[0]?.maxPos ?? -1) + 1;
  await dbRun('INSERT INTO columns (id, board_id, title, position) VALUES (?, ?, ?, ?)', [id, boardId, title, position]);
  return dbGet('SELECT * FROM columns WHERE id = ?', [id]);
}

async function deleteColumn(columnId) {
  await dbRun('DELETE FROM columns WHERE id = ?', [columnId]);
}

// --- Card Handlers ---

async function addCard(columnId, content, author, imageUrl) {
  const id = uuidv4();
  const rows = await dbAll('SELECT MAX(position) as maxPos FROM cards WHERE column_id = ?', [columnId]);
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
  // Use INSERT OR REPLACE for SQLite upsert
  await dbRun('INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)', [key, value]);
  return { key, value };
}

module.exports = {
  createBoard, deleteBoard, listBoards,
  addColumn, deleteColumn,
  addCard, moveCard, deleteCard,
  addReply, deleteReply,
  addReaction, removeReaction,
  getBoardState,
  getAppSettings, updateAppSetting,
  createBoardGroup, deleteBoardGroup, listBoardGroups, moveBoardToGroup,
};
