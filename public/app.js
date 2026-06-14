// ── Auth state ───────────────────────────────────────────────
let currentUser = null;
let authMode = 'login';

// ── Language ─────────────────────────────────────────────────
function detectLang() {
  const saved = localStorage.getItem('et_lang');
  if (saved) return saved;
  const supported = ['nl', 'de', 'fr', 'es', 'pt', 'en'];
  const browser = (navigator.language || navigator.userLanguage || 'nl').toLowerCase();
  // Exact match first (e.g. 'nl', 'de')
  for (const l of supported) { if (browser === l) return l; }
  // Prefix match (e.g. 'nl-NL', 'pt-BR')
  for (const l of supported) { if (browser.startsWith(l + '-')) return l; }
  return 'nl';
}
let currentLang = detectLang();

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
    tab_write:            'Schrijven',
    empty_write:          'Voeg eerst kaartjes toe om te oefenen.',
    nav_settings:         'Instellingen',
    nav_groups:           'Groepen',
    nav_discover:         'Ontdek',
    nav_ai:               'AI Tools',
    aitool_generate_title:'Kaartjes genereren',
    aitool_generate_sub:  'Plak tekst — AI maakt er flashcards van',
    aitool_studyplan_title:'Studieplan',
    aitool_studyplan_sub: 'AI maakt een persoonlijk studieplan',
    aitool_hint_title:    'Oefenen met hints',
    aitool_hint_sub:      'Oefen met kaartjes en vraag een AI-hint als je vastloopt',
    aitool_file_title:    'Bestand importeren',
    aitool_file_sub:      'Upload PDF, Word of tekst — AI maakt flashcards of samenvatting',
    aitool_explain_title: 'Uitleg per kaartje',
    aitool_explain_sub:   'Klik op ✨ Uitleg bij een kaartje voor een diepere uitleg',
    aitool_summaries_title:'Mijn samenvattingen',
    aitool_summaries_sub: 'Bekijk eerder gemaakte samenvattingen van je bestanden',
    file_modal_title:     'Bestand importeren',
    file_modal_hint:      'Upload een PDF, Word (.docx), PowerPoint (.pptx) of tekstbestand — de AI maakt er flashcards of een samenvatting van.',
    file_drop_text:       'Klik om een bestand te kiezen',
    file_drop_sub:        'PDF, Word, PowerPoint of .txt · max 10MB',
    file_btn_cards:       '✨ Maak flashcards',
    file_btn_summary:     '📝 Samenvatting',
    file_saved_hint:      '✅ Samenvatting opgeslagen — terug te vinden via AI Tools → Mijn samenvattingen',
    summaries_modal_title:'Mijn samenvattingen',
    summaries_empty:      'Nog geen samenvattingen opgeslagen. Maak er een via Bestand importeren → Samenvatting.',
    summaries_loading:    'Laden...',
    summaries_error:      'Kon samenvattingen niet laden.',
    summary_delete_confirm:'Samenvatting verwijderen?',
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
    tab_write:            'Schreiben',
    empty_write:          'Füge zuerst Karten hinzu.',
    nav_settings:         'Einstellungen',
    nav_groups:           'Gruppen',
    nav_discover:         'Entdecken',
    nav_ai:               'KI-Tools',
    aitool_generate_title:'Karten generieren',
    aitool_generate_sub:  'Text einfügen — KI erstellt Karteikarten',
    aitool_studyplan_title:'Lernplan',
    aitool_studyplan_sub: 'KI erstellt einen persönlichen Lernplan',
    aitool_hint_title:    'Üben mit Hinweisen',
    aitool_hint_sub:      'Übe mit Karten und frage die KI um Hilfe',
    aitool_file_title:    'Datei importieren',
    aitool_file_sub:      'PDF, Word oder Text hochladen — KI erstellt Karten oder Zusammenfassung',
    aitool_explain_title: 'Erklärung pro Karte',
    aitool_explain_sub:   'Klicke auf ✨ Erklärung für eine tiefere Erläuterung',
    aitool_summaries_title:'Meine Zusammenfassungen',
    aitool_summaries_sub: 'Frühere Zusammenfassungen deiner Dateien ansehen',
    file_modal_title:     'Datei importieren',
    file_modal_hint:      'Lade eine PDF-, Word- (.docx), PowerPoint- (.pptx) oder Textdatei hoch — die KI erstellt Karteikarten oder eine Zusammenfassung.',
    file_drop_text:       'Klicken um eine Datei auszuwählen',
    file_drop_sub:        'PDF, Word, PowerPoint oder .txt · max 10MB',
    file_btn_cards:       '✨ Karten erstellen',
    file_btn_summary:     '📝 Zusammenfassung',
    file_saved_hint:      '✅ Zusammenfassung gespeichert — unter KI-Tools → Meine Zusammenfassungen abrufbar',
    summaries_modal_title:'Meine Zusammenfassungen',
    summaries_empty:      'Noch keine Zusammenfassungen. Erstelle eine über Datei importieren → Zusammenfassung.',
    summaries_loading:    'Laden...',
    summaries_error:      'Zusammenfassungen konnten nicht geladen werden.',
    summary_delete_confirm:'Zusammenfassung löschen?',
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
    tab_write:            'Écrire',
    empty_write:          'Ajoute des cartes pour commencer.',
    nav_settings:         'Paramètres',
    nav_groups:           'Groupes',
    nav_discover:         'Découvrir',
    nav_ai:               'Outils IA',
    aitool_generate_title:'Générer des cartes',
    aitool_generate_sub:  'Colle du texte — l\'IA crée des flashcards',
    aitool_studyplan_title:'Plan d\'étude',
    aitool_studyplan_sub: 'L\'IA crée un plan d\'étude personnalisé',
    aitool_hint_title:    'Pratiquer avec indices',
    aitool_hint_sub:      'Pratique avec des cartes et demande un indice à l\'IA',
    aitool_file_title:    'Importer un fichier',
    aitool_file_sub:      'PDF, Word ou texte — l\'IA crée des cartes ou un résumé',
    aitool_explain_title: 'Explication par carte',
    aitool_explain_sub:   'Clique sur ✨ Explication pour une explication approfondie',
    aitool_summaries_title:'Mes résumés',
    aitool_summaries_sub: 'Consulte tes résumés enregistrés',
    file_modal_title:     'Importer un fichier',
    file_modal_hint:      'Télécharge un fichier PDF, Word (.docx), PowerPoint (.pptx) ou texte — l\'IA en fait des flashcards ou un résumé.',
    file_drop_text:       'Cliquer pour choisir un fichier',
    file_drop_sub:        'PDF, Word, PowerPoint ou .txt · max 10Mo',
    file_btn_cards:       '✨ Créer des cartes',
    file_btn_summary:     '📝 Résumé',
    file_saved_hint:      '✅ Résumé enregistré — retrouvable via Outils IA → Mes résumés',
    summaries_modal_title:'Mes résumés',
    summaries_empty:      'Aucun résumé enregistré. Crée-en un via Importer un fichier → Résumé.',
    summaries_loading:    'Chargement...',
    summaries_error:      'Impossible de charger les résumés.',
    summary_delete_confirm:'Supprimer ce résumé ?',
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
    tab_write:            'Escribir',
    empty_write:          'Añade tarjetas primero para practicar.',
    nav_settings:         'Ajustes',
    nav_groups:           'Grupos',
    nav_discover:         'Descubrir',
    nav_ai:               'Herramientas IA',
    aitool_generate_title:'Generar tarjetas',
    aitool_generate_sub:  'Pega texto — la IA crea flashcards',
    aitool_studyplan_title:'Plan de estudio',
    aitool_studyplan_sub: 'La IA crea un plan de estudio personalizado',
    aitool_hint_title:    'Practicar con pistas',
    aitool_hint_sub:      'Practica con tarjetas y pide una pista a la IA',
    aitool_file_title:    'Importar archivo',
    aitool_file_sub:      'PDF, Word o texto — la IA crea tarjetas o resumen',
    aitool_explain_title: 'Explicación por tarjeta',
    aitool_explain_sub:   'Haz clic en ✨ Explicación para una explicación detallada',
    aitool_summaries_title:'Mis resúmenes',
    aitool_summaries_sub: 'Consulta tus resúmenes guardados',
    file_modal_title:     'Importar archivo',
    file_modal_hint:      'Sube un PDF, Word (.docx), PowerPoint (.pptx) o archivo de texto — la IA crea flashcards o un resumen.',
    file_drop_text:       'Clic para elegir un archivo',
    file_drop_sub:        'PDF, Word, PowerPoint o .txt · máx 10MB',
    file_btn_cards:       '✨ Crear tarjetas',
    file_btn_summary:     '📝 Resumen',
    file_saved_hint:      '✅ Resumen guardado — encuéntralo en Herramientas IA → Mis resúmenes',
    summaries_modal_title:'Mis resúmenes',
    summaries_empty:      'Ningún resumen guardado. Crea uno en Importar archivo → Resumen.',
    summaries_loading:    'Cargando...',
    summaries_error:      'No se pudieron cargar los resúmenes.',
    summary_delete_confirm:'¿Eliminar este resumen?',
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
    tab_write:            'Escrever',
    empty_write:          'Adicione cartões primeiro para praticar.',
    nav_settings:         'Configurações',
    nav_groups:           'Grupos',
    nav_discover:         'Descobrir',
    nav_ai:               'Ferramentas IA',
    aitool_generate_title:'Gerar cartões',
    aitool_generate_sub:  'Cole texto — a IA cria flashcards',
    aitool_studyplan_title:'Plano de estudo',
    aitool_studyplan_sub: 'A IA cria um plano de estudo personalizado',
    aitool_hint_title:    'Praticar com dicas',
    aitool_hint_sub:      'Pratique com cartões e peça uma dica à IA',
    aitool_file_title:    'Importar arquivo',
    aitool_file_sub:      'PDF, Word ou texto — a IA cria cartões ou resumo',
    aitool_explain_title: 'Explicação por cartão',
    aitool_explain_sub:   'Clique em ✨ Explicação para uma explicação detalhada',
    aitool_summaries_title:'Meus resumos',
    aitool_summaries_sub: 'Veja seus resumos salvos',
    file_modal_title:     'Importar arquivo',
    file_modal_hint:      'Envie um PDF, Word (.docx), PowerPoint (.pptx) ou arquivo de texto — a IA cria flashcards ou um resumo.',
    file_drop_text:       'Clique para escolher um arquivo',
    file_drop_sub:        'PDF, Word, PowerPoint ou .txt · máx 10MB',
    file_btn_cards:       '✨ Criar cartões',
    file_btn_summary:     '📝 Resumo',
    file_saved_hint:      '✅ Resumo salvo — encontre em Ferramentas IA → Meus resumos',
    summaries_modal_title:'Meus resumos',
    summaries_empty:      'Nenhum resumo salvo. Crie um em Importar arquivo → Resumo.',
    summaries_loading:    'Carregando...',
    summaries_error:      'Não foi possível carregar os resumos.',
    summary_delete_confirm:'Excluir este resumo?',
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
    tab_write:            'Write',
    empty_write:          'Add some cards first to start practising.',
    nav_settings:         'Settings',
    nav_groups:           'Groups',
    nav_discover:         'Discover',
    nav_ai:               'AI Tools',
    aitool_generate_title:'Generate cards',
    aitool_generate_sub:  'Paste text — AI creates flashcards',
    aitool_studyplan_title:'Study plan',
    aitool_studyplan_sub: 'AI creates a personal study plan',
    aitool_hint_title:    'Practice with hints',
    aitool_hint_sub:      'Practice with cards and ask AI for a hint',
    aitool_file_title:    'Import file',
    aitool_file_sub:      'Upload PDF, Word or text — AI makes flashcards or summary',
    aitool_explain_title: 'Card explanation',
    aitool_explain_sub:   'Click ✨ Explanation on a card for a deeper explanation',
    aitool_summaries_title:'My summaries',
    aitool_summaries_sub: 'View your saved summaries',
    file_modal_title:     'Import file',
    file_modal_hint:      'Upload a PDF, Word (.docx), PowerPoint (.pptx) or text file — the AI turns it into flashcards or a summary.',
    file_drop_text:       'Click to choose a file',
    file_drop_sub:        'PDF, Word, PowerPoint or .txt · max 10MB',
    file_btn_cards:       '✨ Make flashcards',
    file_btn_summary:     '📝 Summary',
    file_saved_hint:      '✅ Summary saved — find it under AI Tools → My summaries',
    summaries_modal_title:'My summaries',
    summaries_empty:      'No summaries saved yet. Create one via Import file → Summary.',
    summaries_loading:    'Loading...',
    summaries_error:      'Could not load summaries.',
    summary_delete_confirm:'Delete this summary?',
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
    const mode = window._pendingAuthMode || 'login';
    window._pendingAuthMode = null;
    showAuthTab(mode);
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
  const tabWriteLabel = document.getElementById('tab-write-label');
  if (tabWriteLabel) tabWriteLabel.textContent = t('tab_write');
  const writeEmptyText = document.getElementById('write-empty-text');
  if (writeEmptyText) writeEmptyText.textContent = t('empty_write');

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
  const navDiscoverLabel = document.getElementById('nav-discover-label');
  if (navDiscoverLabel) navDiscoverLabel.textContent = t('nav_discover');
  const bnavDiscoverLabel = document.getElementById('bnav-discover-label');
  if (bnavDiscoverLabel) bnavDiscoverLabel.textContent = t('nav_discover');
  const navGroupsLabel = document.getElementById('nav-groups-label');
  if (navGroupsLabel) navGroupsLabel.textContent = t('nav_groups');
  const bnavGroupsLabel = document.getElementById('bnav-groups-label');
  if (bnavGroupsLabel) bnavGroupsLabel.textContent = t('nav_groups');
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

  // Nav AI label
  const navAiLabel = document.getElementById('nav-ai-label');
  if (navAiLabel) navAiLabel.textContent = t('nav_ai');

  // AI tool cards
  const toolCards = [
    ['aitool-generate',  'aitool_generate_title',  'aitool_generate_sub'],
    ['aitool-studyplan', 'aitool_studyplan_title',  'aitool_studyplan_sub'],
    ['aitool-hint',      'aitool_hint_title',       'aitool_hint_sub'],
    ['aitool-file',      'aitool_file_title',       'aitool_file_sub'],
    ['aitool-explain',   'aitool_explain_title',    'aitool_explain_sub'],
    ['aitool-summaries', 'aitool_summaries_title',  'aitool_summaries_sub'],
  ];
  toolCards.forEach(([id, titleKey, subKey]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const strong = el.querySelector('strong');
    const span = el.querySelector('span');
    if (strong) strong.textContent = t(titleKey);
    if (span) span.textContent = t(subKey);
  });

  // Modal: bestand importeren
  const fileModalTitle = document.querySelector('#modal-file .ai-modal-header span');
  if (fileModalTitle) fileModalTitle.textContent = '📄 ' + t('file_modal_title');
  const fileModalHint = document.querySelector('#modal-file .modal-hint');
  if (fileModalHint) fileModalHint.textContent = t('file_modal_hint');
  const fileDropText = document.querySelector('#file-drop-zone .file-drop-text');
  if (fileDropText) fileDropText.textContent = t('file_drop_text');
  const fileDropSub = document.querySelector('#file-drop-zone .file-drop-sub');
  if (fileDropSub) fileDropSub.textContent = t('file_drop_sub');
  const btnFileCards = document.getElementById('btn-file-cards');
  if (btnFileCards && !btnFileCards.disabled) btnFileCards.textContent = t('file_btn_cards');
  const btnFileSummary = document.getElementById('btn-file-summary');
  if (btnFileSummary && !btnFileSummary.disabled) btnFileSummary.textContent = t('file_btn_summary');

  // Modal: mijn samenvattingen
  const sumModalTitle = document.querySelector('#modal-summaries .ai-modal-header span');
  if (sumModalTitle) sumModalTitle.textContent = '📋 ' + t('summaries_modal_title');
}

