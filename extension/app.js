// ── Language ─────────────────────────────────────────────────
var currentLang = localStorage.getItem('et_lang') || null;

var TR = {
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
    result_text:          function(c, tot, pct) { return c + ' van de ' + tot + ' goed — ' + pct + '%'; },
    card_count:           function(n) { return n + ' kaartje' + (n !== 1 ? 's' : ''); },
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
    bulk_no_sep:          '⚠ Geen scheidingsteken',
    bulk_import_btn:      function(n) { return 'Importeren (' + n + ' kaartje' + (n !== 1 ? 's' : '') + ')'; },
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
    result_text:          function(c, tot, pct) { return c + ' out of ' + tot + ' correct — ' + pct + '%'; },
    card_count:           function(n) { return n + ' card' + (n !== 1 ? 's' : ''); },
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
    bulk_import_btn:      function(n) { return 'Import (' + n + ' card' + (n !== 1 ? 's' : '') + ')'; },
  }
};

function t(key, a, b, c) {
  var val = (TR[currentLang] || TR.nl)[key];
  if (typeof val === 'function') return val(a, b, c);
  return val !== undefined ? val : key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('et_lang', lang);
  document.getElementById('modal-lang').classList.add('hidden');
  applyLang();
  showPage('home');
}

function applyLang() {
  var sfps = document.querySelectorAll('.sidebar-footer p');
  if (sfps[0]) sfps[0].innerHTML = t('tagline');
  var kofi = document.querySelector('.kofi-tekst');
  if (kofi) kofi.textContent = t('kofi_text');

  document.getElementById('nav-home').innerHTML = '<span class="nav-icon">📚</span> ' + t('nav_home');
  document.getElementById('tab-cards').innerHTML     = '<span>🃏</span> ' + t('tab_cards');
  document.getElementById('tab-flashcard').innerHTML = '<span>🔄</span> ' + t('tab_flashcard');
  document.getElementById('tab-quiz').innerHTML      = '<span>📝</span> ' + t('tab_quiz');

  var hint = document.querySelector('.hint');
  if (hint) hint.textContent = t('hint_flip');
  var fcBtns = document.querySelectorAll('.fc-buttons button');
  if (fcBtns[0]) fcBtns[0].textContent = t('btn_wrong');
  if (fcBtns[1]) fcBtns[1].textContent = t('btn_correct');

  var fcEmptyP = document.querySelector('#fc-empty p');
  if (fcEmptyP) fcEmptyP.textContent = t('empty_flashcard');
  var quizEmptyP = document.querySelector('#quiz-empty p');
  if (quizEmptyP) quizEmptyP.textContent = t('empty_quiz');

  var resultH2 = document.querySelector('#page-result h2');
  if (resultH2) resultH2.textContent = t('result_title');
  var resultBtns = document.querySelectorAll('#page-result .btn-group button');
  if (resultBtns[0]) resultBtns[0].textContent = t('btn_back_cards');
  if (resultBtns[1]) resultBtns[1].textContent = t('btn_retry');

  var mdNewDeckH3 = document.querySelector('#modal-new-deck h3');
  if (mdNewDeckH3) mdNewDeckH3.textContent = t('modal_new_deck_title');
  var inputDeckName = document.getElementById('input-deck-name');
  if (inputDeckName) inputDeckName.placeholder = t('modal_new_deck_ph');
  var mdNewDeckBtns = document.querySelectorAll('#modal-new-deck .btn-group button');
  if (mdNewDeckBtns[0]) mdNewDeckBtns[0].textContent = t('btn_cancel');
  if (mdNewDeckBtns[1]) mdNewDeckBtns[1].textContent = t('btn_create');

  var mdNewCardH3 = document.querySelector('#modal-new-card h3');
  if (mdNewCardH3) mdNewCardH3.textContent = t('modal_new_card_title');
  var iqq = document.getElementById('input-card-question');
  if (iqq) iqq.placeholder = t('modal_card_q_ph');
  var iqa = document.getElementById('input-card-answer');
  if (iqa) iqa.placeholder = t('modal_card_a_ph');
  var mdNewCardBtns = document.querySelectorAll('#modal-new-card .btn-group button');
  if (mdNewCardBtns[0]) mdNewCardBtns[0].textContent = t('btn_cancel');
  if (mdNewCardBtns[1]) mdNewCardBtns[1].textContent = t('btn_add');

  var mdEditH3 = document.querySelector('#modal-edit-card h3');
  if (mdEditH3) mdEditH3.textContent = t('modal_edit_title');
  var eqq = document.getElementById('edit-card-question');
  if (eqq) eqq.placeholder = t('modal_card_q_ph');
  var eqa = document.getElementById('edit-card-answer');
  if (eqa) eqa.placeholder = t('modal_card_a_ph');
  var mdEditBtns = document.querySelectorAll('#modal-edit-card .btn-group button');
  if (mdEditBtns[0]) mdEditBtns[0].textContent = t('btn_cancel');
  if (mdEditBtns[1]) mdEditBtns[1].textContent = t('btn_save');

  var mdBulkH3 = document.querySelector('#modal-bulk h3');
  if (mdBulkH3) mdBulkH3.textContent = t('modal_bulk_title');
  var mdBulkHint = document.querySelector('#modal-bulk .modal-hint');
  if (mdBulkHint) mdBulkHint.innerHTML = t('modal_bulk_hint');
  var inputBulk = document.getElementById('input-bulk');
  if (inputBulk) inputBulk.placeholder = t('modal_bulk_ph');
  var mdBulkBtns = document.querySelectorAll('#modal-bulk .btn-group button');
  if (mdBulkBtns[0]) mdBulkBtns[0].textContent = t('btn_cancel');
  if (mdBulkBtns[1]) mdBulkBtns[1].textContent = t('btn_check');

  var navHelpLabel = document.getElementById('nav-help-label');
  if (navHelpLabel) navHelpLabel.textContent = t('nav_help');
  var lt = document.getElementById('lang-toggle');
  if (lt) lt.textContent = '🌐 ' + (currentLang || 'NL').toUpperCase();
  var mlh = document.getElementById('menu-label-home');
  if (mlh) mlh.textContent = t('nav_home');
  var mll = document.getElementById('menu-label-lang');
  if (mll) mll.textContent = currentLang === 'en' ? 'Switch language' : 'Taal wisselen';
}

