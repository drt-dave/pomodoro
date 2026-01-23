export type Language ='en' | 'es' | 'fr'| 'eo'|'ru'; 

export interface Translations {
  // App header
  appName: string;

  // Navigation
  timerTab: string;
  statsTab: string;

  // Timer component - controls
  start: string;
  pause: string;
  reset: string;
  finish: string;

  // Timer component - notifications
  workCompleted: string;
  breakCompleted: string;

  // Mode indicator
  workSession: string;
  breakTime: string;

  // Browser notifications
  notificationWorkBody: string;
  notificationBreakBody: string;

  // Timer component - confirmation modal
  confirmFinish: string;
  confirmFinishMessage: string;

  // Tag selector
  selectCategory: string;
  addTag: string;
  tagPlaceholder: string;
  add: string;
  cancel: string;

  // Stats page
  statsTitle: string;
  overall: string;
  byCategory: string;
  totalSessions: string;
  totalTime: string;
  sessions: string;
  ofTotalSessions: string;
  noSessionsYet: string;

  // Default tags
  defaultTagGeneral: string;
  defaultTagWork: string;
  defaultTagStudy: string;

  // Settings panel
  settings: string;
  settingsTitle: string;
  workDuration: string;
  breakDuration: string;
  minutes: string;
  soundEffects: string;
  clearData: string;
  clearDataConfirm: string;
  save: string;
  close: string;
}

