// ── Auth state ───────────────────────────────────────────────
let currentUser = null;
let authMode = 'login';

// ── Language ─────────────────────────────────────────────────
let currentLang = localStorage.getItem('et_lang') || null;

const TR = {
  nl: {
    tagline:              'Leer slimmer,<br>niet harder.',
    kofi_text:            'Vind je EasyToets heel fijn? Je mag altijd een donatie achterlaten als je wil. 😊',
    nav_home:             'Mijn Decks',
    tab_cards:            'Kaartjes',
    tab_flashcard:        'Oefenen',
    tab_quiz:             'Toets',
    nav_help:             'Uitleg',
    btn_new_deck:         '+ Nieuw deck',
    btn_new_card:         '+ Kaartje',
    btn_bulk:             'Bulk import',
    btn_open:             'Openen',
    btn_delete:           'Verwijderen',
    btn_edit:             'Bewerken',
    btn_back_cards:       'Terug naar kaartjes',
    btn_retry:            'Opnieuw proberen',
    btn_cancel:           'Annuleren',
    btn_create:           'Aanmaken',
    btn_add:              'Toevoegen',
    btn_save:             'Opslaan',
    btn_check:            'Controleren',
    empty_decks:          'Nog geen decks. Maak je eerste deck aan!',
    empty_cards:          'Nog geen kaartjes. Voeg er een toe of gebruik Bulk import.',
    empty_flashcard:      'Voeg eerst kaartjes toe om te oefenen.',
    empty_quiz:           'Je hebt minimaal 2 kaartjes nodig voor een toets.',
    hint_flip:            'Klik om te omdraaien',
    btn_wrong:            '✗ Nog oefenen',
    btn_correct:          '✓ Wist ik het',
    result_title:         'Klaar!',
    result_text:          (c, tot, pct) => `${c} van de ${tot} goed — ${pct}%`,
    card_count:           (n) => `${n} kaartje${n !== 1 ? 's' : ''}`,
    confirm_delete_deck:  'Deck en alle kaartjes verwijderen?',
    confirm_delete_card:  'Kaartje verwijderen?',
    modal_new_deck_title: 'Nieuw deck aanmaken',
    modal_new_deck_ph:    'Bijv. Biologie H3',
    modal_new_card_title: 'Nieuw kaartje',
    modal_card_q_ph:      'Vraag',
    modal_card_a_ph:      'Antwoord',
    modal_edit_title:     'Kaartje bewerken',
    modal_bulk_title:     'Bulk import',
    modal_bulk_hint:      'Zet elke flashcard op een nieuwe regel. Scheid vraag en antwoord met <code>|</code>, <code>=</code> of een tab.<br>Voorbeeld: <em>Fotosynthese | Planten zetten licht om in energie</em>',
    modal_bulk_ph:        'Begrip | Uitleg\nBegrip = Uitleg\n...',
    bulk_col_q:           'Vraag',
    bulk_col_a:           'Antwoord',
    bulk_no_sep:          '⚠ Geen scheidingsteken gevonden',
    bulk_import_btn:      (n) => `Importeren (${n} kaartje${n !== 1 ? 's' : ''})`,
  },
  en: {
    tagline:              'Learn smarter,<br>not harder.',
    kofi_text:            "Love using EasyToets? Feel free to leave a donation if you'd like. 😊",
    nav_home:             'My Decks',
    tab_cards:            'Cards',
    tab_flashcard:        'Practice',
    tab_quiz:             'Quiz',
    nav_help:             'Help',
    btn_new_deck:         '+ New deck',
    btn_new_card:         '+ Card',
    btn_bulk:             'Bulk import',
    btn_open:             'Open',
    btn_delete:           'Delete',
    btn_edit:             'Edit',
    btn_back_cards:       'Back to cards',
    btn_retry:            'Try again',
    btn_cancel:           'Cancel',
    btn_create:           'Create',
    btn_add:              'Add',
    btn_save:             'Save',
    btn_check:            'Check',
    empty_decks:          'No decks yet. Create your first deck!',
    empty_cards:          'No cards yet. Add one or use Bulk import.',
    empty_flashcard:      'Add some cards first to start practising.',
    empty_quiz:           'You need at least 2 cards for a quiz.',
    hint_flip:            'Click to flip',
    btn_wrong:            '✗ Still learning',
    btn_correct:          '✓ Got it',
    result_title:         'Done!',
    result_text:          (c, tot, pct) => `${c} out of ${tot} correct — ${pct}%`,
    card_count:           (n) => `${n} card${n !== 1 ? 's' : ''}`,
    confirm_delete_deck:  'Delete deck and all its cards?',
    confirm_delete_card:  'Delete this card?',
    modal_new_deck_title: 'Create new deck',
    modal_new_deck_ph:    'E.g. Biology Ch. 3',
    modal_new_card_title: 'New card',
    modal_card_q_ph:      'Question',
    modal_card_a_ph:      'Answer',
    modal_edit_title:     'Edit card',
    modal_bulk_title:     'Bulk import',
    modal_bulk_hint:      'Put each flashcard on a new line. Separate question and answer with <code>|</code>, <code>=</code> or a tab.<br>Example: <em>Photosynthesis | Plants convert light into energy</em>',
    modal_bulk_ph:        'Term | Definition\nTerm = Definition\n...',
    bulk_col_q:           'Question',
    bulk_col_a:           'Answer',
    bulk_no_sep:          '⚠ No separator found',
    bulk_import_btn:      (n) => `Import (${n} card${n !== 1 ? 's' : ''})`,
  }
};