// ── State ────────────────────────────────────────────────────
let currentDeckId = null;
let currentDeckName = '';
let sessionCards = [];
let sessionIndex = 0;
let sessionCorrect = 0;
let sessionMode = '';
let sessionDeckId = null;
let flipped = false;

const fcSession  = { cards: [], index: 0, correct: 0, deckId: null };
const qzSession  = { cards: [], index: 0, correct: 0, deckId: null };

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
    loadHardCards();
  }

  if (page === 'leaderboard') {
    document.getElementById('nav-leaderboard').classList.add('active');
    setTopbar('🏆 Leaderboard', []);
    loadLeaderboard();
  }

  if (page === 'help') {
    document.getElementById('nav-help').classList.add('active');
    setTopbar(t('nav_help'), []);
    document.getElementById('help-nl').classList.toggle('hidden', currentLang === 'en');
    document.getElementById('help-en').classList.toggle('hidden', currentLang !== 'en');
  }

  if (page === 'ai') {
    document.getElementById('nav-ai').classList.add('active');
    setTopbar('✨ AI Tools', []);
    const hasDeck = !!currentDeckId;
    document.getElementById('page-ai').querySelectorAll('.ai-tool-card').forEach(c => {
      c.classList.toggle('ai-tool-disabled', !hasDeck);
    });
    const intro = document.querySelector('.ai-tools-intro');
    if (intro) intro.textContent = hasDeck
      ? `Actief deck: ${currentDeckName}`
      : 'Selecteer eerst een deck via Mijn Decks, dan kun je de AI tools gebruiken.';
  }

  if (page === 'home') {
    document.getElementById('nav-home').classList.add('active');
    document.getElementById('nav-deck').style.display = 'none';
    setTopbar(t('nav_home'), [
      btn('primary', t('btn_new_deck'), "openModal('modal-new-deck')")
    ]);
    updateHomeWelcome();
    updateProfileUI();
    renderQuests();
    renderBadges();
    loadDecks();
    loadDueWidget();
    checkStreakBanner();
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

  if (page === 'settings') {
    setTopbar('⚙️ ' + t('nav_settings'), []);
    initPushSettingsUI();
  }

  if (page === 'discover') {
    document.getElementById('nav-discover').classList.add('active');
    setTopbar('🌍 ' + t('nav_discover'), []);
    loadDiscover();
  }

  if (page === 'groups') {
    document.getElementById('nav-groups').classList.add('active');
    setTopbar('👥 ' + t('nav_groups'), []);
    loadGroups();
  }

  // Bottom nav active state
  document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
  const bnavMap = { home: 'bnav-home', ai: 'bnav-ai', stats: 'bnav-stats', groups: 'bnav-groups', discover: 'bnav-discover', leaderboard: 'bnav-leaderboard', settings: 'bnav-settings', deck: 'bnav-home', result: 'bnav-home' };
  const bnavId = bnavMap[page];
  if (bnavId) { const el = document.getElementById(bnavId); if (el) el.classList.add('active'); }
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
  ['cards', 'flashcard', 'quiz', 'write', 'match'].forEach(name => {
    const c = document.getElementById('tab-content-' + name);
    if (c) c.classList.add('hidden');
    const t = document.getElementById('tab-' + name);
    if (t) t.classList.remove('active');
  });
  document.getElementById('tab-content-' + tab).classList.remove('hidden');
  document.getElementById('tab-' + tab).classList.add('active');

  if (tab === 'cards')     loadCards();
  if (tab === 'flashcard') startFlashcards();
  if (tab === 'quiz')      startQuiz();
  if (tab === 'write')     startWriteMode();
  if (tab === 'match')     startMatch();
}