// ── Storage ──────────────────────────────────────────────────
function getDecks() { return JSON.parse(localStorage.getItem('et_decks') || '[]'); }
function saveDecks(d) { localStorage.setItem('et_decks', JSON.stringify(d)); }
function getCards(id) { return JSON.parse(localStorage.getItem('et_cards_' + id) || '[]'); }
function saveCards(id, c) { localStorage.setItem('et_cards_' + id, JSON.stringify(c)); }
function nextId(items) { return items.length === 0 ? 1 : Math.max.apply(null, items.map(function(i) { return i.id; })) + 1; }

// ── State ────────────────────────────────────────────────────
var currentDeckId = null;
var currentDeckName = '';
var sessionCards = [];
var sessionIndex = 0;
var sessionCorrect = 0;
var sessionMode = '';

// ── Navigation ───────────────────────────────────────────────
function toggleTopbarMenu() {
  document.getElementById('menu-dropdown').classList.toggle('hidden');
}
function closeTopbarMenu() {
  document.getElementById('menu-dropdown').classList.add('hidden');
}

function showPage(page) {
  document.querySelectorAll('main > section').forEach(function(s) { s.classList.add('hidden'); });
  document.getElementById('page-' + page).classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(function(b) { b.classList.remove('active'); });

  var menuHome = document.getElementById('menu-item-home');
  if (menuHome) menuHome.classList.toggle('hidden', page === 'home');

  if (page === 'help') {
    document.getElementById('nav-help').classList.add('active');
    document.getElementById('topbar-title').textContent = t('nav_help');
    document.getElementById('topbar-actions').innerHTML = '';
    document.getElementById('help-nl').classList.toggle('hidden', currentLang === 'en');
    document.getElementById('help-en').classList.toggle('hidden', currentLang !== 'en');
  }

  if (page === 'home') {
    document.getElementById('nav-home').classList.add('active');
    document.getElementById('nav-deck').style.display = 'none';
    document.getElementById('topbar-title').textContent = t('nav_home');
    document.getElementById('topbar-actions').innerHTML =
      '<button class="btn primary" id="btn-new-deck">' + t('btn_new_deck') + '</button>';
    document.getElementById('btn-new-deck').addEventListener('click', function() { openModal('modal-new-deck'); });
    loadDecks();
  }

  if (page === 'deck') {
    document.getElementById('nav-deck').style.display = 'flex';
    document.getElementById('nav-deck').classList.add('active');
    document.getElementById('nav-deck-label').textContent = currentDeckName;
    document.getElementById('topbar-title').textContent = currentDeckName;
    document.getElementById('topbar-actions').innerHTML =
      '<button class="btn primary" id="btn-new-card">' + t('btn_new_card') + '</button>' +
      '<button class="btn accent" id="btn-bulk">' + t('btn_bulk') + '</button>';
    document.getElementById('btn-new-card').addEventListener('click', function() { openModal('modal-new-card'); });
    document.getElementById('btn-bulk').addEventListener('click', function() { openModal('modal-bulk'); });
    switchTab('cards');
  }

  if (page === 'result') {
    document.getElementById('nav-deck').classList.add('active');
    document.getElementById('topbar-title').textContent = currentDeckName;
    document.getElementById('topbar-actions').innerHTML = '';
  }
}