function t(key, ...args) {
  const val = (TR[currentLang] || TR.nl)[key];
  return typeof val === 'function' ? val(...args) : (val !== undefined ? val : key);
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('et_lang', lang);
  document.getElementById('modal-lang').classList.add('hidden');
  applyLang();
  if (currentUser) {
    showPage('home');
  } else {
    showAuthModal();
  }
}

function showLangPicker() {
  document.getElementById('modal-lang').classList.remove('hidden');
  closeTopbarMenu();
}

function toggleTopbarMenu() {
  document.getElementById('menu-dropdown').classList.toggle('hidden');
}

function closeTopbarMenu() {
  document.getElementById('menu-dropdown').classList.add('hidden');
}

function menuGoHome() {
  closeTopbarMenu();
  showPage('home');
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.topbar-menu')) closeTopbarMenu();
});

function applyLang() {
  // Sidebar footer
  const sfps = document.querySelectorAll('.sidebar-footer p');
  if (sfps[0]) sfps[0].innerHTML = t('tagline');
  const kofi = document.querySelector('.kofi-tekst');
  if (kofi) kofi.textContent = t('kofi_text');

  // Nav
  document.getElementById('nav-home').innerHTML = '<span class="nav-icon">📚</span> ' + t('nav_home');

  // Tabs
  document.getElementById('tab-cards').innerHTML     = '<span>🃏</span> ' + t('tab_cards');
  document.getElementById('tab-flashcard').innerHTML = '<span>🔄</span> ' + t('tab_flashcard');
  document.getElementById('tab-quiz').innerHTML      = '<span>📝</span> ' + t('tab_quiz');

  // Flashcard
  const hint = document.querySelector('.hint');
  if (hint) hint.textContent = t('hint_flip');
  const fcBtns = document.querySelectorAll('.fc-buttons button');
  if (fcBtns[0]) fcBtns[0].textContent = t('btn_wrong');
  if (fcBtns[1]) fcBtns[1].textContent = t('btn_correct');

  // Empty states
  const fcEmptyP = document.querySelector('#fc-empty p');
  if (fcEmptyP) fcEmptyP.textContent = t('empty_flashcard');
  const quizEmptyP = document.querySelector('#quiz-empty p');
  if (quizEmptyP) quizEmptyP.textContent = t('empty_quiz');

  // Result page
  const resultH2 = document.querySelector('#page-result h2');
  if (resultH2) resultH2.textContent = t('result_title');
  const resultBtns = document.querySelectorAll('#page-result .btn-group button');
  if (resultBtns[0]) resultBtns[0].textContent = t('btn_back_cards');
  if (resultBtns[1]) resultBtns[1].textContent = t('btn_retry');

  // Modal: nieuw deck
  const mdNewDeckH3 = document.querySelector('#modal-new-deck h3');
  if (mdNewDeckH3) mdNewDeckH3.textContent = t('modal_new_deck_title');
  const inputDeckName = document.getElementById('input-deck-name');
  if (inputDeckName) inputDeckName.placeholder = t('modal_new_deck_ph');
  const mdNewDeckBtns = document.querySelectorAll('#modal-new-deck .btn-group button');
  if (mdNewDeckBtns[0]) mdNewDeckBtns[0].textContent = t('btn_cancel');
  if (mdNewDeckBtns[1]) mdNewDeckBtns[1].textContent = t('btn_create');

  // Modal: nieuw kaartje
  const mdNewCardH3 = document.querySelector('#modal-new-card h3');
  if (mdNewCardH3) mdNewCardH3.textContent = t('modal_new_card_title');
  const iqq = document.getElementById('input-card-question');
  if (iqq) iqq.placeholder = t('modal_card_q_ph');
  const iqa = document.getElementById('input-card-answer');
  if (iqa) iqa.placeholder = t('modal_card_a_ph');
  const mdNewCardBtns = document.querySelectorAll('#modal-new-card .btn-group button');
  if (mdNewCardBtns[0]) mdNewCardBtns[0].textContent = t('btn_cancel');
  if (mdNewCardBtns[1]) mdNewCardBtns[1].textContent = t('btn_add');

  // Modal: bewerk kaartje
  const mdEditH3 = document.querySelector('#modal-edit-card h3');
  if (mdEditH3) mdEditH3.textContent = t('modal_edit_title');
  const eqq = document.getElementById('edit-card-question');
  if (eqq) eqq.placeholder = t('modal_card_q_ph');
  const eqa = document.getElementById('edit-card-answer');
  if (eqa) eqa.placeholder = t('modal_card_a_ph');
  const mdEditBtns = document.querySelectorAll('#modal-edit-card .btn-group button');
  if (mdEditBtns[0]) mdEditBtns[0].textContent = t('btn_cancel');
  if (mdEditBtns[1]) mdEditBtns[1].textContent = t('btn_save');

  // Modal: bulk import
  const mdBulkH3 = document.querySelector('#modal-bulk h3');
  if (mdBulkH3) mdBulkH3.textContent = t('modal_bulk_title');
  const mdBulkHint = document.querySelector('#modal-bulk .modal-hint');
  if (mdBulkHint) mdBulkHint.innerHTML = t('modal_bulk_hint');
  const inputBulk = document.getElementById('input-bulk');
  if (inputBulk) inputBulk.placeholder = t('modal_bulk_ph');
  const mdBulkBtns = document.querySelectorAll('#modal-bulk .btn-group button');
  if (mdBulkBtns[0]) mdBulkBtns[0].textContent = t('btn_cancel');
  if (mdBulkBtns[1]) mdBulkBtns[1].textContent = t('btn_check');

  // Lang toggle & menu labels
  const lt = document.getElementById('lang-toggle');
  if (lt) lt.textContent = '🌐 ' + (currentLang || 'NL').toUpperCase();
  const navHelpLabel = document.getElementById('nav-help-label');
  if (navHelpLabel) navHelpLabel.textContent = t('nav_help');
  const mlh = document.getElementById('menu-label-home');
  if (mlh) mlh.textContent = t('nav_home');
  const mll = document.getElementById('menu-label-lang');
  if (mll) mll.textContent = currentLang === 'en' ? 'Switch language' : 'Taal wisselen';
}