// ── Decks ────────────────────────────────────────────────────
function updateHomeWelcome() {
  const greeting = document.getElementById('home-greeting');
  const sub = document.getElementById('home-sub');
  const pill = document.getElementById('home-streak-pill');
  const pillNum = document.getElementById('home-streak-num');
  if (!greeting) return;

  const hour = new Date().getHours();
  const name = currentUser?.username || '';
  let greetText = hour < 12 ? '☀️ Goedemorgen' : hour < 18 ? '👋 Hallo' : '🌙 Goedenavond';
  if (currentLang === 'en') greetText = hour < 12 ? '☀️ Good morning' : hour < 18 ? '👋 Hey' : '🌙 Good evening';
  if (currentLang === 'de') greetText = hour < 12 ? '☀️ Guten Morgen' : hour < 18 ? '👋 Hallo' : '🌙 Guten Abend';
  if (currentLang === 'fr') greetText = hour < 12 ? '☀️ Bonjour' : hour < 18 ? '👋 Salut' : '🌙 Bonsoir';
  if (currentLang === 'es') greetText = hour < 12 ? '☀️ Buenos días' : hour < 18 ? '👋 Hola' : '🌙 Buenas noches';
  if (currentLang === 'pt') greetText = hour < 12 ? '☀️ Bom dia' : hour < 18 ? '👋 Olá' : '🌙 Boa noite';

  greeting.textContent = name ? `${greetText}, ${name}` : greetText;

  const streak = currentUser?.streak || 0;
  if (streak > 0) {
    pill.style.display = 'flex';
    pillNum.textContent = streak;
  } else {
    pill.style.display = 'none';
  }
}

let decks = [];
let userXP = 0;
let unlockedBadges = new Set();

async function loadDecks() {
  const res = await fetch('/api/decks');
  decks = await res.json();
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
        <button class="btn primary" data-open-id="${d.id}">${t('btn_open')}</button>
        <button class="btn secondary" data-del-id="${d.id}">${t('btn_delete')}</button>
        <button class="btn accent" data-share-id="${d.id}" title="Deel dit deck">🔗</button>
      </div>
    </div>`;
  }).join('');

  el.querySelectorAll('[data-open-id]').forEach(btn => {
    const deck = decks.find(d => d.id === Number(btn.dataset.openId));
    btn.addEventListener('click', () => openDeck(deck.id, deck.name));
  });
  el.querySelectorAll('[data-del-id]').forEach(btn => {
    btn.addEventListener('click', (e) => deleteDeck(Number(btn.dataset.delId), e));
  });
  el.querySelectorAll('[data-share-id]').forEach(btn => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); openShareModal(Number(btn.dataset.shareId)); });
  });
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
  addXP(XP_REWARDS.create_deck, `+${XP_REWARDS.create_deck} XP`);
  unlockBadge('first_deck');
  updateQuestProgress('create_deck', 1);
  checkBadges();
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
  if (isDemoMode) { renderDemoCards(); return; }
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
        <button class="btn ai-btn-small" data-explain-id="${c.id}">✨ Uitleg</button>
        <button class="btn secondary" data-edit-id="${c.id}">${t('btn_edit')}</button>
        <button class="btn danger" data-delete-id="${c.id}">${t('btn_delete')}</button>
      </div>
    </div>
  `).join('');

  el.querySelectorAll('[data-explain-id]').forEach(btn => {
    const id = Number(btn.dataset.explainId);
    const card = cards.find(c => c.id === id);
    btn.addEventListener('click', () => explainCard(card, cards));
  });
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
  markStudiedToday();
  const empty = document.getElementById('fc-empty');
  const wrapper = document.getElementById('fc-wrapper');
  if (fcSession.deckId === currentDeckId && fcSession.index < fcSession.cards.length) {
    sessionCards = fcSession.cards; sessionIndex = fcSession.index; sessionCorrect = fcSession.correct;
    sessionMode = 'flashcard'; sessionDeckId = currentDeckId;
    empty.style.display = 'none'; wrapper.style.display = 'flex';
    showFlashcard(); return;
  }
  const cards = isDemoMode ? DEMO_CARDS : await (await fetch('/api/decks/' + currentDeckId + '/cards')).json();
  if (cards.length === 0) { empty.style.display = 'block'; wrapper.style.display = 'none'; return; }
  sessionCards = shuffle([...cards]); sessionIndex = 0; sessionCorrect = 0;
  sessionMode = 'flashcard'; sessionDeckId = currentDeckId;
  fcSession.deckId = currentDeckId; fcSession.cards = sessionCards; fcSession.index = 0; fcSession.correct = 0;
  empty.style.display = 'none'; wrapper.style.display = 'flex';
  showFlashcard();
}

function showFlashcard() {
  const card = sessionCards[sessionIndex];
  document.getElementById('fc-question').textContent = card.question;
  document.getElementById('fc-answer').textContent   = card.answer;
  document.getElementById('fc-counter').textContent  = `${sessionIndex + 1} / ${sessionCards.length}`;
  document.getElementById('fc-progress').style.width = ((sessionIndex + 1) / sessionCards.length * 100) + '%';
  document.getElementById('flashcard-inner').classList.remove('flipped');
  const hintBox = document.getElementById('hint-box');
  if (hintBox) { hintBox.classList.add('hidden'); hintBox.textContent = ''; }
  flipped = false;
}

function flipCard() {
  document.getElementById('flashcard-inner').classList.toggle('flipped');
  flipped = !flipped;
}

function nextCard(correct) {
  const card = sessionCards[sessionIndex];
  reviewCard(card.id, correct);
  if (correct) {
    sessionCorrect++;
    markCardMastered(card.id);
    showConfetti();
  }
  sessionIndex++;
  fcSession.index = sessionIndex; fcSession.correct = sessionCorrect;
  if (sessionIndex >= sessionCards.length) { fcSession.deckId = null; return showResult(); }
  showFlashcard();
}

// ── Quiz ─────────────────────────────────────────────────────
async function startQuiz() {
  markStudiedToday();
  const empty = document.getElementById('quiz-empty');
  const wrapper = document.getElementById('quiz-wrapper');
  if (qzSession.deckId === currentDeckId && qzSession.index < qzSession.cards.length) {
    sessionCards = qzSession.cards; sessionIndex = qzSession.index; sessionCorrect = qzSession.correct;
    sessionMode = 'quiz'; sessionDeckId = currentDeckId;
    empty.style.display = 'none'; wrapper.style.display = 'flex';
    showQuizQuestion(); return;
  }
  const cards = isDemoMode ? DEMO_CARDS : await (await fetch('/api/decks/' + currentDeckId + '/cards')).json();
  if (cards.length < 2) { empty.style.display = 'block'; wrapper.style.display = 'none'; return; }
  sessionCards = shuffle([...cards]); sessionIndex = 0; sessionCorrect = 0;
  sessionMode = 'quiz'; sessionDeckId = currentDeckId;
  qzSession.deckId = currentDeckId; qzSession.cards = sessionCards; qzSession.index = 0; qzSession.correct = 0;
  empty.style.display = 'none'; wrapper.style.display = 'flex';
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

  const optEl = document.getElementById('quiz-options');
  optEl.innerHTML = options.map(opt => `<button class="quiz-option">${esc(opt)}</button>`).join('');
  optEl.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => answerQuiz(btn, btn.textContent, card.answer));
  });
}

function answerQuiz(btn, chosen, correct) {
  document.querySelectorAll('.quiz-option').forEach(b => {
    b.disabled = true;
    if (b.textContent.trim() === correct.trim()) b.classList.add('correct');
  });
  if (chosen.trim() === correct.trim()) { btn.classList.add('correct'); sessionCorrect++; showConfetti(); }
  else btn.classList.add('wrong');
  setTimeout(() => {
    sessionIndex++;
    qzSession.index = sessionIndex; qzSession.correct = sessionCorrect;
    if (sessionIndex >= sessionCards.length) { qzSession.deckId = null; showResult(); }
    else showQuizQuestion();
  }, 1200);
}

// ── Result ───────────────────────────────────────────────────
function showResult() {
  const pct = Math.round(sessionCorrect / sessionCards.length * 100);
  const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📖';
  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-text').textContent  = t('result_text', sessionCorrect, sessionCards.length, pct);
  if (sessionMode === 'quiz') {
    recordQuizStat(currentDeckName, sessionCorrect, sessionCards.length);
    recordQuizStatServer(currentDeckId, currentDeckName, sessionCorrect, sessionCards.length);
  }
  if (sessionCorrect > 0) {
    const xpGain = sessionCorrect * XP_REWARDS.correct_card;
    addXP(xpGain, `+${xpGain} XP`);
    addTotalCorrect(sessionCorrect);
    updateQuestProgress('study_cards', sessionCorrect);
    checkBadges();
  }
  showPage('result');
}

function retrySession() {
  showPage('deck');
  switchTab(sessionMode === 'flashcard' ? 'flashcard' : sessionMode === 'write' ? 'write' : 'quiz');
}

// ── Schrijfmodus ─────────────────────────────────────────────
let writeSession = { cards: [], index: 0, correct: 0, deckId: null, answered: false };

async function startWriteMode() {
  const empty   = document.getElementById('write-empty');
  const wrapper = document.getElementById('write-wrapper');
  if (writeSession.deckId === currentDeckId && writeSession.index < writeSession.cards.length) {
    empty.style.display = 'none'; wrapper.style.display = 'flex';
    showWriteCard(); return;
  }
  const res   = await fetch('/api/decks/' + currentDeckId + '/cards');
  const cards = await res.json();
  if (cards.length === 0) { empty.style.display = 'block'; wrapper.style.display = 'none'; return; }
  writeSession = { cards: shuffle([...cards]), index: 0, correct: 0, deckId: currentDeckId, answered: false };
  empty.style.display = 'none'; wrapper.style.display = 'flex';
  showWriteCard();
}

function showWriteCard() {
  const card = writeSession.cards[writeSession.index];
  document.getElementById('write-question').textContent   = card.question;
  document.getElementById('write-counter').textContent    = `${writeSession.index + 1} / ${writeSession.cards.length}`;
  document.getElementById('write-progress').style.width  = ((writeSession.index + 1) / writeSession.cards.length * 100) + '%';
  const inp = document.getElementById('write-answer-input');
  inp.value = ''; inp.disabled = false;
  document.getElementById('write-feedback').className    = 'write-feedback hidden';
  document.getElementById('write-feedback').innerHTML    = '';
  document.getElementById('write-next-row').classList.add('hidden');
  document.getElementById('write-check-btn').classList.remove('hidden');
  writeSession.answered = false;
  setTimeout(() => inp.focus(), 50);
}