// ── Tabs ─────────────────────────────────────────────────────
function switchTab(tab) {
  if (!currentDeckId) return;
  ['cards', 'flashcard', 'quiz'].forEach(function(t) {
    document.getElementById('tab-content-' + t).classList.add('hidden');
    document.getElementById('tab-' + t).classList.remove('active');
  });
  document.getElementById('tab-content-' + tab).classList.remove('hidden');
  document.getElementById('tab-' + tab).classList.add('active');
  if (tab === 'cards')     loadCards();
  if (tab === 'flashcard') startFlashcards();
  if (tab === 'quiz')      startQuiz();
}

// ── Decks ────────────────────────────────────────────────────
function loadDecks() {
  var decks = getDecks();
  var el = document.getElementById('deck-list');
  if (decks.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📚</div><p>' + t('empty_decks') + '</p></div>';
    return;
  }
  el.innerHTML = decks.map(function(d) {
    var count = getCards(d.id).length;
    return '<div class="deck-card" data-id="' + d.id + '" data-name="' + esc(d.name) + '">' +
      '<h3>' + esc(d.name) + '</h3>' +
      '<p class="meta">' + t('card_count', count) + '</p>' +
      '<div class="card-actions">' +
        '<button class="btn primary btn-open-deck">' + t('btn_open') + '</button>' +
        '<button class="btn secondary btn-delete-deck">' + t('btn_delete') + '</button>' +
      '</div></div>';
  }).join('');

  el.querySelectorAll('.btn-open-deck').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var card = btn.closest('.deck-card');
      openDeck(Number(card.dataset.id), card.dataset.name);
    });
  });
  el.querySelectorAll('.btn-delete-deck').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var card = btn.closest('.deck-card');
      deleteDeck(Number(card.dataset.id));
    });
  });
}

function createDeck() {
  var name = document.getElementById('input-deck-name').value.trim();
  if (!name) return;
  var decks = getDecks();
  decks.unshift({ id: nextId(decks), name: name });
  saveDecks(decks);
  document.getElementById('input-deck-name').value = '';
  closeModal('modal-new-deck');
  loadDecks();
}

function deleteDeck(id) {
  if (!confirm(t('confirm_delete_deck'))) return;
  saveDecks(getDecks().filter(function(d) { return d.id !== id; }));
  localStorage.removeItem('et_cards_' + id);
  loadDecks();
}

function openDeck(id, name) {
  currentDeckId = id;
  currentDeckName = name;
  showPage('deck');
}