// ── State ────────────────────────────────────────────────────
let currentDeckId = null;
let currentDeckName = '';
let sessionCards = [];
let sessionIndex = 0;
let sessionCorrect = 0;
let sessionMode = '';
let flipped = false;

// ── Navigation ──────────────────────────────────────────────
function showPage(page) {
  document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
  document.getElementById('page-' + page).classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

  const menuHome = document.getElementById('menu-item-home');
  if (menuHome) menuHome.classList.toggle('hidden', page === 'home');

  if (page === 'help') {
    document.getElementById('nav-help').classList.add('active');
    setTopbar(t('nav_help'), []);
    document.getElementById('help-nl').classList.toggle('hidden', currentLang === 'en');
    document.getElementById('help-en').classList.toggle('hidden', currentLang !== 'en');
  }

  if (page === 'home') {
    document.getElementById('nav-home').classList.add('active');
    document.getElementById('nav-deck').style.display = 'none';
    setTopbar(t('nav_home'), [
      btn('primary', t('btn_new_deck'), "openModal('modal-new-deck')")
    ]);
    loadDecks();
  }

  if (page === 'deck') {
    document.getElementById('nav-deck').style.display = 'flex';
    document.getElementById('nav-deck').classList.add('active');
    document.getElementById('nav-deck-label').textContent = currentDeckName;
    setTopbar(currentDeckName, [
      btn('primary', t('btn_new_card'), "openModal('modal-new-card')"),
      btn('accent',  t('btn_bulk'),     "openModal('modal-bulk')"),
    ]);
    switchTab('cards');
  }

  if (page === 'result') {
    document.getElementById('nav-deck').classList.add('active');
    setTopbar(currentDeckName, []);
  }
}