function normalizeAns(s) {
  return s.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0)
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function checkWriteAnswer() {
  if (writeSession.answered) return;
  const card      = writeSession.cards[writeSession.index];
  const userNorm  = normalizeAns(document.getElementById('write-answer-input').value);
  const corrNorm  = normalizeAns(card.answer);
  const exact     = userNorm === corrNorm;
  const maxDist   = Math.max(1, Math.floor(corrNorm.length * 0.2));
  const almost    = !exact && levenshtein(userNorm, corrNorm) <= maxDist;
  const isCorrect = exact || almost;

  const fb = document.getElementById('write-feedback');
  fb.classList.remove('hidden');
  if (exact) {
    fb.className = 'write-feedback write-correct';
    fb.innerHTML = `✓ Correct!`;
    writeSession.correct++;
    showConfetti();
  } else if (almost) {
    fb.className = 'write-feedback write-almost';
    fb.innerHTML = `~ Bijna goed! Juiste antwoord: <strong>${esc(card.answer)}</strong>`;
    writeSession.correct++;
  } else {
    fb.className = 'write-feedback write-wrong';
    fb.innerHTML = `✗ Fout. Juiste antwoord: <strong>${esc(card.answer)}</strong>`;
  }

  writeSession.answered = true;
  document.getElementById('write-answer-input').disabled = true;
  document.getElementById('write-check-btn').classList.add('hidden');
  document.getElementById('write-next-row').classList.remove('hidden');

  reviewCard(card.id, isCorrect);
  if (isCorrect) markCardMastered(card.id);
}

function nextWriteCard() {
  writeSession.index++;
  if (writeSession.index >= writeSession.cards.length) {
    sessionCorrect  = writeSession.correct;
    sessionCards    = writeSession.cards;
    sessionMode     = 'write';
    writeSession.deckId = null;
    showResult();
  } else {
    showWriteCard();
  }
}

// ── Toetsenbordinvoer ─────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  const tag = e.target.tagName;
  if (tag === 'TEXTAREA') return;

  // Enter in schrijfmodus invoerveld
  if (tag === 'INPUT' && e.target.id === 'write-answer-input') {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!writeSession.answered) checkWriteAnswer();
      else nextWriteCard();
    }
    return;
  }
  if (tag === 'INPUT') return;

  // Flashcard sneltoetsen (alleen als flashcard tab actief is)
  const fcTab = document.getElementById('tab-content-flashcard');
  if (!fcTab || fcTab.classList.contains('hidden')) return;

  if (e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault();
    flipCard();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    nextCard(true);
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    nextCard(false);
  }
});

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
  const cards = parsedBulkCards.filter(c => c.ok);
  if (!cards.length) return;
  const btn = document.getElementById('btn-bulk-import');
  btn.disabled = true;
  btn.textContent = '⏳ Bezig...';
  await fetch('/api/decks/' + currentDeckId + '/cards/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cards })
  });
  btn.disabled = false;
  document.getElementById('input-bulk').value = '';
  document.getElementById('bulk-preview').classList.add('hidden');
  btn.classList.add('hidden');
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

function showAuthModal(mode) {
  document.getElementById('modal-auth').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (mode) showAuthTab(mode);
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
  document.getElementById('auth-username-hint').classList.toggle('hidden', isLogin);
  applyAuthLang();
  document.getElementById('auth-username').focus();
}

async function submitAuth() {
  const username = document.getElementById('auth-username').value.trim();
  const password = document.getElementById('auth-password').value;
  const errEl = document.getElementById('auth-error');
  errEl.classList.add('hidden');
  if (authMode === 'register' && username.includes('@')) {
    errEl.textContent = 'Gebruik geen emailadres als gebruikersnaam — kies een bijnaam.';
    errEl.classList.remove('hidden');
    return;
  }
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
  userXP = data.xp || 0;
  document.getElementById('auth-password').value = '';
  document.getElementById('auth-username').value = '';
  hideAuthModal();
  hideLanding();
  updateUserDisplay();
  renderStreak(data.streak);
  showPage('home');
  if (typeof loadSidebarPlans === 'function') loadSidebarPlans();
  loadBadges();
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

// ── Landing ───────────────────────────────────────────────────
// ── Demo mode ─────────────────────────────────────────────────
let isDemoMode = false;

const DEMO_CARDS = [
  { id: 1, question: 'What is photosynthesis?', answer: 'The process by which plants convert sunlight, water and CO₂ into glucose and oxygen.' },
  { id: 2, question: 'What is the powerhouse of the cell?', answer: 'The mitochondria — it produces ATP through cellular respiration.' },
  { id: 3, question: 'What is DNA?', answer: 'Deoxyribonucleic acid — a molecule that carries the genetic instructions for life.' },
  { id: 4, question: 'What is osmosis?', answer: 'The movement of water through a semi-permeable membrane from low to high solute concentration.' },
  { id: 5, question: 'What is Newton\'s second law?', answer: 'Force equals mass times acceleration: F = ma.' },
  { id: 6, question: 'What is the speed of light?', answer: 'Approximately 299,792,458 metres per second (3 × 10⁸ m/s).' },
];

function startDemo() {
  isDemoMode = true;
  hideLanding();
  document.getElementById('demo-banner').classList.remove('hidden');
  currentDeckId = 'demo';
  currentDeckName = '🎓 Biology & Physics Demo';
  document.getElementById('nav-deck-label').textContent = currentDeckName;
  document.getElementById('nav-deck').style.display = '';
  showPage('deck');
  switchTab('cards');
}

function exitDemo() {
  isDemoMode = false;
  document.getElementById('demo-banner').classList.add('hidden');
  showLanding();
}

function renderDemoCards() {
  const el = document.getElementById('card-list');
  el.innerHTML = DEMO_CARDS.map(c => `
    <div class="learn-card">
      <p class="card-q">${c.question}</p>
      <p class="card-a">${c.answer}</p>
      <div class="card-actions">
        <span class="demo-locked">🔒 Maak een account aan om te bewerken</span>
      </div>
    </div>
  `).join('');
}

function showLanding() {
  document.getElementById('landing').classList.remove('hidden');
  document.querySelector('.layout').style.display = 'none';
}
function hideLanding() {
  document.getElementById('landing').classList.add('hidden');
  document.querySelector('.layout').style.display = '';
}
function showAuthFromLanding(mode) {
  hideLanding();
  if (mode) showAuthTab(mode);
  showAuthModal();
}

// ── Init ─────────────────────────────────────────────────────
async function init() {
  const meRes = await fetch('/api/me');
  const meData = await meRes.json();
  currentUser = meData.user;

  applyLang();
  if (currentUser) {
    userXP = meData.user.xp || 0;
    updateUserDisplay();
    renderStreak(meData.user.streak);
    const darkBtn = document.getElementById('dark-toggle');
    if (darkBtn) darkBtn.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
    showPage('home');
    if (typeof loadSidebarPlans === 'function') loadSidebarPlans();
    loadBadges();
  } else {
    showLanding();
  }
  checkShareUrl();
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
function renderStreak(streak) {
  const badge = document.getElementById('streak-badge');
  if (!currentUser || !streak || streak < 1) { badge.classList.add('hidden'); return; }
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

// ── App delen ─────────────────────────────────────────────────
const APP_URL = 'https://easytoets.up.railway.app';
const APP_TEXT = 'Leer slimmer met EasyToets — gratis flashcards, AI-hints en meer! 🚀';

function shareApp() {
  if (navigator.share) {
    navigator.share({ title: 'EasyToets', text: APP_TEXT, url: APP_URL }).catch(() => {});
  } else {
    openModal('modal-share-app');
  }
}
function shareToX() {
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(APP_TEXT + '\n' + APP_URL)}`, '_blank');
}
function shareToWhatsApp() {
  window.open(`https://wa.me/?text=${encodeURIComponent(APP_TEXT + '\n' + APP_URL)}`, '_blank');
}
function shareAppCopyLink() {
  navigator.clipboard.writeText(APP_URL).then(() => {
    const lbl = document.getElementById('share-app-copy-label');
    lbl.textContent = '✅ Gekopieerd!';
    setTimeout(() => lbl.textContent = 'Link kopiëren', 2000);
  });
}

// ── Dark mode ─────────────────────────────────────────────────
function toggleDark() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('et_dark', isDark ? '1' : '0');
  document.getElementById('dark-toggle').textContent = isDark ? '☀️' : '🌙';
}
(function initDark() {
  if (localStorage.getItem('et_dark') === '1') {
    document.documentElement.classList.add('dark');
    document.addEventListener('DOMContentLoaded', () => {
      const btn = document.getElementById('dark-toggle');
      if (btn) btn.textContent = '☀️';
    });
  }
})();

// ── Leaderboard ───────────────────────────────────────────────
async function loadLeaderboard() {
  const res = await fetch('/api/leaderboard');
  const rows = await res.json();
  const me = currentUser?.username;
  document.getElementById('leaderboard-list').innerHTML = rows.map((r, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
    const isMe = r.username === me;
    return `<div class="lb-row${isMe ? ' lb-me' : ''}">
      <span class="lb-rank">${medal}</span>
      <span class="lb-name">${esc(r.username)}${isMe ? ' <span class="lb-you">(jij)</span>' : ''}</span>
      <span class="lb-streak">🔥 ${r.streak}</span>
      <span class="lb-score">${r.quiz_count} toetsen · ${r.avg_pct}% gem.</span>
    </div>`;
  }).join('') || '<p class="stats-empty">Nog geen gegevens.</p>';
}

// ── Stats uitbreiden met moeilijke kaartjes ───────────────────
async function loadHardCards() {
  const res = await fetch('/api/quiz-stats/hard-cards');
  if (!res.ok) return;
  const cards = await res.json();
  const wrap = document.getElementById('hard-cards-wrap');
  const list = document.getElementById('hard-cards-list');
  if (!cards.length) { wrap.classList.add('hidden'); return; }
  wrap.classList.remove('hidden');
  list.innerHTML = cards.map(c => `
    <div class="hard-card-row">
      <div class="hard-card-q">${esc(c.question)}</div>
      <div class="hard-card-a">${esc(c.answer)}</div>
      <div class="hard-card-meta">${esc(c.deck_name)} · ease: ${parseFloat(c.ease).toFixed(1)}</div>
    </div>`).join('');
}

// ── Quiz stats naar server sturen ─────────────────────────────
async function recordQuizStatServer(deckId, deckName, correct, total) {
  if (!currentUser) return;
  await fetch('/api/quiz-stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deck_id: deckId, deck_name: deckName, correct, total })
  });
}