// ── Cards ────────────────────────────────────────────────────
function loadCards() {
  var cards = getCards(currentDeckId);
  var el = document.getElementById('card-list');
  if (cards.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🃏</div><p>' + t('empty_cards') + '</p></div>';
    return;
  }
  el.innerHTML = cards.map(function(c) {
    return '<div class="learn-card" data-id="' + c.id + '" data-q="' + esc(c.question) + '" data-a="' + esc(c.answer) + '">' +
      '<p class="card-q">' + esc(c.question) + '</p>' +
      '<p class="card-a">' + esc(c.answer) + '</p>' +
      '<div class="card-actions">' +
        '<button class="btn secondary btn-edit-card">' + t('btn_edit') + '</button>' +
        '<button class="btn danger btn-delete-card">' + t('btn_delete') + '</button>' +
      '</div></div>';
  }).join('');

  el.querySelectorAll('.btn-edit-card').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var card = btn.closest('.learn-card');
      openEditCard(Number(card.dataset.id), card.dataset.q, card.dataset.a);
    });
  });
  el.querySelectorAll('.btn-delete-card').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var card = btn.closest('.learn-card');
      deleteCard(Number(card.dataset.id));
    });
  });
}

function createCard() {
  var question = document.getElementById('input-card-question').value.trim();
  var answer   = document.getElementById('input-card-answer').value.trim();
  if (!question || !answer) return;
  var cards = getCards(currentDeckId);
  cards.push({ id: nextId(cards), question: question, answer: answer });
  saveCards(currentDeckId, cards);
  document.getElementById('input-card-question').value = '';
  document.getElementById('input-card-answer').value = '';
  closeModal('modal-new-card');
  loadCards();
}

function deleteCard(id) {
  if (!confirm(t('confirm_delete_card'))) return;
  saveCards(currentDeckId, getCards(currentDeckId).filter(function(c) { return c.id !== id; }));
  loadCards();
}

function openEditCard(id, question, answer) {
  document.getElementById('edit-card-id').value = id;
  document.getElementById('edit-card-question').value = question;
  document.getElementById('edit-card-answer').value = answer;
  openModal('modal-edit-card');
}

function saveCardEdit() {
  var id       = Number(document.getElementById('edit-card-id').value);
  var question = document.getElementById('edit-card-question').value.trim();
  var answer   = document.getElementById('edit-card-answer').value.trim();
  saveCards(currentDeckId, getCards(currentDeckId).map(function(c) {
    return c.id === id ? { id: c.id, question: question, answer: answer } : c;
  }));
  closeModal('modal-edit-card');
  loadCards();
}

// ── Flashcards ───────────────────────────────────────────────
function startFlashcards() {
  var cards   = getCards(currentDeckId) || [];
  var empty   = document.getElementById('fc-empty');
  var wrapper = document.getElementById('fc-wrapper');
  if (!empty || !wrapper) return;
  if (cards.length === 0) {
    empty.style.display   = 'block';
    wrapper.style.display = 'none';
    return;
  }
  empty.style.display   = 'none';
  wrapper.style.display = 'flex';
  sessionCards   = shuffle(cards.slice());
  sessionIndex   = 0;
  sessionCorrect = 0;
  sessionMode    = 'flashcard';
  showFlashcard();
}

function showFlashcard() {
  var card = sessionCards[sessionIndex];
  if (!card) return;
  document.getElementById('fc-question').textContent = card.question;
  document.getElementById('fc-answer').textContent   = card.answer;
  document.getElementById('fc-counter').textContent  = (sessionIndex + 1) + ' / ' + sessionCards.length;
  document.getElementById('fc-progress').style.width = ((sessionIndex + 1) / sessionCards.length * 100) + '%';
  document.getElementById('flashcard-inner').classList.remove('flipped');
}

// ── Quiz ─────────────────────────────────────────────────────
function startQuiz() {
  var cards   = getCards(currentDeckId) || [];
  var empty   = document.getElementById('quiz-empty');
  var wrapper = document.getElementById('quiz-wrapper');
  if (!empty || !wrapper) return;
  if (cards.length < 2) {
    empty.style.display   = 'block';
    wrapper.style.display = 'none';
    return;
  }
  empty.style.display   = 'none';
  wrapper.style.display = 'flex';
  sessionCards   = shuffle(cards.slice());
  sessionIndex   = 0;
  sessionCorrect = 0;
  sessionMode    = 'quiz';
  showQuizQuestion();
}