function setTopbar(title, buttons) {
  document.getElementById('topbar-title').textContent = title;
  document.getElementById('topbar-actions').innerHTML = buttons.join('');
}

function btn(cls, label, onclick) {
  return `<button class="btn ${cls}" onclick="${onclick}">${label}</button>`;
}

function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
}

// ── Tabs ─────────────────────────────────────────────────────
function switchTab(tab) {
  ['cards', 'flashcard', 'quiz'].forEach(name => {
    document.getElementById('tab-content-' + name).classList.add('hidden');
    document.getElementById('tab-' + name).classList.remove('active');
  });
  document.getElementById('tab-content-' + tab).classList.remove('hidden');
  document.getElementById('tab-' + tab).classList.add('active');

  if (tab === 'flashcard') startFlashcards();
  if (tab === 'quiz') startQuiz();
}

// ── Decks ────────────────────────────────────────────────────
async function loadDecks() {
  const res = await fetch('/api/decks');
  const decks = await res.json();
  const el = document.getElementById('deck-list');
  if (decks.length === 0) {
    el.innerHTML = `<div class="empty-state">
      <div class="empty-icon">📚</div>
      <p>${t('empty_decks')}</p>
    </div>`;
    return;
  }
  el.innerHTML = decks.map(d => `
    <div class="deck-card">
      <h3>${esc(d.name)}</h3>
      <p class="meta">${t('card_count', d.card_count)}</p>
      <div class="card-actions">
        <button class="btn primary" onclick="openDeck(${d.id}, '${esc(d.name)}')">${t('btn_open')}</button>
        <button class="btn secondary" onclick="deleteDeck(${d.id}, event)">${t('btn_delete')}</button>
      </div>
    </div>
  `).join('');
}

async function createDeck() {
  const name = document.getElementById('input-deck-name').value;
  if (!name.trim()) return;
  await fetch('/api/decks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  document.getElementById('input-deck-name').value = '';
  closeModal('modal-new-deck');
  loadDecks();
}

async function deleteDeck(id, e) {
  e.stopPropagation();
  if (!confirm(t('confirm_delete_deck'))) return;
  await fetch('/api/decks/' + id, { method: 'DELETE' });
  loadDecks();
}

function openDeck(id, name) {
  currentDeckId = id;
  currentDeckName = name;
  showPage('deck');
}

// ── Cards ────────────────────────────────────────────────────
async function loadCards() {
  const res = await fetch('/api/decks/' + currentDeckId + '/cards');
  const cards = await res.json();
  const el = document.getElementById('card-list');
  if (cards.length === 0) {
    el.innerHTML = `<div class="empty-state">
      <div class="empty-icon">🃏</div>
      <p>${t('empty_cards')}</p>
    </div>`;
    return;
  }
  el.innerHTML = cards.map(c => `
    <div class="learn-card">
      <p class="card-q">${esc(c.question)}</p>
      <p class="card-a">${esc(c.answer)}</p>
      <div class="card-actions">
        <button class="btn secondary" onclick="openEditCard(${c.id}, \`${esc(c.question)}\`, \`${esc(c.answer)}\`)">${t('btn_edit')}</button>
        <button class="btn danger" onclick="deleteCard(${c.id})">${t('btn_delete')}</button>
      </div>
    </div>
  `).join('');
}

async function createCard() {
  const question = document.getElementById('input-card-question').value;
  const answer   = document.getElementById('input-card-answer').value;
  if (!question.trim() || !answer.trim()) return;
  await fetch('/api/decks/' + currentDeckId + '/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer })
  });
  document.getElementById('input-card-question').value = '';
  document.getElementById('input-card-answer').value = '';
  closeModal('modal-new-card');
  loadCards();
}