// ── Spaced repetition: kaartje beoordelen ────────────────────
async function reviewCard(cardId, correct) {
  if (!currentUser || !cardId) return;
  await fetch(`/api/cards/${cardId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correct })
  });
}

// ── Deck delen ────────────────────────────────────────────────
let shareCurrentDeckId = null;

function openShareModal(deckId) {
  shareCurrentDeckId = deckId;
  const deck = decks.find(d => d.id === deckId);
  const linkWrap = document.getElementById('share-link-wrap');
  const statusEl = document.getElementById('share-status');
  const btnEnable = document.getElementById('btn-share-enable');
  const btnDisable = document.getElementById('btn-share-disable');

  if (deck && deck.is_public && deck.share_token) {
    const link = location.origin + '/share/' + deck.share_token;
    document.getElementById('share-link-input').value = link;
    linkWrap.classList.remove('hidden');
    btnEnable.classList.add('hidden');
    btnDisable.classList.remove('hidden');
    statusEl.textContent = '🔓 Dit deck is publiek';
  } else {
    linkWrap.classList.add('hidden');
    btnEnable.classList.remove('hidden');
    btnDisable.classList.add('hidden');
    statusEl.textContent = '';
  }
  openModal('modal-share');
}

async function enableShare() {
  const res = await fetch(`/api/decks/${shareCurrentDeckId}/share`, { method: 'POST' });
  const data = await res.json();
  const link = location.origin + '/share/' + data.token;
  document.getElementById('share-link-input').value = link;
  document.getElementById('share-link-wrap').classList.remove('hidden');
  document.getElementById('btn-share-enable').classList.add('hidden');
  document.getElementById('btn-share-disable').classList.remove('hidden');
  document.getElementById('share-status').textContent = '✅ Deck is nu publiek';
  const deck = decks.find(d => d.id === shareCurrentDeckId);
  if (deck) { deck.is_public = true; deck.share_token = data.token; }
  unlockBadge('deck_shared');
  addXP(XP_REWARDS.share_deck, `+${XP_REWARDS.share_deck} XP`);
}

async function disableShare() {
  await fetch(`/api/decks/${shareCurrentDeckId}/unshare`, { method: 'POST' });
  document.getElementById('share-link-wrap').classList.add('hidden');
  document.getElementById('btn-share-enable').classList.remove('hidden');
  document.getElementById('btn-share-disable').classList.add('hidden');
  document.getElementById('share-status').textContent = '🔒 Delen gestopt';
  const deck = decks.find(d => d.id === shareCurrentDeckId);
  if (deck) { deck.is_public = false; deck.share_token = null; }
}

function copyShareLink() {
  const val = document.getElementById('share-link-input').value;
  navigator.clipboard.writeText(val).then(() => {
    document.getElementById('share-status').textContent = '✅ Link gekopieerd!';
  });
}

// ── Streak banner ─────────────────────────────────────────────
function checkStreakBanner() {
  if (!currentUser || currentUser.streak < 1) return;
  const today = new Date().toISOString().slice(0, 10);
  const lastStudied = localStorage.getItem('lastStudiedDate_' + currentUser.username);
  if (lastStudied === today) return;
  const banner = document.getElementById('streak-banner');
  if (banner) banner.classList.remove('hidden');
}

function markStudiedToday() {
  if (!currentUser) return;
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem('lastStudiedDate_' + currentUser.username, today);
  const banner = document.getElementById('streak-banner');
  if (banner) banner.classList.add('hidden');
}

// ── Spaced repetition widget ──────────────────────────────────
let dueDecks = [];

async function loadDueWidget() {
  const widget = document.getElementById('review-widget');
  const sub = document.getElementById('review-widget-sub');
  try {
    const res = await fetch('/api/due-summary');
    if (!res.ok) { widget.classList.add('hidden'); return; }
    dueDecks = await res.json();
    if (dueDecks.length === 0) { widget.classList.add('hidden'); return; }
    const total = dueDecks.reduce((s, d) => s + d.due_count, 0);
    sub.textContent = `${total} kaartje${total !== 1 ? 's' : ''} in ${dueDecks.length} deck${dueDecks.length !== 1 ? 's' : ''}`;
    widget.classList.remove('hidden');
  } catch(e) { widget.classList.add('hidden'); }
}

function startBestDueReview() {
  if (!dueDecks.length) return;
  const best = dueDecks[0];
  openDeck(best.id, best.name);
  setTimeout(() => switchTab('flashcard'), 300);
}

// ── Quizlet import ────────────────────────────────────────────
let activeBulkTab = 'manual';

function switchBulkTab(tab) {
  activeBulkTab = tab;
  document.getElementById('bulk-panel-manual').classList.toggle('hidden', tab !== 'manual');
  document.getElementById('bulk-panel-quizlet').classList.toggle('hidden', tab !== 'quizlet');
  document.getElementById('bulk-tab-manual').classList.toggle('active', tab === 'manual');
  document.getElementById('bulk-tab-quizlet').classList.toggle('active', tab === 'quizlet');
  document.getElementById('bulk-preview').classList.add('hidden');
  document.getElementById('btn-bulk-import').classList.add('hidden');
}

function parseQuizletExport(text) {
  return text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      const parts = line.split('\t');
      if (parts.length >= 2) return { question: parts[0].trim(), answer: parts[1].trim() };
      const sep = line.includes('|') ? '|' : '=';
      const idx = line.indexOf(sep);
      if (idx > 0) return { question: line.slice(0, idx).trim(), answer: line.slice(idx + 1).trim() };
      return null;
    })
    .filter(c => c && c.question && c.answer);
}

function previewBulkActive() {
  if (activeBulkTab === 'quizlet') {
    const text = document.getElementById('input-quizlet').value;
    const cards = parseQuizletExport(text);
    parsedBulkCards = cards;
    const preview = document.getElementById('bulk-preview');
    if (!cards.length) { preview.innerHTML = '<p style="color:var(--danger);font-size:0.9rem">Geen kaartjes herkend. Kopieer de volledige Quizlet export.</p>'; preview.classList.remove('hidden'); return; }
    preview.innerHTML = cards.map((c, i) =>
      `<div class="bulk-row"><span class="bulk-q">${i+1}. ${esc(c.question)}</span><span class="bulk-a">${esc(c.answer)}</span></div>`
    ).join('');
    preview.classList.remove('hidden');
    document.getElementById('btn-bulk-import').classList.remove('hidden');
  } else {
    previewBulk();
  }
}

// ── Klassengroepen ────────────────────────────────────────────
let currentGroupId = null;
let currentGroupIsOwner = false;
let currentGroupCode = '';

async function loadGroups() {
  const list = document.getElementById('groups-list');
  list.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem">Laden...</p>';
  const res = await fetch('/api/groups');
  if (!res.ok) { list.innerHTML = ''; return; }
  const groups = await res.json();
  if (!groups.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">👥</div><p>Je bent nog geen lid van een groep.<br>Maak er een aan of voer een code in.</p></div>`;
    return;
  }
  list.innerHTML = groups.map(g => `
    <div class="group-card" onclick="openGroupDetail(${g.id}, ${g.is_owner}, '${esc(g.name)}', '${esc(g.code)}')">
      <div class="group-card-info">
        <div class="group-card-name">${esc(g.name)}</div>
        <div class="group-card-meta">${g.member_count} leden · ${g.is_owner ? '👑 Jij bent beheerder' : `door ${esc(g.owner_name)}`}</div>
      </div>
      <div class="group-card-code">${esc(g.code)}</div>
    </div>`).join('');
}

