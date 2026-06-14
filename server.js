const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const officeParser = require('officeparser');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

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
app.get('/share/:token', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Database setup
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS study_plans (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      deck_id INTEGER NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
      exam_date TEXT NOT NULL,
      plan_json TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, deck_id)
    );
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      streak INTEGER NOT NULL DEFAULT 0,
      last_login_date TEXT
    );
    ALTER TABLE users ADD COLUMN IF NOT EXISTS streak INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_date TEXT;
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
    CREATE TABLE IF NOT EXISTS card_reviews (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
      ease REAL NOT NULL DEFAULT 2.5,
      interval_days INTEGER NOT NULL DEFAULT 1,
      next_review DATE NOT NULL DEFAULT CURRENT_DATE,
      reps INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, card_id)
    );
    CREATE TABLE IF NOT EXISTS quiz_stats (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      deck_id INTEGER,
      deck_name TEXT,
      correct INTEGER NOT NULL,
      total INTEGER NOT NULL,
      pct INTEGER NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE decks ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT FALSE;
    ALTER TABLE decks ADD COLUMN IF NOT EXISTS share_token TEXT;
  `);
}
initDb().catch(console.error);

// ── Auth middleware ──────────────────────────────────────────
function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Niet ingelogd' });
  next();
}

// ── Auth routes ──────────────────────────────────────────────
async function checkinStreak(userId) {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const r = await pool.query('SELECT streak, last_login_date FROM users WHERE id=$1', [userId]);
  const { streak, last_login_date } = r.rows[0];
  if (last_login_date === today) return streak;
  const newStreak = last_login_date === yesterday ? (streak || 0) + 1 : 1;
  await pool.query('UPDATE users SET streak=$1, last_login_date=$2 WHERE id=$3', [newStreak, today, userId]);
  return newStreak;
}

app.get('/api/me', async (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  const streak = await checkinStreak(req.session.userId);
  res.json({ user: { id: req.session.userId, username: req.session.username, streak } });
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username?.trim() || !password) return res.status(400).json({ error: 'Vul alle velden in' });
    if (username.trim().length < 3) return res.status(400).json({ error: 'Gebruikersnaam moet minimaal 3 tekens zijn' });
    if (username.includes('@')) return res.status(400).json({ error: 'Gebruik geen emailadres als gebruikersnaam — kies een bijnaam.' });
    if (password.length < 6) return res.status(400).json({ error: 'Wachtwoord moet minimaal 6 tekens zijn' });
    const existing = await pool.query('SELECT id FROM users WHERE LOWER(username) = LOWER($1)', [username.trim()]);
    if (existing.rows.length) return res.status(400).json({ error: 'Gebruikersnaam al in gebruik' });
    const hash = bcrypt.hashSync(password, 10);
    const result = await pool.query('INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id', [username.trim(), hash]);
    req.session.userId = result.rows[0].id;
    req.session.username = username.trim();
    res.json({ ok: true, username: username.trim() });
  } catch (e) {
    console.error('register error:', e.message);
    res.status(500).json({ error: 'Serverfout: ' + e.message });
  }
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
  const streak = await checkinStreak(user.id);
  res.json({ ok: true, username: user.username, streak });
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

app.post('/api/decks/:id/cards/bulk', requireAuth, async (req, res) => {
  const { cards } = req.body;
  if (!Array.isArray(cards) || cards.length === 0) return res.status(400).json({ error: 'Geen kaartjes' });
  const values = cards.flatMap(c => [req.params.id, c.question.trim(), c.answer.trim()]);
  const placeholders = cards.map((_, i) => `($${i*3+1}, $${i*3+2}, $${i*3+3})`).join(', ');
  await pool.query(`INSERT INTO cards (deck_id, question, answer) VALUES ${placeholders}`, values);
  res.json({ ok: true, count: cards.length });
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

// ── AI Flashcard Generator ───────────────────────────────────
app.post('/api/generate-cards', requireAuth, async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'Geen tekst meegegeven' });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'AI niet geconfigureerd' });
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Maak flashcards van de volgende tekst. Geef alleen een JSON array terug, geen uitleg. Formaat: [{"question":"...","answer":"..."}]. Maximaal 15 kaartjes, focus op de belangrijkste begrippen.\n\nTekst:\n${text.trim()}`
        }]
      })
    });
    const data = await response.json();
    const raw = data.content?.[0]?.text || '';
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) return res.status(500).json({ error: 'AI gaf geen geldige kaartjes terug' });
    const cards = JSON.parse(match[0]);
    res.json({ cards });
  } catch (e) {
    console.error('generate-cards error:', e.message);
    res.status(500).json({ error: 'AI fout: ' + e.message });
  }
});

