const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const dbPath = path.join(process.cwd(), 'server/data/retro.db');
const db = new sqlite3.Database(dbPath);

const dbRun = (query, params = []) => new Promise((resolve, reject) => {
  db.run(query, params, function(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const dbAll = (query, params = []) => new Promise((resolve, reject) => {
  db.all(query, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

async function populate() {
  console.log('Cleaning existing data...');
  await dbRun('DELETE FROM replies');
  await dbRun('DELETE FROM reactions');
  await dbRun('DELETE FROM cards');
  await dbRun('DELETE FROM columns');
  await dbRun('DELETE FROM boards');
  await dbRun('DELETE FROM board_groups');

  console.log('Creating groups...');
  const groupActiveId = uuidv4();
  const groupArchiveId = uuidv4();
  await dbRun('INSERT INTO board_groups (id, name, position) VALUES (?, ?, ?)', [groupActiveId, 'Active Sprints', 0]);
  await dbRun('INSERT INTO board_groups (id, name, position) VALUES (?, ?, ?)', [groupArchiveId, 'Archived Retrospectives', 1]);

  const boards = [
    { name: 'Sprint 42 Retrospective', group: groupActiveId },
    { name: 'API Migration Planning', group: groupActiveId },
    { name: 'Q1 Strategy Review', group: groupArchiveId },
    { name: 'Onboarding Experience', group: groupArchiveId }
  ];

  for (const b of boards) {
    const boardId = uuidv4();
    const now = new Date().toISOString();
    await dbRun('INSERT INTO boards (id, name, group_id, created_at) VALUES (?, ?, ?, ?)', [boardId, b.name, b.group, now]);

    // Columns
    const col1Id = uuidv4();
    const col2Id = uuidv4();
    const col3Id = uuidv4();
    await dbRun('INSERT INTO columns (id, board_id, title, position) VALUES (?, ?, ?, ?)', [col1Id, boardId, 'What went well', 0]);
    await dbRun('INSERT INTO columns (id, board_id, title, position) VALUES (?, ?, ?, ?)', [col2Id, boardId, 'Needs Improvement', 1]);
    await dbRun('INSERT INTO columns (id, board_id, title, position) VALUES (?, ?, ?, ?)', [col3Id, boardId, 'Actions', 2]);

    if (b.name === 'Sprint 42 Retrospective') {
      // Add realistic cards and replies
      const card1Id = uuidv4();
      await dbRun('INSERT INTO cards (id, column_id, content, author, position) VALUES (?, ?, ?, ?, ?)', [
        card1Id, col1Id, 'New component library migration is 90% complete!', 'Agent Antigravity', 0
      ]);
      await dbRun('INSERT INTO reactions (id, card_id, emoji, count) VALUES (?, ?, ?, ?)', [uuidv4(), card1Id, '🚀', 3]);
      await dbRun('INSERT INTO replies (id, card_id, content, author) VALUES (?, ?, ?, ?)', [
        uuidv4(), card1Id, 'Major win! The developer experience is so much better now.', 'Achint'
      ]);

      const card2Id = uuidv4();
      await dbRun('INSERT INTO cards (id, column_id, content, author, position) VALUES (?, ?, ?, ?, ?)', [
        card2Id, col2Id, 'Daily standups are running over 15 minutes lately.', 'Agent Antigravity', 0
      ]);
      await dbRun('INSERT INTO replies (id, card_id, content, author) VALUES (?, ?, ?, ?)', [
        uuidv4(), card2Id, 'Agreed. We should set a timer or move deep-dives to after-hours.', 'Antigravity'
      ]);
      await dbRun('INSERT INTO replies (id, card_id, content, author) VALUES (?, ?, ?, ?)', [
        uuidv4(), card2Id, 'Let\'s try the "parking lot" method for off-topic items.', 'Achint'
      ]);

      await dbRun('INSERT INTO cards (id, column_id, content, author, position) VALUES (?, ?, ?, ?, ?)', [
        uuidv4(), col3Id, 'Implement 5-minute timer for standups.', 'Antigravity', 0
      ]);
    }
  }

  console.log('Population complete!');
  db.close();
}

populate().catch(console.error);
