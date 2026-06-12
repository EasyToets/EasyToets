const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'easytoets-geheim-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS decks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL DEFAULT 0,
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS cards (
      id SERIAL PRIMARY KEY,
      deck_id INTEGER NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
      question TEXT NOT NULL,
      answer TEXT NOT NULL
    );
  `);
}
initDb().catch(console.error);

// ── Auth middleware ──────────────────────────────────────────
function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Niet ingelogd' });
  next();
}

// ── Auth routes ──────────────────────────────────────────────
app.get('/api/me', (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  res.json({ user: { id: req.session.userId, username: req.session.username } });
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username?.trim() || !password) return res.status(400).json({ error: 'Vul alle velden in' });
  if (username.trim().length < 3) return res.status(400).json({ error: 'Gebruikersnaam moet minimaal 3 tekens zijn' });
  if (password.length < 6) return res.status(400).json({ error: 'Wachtwoord moet minimaal 6 tekens zijn' });
  const existing = await pool.query('SELECT id FROM users WHERE LOWER(username) = LOWER($1)', [username.trim()]);
  if (existing.rows.length) return res.status(400).json({ error: 'Gebruikersnaam al in gebruik' });
  const hash = bcrypt.hashSync(password, 10);
  const result = await pool.query('INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id', [username.trim(), hash]);
  req.session.userId = result.rows[0].id;
  req.session.username = username.trim();
  res.json({ ok: true, username: username.trim() });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE LOWER(username) = LOWER($1)', [username?.trim() || '']);
  const user = result.rows[0];
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Gebruikersnaam of wachtwoord onjuist' });
  }
  req.session.userId = user.id;
  req.session.username = user.username;
  res.json({ ok: true, username: user.username });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

// ── Decks ────────────────────────────────────────────────────
app.get('/api/decks', requireAuth, async (req, res) => {
  const result = await pool.query(`
    SELECT d.*, COUNT(c.id)::int as card_count
    FROM decks d LEFT JOIN cards c ON c.deck_id = d.id
    WHERE d.user_id = $1
    GROUP BY d.id ORDER BY d.created_at DESC
  `, [req.session.userId]);
  res.json(result.rows);
});

app.post('/api/decks', requireAuth, async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Naam is verplicht' });
  const result = await pool.query('INSERT INTO decks (user_id, name) VALUES ($1, $2) RETURNING id', [req.session.userId, name.trim()]);
  res.json({ id: result.rows[0].id, name: name.trim(), card_count: 0 });
});

app.delete('/api/decks/:id', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM decks WHERE id = $1 AND user_id = $2', [req.params.id, req.session.userId]);
  res.json({ ok: true });
});

// ── Cards ────────────────────────────────────────────────────
app.get('/api/decks/:id/cards', requireAuth, async (req, res) => {
  const result = await pool.query('SELECT * FROM cards WHERE deck_id = $1 ORDER BY id', [req.params.id]);
  res.json(result.rows);
});

app.post('/api/decks/:id/cards', requireAuth, async (req, res) => {
  const { question, answer } = req.body;
  if (!question?.trim() || !answer?.trim()) return res.status(400).json({ error: 'Vraag en antwoord zijn verplicht' });
  const result = await pool.query('INSERT INTO cards (deck_id, question, answer) VALUES ($1, $2, $3) RETURNING id', [req.params.id, question.trim(), answer.trim()]);
  res.json({ id: result.rows[0].id, deck_id: Number(req.params.id), question: question.trim(), answer: answer.trim() });
});

app.put('/api/cards/:id', requireAuth, async (req, res) => {
  const { question, answer } = req.body;
  await pool.query('UPDATE cards SET question = $1, answer = $2 WHERE id = $3', [question.trim(), answer.trim(), req.params.id]);
  res.json({ ok: true });
});

app.delete('/api/cards/:id', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM cards WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Leersite draait op http://localhost:${PORT}`));