// ── AI: Bestand uploaden & verwerken ─────────────────────────
app.post('/api/process-file', requireAuth, upload.single('file'), async (req, res) => {
  const { action } = req.body; // 'flashcards' of 'summary'
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Geen bestand meegegeven' });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'AI niet geconfigureerd' });

  try {
    // Tekst extraheren uit bestand
    let text = '';
    const mime = file.mimetype;
    if (mime === 'application/pdf') {
      const parsed = await pdfParse(file.buffer);
      text = parsed.text;
    } else if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value;
    } else if (mime === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      text = await new Promise((resolve, reject) => {
        officeParser.parseOfficeAsync(file.buffer, { outputErrorToConsole: false })
          .then(resolve).catch(reject);
      });
    } else if (mime.startsWith('text/')) {
      text = file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({ error: 'Bestandstype niet ondersteund. Gebruik PDF, Word, PowerPoint of tekst.' });
    }

    if (!text.trim()) return res.status(400).json({ error: 'Geen tekst gevonden in bestand' });
    if (text.length > 20000) text = text.slice(0, 20000);

    let prompt, responseKey;
    if (action === 'flashcards') {
      prompt = `Maak flashcards van de volgende tekst. Geef alleen een JSON array terug, geen uitleg. Formaat: [{"question":"...","answer":"..."}]. Maximaal 20 kaartjes, focus op de belangrijkste begrippen.\n\nTekst:\n${text}`;
      responseKey = 'cards';
    } else {
      prompt = `Maak een duidelijke samenvatting van de volgende tekst voor een scholier. Gebruik kopjes en bullet points. Max 300 woorden.\n\nTekst:\n${text}`;
      responseKey = 'summary';
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 2048, messages: [{ role: 'user', content: prompt }] })
    });
    const data = await response.json();
    const raw = data.content?.[0]?.text || '';

    if (action === 'flashcards') {
      const match = raw.match(/\[[\s\S]*\]/);
      if (!match) return res.status(500).json({ error: 'AI gaf geen geldige kaartjes terug' });
      return res.json({ cards: JSON.parse(match[0]) });
    } else {
      return res.json({ summary: raw });
    }
  } catch(e) {
    console.error('process-file error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ── AI: Uitleg per kaartje ───────────────────────────────────
app.post('/api/explain-card', requireAuth, async (req, res) => {
  const { question, answer, deckCards } = req.body;
  if (!question || !answer) return res.status(400).json({ error: 'Geen kaartje meegegeven' });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'AI niet geconfigureerd' });
  try {
    const context = deckCards?.length
      ? `\n\nAndere begrippen uit dit deck: ${deckCards.slice(0,10).map(c => c.question).join(', ')}`
      : '';
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        messages: [{ role: 'user', content: `Leg het volgende begrip duidelijk uit voor een scholier. Geef een heldere uitleg van 3-5 zinnen, gebruik eventueel een voorbeeld.\n\nBegrip: ${question}\nAntwoord: ${answer}${context}` }]
      })
    });
    const data = await response.json();
    res.json({ explanation: data.content?.[0]?.text || 'Geen uitleg beschikbaar' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ── AI: Hint tijdens oefenen ─────────────────────────────────
app.post('/api/hint-card', requireAuth, async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) return res.status(400).json({ error: 'Geen kaartje meegegeven' });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'AI niet geconfigureerd' });
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        messages: [{ role: 'user', content: `Geef een hint voor dit flashcard zonder het antwoord te verklappen. De hint moet de leerling in de goede richting sturen.\n\nVraag: ${question}\nAntwoord (niet verklappen): ${answer}\n\nGeef alleen de hint, geen uitleg eromheen.` }]
      })
    });
    const data = await response.json();
    res.json({ hint: data.content?.[0]?.text || 'Geen hint beschikbaar' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ── AI: Studieplan ───────────────────────────────────────────
app.post('/api/study-plan', requireAuth, async (req, res) => {
  const { examDate, deckName, cardCount } = req.body;
  if (!examDate || !cardCount) return res.status(400).json({ error: 'Ontbrekende gegevens' });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'AI niet geconfigureerd' });
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        messages: [{ role: 'user', content: `Maak een studieplan als JSON array. Vandaag: ${today}, toets: ${examDate}, deck: "${deckName}", ${cardCount} kaartjes.\n\nGeef alleen een JSON array terug, geen tekst eromheen. Formaat:\n[{"date":"YYYY-MM-DD","day":"Ma 9 jun","activity":"Eerste kennismaking","tip":"Lees alle kaartjes rustig door","cards":10}]\n\nMax 7 dagen, verspreid tot de toetsdatum. Activiteiten: Eerste kennismaking / Herhaling / Intensief oefenen / Toets simulatie / Laatste herhaling. Tips moeten kort en motiverend zijn (max 8 woorden).` }]
      })
    });
    const data = await response.json();
    const raw = data.content?.[0]?.text || '[]';
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) return res.status(500).json({ error: 'AI gaf geen geldig plan terug' });
    const days = JSON.parse(match[0]);
    await pool.query(
      `INSERT INTO study_plans (user_id, deck_id, exam_date, plan_json)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, deck_id) DO UPDATE SET exam_date=$3, plan_json=$4, created_at=NOW()`,
      [req.session.userId, req.body.deckId, examDate, JSON.stringify(days)]
    );
    res.json({ days });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/study-plans', requireAuth, async (req, res) => {
  const result = await pool.query(
    `SELECT sp.*, d.name as deck_name FROM study_plans sp
     JOIN decks d ON d.id = sp.deck_id
     WHERE sp.user_id = $1 ORDER BY sp.created_at DESC`,
    [req.session.userId]
  );
  res.json(result.rows.map(r => ({
    deckId: r.deck_id, deckName: r.deck_name,
    examDate: r.exam_date, days: JSON.parse(r.plan_json), createdAt: r.created_at
  })));
});