async function deleteCard(id) {
  if (!confirm(t('confirm_delete_card'))) return;
  await fetch('/api/cards/' + id, { method: 'DELETE' });
  loadCards();
}

function openEditCard(id, question, answer) {
  document.getElementById('edit-card-id').value = id;
  document.getElementById('edit-card-question').value = question;
  document.getElementById('edit-card-answer').value = answer;
  openModal('modal-edit-card');
}

async function saveCardEdit() {
  const id       = document.getElementById('edit-card-id').value;
  const question = document.getElementById('edit-card-question').value;
  const answer   = document.getElementById('edit-card-answer').value;
  await fetch('/api/cards/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer })
  });
  closeModal('modal-edit-card');
  loadCards();
}

// ── Flashcards ───────────────────────────────────────────────
async function startFlashcards() {
  const res = await fetch('/api/decks/' + currentDeckId + '/cards');
  const cards = await res.json();
  const empty = document.getElementById('fc-empty');
  const wrapper = document.getElementById('fc-wrapper');
  if (cards.length === 0) {
    empty.style.display = 'block';
    wrapper.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  wrapper.style.display = 'flex';
  sessionCards = shuffle([...cards]);
  sessionIndex = 0;
  sessionCorrect = 0;
  sessionMode = 'flashcard';
  showFlashcard();
}

function showFlashcard() {
  const card = sessionCards[sessionIndex];
  document.getElementById('fc-question').textContent = card.question;
  document.getElementById('fc-answer').textContent   = card.answer;
  document.getElementById('fc-counter').textContent  = `${sessionIndex + 1} / ${sessionCards.length}`;
  document.getElementById('fc-progress').style.width = ((sessionIndex + 1) / sessionCards.length * 100) + '%';
  document.getElementById('flashcard-inner').classList.remove('flipped');
  flipped = false;
}

function flipCard() {
  document.getElementById('flashcard-inner').classList.toggle('flipped');
  flipped = !flipped;
}

function nextCard(correct) {
  if (correct) sessionCorrect++;
  sessionIndex++;
  if (sessionIndex >= sessionCards.length) return showResult();
  showFlashcard();
}

// ── Quiz ─────────────────────────────────────────────────────
async function startQuiz() {
  const res = await fetch('/api/decks/' + currentDeckId + '/cards');
  const cards = await res.json();
  const empty = document.getElementById('quiz-empty');
  const wrapper = document.getElementById('quiz-wrapper');
  if (cards.length < 2) {
    empty.style.display = 'block';
    wrapper.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  wrapper.style.display = 'flex';
  sessionCards = shuffle([...cards]);
  sessionIndex = 0;
  sessionCorrect = 0;
  sessionMode = 'quiz';
  showQuizQuestion();
}

function showQuizQuestion() {
  const card   = sessionCards[sessionIndex];
  const others = sessionCards.filter((_, i) => i !== sessionIndex);
  const wrong  = shuffle(others).slice(0, 3).map(c => c.answer);
  const options = shuffle([card.answer, ...wrong]);

  document.getElementById('quiz-question').textContent  = card.question;
  document.getElementById('quiz-counter').textContent   = `${sessionIndex + 1} / ${sessionCards.length}`;
  document.getElementById('quiz-progress').style.width  = ((sessionIndex + 1) / sessionCards.length * 100) + '%';

  document.getElementById('quiz-options').innerHTML = options.map(opt => `
    <button class="quiz-option" onclick="answerQuiz(this, '${esc(opt)}', '${esc(card.answer)}')">${esc(opt)}</button>
  `).join('');
}

function answerQuiz(btn, chosen, correct) {
  document.querySelectorAll('.quiz-option').forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add('correct');
  });
  if (chosen === correct) { btn.classList.add('correct'); sessionCorrect++; }
  else btn.classList.add('wrong');
  setTimeout(() => {
    sessionIndex++;
    if (sessionIndex >= sessionCards.length) showResult();
    else showQuizQuestion();
  }, 1200);
}