function showQuizQuestion() {
  var card    = sessionCards[sessionIndex];
  var others  = sessionCards.filter(function(_, i) { return i !== sessionIndex; });
  var options = shuffle([card.answer].concat(shuffle(others).slice(0, 3).map(function(c) { return c.answer; })));

  document.getElementById('quiz-question').textContent = card.question;
  document.getElementById('quiz-counter').textContent  = (sessionIndex + 1) + ' / ' + sessionCards.length;
  document.getElementById('quiz-progress').style.width = ((sessionIndex + 1) / sessionCards.length * 100) + '%';

  var el = document.getElementById('quiz-options');
  el.innerHTML = options.map(function(opt) {
    return '<button class="quiz-option" data-opt="' + esc(opt) + '" data-correct="' + esc(card.answer) + '">' + esc(opt) + '</button>';
  }).join('');
  el.querySelectorAll('.quiz-option').forEach(function(btn) {
    btn.addEventListener('click', function() { answerQuiz(btn); });
  });
}

function answerQuiz(btn) {
  var chosen  = btn.dataset.opt;
  var correct = btn.dataset.correct;
  document.querySelectorAll('.quiz-option').forEach(function(b) {
    b.disabled = true;
    if (b.dataset.opt === correct) b.classList.add('correct');
  });
  if (chosen === correct) { btn.classList.add('correct'); sessionCorrect++; }
  else btn.classList.add('wrong');
  setTimeout(function() {
    sessionIndex++;
    if (sessionIndex >= sessionCards.length) showResult();
    else showQuizQuestion();
  }, 1200);
}

// ── Result ───────────────────────────────────────────────────
function showResult() {
  var pct = Math.round(sessionCorrect / sessionCards.length * 100);
  document.getElementById('result-emoji').textContent = pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📖';
  document.getElementById('result-text').textContent  = t('result_text', sessionCorrect, sessionCards.length, pct);
  showPage('result');
}

// ── Bulk import ──────────────────────────────────────────────
var parsedBulkCards = [];

function parseBulkText(text) {
  return text.split('\n').map(function(l) { return l.trim(); }).filter(Boolean).map(function(line) {
    var idx = -1, q = null, a = null;
    if ((idx = line.indexOf('|'))  !== -1) { q = line.slice(0, idx).trim(); a = line.slice(idx + 1).trim(); }
    else if ((idx = line.indexOf('\t')) !== -1) { q = line.slice(0, idx).trim(); a = line.slice(idx + 1).trim(); }
    else if ((idx = line.indexOf('='))  !== -1) { q = line.slice(0, idx).trim(); a = line.slice(idx + 1).trim(); }
    return (q && a) ? { question: q, answer: a, ok: true } : { question: line, answer: '', ok: false };
  });
}

function previewBulk() {
  parsedBulkCards = parseBulkText(document.getElementById('input-bulk').value);
  var preview   = document.getElementById('bulk-preview');
  var btnImport = document.getElementById('btn-bulk-import');
  if (!parsedBulkCards.length) { preview.classList.add('hidden'); btnImport.classList.add('hidden'); return; }
  var good = parsedBulkCards.filter(function(c) { return c.ok; });
  preview.innerHTML = '<table><thead><tr><th>' + t('bulk_col_q') + '</th><th>' + t('bulk_col_a') + '</th></tr></thead><tbody>' +
    parsedBulkCards.map(function(c) {
      return '<tr class="' + (c.ok ? '' : 'error') + '"><td>' + esc(c.question) + '</td><td>' + (c.ok ? esc(c.answer) : t('bulk_no_sep')) + '</td></tr>';
    }).join('') + '</tbody></table>';
  preview.classList.remove('hidden');
  if (good.length) {
    btnImport.textContent = t('bulk_import_btn', good.length);
    btnImport.classList.remove('hidden');
  } else {
    btnImport.classList.add('hidden');
  }
}

function importBulk() {
  var cards = getCards(currentDeckId);
  parsedBulkCards.filter(function(c) { return c.ok; }).forEach(function(c) {
    cards.push({ id: nextId(cards), question: c.question, answer: c.answer });
  });
  saveCards(currentDeckId, cards);
  document.getElementById('input-bulk').value = '';
  document.getElementById('bulk-preview').classList.add('hidden');
  document.getElementById('btn-bulk-import').classList.add('hidden');
  parsedBulkCards = [];
  closeModal('modal-bulk');
  loadCards();
}