app.delete('/api/decks/:id/study-plan', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM study_plans WHERE user_id=$1 AND deck_id=$2', [req.session.userId, req.params.id]);
  res.json({ ok: true });
});

app.get('/api/decks/:id/study-plan', requireAuth, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM study_plans WHERE user_id=$1 AND deck_id=$2',
    [req.session.userId, req.params.id]
  );
  if (!result.rows.length) return res.json({ plan: null });
  const row = result.rows[0];
  res.json({ plan: { examDate: row.exam_date, days: JSON.parse(row.plan_json), createdAt: row.created_at } });
});

// ── Admin stats ──────────────────────────────────────────────
app.get('/api/admin/stats', async (req, res) => {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey || req.headers['x-admin-key'] !== adminKey) {
    return res.status(401).json({ error: 'Geen toegang' });
  }
  const users = await pool.query('SELECT COUNT(*)::int as total, MIN(created_at) as eerste, MAX(created_at) as laatste FROM users');
  const recent = await pool.query('SELECT username, created_at FROM users ORDER BY created_at DESC LIMIT 10');
  const decks = await pool.query('SELECT COUNT(*)::int as total FROM decks');
  const cards = await pool.query('SELECT COUNT(*)::int as total FROM cards');
  res.json({
    gebruikers: users.rows[0].total,
    eerste_registratie: users.rows[0].eerste,
    laatste_registratie: users.rows[0].laatste,
    decks: decks.rows[0].total,
    kaartjes: cards.rows[0].total,
    recente_gebruikers: recent.rows
  });
});

// ── Spaced repetition ────────────────────────────────────────
app.post('/api/cards/:id/review', requireAuth, async (req, res) => {
  const { correct } = req.body; // true/false
  const cardId = parseInt(req.params.id);
  const userId = req.session.userId;
  const r = await pool.query('SELECT * FROM card_reviews WHERE user_id=$1 AND card_id=$2', [userId, cardId]);
  let { ease = 2.5, interval_days = 1, reps = 0 } = r.rows[0] || {};
  if (correct) {
    reps++;
    if (reps === 1) interval_days = 1;
    else if (reps === 2) interval_days = 3;
    else interval_days = Math.round(interval_days * ease);
    ease = Math.max(1.3, ease + 0.1);
  } else {
    reps = 0;
    interval_days = 1;
    ease = Math.max(1.3, ease - 0.2);
  }
  const next = new Date(Date.now() + interval_days * 86400000).toISOString().slice(0, 10);
  await pool.query(`
    INSERT INTO card_reviews (user_id, card_id, ease, interval_days, next_review, reps)
    VALUES ($1,$2,$3,$4,$5,$6)
    ON CONFLICT (user_id, card_id) DO UPDATE SET ease=$3, interval_days=$4, next_review=$5, reps=$6
  `, [userId, cardId, ease, interval_days, next, reps]);
  res.json({ ok: true, interval_days });
});

app.get('/api/decks/:id/due-cards', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const deckId = parseInt(req.params.id);
  const result = await pool.query(`
    SELECT c.*, COALESCE(cr.next_review, CURRENT_DATE) as next_review,
           COALESCE(cr.reps, 0) as reps, COALESCE(cr.ease, 2.5) as ease
    FROM cards c
    LEFT JOIN card_reviews cr ON cr.card_id = c.id AND cr.user_id = $1
    WHERE c.deck_id = $2
    ORDER BY COALESCE(cr.next_review, CURRENT_DATE) ASC
  `, [userId, deckId]);
  const today = new Date().toISOString().slice(0, 10);
  const due = result.rows.filter(c => c.next_review <= today);
  const notDue = result.rows.filter(c => c.next_review > today);
  res.json({ due, notDue, all: result.rows });
});

