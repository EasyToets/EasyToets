const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');

const app = express();
const DB_PATH = process.env.DATABASE_PATH || 'data.db';
const db = new Database(DB_PATH);

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'easytoets-geheim-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS decks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL DEFAULT 0,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deck_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
  );
`);

// Voeg user_id kolom toe als die nog niet bestaat (migratie)
try { db.exec('ALTER TABLE decks ADD COLUMN user_id INTEGER NOT NULL DEFAULT 0'); } catch {}

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

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username?.trim() || !password) return res.status(400).json({ error: 'Vul alle velden in' });
  if (username.trim().length < 3) return res.status(400).json({ error: 'Gebruikersnaam moet minimaal 3 tekens zijn' });
  if (password.length < 6) return res.status(400).json({ error: 'Wachtwoord moet minimaal 6 tekens zijn' });
  const existing = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?)').get(username.trim());
  if (existing) return res.status(400).json({ error: 'Gebruikersnaam al in gebruik' });
  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username.trim(), hash);
  req.session.userId = result.lastInsertRowid;
  req.session.username = username.trim();
  res.json({ ok: true, username: username.trim() });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE LOWER(username) = LOWER(?)').get(username?.trim() || '');
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
app.get('/api/decks', requireAuth, (req, res) => {
  const decks = db.prepare(`
    SELECT d.*, COUNT(c.id) as card_count
    FROM decks d LEFT JOIN cards c ON c.deck_id = d.id
    WHERE d.user_id = ?
    GROUP BY d.id ORDER BY d.created_at DESC
  `).all(req.session.userId);
  res.json(decks);
});

app.post('/api/decks', requireAuth, (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Naam is verplicht' });
  const result = db.prepare('INSERT INTO decks (user_id, name) VALUES (?, ?)').run(req.session.userId, name.trim());
  res.json({ id: result.lastInsertRowid, name: name.trim(), card_count: 0 });
});

app.delete('/api/decks/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM decks WHERE id = ? AND user_id = ?').run(req.params.id, req.session.userId);
  res.json({ ok: true });
});

// ── Cards ────────────────────────────────────────────────────
app.get('/api/decks/:id/cards', requireAuth, (req, res) => {
  const cards = db.prepare('SELECT * FROM cards WHERE deck_id = ? ORDER BY id').all(req.params.id);
  res.json(cards);
});

app.post('/api/decks/:id/cards', requireAuth, (req, res) => {
  const { question, answer } = req.body;
  if (!question?.trim() || !answer?.trim()) return res.status(400).json({ error: 'Vraag en antwoord zijn verplicht' });
  const result = db.prepare('INSERT INTO cards (deck_id, question, answer) VALUES (?, ?, ?)').run(req.params.id, question.trim(), answer.trim());
  res.json({ id: result.lastInsertRowid, deck_id: Number(req.params.id), question: question.trim(), answer: answer.trim() });
});

app.put('/api/cards/:id', requireAuth, (req, res) => {
  const { question, answer } = req.body;
  db.prepare('UPDATE cards SET question = ?, answer = ? WHERE id = ?').run(question.trim(), answer.trim(), req.params.id);
  res.json({ ok: true });
});

app.delete('/api/cards/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM cards WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Leersite draait op http://localhost:${PORT}`));
