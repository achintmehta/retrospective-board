const { Pool } = require('pg');

// Connection: prefer DATABASE_URL, fall back to discrete PG* vars
// e.g. DATABASE_URL=postgres://user:pass@host:5432/retroboard
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl:
          process.env.PGSSL === 'disable'
            ? false
            : { rejectUnauthorized: false }, // RDS default certs
      }
    : {
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432', 10),
        user: process.env.PGUSER || 'retro',
        password: process.env.PGPASSWORD || 'retro',
        database: process.env.PGDATABASE || 'retroboard',
        ssl: process.env.PGSSL === 'require' ? { rejectUnauthorized: false } : false,
      }
);

pool.on('error', (err) => {
  console.error('Unexpected Postgres pool error:', err.message);
});

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS boards (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS board_groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0
  )`,
  `ALTER TABLE boards ADD COLUMN IF NOT EXISTS group_id TEXT REFERENCES board_groups(id) ON DELETE SET NULL`,
  `ALTER TABLE boards ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'default'`,
  `ALTER TABLE columns ADD COLUMN IF NOT EXISTS color TEXT`,
  `CREATE TABLE IF NOT EXISTS columns (
    id TEXT PRIMARY KEY,
    board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS cards (
    id TEXT PRIMARY KEY,
    column_id TEXT NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author TEXT,
    image_url TEXT,
    position INTEGER NOT NULL DEFAULT 0
  )`,
  `ALTER TABLE cards ADD COLUMN IF NOT EXISTS image_url TEXT`,
  `CREATE TABLE IF NOT EXISTS reactions (
    id TEXT PRIMARY KEY,
    card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    UNIQUE(card_id, emoji)
  )`,
  `CREATE TABLE IF NOT EXISTS replies (
    id TEXT PRIMARY KEY,
    card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    author TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    board_id TEXT,
    event_type TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS mcp_subscriptions (
    id TEXT PRIMARY KEY,
    board_id TEXT NOT NULL,
    client_id TEXT NOT NULL,
    alert_type TEXT NOT NULL DEFAULT 'all',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(board_id, client_id)
  )`,
];

const ready = (async () => {
  for (const stmt of SCHEMA_STATEMENTS) {
    await pool.query(stmt);
  }
  console.log('Connected to PostgreSQL, schema ensured');
})().catch((err) => {
  console.error('Failed to initialize PostgreSQL schema:', err.message);
  process.exit(1);
});

// Convert SQLite-style `?` placeholders to Postgres `$1..$n`
// (skips ? inside single-quoted string literals)
function toPgParams(sql) {
  let i = 0;
  let inString = false;
  let out = '';
  for (const ch of sql) {
    if (ch === "'") inString = !inString;
    if (ch === '?' && !inString) {
      out += `$${++i}`;
    } else {
      out += ch;
    }
  }
  return out;
}

// Same API the rest of the app already uses
const dbRun = async (sql, params = []) => {
  await ready;
  const res = await pool.query(toPgParams(sql), params);
  return { lastID: undefined, changes: res.rowCount };
};

const dbAll = async (sql, params = []) => {
  await ready;
  const res = await pool.query(toPgParams(sql), params);
  return res.rows;
};

const dbGet = async (sql, params = []) => {
  await ready;
  const res = await pool.query(toPgParams(sql), params);
  return res.rows[0];
};

module.exports = { pool, ready, dbRun, dbAll, dbGet };