// ── Quiz stats (server-side) ──────────────────────────────────
app.post('/api/quiz-stats', requireAuth, async (req, res) => {
  const { deck_id, deck_name, correct, total } = req.body;
  const pct = Math.round(correct / total * 100);
  await pool.query(
    'INSERT INTO quiz_stats (user_id, deck_id, deck_name, correct, total, pct) VALUES ($1,$2,$3,$4,$5,$6)',
    [req.session.userId, deck_id || null, deck_name, correct, total, pct]
  );
  res.json({ ok: true });
});

app.get('/api/quiz-stats', requireAuth, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM quiz_stats WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100',
    [req.session.userId]
  );
  res.json(result.rows);
});

app.get('/api/quiz-stats/hard-cards', requireAuth, async (req, res) => {
  const result = await pool.query(`
    SELECT c.question, c.answer, d.name as deck_name,
           COALESCE(cr.reps, 0) as reps,
           COALESCE(cr.ease, 2.5) as ease,
           COALESCE(cr.interval_days, 1) as interval_days
    FROM cards c
    JOIN decks d ON d.id = c.deck_id
    LEFT JOIN card_reviews cr ON cr.card_id = c.id AND cr.user_id = $1
    WHERE d.user_id = $1
    ORDER BY COALESCE(cr.ease, 2.5) ASC
    LIMIT 10
  `, [req.session.userId]);
  res.json(result.rows);
});

// ── Leaderboard ───────────────────────────────────────────────
app.get('/api/leaderboard', requireAuth, async (req, res) => {
  const result = await pool.query(`
    SELECT u.username, u.streak,
           COUNT(qs.id)::int as quiz_count,
           COALESCE(ROUND(AVG(qs.pct)), 0)::int as avg_pct
    FROM users u
    LEFT JOIN quiz_stats qs ON qs.user_id = u.id
    GROUP BY u.id, u.username, u.streak
    ORDER BY u.streak DESC, avg_pct DESC
    LIMIT 20
  `);
  res.json(result.rows);
});

// ── Deck delen ────────────────────────────────────────────────
app.post('/api/decks/:id/share', requireAuth, async (req, res) => {
  const deckId = parseInt(req.params.id);
  const token = require('crypto').randomBytes(8).toString('hex');
  const r = await pool.query(
    'UPDATE decks SET is_public=TRUE, share_token=$1 WHERE id=$2 AND user_id=$3 RETURNING share_token',
    [token, deckId, req.session.userId]
  );
  if (!r.rows.length) return res.status(404).json({ error: 'Deck niet gevonden' });
  res.json({ token: r.rows[0].share_token });
});

app.post('/api/decks/:id/unshare', requireAuth, async (req, res) => {
  await pool.query('UPDATE decks SET is_public=FALSE, share_token=NULL WHERE id=$1 AND user_id=$2',
    [parseInt(req.params.id), req.session.userId]);
  res.json({ ok: true });
});

app.get('/api/share/:token', async (req, res) => {
  const r = await pool.query(
    `SELECT d.id, d.name, u.username as owner,
            COUNT(c.id)::int as card_count, d.share_token
     FROM decks d JOIN users u ON u.id=d.user_id
     LEFT JOIN cards c ON c.deck_id=d.id
     WHERE d.share_token=$1 AND d.is_public=TRUE
     GROUP BY d.id, d.name, u.username, d.share_token`, [req.params.token]);
  if (!r.rows.length) return res.status(404).json({ error: 'Deck niet gevonden of niet gedeeld' });
  const cards = await pool.query('SELECT question, answer FROM cards WHERE deck_id=$1', [r.rows[0].id]);
  res.json({ deck: r.rows[0], cards: cards.rows });
});

app.post('/api/share/:token/copy', requireAuth, async (req, res) => {
  const r = await pool.query(
    'SELECT d.* FROM decks d WHERE share_token=$1 AND is_public=TRUE', [req.params.token]);
  if (!r.rows.length) return res.status(404).json({ error: 'Niet gevonden' });
  const deck = r.rows[0];
  const cards = await pool.query('SELECT question, answer FROM cards WHERE deck_id=$1', [deck.id]);
  const newDeck = await pool.query(
    'INSERT INTO decks (user_id, name) VALUES ($1, $2) RETURNING id',
    [req.session.userId, deck.name + ' (kopie)']);
  const newId = newDeck.rows[0].id;
  for (const c of cards.rows) {
    await pool.query('INSERT INTO cards (deck_id, question, answer) VALUES ($1,$2,$3)',
      [newId, c.question, c.answer]);
  }
  res.json({ ok: true, deck_id: newId });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Leersite draait op http://localhost:${PORT}`));