// ── Modal ────────────────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.remove('hidden'); document.getElementById('modal-backdrop').classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.add('hidden');    document.getElementById('modal-backdrop').classList.add('hidden'); document.body.style.overflow = ''; }
function closeAllModals() {
  document.querySelectorAll('.modal').forEach(function(m) { m.classList.add('hidden'); });
  document.getElementById('modal-backdrop').classList.add('hidden');
  document.body.style.overflow = '';
}

// ── Helpers ──────────────────────────────────────────────────
function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
}
function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/`/g,'&#96;').replace(/'/g,'&#39;');
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  if (!currentLang) {
    document.getElementById('modal-lang').classList.remove('hidden');
  } else {
    applyLang();
    showPage('home');
  }

  document.getElementById('btn-lang-nl').addEventListener('click', function() { setLang('nl'); });
  document.getElementById('btn-lang-en').addEventListener('click', function() { setLang('en'); });
  document.getElementById('lang-toggle').addEventListener('click', function() {
    document.getElementById('modal-lang').classList.remove('hidden');
  });

  document.getElementById('btn-topbar-menu').addEventListener('click', function(e) {
    e.stopPropagation();
    toggleTopbarMenu();
  });
  document.getElementById('menu-item-home').addEventListener('click', function() {
    closeTopbarMenu();
    showPage('home');
  });
  document.getElementById('menu-item-lang').addEventListener('click', function() {
    closeTopbarMenu();
    document.getElementById('modal-lang').classList.remove('hidden');
  });
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.topbar-menu')) closeTopbarMenu();
  });

  document.getElementById('btn-logo').addEventListener('click', function() { showPage('home'); });
  document.getElementById('nav-home').addEventListener('click', function() { showPage('home'); });
  document.getElementById('nav-help').addEventListener('click', function() { showPage('help'); });
  document.getElementById('nav-deck').addEventListener('click', function() { showPage('deck'); });
  document.getElementById('btn-menu').addEventListener('click', function() { document.getElementById('sidebar').classList.toggle('open'); });

  document.getElementById('tab-cards').addEventListener('click',     function() { switchTab('cards'); });
  document.getElementById('tab-flashcard').addEventListener('click', function() { switchTab('flashcard'); });
  document.getElementById('tab-quiz').addEventListener('click',      function() { switchTab('quiz'); });

  document.getElementById('flashcard').addEventListener('click', function() { document.getElementById('flashcard-inner').classList.toggle('flipped'); });
  document.getElementById('btn-correct').addEventListener('click', function() { sessionCorrect++; sessionIndex++; if (sessionIndex >= sessionCards.length) showResult(); else showFlashcard(); });
  document.getElementById('btn-wrong').addEventListener('click',   function() { sessionIndex++; if (sessionIndex >= sessionCards.length) showResult(); else showFlashcard(); });

  document.getElementById('btn-back-to-cards').addEventListener('click', function() { showPage('deck'); switchTab('cards'); });
  document.getElementById('btn-retry').addEventListener('click', function() { showPage('deck'); switchTab(sessionMode === 'flashcard' ? 'flashcard' : 'quiz'); });

  document.getElementById('btn-cancel-deck').addEventListener('click',  function() { closeModal('modal-new-deck'); });
  document.getElementById('btn-create-deck').addEventListener('click',  createDeck);
  document.getElementById('input-deck-name').addEventListener('keydown', function(e) { if (e.key === 'Enter') createDeck(); });

  document.getElementById('btn-cancel-card').addEventListener('click', function() { closeModal('modal-new-card'); });
  document.getElementById('btn-save-card').addEventListener('click',   createCard);

  document.getElementById('btn-cancel-edit').addEventListener('click', function() { closeModal('modal-edit-card'); });
  document.getElementById('btn-save-edit').addEventListener('click',   saveCardEdit);

  document.getElementById('btn-cancel-bulk').addEventListener('click',  function() { closeModal('modal-bulk'); });
  document.getElementById('btn-preview-bulk').addEventListener('click', previewBulk);
  document.getElementById('btn-bulk-import').addEventListener('click',  importBulk);

  document.getElementById('modal-backdrop').addEventListener('click', closeAllModals);
});
