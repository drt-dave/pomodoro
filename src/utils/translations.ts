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
  deleteTagTitle: string;
  deleteTagMessage: string;

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

  // Session notes
  sessionNotePlaceholder: string;

  // Session history
  sessionHistory: string;
  allSessions: string;
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
	selectCategory: 'Select Label',
	addTag: '➕ Add Tag',
	tagPlaceholder: 'Tag name...',
	add: 'Add',
	cancel: 'Cancel',
	deleteTagTitle: 'Delete Tag?',
	deleteTagMessage: 'Are you sure you want to delete',
	statsTitle: '📊 Your Pomodoro Stats',
	overall: 'Overall',
	byCategory: 'By Label',
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
	clearData: 'Reset Timer',
	clearDataConfirm: 'Are you sure? This will reset timer and settings.',
	save: 'Save',
	close: 'Close',
	sessionNotePlaceholder: 'Add a note about this pomodoro...',
	sessionHistory: 'Session History',
	allSessions: 'All',
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
	selectCategory: 'Seleccionar Etiqueta',
	addTag: '➕ Agregar Etiqueta',
	tagPlaceholder: 'Nombre de etiqueta...',
	add: 'Agregar',
	cancel: 'Cancelar',
	deleteTagTitle: '¿Eliminar Etiqueta?',
	deleteTagMessage: '¿Estás seguro de que quieres eliminar',
	statsTitle: '📊 Tus Estadísticas Pomodoro',
	overall: 'General',
	byCategory: 'Por Etiqueta',
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
	clearData: 'Reiniciar Temporizador',
	clearDataConfirm: 'Esto reiniciará el temporizador y los ajustes.',
	save: 'Guardar',
	close: 'Cerrar',
	sessionNotePlaceholder: 'Agrega una nota sobre este pomodoro...',
	sessionHistory: 'Historial de Sesiones',
	allSessions: 'Todas',
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
	selectCategory: 'Sélectionner une Étiquette',
	addTag: '➕ Ajouter une Étiquette',
	tagPlaceholder: 'Nom de l\'étiquette...',
	add: 'Ajouter',
	cancel: 'Annuler',
	deleteTagTitle: 'Supprimer l\'Étiquette ?',
	deleteTagMessage: 'Êtes-vous sûr de vouloir supprimer',
	statsTitle: '📊 Vos Statistiques Pomodoro',
	overall: 'Général',
	byCategory: 'Par Étiquette',
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
	clearData: 'Réinitialiser Minuteur',
	clearDataConfirm: 'Cela réinitialisera le minuteur et les paramètres.',
	save: 'Enregistrer',
	close: 'Fermer',
	sessionNotePlaceholder: 'Ajoutez une note sur ce pomodoro...',
	sessionHistory: 'Historique des Sessions',
	allSessions: 'Toutes',
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
	selectCategory: 'Elektu Etikedon',
	addTag: '➕ Aldoni Etikedon',
	tagPlaceholder: 'Nomo de etikedo...',
	add: 'Aldoni',
	cancel: 'Nuligi',
	deleteTagTitle: 'Ĉu Forigi Etikedon?',
	deleteTagMessage: 'Ĉu vi certas, ke vi volas forigi',
	statsTitle: '📊 Viaj Pomodoro Statistikoj',
	overall: 'Ĝenerala',
	byCategory: 'Laŭ Etikedo',
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
	clearData: 'Restarigi Horloĝon',
	clearDataConfirm: 'Tio restarigos la horloĝon kaj agordojn.',
	save: 'Konservi',
	close: 'Fermi',
	sessionNotePlaceholder: 'Aldonu noton pri ĉi tiu pomodoro...',
	sessionHistory: 'Seanca Historio',
	allSessions: 'Ĉiuj',
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
	selectCategory: 'Выберите Метку',
	addTag: '➕ Добавить Метку',
	tagPlaceholder: 'Название метки...',
	add: 'Добавить',
	cancel: 'Отмена',
	deleteTagTitle: 'Удалить Метку?',
	deleteTagMessage: 'Вы уверены, что хотите удалить',
	statsTitle: '📊 Ваша Статистика Помодоро',
	overall: 'Общая',
	byCategory: 'По Меткам',
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
	clearData: 'Сбросить Таймер',
	clearDataConfirm: 'Это сбросит таймер и настройки.',
	save: 'Сохранить',
	close: 'Закрыть',
	sessionNotePlaceholder: 'Добавьте заметку об этом помодоро...',
	sessionHistory: 'История Сессий',
	allSessions: 'Все',
  },
};  

export const LANGUAGES = Object.keys(translations) as Language[];
export function getTranslations(language: Language): Translations {
  return translations[language];
}
