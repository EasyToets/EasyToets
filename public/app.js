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
    nav_stats:            'Statistieken',
    stats_title:          '📊 Statistieken',
    stats_chart_label:    'Recente quizscores',
    stats_quizzes:        'Toetsen gemaakt',
    stats_avg:            'Gemiddelde score',
    stats_best:           'Beste score',
    stats_empty:          'Nog geen quizresultaten. Doe eerst een toets!',
    mastered:             'beheerst',
    streak_day:           'dag op rij',
    streak_days:          'dagen op rij',
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
  de: {
    tagline:              'Intelligenter lernen,<br>nicht härter.',
    kofi_text:            'Gefällt dir EasyToets? Du kannst gerne eine Spende hinterlassen. 😊',
    nav_home:             'Meine Decks',
    tab_cards:            'Karten',
    tab_flashcard:        'Üben',
    tab_quiz:             'Quiz',
    nav_help:             'Hilfe',
    nav_stats:            'Statistiken',
    stats_title:          '📊 Statistiken',
    stats_chart_label:    'Letzte Quizergebnisse',
    stats_quizzes:        'Quizze gemacht',
    stats_avg:            'Durchschnitt',
    stats_best:           'Beste Punktzahl',
    stats_empty:          'Noch keine Ergebnisse. Mach zuerst ein Quiz!',
    mastered:             'beherrscht',
    streak_day:           'Tag in Folge',
    streak_days:          'Tage in Folge',
    btn_new_deck:         '+ Neues Deck',
    btn_new_card:         '+ Karte',
    btn_bulk:             'Massenimport',
    btn_open:             'Öffnen',
    btn_delete:           'Löschen',
    btn_edit:             'Bearbeiten',
    btn_back_cards:       'Zurück zu Karten',
    btn_retry:            'Nochmal versuchen',
    btn_cancel:           'Abbrechen',
    btn_create:           'Erstellen',
    btn_add:              'Hinzufügen',
    btn_save:             'Speichern',
    btn_check:            'Prüfen',
    empty_decks:          'Noch keine Decks. Erstelle dein erstes Deck!',
    empty_cards:          'Noch keine Karten. Füge eine hinzu.',
    empty_flashcard:      'Füge zuerst Karten hinzu.',
    empty_quiz:           'Du brauchst mindestens 2 Karten für ein Quiz.',
    hint_flip:            'Klicken zum Umdrehen',
    btn_wrong:            '✗ Noch lernen',
    btn_correct:          '✓ Gewusst',
    result_title:         'Fertig!',
    result_text:          (c, tot, pct) => `${c} von ${tot} richtig — ${pct}%`,
    card_count:           (n) => `${n} Karte${n !== 1 ? 'n' : ''}`,
    confirm_delete_deck:  'Deck und alle Karten löschen?',
    confirm_delete_card:  'Karte löschen?',
    modal_new_deck_title: 'Neues Deck erstellen',
    modal_new_deck_ph:    'z.B. Biologie Kap. 3',
    modal_new_card_title: 'Neue Karte',
    modal_card_q_ph:      'Frage',
    modal_card_a_ph:      'Antwort',
    modal_edit_title:     'Karte bearbeiten',
    modal_bulk_title:     'Massenimport',
    modal_bulk_hint:      'Jede Karte auf eine neue Zeile. Trenne Frage und Antwort mit <code>|</code>, <code>=</code> oder Tab.<br>Beispiel: <em>Fotosynthese | Pflanzen wandeln Licht in Energie um</em>',
    modal_bulk_ph:        'Begriff | Erklärung\nBegriff = Erklärung\n...',
    bulk_col_q:           'Frage',
    bulk_col_a:           'Antwort',
    bulk_no_sep:          '⚠ Kein Trennzeichen gefunden',
    bulk_import_btn:      (n) => `Importieren (${n} Karte${n !== 1 ? 'n' : ''})`,
  },
  fr: {
    tagline:              'Apprendre plus vite,<br>pas plus dur.',
    kofi_text:            'Tu aimes EasyToets ? Tu peux laisser un don si tu veux. 😊',
    nav_home:             'Mes decks',
    tab_cards:            'Cartes',
    tab_flashcard:        'Pratiquer',
    tab_quiz:             'Quiz',
    nav_help:             'Aide',
    nav_stats:            'Statistiques',
    stats_title:          '📊 Statistiques',
    stats_chart_label:    'Scores récents',
    stats_quizzes:        'Quiz effectués',
    stats_avg:            'Score moyen',
    stats_best:           'Meilleur score',
    stats_empty:          'Aucun résultat. Fais d\'abord un quiz !',
    mastered:             'maîtrisé',
    streak_day:           'jour consécutif',
    streak_days:          'jours consécutifs',
    btn_new_deck:         '+ Nouveau deck',
    btn_new_card:         '+ Carte',
    btn_bulk:             'Import en masse',
    btn_open:             'Ouvrir',
    btn_delete:           'Supprimer',
    btn_edit:             'Modifier',
    btn_back_cards:       'Retour aux cartes',
    btn_retry:            'Réessayer',
    btn_cancel:           'Annuler',
    btn_create:           'Créer',
    btn_add:              'Ajouter',
    btn_save:             'Enregistrer',
    btn_check:            'Vérifier',
    empty_decks:          'Aucun deck. Crée ton premier deck !',
    empty_cards:          'Aucune carte. Ajoutes-en une.',
    empty_flashcard:      'Ajoute des cartes pour commencer.',
    empty_quiz:           'Tu as besoin d\'au moins 2 cartes pour un quiz.',
    hint_flip:            'Cliquer pour retourner',
    btn_wrong:            '✗ À revoir',
    btn_correct:          '✓ Je savais',
    result_title:         'Terminé !',
    result_text:          (c, tot, pct) => `${c} sur ${tot} correct — ${pct}%`,
    card_count:           (n) => `${n} carte${n !== 1 ? 's' : ''}`,
    confirm_delete_deck:  'Supprimer le deck et toutes ses cartes ?',
    confirm_delete_card:  'Supprimer cette carte ?',
    modal_new_deck_title: 'Créer un nouveau deck',
    modal_new_deck_ph:    'Ex. Biologie Ch. 3',
    modal_new_card_title: 'Nouvelle carte',
    modal_card_q_ph:      'Question',
    modal_card_a_ph:      'Réponse',
    modal_edit_title:     'Modifier la carte',
    modal_bulk_title:     'Import en masse',
    modal_bulk_hint:      'Une carte par ligne. Sépare question et réponse avec <code>|</code>, <code>=</code> ou une tabulation.<br>Exemple : <em>Photosynthèse | Les plantes convertissent la lumière en énergie</em>',
    modal_bulk_ph:        'Terme | Définition\nTerme = Définition\n...',
    bulk_col_q:           'Question',
    bulk_col_a:           'Réponse',
    bulk_no_sep:          '⚠ Aucun séparateur trouvé',
    bulk_import_btn:      (n) => `Importer (${n} carte${n !== 1 ? 's' : ''})`,
  },
  es: {
    tagline:              'Aprende más listo,<br>no más duro.',
    kofi_text:            '¿Te gusta EasyToets? Puedes dejar una donación si quieres. 😊',
    nav_home:             'Mis mazos',
    tab_cards:            'Tarjetas',
    tab_flashcard:        'Practicar',
    tab_quiz:             'Quiz',
    nav_help:             'Ayuda',
    nav_stats:            'Estadísticas',
    stats_title:          '📊 Estadísticas',
    stats_chart_label:    'Puntuaciones recientes',
    stats_quizzes:        'Quizzes hechos',
    stats_avg:            'Puntuación media',
    stats_best:           'Mejor puntuación',
    stats_empty:          'Sin resultados aún. ¡Haz un quiz primero!',
    mastered:             'dominado',
    streak_day:           'día seguido',
    streak_days:          'días seguidos',
    btn_new_deck:         '+ Nuevo mazo',
    btn_new_card:         '+ Tarjeta',
    btn_bulk:             'Importar en masa',
    btn_open:             'Abrir',
    btn_delete:           'Eliminar',
    btn_edit:             'Editar',
    btn_back_cards:       'Volver a tarjetas',
    btn_retry:            'Intentar de nuevo',
    btn_cancel:           'Cancelar',
    btn_create:           'Crear',
    btn_add:              'Añadir',
    btn_save:             'Guardar',
    btn_check:            'Comprobar',
    empty_decks:          'Sin mazos. ¡Crea tu primer mazo!',
    empty_cards:          'Sin tarjetas. Añade una.',
    empty_flashcard:      'Añade tarjetas primero para practicar.',
    empty_quiz:           'Necesitas al menos 2 tarjetas para un quiz.',
    hint_flip:            'Clic para voltear',
    btn_wrong:            '✗ Repasar',
    btn_correct:          '✓ Lo sabía',
    result_title:         '¡Listo!',
    result_text:          (c, tot, pct) => `${c} de ${tot} correctas — ${pct}%`,
    card_count:           (n) => `${n} tarjeta${n !== 1 ? 's' : ''}`,
    confirm_delete_deck:  '¿Eliminar el mazo y todas sus tarjetas?',
    confirm_delete_card:  '¿Eliminar esta tarjeta?',
    modal_new_deck_title: 'Crear nuevo mazo',
    modal_new_deck_ph:    'Ej. Biología Cap. 3',
    modal_new_card_title: 'Nueva tarjeta',
    modal_card_q_ph:      'Pregunta',
    modal_card_a_ph:      'Respuesta',
    modal_edit_title:     'Editar tarjeta',
    modal_bulk_title:     'Importar en masa',
    modal_bulk_hint:      'Una tarjeta por línea. Separa pregunta y respuesta con <code>|</code>, <code>=</code> o tabulación.<br>Ejemplo: <em>Fotosíntesis | Las plantas convierten la luz en energía</em>',
    modal_bulk_ph:        'Término | Definición\nTérmino = Definición\n...',
    bulk_col_q:           'Pregunta',
    bulk_col_a:           'Respuesta',
    bulk_no_sep:          '⚠ No se encontró separador',
    bulk_import_btn:      (n) => `Importar (${n} tarjeta${n !== 1 ? 's' : ''})`,
  },
  pt: {
    tagline:              'Aprenda mais rápido,<br>não mais difícil.',
    kofi_text:            'Gostou do EasyToets? Pode deixar uma doação se quiser. 😊',
    nav_home:             'Meus decks',
    tab_cards:            'Cartões',
    tab_flashcard:        'Praticar',
    tab_quiz:             'Quiz',
    nav_help:             'Ajuda',
    nav_stats:            'Estatísticas',
    stats_title:          '📊 Estatísticas',
    stats_chart_label:    'Pontuações recentes',
    stats_quizzes:        'Quizzes feitos',
    stats_avg:            'Pontuação média',
    stats_best:           'Melhor pontuação',
    stats_empty:          'Sem resultados ainda. Faça um quiz primeiro!',
    mastered:             'dominado',
    streak_day:           'dia seguido',
    streak_days:          'dias seguidos',
    btn_new_deck:         '+ Novo deck',
    btn_new_card:         '+ Cartão',
    btn_bulk:             'Importar em massa',
    btn_open:             'Abrir',
    btn_delete:           'Excluir',
    btn_edit:             'Editar',
    btn_back_cards:       'Voltar aos cartões',
    btn_retry:            'Tentar novamente',
    btn_cancel:           'Cancelar',
    btn_create:           'Criar',
    btn_add:              'Adicionar',
    btn_save:             'Salvar',
    btn_check:            'Verificar',
    empty_decks:          'Sem decks. Crie seu primeiro deck!',
    empty_cards:          'Sem cartões. Adicione um.',
    empty_flashcard:      'Adicione cartões primeiro para praticar.',
    empty_quiz:           'Você precisa de pelo menos 2 cartões para um quiz.',
    hint_flip:            'Clique para virar',
    btn_wrong:            '✗ Ainda aprendendo',
    btn_correct:          '✓ Eu sabia',
    result_title:         'Pronto!',
    result_text:          (c, tot, pct) => `${c} de ${tot} corretas — ${pct}%`,
    card_count:           (n) => `${n} cartão` + (n !== 1 ? ' → cartões' : ''),
    confirm_delete_deck:  'Excluir o deck e todos os cartões?',
    confirm_delete_card:  'Excluir este cartão?',
    modal_new_deck_title: 'Criar novo deck',
    modal_new_deck_ph:    'Ex. Biologia Cap. 3',
    modal_new_card_title: 'Novo cartão',
    modal_card_q_ph:      'Pergunta',
    modal_card_a_ph:      'Resposta',
    modal_edit_title:     'Editar cartão',
    modal_bulk_title:     'Importar em massa',
    modal_bulk_hint:      'Um cartão por linha. Separe pergunta e resposta com <code>|</code>, <code>=</code> ou tabulação.<br>Exemplo: <em>Fotossíntese | Plantas convertem luz em energia</em>',
    modal_bulk_ph:        'Termo | Definição\nTermo = Definição\n...',
    bulk_col_q:           'Pergunta',
    bulk_col_a:           'Resposta',
    bulk_no_sep:          '⚠ Nenhum separador encontrado',
    bulk_import_btn:      (n) => `Importar (${n} cartão${n !== 1 ? 'ões' : ''})`,
  },
  en: {
    tagline:              'Learn smarter,<br>not harder.',
    kofi_text:            "Love using EasyToets? Feel free to leave a donation if you'd like. 😊",
    nav_home:             'My Decks',
    tab_cards:            'Cards',
    tab_flashcard:        'Practice',
    tab_quiz:             'Quiz',
    nav_help:             'Help',
    nav_stats:            'Statistics',
    stats_title:          '📊 Statistics',
    stats_chart_label:    'Recent quiz scores',
    stats_quizzes:        'Quizzes taken',
    stats_avg:            'Average score',
    stats_best:           'Best score',
    stats_empty:          'No quiz results yet. Take a quiz first!',
    mastered:             'mastered',
    streak_day:           'day streak',
    streak_days:          'days in a row',
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
  authLang = AUTH_TR[lang] ? lang : 'en';
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
  const navStatsLabel = document.getElementById('nav-stats-label');
  if (navStatsLabel) navStatsLabel.textContent = t('nav_stats');
  const mlh = document.getElementById('menu-label-home');
  if (mlh) mlh.textContent = t('nav_home');
  const mll = document.getElementById('menu-label-lang');
  if (mll) mll.textContent = currentLang === 'en' ? 'Switch language' : 'Taal wisselen';

  // Stats page
  const statsTitle = document.getElementById('stats-title');
  if (statsTitle) statsTitle.textContent = t('stats_title');
  const statsChartLabel = document.getElementById('stats-chart-label');
  if (statsChartLabel) statsChartLabel.textContent = t('stats_chart_label');

  // Streak
  renderStreak();
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

  if (page === 'stats') {
    document.getElementById('nav-stats').classList.add('active');
    setTopbar(t('nav_stats'), []);
    renderStats();
  }

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
  el.innerHTML = decks.map(d => {
    const mastered = getMasteredCount(currentUser?.username, d.id);
    const total    = d.card_count;
    const pct      = total > 0 ? Math.round(mastered / total * 100) : 0;
    const col      = pct >= 80 ? 'green' : pct >= 40 ? 'orange' : 'red';
    const bar      = total > 0 ? `<div class="deck-progress"><div class="deck-progress-fill ${col}" style="width:${pct}%"></div></div>` : '';
    return `
    <div class="deck-card">
      <h3>${esc(d.name)}</h3>
      <p class="meta">${t('card_count', d.card_count)}${total > 0 ? ` · ${pct}% ${t('mastered')}` : ''}</p>
      ${bar}
      <div class="card-actions">
        <button class="btn primary" onclick="openDeck(${d.id}, '${esc(d.name)}')">${t('btn_open')}</button>
        <button class="btn secondary" onclick="deleteDeck(${d.id}, event)">${t('btn_delete')}</button>
      </div>
    </div>`;
  }).join('');
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
        <button class="btn secondary" data-edit-id="${c.id}">${t('btn_edit')}</button>
        <button class="btn danger" data-delete-id="${c.id}">${t('btn_delete')}</button>
      </div>
    </div>
  `).join('');

  el.querySelectorAll('[data-edit-id]').forEach(btn => {
    const id = Number(btn.dataset.editId);
    const card = cards.find(c => c.id === id);
    btn.addEventListener('click', () => openEditCard(card.id, card.question, card.answer));
  });
  el.querySelectorAll('[data-delete-id]').forEach(btn => {
    btn.addEventListener('click', () => deleteCard(Number(btn.dataset.deleteId)));
  });
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
  if (correct) {
    sessionCorrect++;
    markCardMastered(sessionCards[sessionIndex].id);
    showConfetti();
  }
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
  if (chosen === correct) { btn.classList.add('correct'); sessionCorrect++; showConfetti(); }
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
  if (sessionMode === 'quiz') recordQuizStat(currentDeckName, sessionCorrect, sessionCards.length);
  updateStreak();
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
  en: { login: 'Log in', register: 'Create account', username: 'Username', password: 'Password', empty: 'Please fill in all fields.', switch: '🌐 Change language' },
  nl: { login: 'Inloggen', register: 'Account aanmaken', username: 'Gebruikersnaam', password: 'Wachtwoord', empty: 'Vul alle velden in.', switch: '🌐 Taal wisselen' },
  de: { login: 'Anmelden', register: 'Konto erstellen', username: 'Benutzername', password: 'Passwort', empty: 'Bitte alle Felder ausfüllen.', switch: '🌐 Sprache wechseln' },
  fr: { login: 'Se connecter', register: 'Créer un compte', username: 'Nom d\'utilisateur', password: 'Mot de passe', empty: 'Veuillez remplir tous les champs.', switch: '🌐 Changer de langue' },
  es: { login: 'Iniciar sesión', register: 'Crear cuenta', username: 'Usuario', password: 'Contraseña', empty: 'Por favor rellena todos los campos.', switch: '🌐 Cambiar idioma' },
  pt: { login: 'Entrar', register: 'Criar conta', username: 'Usuário', password: 'Senha', empty: 'Por favor preencha todos os campos.', switch: '🌐 Mudar idioma' },
};

function toggleAuthLang() {
  document.getElementById('modal-lang').classList.remove('hidden');
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
  renderStreak();
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

// ── Confetti ──────────────────────────────────────────────────
function showConfetti() {
  const colors = ['#7c3aed','#06b6d4','#059669','#f59e0b','#ec4899','#f97316'];
  const container = document.getElementById('confetti-container');
  for (let i = 0; i < 22; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = (20 + Math.random() * 60) + '%';
    el.style.top = (10 + Math.random() * 40) + '%';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDelay = (Math.random() * 0.3) + 's';
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
}

// ── Mastery (kaartjes beheerst) ───────────────────────────────
function masteryKey() {
  return 'et_mastered_' + (currentUser?.username || 'guest') + '_' + currentDeckId;
}
function getMastered() {
  return new Set(JSON.parse(localStorage.getItem(masteryKey()) || '[]'));
}
function markCardMastered(cardId) {
  const s = getMastered();
  s.add(cardId);
  localStorage.setItem(masteryKey(), JSON.stringify([...s]));
}
function getMasteredCount(userId, deckId) {
  const key = 'et_mastered_' + (userId || 'guest') + '_' + deckId;
  return JSON.parse(localStorage.getItem(key) || '[]').length;
}

// ── Streak ────────────────────────────────────────────────────
function updateStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const last  = localStorage.getItem('et_last_study');
  let streak  = parseInt(localStorage.getItem('et_streak') || '0');
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (last === today) {
    // al geteld vandaag
  } else if (last === yesterday) {
    streak++;
    localStorage.setItem('et_streak', streak);
    localStorage.setItem('et_last_study', today);
  } else {
    streak = 1;
    localStorage.setItem('et_streak', 1);
    localStorage.setItem('et_last_study', today);
  }
  renderStreak();
}
function renderStreak() {
  const streak = parseInt(localStorage.getItem('et_streak') || '0');
  const badge  = document.getElementById('streak-badge');
  if (!currentUser || streak < 1) { badge.classList.add('hidden'); return; }
  badge.classList.remove('hidden');
  document.getElementById('streak-count').textContent = streak;
  document.getElementById('streak-label').textContent = streak === 1 ? t('streak_day') : t('streak_days');
}

// ── Stats (quizscores opslaan) ────────────────────────────────
function recordQuizStat(deckName, correct, total) {
  const key  = 'et_stats_' + (currentUser?.username || 'guest');
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  list.push({ deck: deckName, correct, total, pct: Math.round(correct / total * 100), date: new Date().toISOString().slice(0,10) });
  if (list.length > 50) list.splice(0, list.length - 50);
  localStorage.setItem(key, JSON.stringify(list));
}
function renderStats() {
  const key  = 'et_stats_' + (currentUser?.username || 'guest');
  const list = JSON.parse(localStorage.getItem(key) || '[]');

  const sumEl   = document.getElementById('stats-summary');
  const chartEl = document.getElementById('stats-chart');

  if (list.length === 0) {
    sumEl.innerHTML   = '';
    chartEl.innerHTML = `<p class="stats-empty">${t('stats_empty')}</p>`;
    return;
  }

  const avg = Math.round(list.reduce((s, r) => s + r.pct, 0) / list.length);
  const best = Math.max(...list.map(r => r.pct));
  sumEl.innerHTML = `
    <div class="stats-card"><span class="stats-num">${list.length}</span><div class="stats-lbl">${t('stats_quizzes')}</div></div>
    <div class="stats-card"><span class="stats-num">${avg}%</span><div class="stats-lbl">${t('stats_avg')}</div></div>
    <div class="stats-card"><span class="stats-num">${best}%</span><div class="stats-lbl">${t('stats_best')}</div></div>
  `;

  const recent = list.slice(-20);
  const maxPct = 100;
  chartEl.innerHTML = recent.map(r => {
    const h = Math.round((r.pct / maxPct) * 88);
    const col = r.pct >= 80 ? 'green' : r.pct >= 50 ? 'orange' : 'red';
    return `<div class="stats-bar-wrap">
      <div class="stats-bar ${col}" style="height:${h}px" title="${r.deck}: ${r.pct}%"></div>
      <span class="stats-bar-pct">${r.pct}%</span>
    </div>`;
  }).join('');
}

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