const translations: Record<Language, Translations> = {
  en: {
	appName: '🍅 PomoDoroto',
	timerTab: '⏱️ Timer',
	statsTab: '📊 Stats',
	start: '▶️ Start',
	pause: '⏸ Pause',
	reset: '🔄 Reset',
	finish: 'FINISH',
	workCompleted: '✅ Work session completed!',
	breakCompleted: '☕ Break completed!',
	workSession: 'Work Session',
	breakTime: 'Break Time',
	notificationWorkBody: 'Time for a break!',
	notificationBreakBody: 'Ready to work!',
	confirmFinish: 'Finish Session?',
	confirmFinishMessage: 'Are you sure you want to end this Pomodoro session early?',
	selectCategory: 'Select Category',
	addTag: '➕ Add Tag',
	tagPlaceholder: 'Tag name...',
	add: 'Add',
	cancel: 'Cancel',
	statsTitle: '📊 Your Pomodoro Stats',
	overall: 'Overall',
	byCategory: 'By Category',
	totalSessions: '🍅 Total Sessions:',
	totalTime: '⏱️ Total Time:',
	sessions: 'sessions',
	ofTotalSessions: 'of total sessions',
	noSessionsYet: 'No completed sessions yet. Start a timer to see stats! 🚀',
	defaultTagGeneral: 'General',
	defaultTagWork: 'Work',
	defaultTagStudy: 'Study',
	settings: 'Settings',
	settingsTitle: 'Settings',
	workDuration: 'Work Duration',
	breakDuration: 'Break Duration',
	minutes: 'minutes',
	soundEffects: 'Sound Effects',
	clearData: 'Clear All Data',
	clearDataConfirm: 'Are you sure? This will delete all sessions and settings.',
	save: 'Save',
	close: 'Close',
  },

  es: {
	appName: '🍅 PomoDoroto',
	timerTab: '⏱️ Temporizador',
	statsTab: '📊 Estadísticas',
	start: '▶️ Iniciar',
	pause: '⏸ Pausar',
	reset: '🔄 Reiniciar',
	finish: 'FINALIZAR',
	workCompleted: '✅ ¡Sesión de trabajo completada!',
	breakCompleted: '☕ ¡Descanso completado!',
	workSession: 'Sesión de Trabajo',
	breakTime: 'Descanso',
	notificationWorkBody: '¡Hora de descansar!',
	notificationBreakBody: '¡Listo para trabajar!',
	confirmFinish: '¿Finalizar Sesión?',
	confirmFinishMessage: '¿Estás seguro de que quieres terminar esta sesión Pomodoro antes de tiempo?',
	selectCategory: 'Seleccionar Categoría',
	addTag: '➕ Agregar Etiqueta',
	tagPlaceholder: 'Nombre de etiqueta...',
	add: 'Agregar',
	cancel: 'Cancelar',
	statsTitle: '📊 Tus Estadísticas Pomodoro',
	overall: 'General',
	byCategory: 'Por Categoría',
	totalSessions: '🍅 Total de Sesiones:',
	totalTime: '⏱️ Tiempo Total:',
	sessions: 'sesiones',
	ofTotalSessions: 'del total de sesiones',
	noSessionsYet: '¡Aún no hay sesiones completadas. Inicia un temporizador para ver estadísticas! 🚀',
	defaultTagGeneral: 'General',
	defaultTagWork: 'Trabajo',
	defaultTagStudy: 'Estudio',
	settings: 'Ajustes',
	settingsTitle: 'Ajustes',
	workDuration: 'Duración de Trabajo',
	breakDuration: 'Duración de Descanso',
	minutes: 'minutos',
	soundEffects: 'Efectos de Sonido',
	clearData: 'Borrar Todos los Datos',
	clearDataConfirm: 'Esto eliminará todas las sesiones y ajustes.',
	save: 'Guardar',
	close: 'Cerrar',
  },

  fr: {
	appName: '🍅 PomoDoroto',
	timerTab: '⏱️ Minuteur',
	statsTab: '📊 Statistiques',
	start: '▶️ Démarrer',
	pause: '⏸ Pause',
	reset: '🔄 Réinitialiser',
	finish: 'TERMINER',
	workCompleted: '✅ Session de travail terminée !',
	breakCompleted: '☕ Pause terminée !',
	workSession: 'Session de Travail',
	breakTime: 'Pause',
	notificationWorkBody: 'C\'est l\'heure de la pause !',
	notificationBreakBody: 'Prêt à travailler !',
	confirmFinish: 'Terminer la Session ?',
	confirmFinishMessage: 'Êtes-vous sûr de vouloir terminer cette session Pomodoro plus tôt ?',
	selectCategory: 'Sélectionner une Catégorie',
	addTag: '➕ Ajouter une Étiquette',
	tagPlaceholder: 'Nom de l\'étiquette...',
	add: 'Ajouter',
	cancel: 'Annuler',
	statsTitle: '📊 Vos Statistiques Pomodoro',
	overall: 'Général',
	byCategory: 'Par Catégorie',
	totalSessions: '🍅 Sessions Totales :',
	totalTime: '⏱️ Temps Total :',
	sessions: 'sessions',
	ofTotalSessions: 'du total des sessions',
	noSessionsYet: 'Aucune session terminée pour le moment. Démarrez un minuteur pour voir les statistiques ! 🚀',
	defaultTagGeneral: 'Général',
	defaultTagWork: 'Travail',
	defaultTagStudy: 'Étude',
	settings: 'Paramètres',
	settingsTitle: 'Paramètres',
	workDuration: 'Durée de Travail',
	breakDuration: 'Durée de Pause',
	minutes: 'minutes',
	soundEffects: 'Effets Sonores',
	clearData: 'Effacer Toutes les Données',
	clearDataConfirm: 'Cela supprimera toutes les sessions et paramètres.',
	save: 'Enregistrer',
	close: 'Fermer',
  },

  eo: {
	appName: '🍅 PomoDoroto',
	timerTab: '⏱️ Horloĝo',
	statsTab: '📊 Statistikoj',
	start: '▶️ Komenci',
	pause: '⏸ Paŭzi',
	reset: '🔄 Rekomenci',
	finish: 'FINI',
	workCompleted: '✅ Laborseanco finita!',
	breakCompleted: '☕ Paŭzo finita!',
	workSession: 'Laborseanco',
	breakTime: 'Paŭzo',
	notificationWorkBody: 'Tempo por paŭzo!',
	notificationBreakBody: 'Preta por labori!',
	confirmFinish: 'Ĉu Fini la Seancon?',
	confirmFinishMessage: 'Ĉu vi certas, ke vi volas fini ĉi tiun Pomodoro-seancon frutempe?',
	selectCategory: 'Elektu Kategorion',
	addTag: '➕ Aldoni Etikedon',
	tagPlaceholder: 'Nomo de etikedo...',
	add: 'Aldoni',
	cancel: 'Nuligi',
	statsTitle: '📊 Viaj Pomodoro Statistikoj',
	overall: 'Ĝenerala',
	byCategory: 'Laŭ Kategorio',
	totalSessions: '🍅 Tutaj Seancoj:',
	totalTime: '⏱️ Tuta Tempo:',
	sessions: 'seancoj',
	ofTotalSessions: 'de tutaj seancoj',
	noSessionsYet: 'Ankoraŭ neniuj finitaj seancoj. Komencu horloĝon por vidi statistikojn! 🚀',
	defaultTagGeneral: 'Ĝenerala',
	defaultTagWork: 'Laboro',
	defaultTagStudy: 'Studo',
	settings: 'Agordoj',
	settingsTitle: 'Agordoj',
	workDuration: 'Labordaŭro',
	breakDuration: 'Paŭzodaŭro',
	minutes: 'minutoj',
	soundEffects: 'Sonefektoj',
	clearData: 'Forigi Ĉiujn Datumojn',
	clearDataConfirm: 'Tio forigos ĉiujn seancojn kaj agordojn.',
	save: 'Konservi',
	close: 'Fermi',
  },

  ru: {
	appName: '🍅 PomoDoroto',
	timerTab: '⏱️ Таймер',
	statsTab: '📊 Статистика',
	start: '▶️ Старт',
	pause: '⏸ Пауза',
	reset: '🔄 Сброс',
	finish: 'ЗАВЕРШИТЬ',
	workCompleted: '✅ Рабочая сессия завершена!',
	breakCompleted: '☕ Перерыв завершен!',
	workSession: 'Рабочая Сессия',
	breakTime: 'Перерыв',
	notificationWorkBody: 'Время отдохнуть!',
	notificationBreakBody: 'Готов к работе!',
	confirmFinish: 'Завершить Сессию?',
	confirmFinishMessage: 'Вы уверены, что хотите завершить эту сессию Помодоро досрочно?',
	selectCategory: 'Выберите Категорию',
	addTag: '➕ Добавить Метку',
	tagPlaceholder: 'Название метки...',
	add: 'Добавить',
	cancel: 'Отмена',
	statsTitle: '📊 Ваша Статистика Помодоро',
	overall: 'Общая',
	byCategory: 'По Категориям',
	totalSessions: '🍅 Всего Сессий:',
	totalTime: '⏱️ Общее Время:',
	sessions: 'сессий',
	ofTotalSessions: 'от общего числа сессий',
	noSessionsYet: 'Завершенных сессий пока нет. Запустите таймер, чтобы увидеть статистику! 🚀',
	defaultTagGeneral: 'Общее',
	defaultTagWork: 'Работа',
	defaultTagStudy: 'Учеба',
	settings: 'Настройки',
	settingsTitle: 'Настройки',
	workDuration: 'Продолжительность Работы',
	breakDuration: 'Продолжительность Перерыва',
	minutes: 'минут',
	soundEffects: 'Звуковые Эффекты',
	clearData: 'Удалить Все Данные',
	clearDataConfirm: 'Это удалит все сессии и настройки.',
	save: 'Сохранить',
	close: 'Закрыть',
  },
};  

export const LANGUAGES = Object.keys(translations) as Language[];
export function getTranslations(language: Language): Translations {
  return translations[language];
}