async function createGroup() {
  const name = document.getElementById('input-group-name').value.trim();
  const err = document.getElementById('group-create-error');
  if (!name) { err.textContent = 'Voer een naam in'; err.classList.remove('hidden'); return; }
  err.classList.add('hidden');
  const res = await fetch('/api/groups', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
  const data = await res.json();
  if (!res.ok) { err.textContent = data.error; err.classList.remove('hidden'); return; }
  document.getElementById('input-group-name').value = '';
  closeModal('modal-create-group');
  loadGroups();
  openGroupDetail(data.id, true, data.name, data.code);
  unlockBadge('group_joined');
  addXP(XP_REWARDS.join_group, `+${XP_REWARDS.join_group} XP`);
}

async function joinGroup() {
  const code = document.getElementById('input-group-code').value.trim().toUpperCase();
  const err = document.getElementById('group-join-error');
  if (!code) { err.textContent = 'Voer een code in'; err.classList.remove('hidden'); return; }
  err.classList.add('hidden');
  const res = await fetch('/api/groups/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
  const data = await res.json();
  if (!res.ok) { err.textContent = data.error; err.classList.remove('hidden'); return; }
  document.getElementById('input-group-code').value = '';
  closeModal('modal-join-group');
  loadGroups();
  unlockBadge('group_joined');
  addXP(XP_REWARDS.join_group, `+${XP_REWARDS.join_group} XP`);
}

async function openGroupDetail(id, isOwner, name, code) {
  currentGroupId = id;
  currentGroupIsOwner = isOwner;
  currentGroupCode = code;
  document.getElementById('group-detail-title').textContent = '👥 ' + name;
  document.getElementById('group-detail-code').textContent = code;
  document.getElementById('btn-delete-group').classList.toggle('hidden', !isOwner);
  document.getElementById('btn-leave-group').classList.toggle('hidden', !!isOwner);
  document.getElementById('group-members-list').innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem">Laden...</p>';
  openModal('modal-group-detail');
  const res = await fetch(`/api/groups/${id}/members`);
  const members = await res.json();
  document.getElementById('group-members-list').innerHTML = members.map((m, i) => `
    <div class="group-member-row">
      <span class="group-member-rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`}</span>
      <span class="group-member-name">${esc(m.username)}${m.is_owner ? ' 👑' : ''}</span>
      <span class="group-member-streak">🔥 ${m.streak}</span>
      ${m.last_score != null ? `<span class="group-member-score">${m.last_score}%</span>` : ''}
    </div>`).join('');
}

function copyGroupCode() {
  navigator.clipboard.writeText(currentGroupCode).then(() => {
    document.getElementById('group-detail-code').textContent = currentGroupCode + ' ✓';
    setTimeout(() => { document.getElementById('group-detail-code').textContent = currentGroupCode; }, 1500);
  });
}

async function deleteGroup() {
  if (!confirm('Groep verwijderen? Dit kan niet ongedaan worden gemaakt.')) return;
  await fetch(`/api/groups/${currentGroupId}`, { method: 'DELETE' });
  closeModal('modal-group-detail');
  loadGroups();
}

async function leaveGroup() {
  if (!confirm('Groep verlaten?')) return;
  await fetch(`/api/groups/${currentGroupId}/leave`, { method: 'POST' });
  closeModal('modal-group-detail');
  loadGroups();
}

// ── Publieke deck-bibliotheek ─────────────────────────────────
let discoverQuery = '';

async function loadDiscover(q = '') {
  discoverQuery = q;
  const grid = document.getElementById('discover-grid');
  const status = document.getElementById('discover-status');
  grid.innerHTML = '';
  status.textContent = '⏳ Laden...';
  try {
    const url = '/api/public-decks' + (q ? '?q=' + encodeURIComponent(q) : '');
    const res = await fetch(url);
    const decks = await res.json();
    status.textContent = '';
    if (decks.length === 0) {
      grid.innerHTML = `<div class="empty-state"><div class="empty-icon">🌍</div><p>${q ? 'Geen decks gevonden voor "' + esc(q) + '".' : 'Nog geen publieke decks. Deel jouw deck als eerste!'}</p></div>`;
      return;
    }
    grid.innerHTML = decks.map(d => `
      <div class="deck-card discover-deck-card">
        <div class="discover-deck-author">👤 ${esc(d.username)}</div>
        <h3>${esc(d.name)}</h3>
        <p class="meta">${d.card_count} kaartjes</p>
        <div class="deck-progress"><div class="deck-progress-fill green" style="width:100%"></div></div>
        <div class="card-actions">
          <button class="btn primary" onclick="copyPublicDeck('${esc(d.share_token)}', this)">➕ Kopieer deck</button>
          <button class="btn secondary" onclick="previewPublicDeck('${esc(d.share_token)}', '${esc(d.name)}')">👁 Bekijk</button>
        </div>
      </div>`).join('');
  } catch(e) {
    status.textContent = 'Fout bij laden.';
  }
}

function searchDiscover() {
  const q = document.getElementById('discover-search-input').value.trim();
  loadDiscover(q);
}

async function copyPublicDeck(token, btn) {
  if (!currentUser) { showAuthModal('register'); return; }
  btn.disabled = true;
  btn.textContent = '⏳ Bezig...';
  try {
    const res = await fetch(`/api/share/${token}/copy`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Fout');
    btn.textContent = '✅ Gekopieerd!';
    btn.classList.remove('primary');
    btn.classList.add('success');
    loadDecks();
  } catch(e) {
    btn.textContent = '❌ Mislukt';
    btn.disabled = false;
  }
}

async function previewPublicDeck(token, name) {
  const res = await fetch(`/api/share/${token}`);
  if (!res.ok) return;
  const data = await res.json();
  const cards = data.cards || [];
  document.getElementById('shared-deck-info').innerHTML = `
    <p><strong>${esc(data.name)}</strong> door <em>${esc(data.username)}</em></p>
    <p class="modal-hint">${cards.length} kaartjes</p>
    <div class="discover-preview-list">
      ${cards.slice(0, 5).map(c => `<div class="discover-preview-row"><span class="bulk-q">${esc(c.question)}</span><span class="bulk-a">${esc(c.answer)}</span></div>`).join('')}
      ${cards.length > 5 ? `<p class="modal-hint" style="margin-top:0.5rem">+ ${cards.length - 5} meer...</p>` : ''}
    </div>`;
  document.getElementById('btn-copy-deck').onclick = () => { closeModal('modal-shared-deck'); copyPublicDeck(token, document.getElementById('btn-copy-deck')); };
  openModal('modal-shared-deck');
}

// ── Swipe gestures op flashcard ───────────────────────────────
(function initSwipe() {
  let startX = 0, startY = 0;
  document.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    if (!document.getElementById('fc-wrapper') || document.getElementById('fc-wrapper').style.display === 'none') return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0) answerFlashcard(false);  // swipe links = fout
    else answerFlashcard(true);           // swipe rechts = goed
  }, { passive: true });
})();

// ── Settings ─────────────────────────────────────────────────
async function changeUsername() {
  const input = document.getElementById('input-new-username');
  const err = document.getElementById('settings-username-error');
  const ok = document.getElementById('settings-username-success');
  const btn = document.getElementById('btn-change-username');
  err.classList.add('hidden'); ok.classList.add('hidden');
  btn.disabled = true;
  const res = await fetch('/api/settings/username', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: input.value })
  });
  const data = await res.json();
  btn.disabled = false;
  if (!res.ok) { err.textContent = data.error; err.classList.remove('hidden'); return; }
  currentUser.username = data.username;
  updateUserDisplay();
  input.value = '';
  ok.textContent = '✅ Gebruikersnaam gewijzigd naar ' + data.username;
  ok.classList.remove('hidden');
}

async function changePassword() {
  const cur = document.getElementById('input-current-password');
  const nw = document.getElementById('input-new-password');
  const err = document.getElementById('settings-password-error');
  const ok = document.getElementById('settings-password-success');
  const btn = document.getElementById('btn-change-password');
  err.classList.add('hidden'); ok.classList.add('hidden');
  btn.disabled = true;
  const res = await fetch('/api/settings/password', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword: cur.value, newPassword: nw.value })
  });
  const data = await res.json();
  btn.disabled = false;
  if (!res.ok) { err.textContent = data.error; err.classList.remove('hidden'); return; }
  cur.value = ''; nw.value = '';
  ok.textContent = '✅ Wachtwoord gewijzigd';
  ok.classList.remove('hidden');
}

// ── Mijn samenvattingen ───────────────────────────────────────
async function openSummariesModal() {
  openModal('modal-summaries');
  const list = document.getElementById('summaries-list');
  list.innerHTML = `<p class="stats-empty">${t('summaries_loading')}</p>`;
  const res = await fetch('/api/summaries');
  if (!res.ok) { list.innerHTML = `<p class="stats-empty">${t('summaries_error')}</p>`; return; }
  const summaries = await res.json();
  if (!summaries.length) {
    list.innerHTML = `<p class="stats-empty">${t('summaries_empty')}</p>`;
    return;
  }
  list.innerHTML = summaries.map(s => {
    const date = new Date(s.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
    return `<div class="summary-list-item">
      <div class="summary-list-info" onclick="viewSummary(${s.id}, ${JSON.stringify(s.filename)})">
        <span class="summary-list-name">📄 ${s.filename}</span>
        <span class="summary-list-date">${date}</span>
        <span class="summary-list-preview">${s.preview.replace(/[#*]/g,'').trim()}…</span>
      </div>
      <button class="btn-summary-delete" onclick="deleteSummary(${s.id}, this)" title="Verwijderen">🗑</button>
    </div>`;
  }).join('');
}

async function viewSummary(id, filename) {
  const res = await fetch('/api/summaries/' + id);
  const data = await res.json();
  document.getElementById('summary-view-title').textContent = '📄 ' + filename;
  document.getElementById('summary-view-content').innerHTML = mdToHtml(data.content);
  openModal('modal-summary-view');
}

async function deleteSummary(id, btn) {
  if (!confirm(t('summary_delete_confirm'))) return;
  await fetch('/api/summaries/' + id, { method: 'DELETE' });
  btn.closest('.summary-list-item').remove();
  const list = document.getElementById('summaries-list');
  if (!list.children.length) list.innerHTML = `<p class="stats-empty">${t('summaries_empty')}</p>`;
}

// ── Match modus ───────────────────────────────────────────────
let matchCards = [];
let matchSelected = null;
let matchMatched = 0;
let matchTimerInterval = null;
let matchSeconds = 0;
let matchErrors = 0;

async function startMatch() {
  const emptyEl = document.getElementById('match-empty');
  const wrapper = document.getElementById('match-wrapper');
  const cards = isDemoMode ? DEMO_CARDS : await (await fetch('/api/decks/' + currentDeckId + '/cards')).json();

  if (!cards || cards.length < 2) {
    emptyEl.style.display = 'block';
    wrapper.style.display = 'none';
    return;
  }
  emptyEl.style.display = 'none';
  wrapper.style.display = '';
  document.getElementById('match-win').classList.add('hidden');

  // Pick up to 6 random pairs
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  matchCards = shuffled.slice(0, Math.min(6, shuffled.length));
  matchSelected = null;
  matchMatched = 0;
  matchSeconds = 0;
  matchErrors = 0;

  const tiles = [];
  matchCards.forEach((card, i) => {
    tiles.push({ pairId: i, type: 'q', text: card.question });
    tiles.push({ pairId: i, type: 'a', text: card.answer });
  });
  tiles.sort(() => Math.random() - 0.5);

  document.getElementById('match-grid').innerHTML = tiles.map(tile =>
    `<div class="match-tile" data-pair="${tile.pairId}" data-type="${tile.type}" onclick="matchTileClick(this)">${esc(tile.text)}</div>`
  ).join('');

  document.getElementById('match-progress').textContent = `0 / ${matchCards.length}`;
  document.getElementById('match-timer').textContent = '00:00';

  clearInterval(matchTimerInterval);
  matchTimerInterval = setInterval(() => {
    matchSeconds++;
    const m = Math.floor(matchSeconds / 60).toString().padStart(2, '0');
    const s = (matchSeconds % 60).toString().padStart(2, '0');
    document.getElementById('match-timer').textContent = `${m}:${s}`;
  }, 1000);
}

function matchTileClick(el) {
  if (el.classList.contains('matched') || el.classList.contains('wrong')) return;

  if (!matchSelected) {
    if (el.classList.contains('selected')) {
      el.classList.remove('selected');
    } else {
      el.classList.add('selected');
      matchSelected = el;
    }
    return;
  }

  if (matchSelected === el) {
    el.classList.remove('selected');
    matchSelected = null;
    return;
  }

  const pA = matchSelected.dataset.pair, tA = matchSelected.dataset.type;
  const pB = el.dataset.pair, tB = el.dataset.type;

  if (pA === pB && tA !== tB) {
    matchSelected.classList.remove('selected');
    matchSelected.classList.add('matched');
    el.classList.add('matched');
    matchSelected = null;
    matchMatched++;
    document.getElementById('match-progress').textContent = `${matchMatched} / ${matchCards.length}`;
    if (matchMatched === matchCards.length) {
      clearInterval(matchTimerInterval);
      setTimeout(showMatchWin, 400);
    }
  } else {
    matchErrors++;
    const prev = matchSelected;
    matchSelected = null;
    prev.classList.remove('selected');
    prev.classList.add('wrong');
    el.classList.add('wrong');
    setTimeout(() => { prev.classList.remove('wrong'); el.classList.remove('wrong'); }, 800);
  }
}

function showMatchWin() {
  const m = Math.floor(matchSeconds / 60).toString().padStart(2, '0');
  const s = (matchSeconds % 60).toString().padStart(2, '0');
  document.getElementById('match-win-time').textContent = `${m}:${s}`;
  document.getElementById('match-win-errors').textContent = matchErrors;
  document.getElementById('match-win').classList.remove('hidden');
  showConfetti();
  addXP(XP_REWARDS.match_win, `+${XP_REWARDS.match_win} XP`);
  updateQuestProgress('play_match', 1);
  unlockBadge('match_master');
  checkBadges();
}

// ── Push notificaties ─────────────────────────────────────────
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

async function subscribeToPush() {
  const statusEl = document.getElementById('push-status-text');
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    if (statusEl) statusEl.textContent = '❌ Push notificaties worden niet ondersteund door je browser.';
    return;
  }
  try {
    const keyRes = await fetch('/api/push/vapid-key');
    const { key } = await keyRes.json();
    if (!key) { if (statusEl) statusEl.textContent = '❌ Server niet klaar. Probeer later opnieuw.'; return; }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      if (statusEl) statusEl.textContent = '❌ Toestemming geweigerd. Sta notificaties toe in je browser.';
      return;
    }

    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key) });
    await fetch('/api/push/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscription: sub }) });
    localStorage.setItem('push_subscribed', '1');
    if (statusEl) statusEl.textContent = '✅ Pushmeldingen ingeschakeld!';
    document.getElementById('btn-push-enable')?.classList.add('hidden');
    document.getElementById('btn-push-disable')?.classList.remove('hidden');
  } catch(e) {
    if (statusEl) statusEl.textContent = '❌ Fout: ' + e.message;
  }
}

async function unsubscribePush() {
  await fetch('/api/push/unsubscribe', { method: 'POST' });
  localStorage.removeItem('push_subscribed');
  const statusEl = document.getElementById('push-status-text');
  if (statusEl) statusEl.textContent = 'Pushmeldingen uitgeschakeld.';
  document.getElementById('btn-push-enable')?.classList.remove('hidden');
  document.getElementById('btn-push-disable')?.classList.add('hidden');
}

function initPushSettingsUI() {
  const enabled = localStorage.getItem('push_subscribed') === '1';
  document.getElementById('btn-push-enable')?.classList.toggle('hidden', enabled);
  document.getElementById('btn-push-disable')?.classList.toggle('hidden', !enabled);
}

// ── Gedeeld deck via URL openen (/share/TOKEN) ────────────────
let sharedDeckToken = null;
async function checkShareUrl() {
  const m = location.pathname.match(/^\/share\/([a-f0-9]+)$/);
  if (!m) return;
  sharedDeckToken = m[1];
  const res = await fetch('/api/share/' + sharedDeckToken);
  if (!res.ok) {
    document.getElementById('shared-deck-info').innerHTML = '<p style="color:var(--danger)">Dit deck bestaat niet of is niet meer gedeeld.</p>';
    openModal('modal-shared-deck');
    return;
  }
  const { deck, cards } = await res.json();
  document.getElementById('shared-deck-info').innerHTML = `
    <div class="shared-deck-preview">
      <div class="shared-deck-name">${esc(deck.name)}</div>
      <div class="shared-deck-meta">${cards.length} kaartjes · gemaakt door <strong>${esc(deck.owner)}</strong></div>
    </div>`;
  const copyBtn = document.getElementById('btn-copy-deck');
  if (!currentUser) {
    copyBtn.textContent = '🔐 Inloggen om te kopiëren';
  } else {
    copyBtn.textContent = '➕ Kopieer naar mijn decks';
  }
  if (!currentUser) hideLanding();
  openModal('modal-shared-deck');
}

async function copySharedDeck() {
  if (!currentUser) {
    closeModal('modal-shared-deck');
    showAuthModal('register');
    return;
  }
  const btn = document.getElementById('btn-copy-deck');
  btn.disabled = true;
  btn.textContent = 'Bezig...';
  const res = await fetch('/api/share/' + sharedDeckToken + '/copy', { method: 'POST' });
  const data = await res.json();
  if (data.ok) {
    closeModal('modal-shared-deck');
    await loadDecks();
    showPage('home');
    history.replaceState(null, '', '/');
  } else {
    btn.disabled = false;
    btn.textContent = '➕ Kopieer naar mijn decks';
  }
}



// ── Gamificatie ───────────────────────────────────────────────

const XP_REWARDS = {
  correct_card: 2,
  create_deck:  10,
  share_deck:   15,
  match_win:    20,
  join_group:   10,
  quest_done:   25,
};

const LEVEL_TITLES = [
  'Nieuweling', 'Leerling', 'Student', 'Kenner', 'Geleerde',
  'Expert', 'Meester', 'Grootmeester', 'Professor', 'Legende'
];

const BADGES = [
  { id: 'first_deck',   icon: '📚', label: 'Eerste deck',       desc: 'Maak je eerste deck aan' },
  { id: 'deck_shared',  icon: '🔗', label: 'Deler',             desc: 'Deel een deck publiek' },
  { id: 'match_master', icon: '🎯', label: 'Match master',      desc: 'Voltooi een match spel' },
  { id: 'group_joined', icon: '👥', label: 'Teamspeler',        desc: 'Sluit je aan bij een groep' },
  { id: 'streak_3',     icon: '🔥', label: '3-daagse streak',   desc: '3 dagen op rij geleerd' },
  { id: 'streak_7',     icon: '🔥', label: 'Weekkampioen',      desc: '7 dagen op rij geleerd' },
  { id: 'streak_30',    icon: '🔥', label: 'Maandmaster',       desc: '30 dagen op rij geleerd' },
  { id: 'cards_10',     icon: '✅', label: '10 kaarten',        desc: '10 kaarten correct beantwoord' },
  { id: 'cards_50',     icon: '✅', label: '50 kaarten',        desc: '50 kaarten correct beantwoord' },
  { id: 'cards_100',    icon: '🌟', label: '100 kaarten',       desc: '100 kaarten correct beantwoord' },
  { id: 'cards_500',    icon: '💫', label: '500 kaarten',       desc: '500 kaarten correct beantwoord' },
  { id: 'level_5',      icon: '⭐', label: 'Level 5',           desc: 'Bereik level 5' },
  { id: 'level_10',     icon: '⭐', label: 'Level 10',          desc: 'Bereik level 10' },
  { id: 'level_25',     icon: '👑', label: 'Level 25',          desc: 'Bereik level 25' },
  { id: 'level_50',     icon: '👑', label: 'Level 50',          desc: 'Bereik level 50' },
  { id: 'xp_100',       icon: '💎', label: '100 XP',            desc: 'Verdien 100 XP totaal' },
  { id: 'xp_500',       icon: '💎', label: '500 XP',            desc: 'Verdien 500 XP totaal' },
  { id: 'xp_1000',      icon: '💎', label: '1000 XP',           desc: 'Verdien 1000 XP totaal' },
];

const QUEST_TEMPLATES = [
  { id: 'study_cards', label: 'Beantwoord {n} kaarten correct', goal: 10, xp: 25 },
  { id: 'study_cards', label: 'Beantwoord {n} kaarten correct', goal: 20, xp: 50 },
  { id: 'play_match',  label: 'Speel {n} match potje(s)',        goal: 1,  xp: 30 },
  { id: 'play_match',  label: 'Speel {n} match potje(s)',        goal: 3,  xp: 60 },
  { id: 'create_deck', label: 'Maak {n} nieuw(e) deck(s) aan',  goal: 1,  xp: 20 },
];

function getLevel(xp) {
  return Math.min(50, Math.floor(Math.sqrt(xp / 50)) + 1);
}

function xpForLevel(level) {
  return (level - 1) * (level - 1) * 50;
}

function getLevelTitle(level) {
  const idx = Math.min(LEVEL_TITLES.length - 1, Math.floor((level - 1) / 5));
  return LEVEL_TITLES[idx];
}

function renderCharacterSVG(level) {
  const tier = level >= 40 ? 5 : level >= 25 ? 4 : level >= 15 ? 3 : level >= 8 ? 2 : 1;
  const colors = ['#a0c4ff', '#ffd166', '#06d6a0', '#ef476f', '#b5179e'];
  const c = colors[tier - 1];
  const crown = tier >= 4
    ? `<g transform="translate(24,4)"><polygon points="0,8 4,0 8,8" fill="#f9c74f"/><polygon points="8,8 14,2 18,8" fill="#f9c74f"/><polygon points="16,8 20,0 24,8" fill="#f9c74f"/><rect x="0" y="7" width="24" height="4" rx="2" fill="#f9c74f"/></g>`
    : '';
  const glow = tier >= 5 ? `<circle cx="36" cy="42" r="32" fill="${c}" opacity="0.18"/>` : '';
  const wings = tier >= 2
    ? `<ellipse cx="16" cy="38" rx="8" ry="5" fill="${c}" transform="rotate(-20,16,38)"/><ellipse cx="56" cy="38" rx="8" ry="5" fill="${c}" transform="rotate(20,56,38)"/>`
    : '';
  const smile = tier >= 3 ? `<path d="M28,34 Q36,40 44,34" stroke="#fff8" stroke-width="2" fill="none"/>` : '';
  return `<svg viewBox="0 0 72 80" xmlns="http://www.w3.org/2000/svg">
    ${glow}${crown}
    <ellipse cx="36" cy="50" rx="20" ry="20" fill="${c}"/>
    <circle cx="36" cy="28" r="16" fill="${c}"/>
    <circle cx="28" cy="24" r="6" fill="white"/><circle cx="44" cy="24" r="6" fill="white"/>
    <circle cx="28" cy="24" r="3" fill="#222"/><circle cx="44" cy="24" r="3" fill="#222"/>
    <circle cx="29" cy="23" r="1" fill="white"/><circle cx="45" cy="23" r="1" fill="white"/>
    <ellipse cx="36" cy="32" rx="3" ry="2" fill="#e07b39"/>
    ${wings}${smile}
  </svg>`;
}

function updateProfileUI() {
  if (!currentUser) return;
  const level = getLevel(userXP);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP    = xpForLevel(level + 1);
  const progress = level >= 50 ? 100 : Math.round((userXP - currentLevelXP) / (nextLevelXP - currentLevelXP) * 100);

  const charEl = document.getElementById('profile-char');
  if (charEl) charEl.innerHTML = renderCharacterSVG(level);

  const badgeEl = document.getElementById('profile-level-badge');
  if (badgeEl) badgeEl.textContent = 'L' + level;

  const titleEl = document.getElementById('profile-title-text');
  if (titleEl) titleEl.textContent = getLevelTitle(level);

  const barEl = document.getElementById('profile-xp-bar');
  if (barEl) barEl.style.width = progress + '%';

  const xpTextEl = document.getElementById('profile-xp-text');
  if (xpTextEl) xpTextEl.textContent = level >= 50
    ? `${userXP} XP (Max level)`
    : `${userXP} / ${nextLevelXP} XP`;
}

async function addXP(amount, label) {
  if (!currentUser || amount <= 0) return;
  const prevLevel = getLevel(userXP);
  try {
    const res = await fetch('/api/xp/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    const data = await res.json();
    userXP = data.xp;
  } catch (e) {
    userXP += amount;
  }
  const newLevel = getLevel(userXP);
  updateProfileUI();
  if (label) showXPGain(label);
  if (newLevel > prevLevel) {
    checkLevelBadges(newLevel);
    setTimeout(() => showLevelUp(newLevel), 1200);
  }
}

function showXPGain(label) {
  const el = document.createElement('div');
  el.className = 'xp-gain-toast';
  el.textContent = label;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('xp-gain-toast--show'));
  setTimeout(() => {
    el.classList.remove('xp-gain-toast--show');
    setTimeout(() => el.remove(), 400);
  }, 1800);
}

function showLevelUp(level) {
  const overlay = document.getElementById('levelup-overlay');
  if (!overlay) return;
  const charEl = document.getElementById('levelup-char');
  if (charEl) charEl.innerHTML = renderCharacterSVG(level);
  const lvlEl = document.getElementById('levelup-level');
  if (lvlEl) lvlEl.textContent = 'Level ' + level;
  const titleEl = document.getElementById('levelup-title-text');
  if (titleEl) titleEl.textContent = getLevelTitle(level);
  overlay.classList.remove('hidden');
}

function checkLevelBadges(level) {
  if (level >= 5)  unlockBadge('level_5');
  if (level >= 10) unlockBadge('level_10');
  if (level >= 25) unlockBadge('level_25');
  if (level >= 50) unlockBadge('level_50');
}

async function loadBadges() {
  if (!currentUser) return;
  try {
    const res = await fetch('/api/badges');
    const data = await res.json();
    unlockedBadges = new Set((data.badges || []).map(b => b.badge_id));
    renderBadges();
  } catch (e) {}
}

async function unlockBadge(badgeId) {
  if (!currentUser || unlockedBadges.has(badgeId)) return;
  unlockedBadges.add(badgeId);
  try {
    await fetch('/api/badges/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ badge_id: badgeId })
    });
  } catch (e) {}
  const badge = BADGES.find(b => b.id === badgeId);
  if (badge) showBadgeUnlock(badge);
  renderBadges();
}

function showBadgeUnlock(badge) {
  const el = document.createElement('div');
  el.className = 'badge-unlock-toast';
  el.innerHTML = `<span class="badge-unlock-icon">${badge.icon}</span><span><strong>Badge ontgrendeld!</strong><br>${badge.label}</span>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('badge-unlock-toast--show'));
  setTimeout(() => {
    el.classList.remove('badge-unlock-toast--show');
    setTimeout(() => el.remove(), 400);
  }, 3000);
}

function renderBadges() {
  const grid = document.getElementById('badges-grid');
  if (!grid) return;
  grid.innerHTML = BADGES.map(b => {
    const unlocked = unlockedBadges.has(b.id);
    return `<div class="badge-item ${unlocked ? 'badge-item--unlocked' : 'badge-item--locked'}" title="${b.desc}">
      <span class="badge-item-icon">${unlocked ? b.icon : '🔒'}</span>
      <span class="badge-item-label">${b.label}</span>
    </div>`;
  }).join('');
}

function checkBadges() {
  const total = getTotalCorrect();
  if (total >= 10)  unlockBadge('cards_10');
  if (total >= 50)  unlockBadge('cards_50');
  if (total >= 100) unlockBadge('cards_100');
  if (total >= 500) unlockBadge('cards_500');
  if (userXP >= 100)  unlockBadge('xp_100');
  if (userXP >= 500)  unlockBadge('xp_500');
  if (userXP >= 1000) unlockBadge('xp_1000');
  const streakEl = document.getElementById('home-streak-num');
  if (streakEl) {
    const streak = parseInt(streakEl.textContent) || 0;
    if (streak >= 3)  unlockBadge('streak_3');
    if (streak >= 7)  unlockBadge('streak_7');
    if (streak >= 30) unlockBadge('streak_30');
  }
  checkLevelBadges(getLevel(userXP));
}

function getTotalCorrect() {
  return parseInt(localStorage.getItem('total_correct') || '0');
}

function addTotalCorrect(n) {
  const cur = getTotalCorrect();
  localStorage.setItem('total_correct', String(cur + n));
}

function seededRng(seed) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function getTodayQuests() {
  const today = new Date().toISOString().slice(0, 10);
  const key = 'quests_' + today + '_' + (currentUser ? currentUser.username : 'guest');
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  const seed = today.split('-').reduce((a, b) => a * 100 + parseInt(b), 0) +
    (currentUser ? currentUser.username.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 0);
  const rng = seededRng(seed);
  const shuffled = [...QUEST_TEMPLATES].sort(() => rng() - 0.5);
  const chosen = shuffled.slice(0, 3).map(tmpl => ({
    ...tmpl,
    label: tmpl.label.replace('{n}', tmpl.goal),
    progress: 0,
    done: false,
    rewarded: false,
  }));
  localStorage.setItem(key, JSON.stringify(chosen));
  return chosen;
}

function saveTodayQuests(quests) {
  const today = new Date().toISOString().slice(0, 10);
  const key = 'quests_' + today + '_' + (currentUser ? currentUser.username : 'guest');
  localStorage.setItem(key, JSON.stringify(quests));
}

function updateQuestProgress(questType, amount) {
  if (!currentUser) return;
  const quests = getTodayQuests();
  let changed = false;
  quests.forEach(q => {
    if (q.id === questType && !q.done) {
      q.progress = Math.min(q.goal, q.progress + amount);
      if (q.progress >= q.goal) {
        q.done = true;
        if (!q.rewarded) {
          q.rewarded = true;
          addXP(q.xp, '+' + q.xp + ' XP (opdracht!)');
          showQuestComplete(q);
        }
      }
      changed = true;
    }
  });
  if (changed) {
    saveTodayQuests(quests);
    renderQuests();
  }
}

function renderQuests() {
  const list = document.getElementById('quests-list');
  if (!list) return;
  if (!currentUser) {
    list.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem">Log in om dagelijkse opdrachten te zien.</p>';
    return;
  }
  const quests = getTodayQuests();
  list.innerHTML = quests.map(q => {
    const pct = Math.round(q.progress / q.goal * 100);
    return `<div class="quest-item ${q.done ? 'quest-item--done' : ''}">
      <div class="quest-item-top">
        <span class="quest-item-label">${q.label}</span>
        <span class="quest-item-xp">${q.done ? '✅' : '+' + q.xp + ' XP'}</span>
      </div>
      <div class="quest-progress-bar-wrap">
        <div class="quest-progress-bar" style="width:${pct}%"></div>
      </div>
      <div class="quest-progress-text">${q.progress} / ${q.goal}</div>
    </div>`;
  }).join('');
}

function showQuestComplete(quest) {
  const el = document.createElement('div');
  el.className = 'quest-complete-toast';
  el.innerHTML = '🎯 <strong>Opdracht voltooid!</strong> ' + quest.label;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('quest-complete-toast--show'));
  setTimeout(() => {
    el.classList.remove('quest-complete-toast--show');
    setTimeout(() => el.remove(), 400);
  }, 3000);
}
