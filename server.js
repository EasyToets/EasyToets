const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const db = new Database('data.db');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
db.exec(`
  CREATE TABLE IF NOT EXISTS decks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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

// Decks
app.get('/api/decks', (req, res) => {
  const decks = db.prepare(`
    SELECT d.*, COUNT(c.id) as card_count
    FROM decks d LEFT JOIN cards c ON c.deck_id = d.id
    GROUP BY d.id ORDER BY d.created_at DESC
  `).all();
  res.json(decks);
});

app.post('/api/decks', (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Naam is verplicht' });
  const result = db.prepare('INSERT INTO decks (name) VALUES (?)').run(name.trim());
  res.json({ id: result.lastInsertRowid, name: name.trim(), card_count: 0 });
});

app.delete('/api/decks/:id', (req, res) => {
  db.prepare('DELETE FROM decks WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Cards
app.get('/api/decks/:id/cards', (req, res) => {
  const cards = db.prepare('SELECT * FROM cards WHERE deck_id = ? ORDER BY id').all(req.params.id);
  res.json(cards);
});

app.post('/api/decks/:id/cards', (req, res) => {
  const { question, answer } = req.body;
  if (!question?.trim() || !answer?.trim()) return res.status(400).json({ error: 'Vraag en antwoord zijn verplicht' });
  const result = db.prepare('INSERT INTO cards (deck_id, question, answer) VALUES (?, ?, ?)').run(req.params.id, question.trim(), answer.trim());
  res.json({ id: result.lastInsertRowid, deck_id: Number(req.params.id), question: question.trim(), answer: answer.trim() });
});

app.put('/api/cards/:id', (req, res) => {
  const { question, answer } = req.body;
  db.prepare('UPDATE cards SET question = ?, answer = ? WHERE id = ?').run(question.trim(), answer.trim(), req.params.id);
  res.json({ ok: true });
});

app.delete('/api/cards/:id', (req, res) => {
  db.prepare('DELETE FROM cards WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Leersite draait op http://localhost:${PORT}`));