// ── Result ───────────────────────────────────────────────────
function showResult() {
  const pct = Math.round(sessionCorrect / sessionCards.length * 100);
  const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📖';
  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-text').textContent  = t('result_text', sessionCorrect, sessionCards.length, pct);
  showPage('result');
}

function retrySession() {
  showPage('deck');
  switchTab(sessionMode === 'flashcard' ? 'flashcard' : 'quiz');
}

// ── Bulk import ──────────────────────────────────────────────
let parsedBulkCards = [];

function parseBulkText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  return lines.map(line => {
    let idx = -1, q = null, a = null;
    if ((idx = line.indexOf('|')) !== -1) {
      q = line.slice(0, idx).trim(); a = line.slice(idx + 1).trim();
    } else if ((idx = line.indexOf('\t')) !== -1) {
      q = line.slice(0, idx).trim(); a = line.slice(idx + 1).trim();
    } else if ((idx = line.indexOf('=')) !== -1) {
      q = line.slice(0, idx).trim(); a = line.slice(idx + 1).trim();
    }
    if (q && a) return { question: q, answer: a, ok: true };
    return { question: line, answer: '', ok: false };
  });
}

function previewBulk() {
  const text = document.getElementById('input-bulk').value;
  parsedBulkCards = parseBulkText(text);
  const preview   = document.getElementById('bulk-preview');
  const btnImport = document.getElementById('btn-bulk-import');
  if (parsedBulkCards.length === 0) { preview.classList.add('hidden'); btnImport.classList.add('hidden'); return; }

  const good = parsedBulkCards.filter(c => c.ok);
  preview.innerHTML = `<table>
    <thead><tr><th>${t('bulk_col_q')}</th><th>${t('bulk_col_a')}</th></tr></thead>
    <tbody>${parsedBulkCards.map(c => `
      <tr class="${c.ok ? '' : 'error'}">
        <td>${esc(c.question)}</td>
        <td>${c.ok ? esc(c.answer) : t('bulk_no_sep')}</td>
      </tr>`).join('')}
    </tbody></table>`;
  preview.classList.remove('hidden');
  if (good.length > 0) {
    btnImport.textContent = t('bulk_import_btn', good.length);
    btnImport.classList.remove('hidden');
  } else {
    btnImport.classList.add('hidden');
  }
}

async function importBulk() {
  for (const card of parsedBulkCards.filter(c => c.ok)) {
    await fetch('/api/decks/' + currentDeckId + '/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: card.question, answer: card.answer })
    });
  }
  document.getElementById('input-bulk').value = '';
  document.getElementById('bulk-preview').classList.add('hidden');
  document.getElementById('btn-bulk-import').classList.add('hidden');
  parsedBulkCards = [];
  closeModal('modal-bulk');
  loadCards();
}

// ── Modal ────────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
  document.getElementById('modal-backdrop').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
  document.getElementById('modal-backdrop').classList.add('hidden');
  document.body.style.overflow = '';
}
function closeAllModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  document.getElementById('modal-backdrop').classList.add('hidden');
  document.body.style.overflow = '';
}

document.getElementById('input-deck-name').addEventListener('keydown', e => {
  if (e.key === 'Enter') createDeck();
});

// ── Helpers ──────────────────────────────────────────────────
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/`/g,'&#96;').replace(/'/g,'&#39;');
}

// ── Auth ─────────────────────────────────────────────────────
let authLang = 'en';

const AUTH_TR = {
  en: {
    login: 'Log in', register: 'Create account',
    username: 'Username', password: 'Password',
    empty: 'Please fill in all fields.',
    switch: '🇳🇱 Liever Nederlands?'
  },
  nl: {
    login: 'Inloggen', register: 'Account aanmaken',
    username: 'Gebruikersnaam', password: 'Wachtwoord',
    empty: 'Vul alle velden in.',
    switch: '🇬🇧 Prefer English?'
  }
};

function toggleAuthLang() {
  authLang = authLang === 'en' ? 'nl' : 'en';
  applyAuthLang();
}

function applyAuthLang() {
  const tr = AUTH_TR[authLang];
  const isLogin = authMode === 'login';
  document.getElementById('auth-tab-login').textContent = tr.login;
  document.getElementById('auth-tab-register').textContent = tr.register;
  document.getElementById('auth-username').placeholder = tr.username;
  document.getElementById('auth-password').placeholder = tr.password;
  document.getElementById('auth-submit-btn').textContent = isLogin ? tr.login : tr.register;
  document.getElementById('auth-lang-switch').textContent = tr.switch;
}

function showAuthModal() {
  document.getElementById('modal-auth').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  document.getElementById('auth-username').focus();
}

function hideAuthModal() {
  document.getElementById('modal-auth').classList.add('hidden');
  document.body.style.overflow = '';
  document.getElementById('auth-error').classList.add('hidden');
  document.getElementById('auth-error').textContent = '';
}

function showAuthTab(mode) {
  authMode = mode;
  const isLogin = mode === 'login';
  document.getElementById('auth-tab-login').classList.toggle('active', isLogin);
  document.getElementById('auth-tab-register').classList.toggle('active', !isLogin);
  document.getElementById('auth-error').classList.add('hidden');
  applyAuthLang();
  document.getElementById('auth-username').focus();
}

async function submitAuth() {
  const username = document.getElementById('auth-username').value.trim();
  const password = document.getElementById('auth-password').value;
  const errEl = document.getElementById('auth-error');
  errEl.classList.add('hidden');
  if (!username || !password) {
    errEl.textContent = AUTH_TR[authLang].empty;
    errEl.classList.remove('hidden');
    return;
  }
  const res = await fetch('/api/' + authMode, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) {
    errEl.textContent = data.error || 'Er is iets misgegaan.';
    errEl.classList.remove('hidden');
    return;
  }
  currentUser = { username: data.username };
  document.getElementById('auth-password').value = '';
  document.getElementById('auth-username').value = '';
  hideAuthModal();
  updateUserDisplay();
  showPage('home');
}

async function doLogout() {
  closeTopbarMenu();
  await fetch('/api/logout', { method: 'POST' });
  currentUser = null;
  updateUserDisplay();
  document.getElementById('deck-list').innerHTML = '';
  document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
  document.getElementById('page-home').classList.remove('hidden');
  document.getElementById('nav-deck').style.display = 'none';
  showAuthModal();
}

function updateUserDisplay() {
  const el = document.getElementById('topbar-user');
  if (el) el.textContent = currentUser ? '👤 ' + currentUser.username : '';
}

document.getElementById('auth-username').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('auth-password').focus();
});
document.getElementById('auth-password').addEventListener('keydown', e => {
  if (e.key === 'Enter') submitAuth();
});

// ── Init ─────────────────────────────────────────────────────
async function init() {
  const meRes = await fetch('/api/me');
  const meData = await meRes.json();
  currentUser = meData.user;

  if (!currentLang) {
    document.getElementById('modal-lang').classList.remove('hidden');
  } else {
    applyLang();
  }

  if (!currentUser) {
    showAuthModal();
  } else {
    updateUserDisplay();
    if (currentLang) showPage('home');
  }
}

init();

// ── PWA installeren ───────────────────────────────────────────
let installPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installPrompt = e;
  document.getElementById('nav-install').style.display = '';
});

window.addEventListener('appinstalled', () => {
  document.getElementById('nav-install').style.display = 'none';
  installPrompt = null;
});

function installApp() {
  if (!installPrompt) return;
  installPrompt.prompt();
  installPrompt.userChoice.then(() => { installPrompt = null; });
}
