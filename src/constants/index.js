// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  ENDPOINTS: {
    ASSIGN_EXERCISE: '/assign-exercise/',
    GENERATE_EXERCISE: '/context/generate',
    PERSONALIZE_EXERCISE: '/personalize-exercise/',
  },
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  MIN_PAGE_SIZE: 5,
};

// Exercise Types
export const EXERCISE_TYPES = {
  VNEST: 'VNEST',
  SR: 'SR',
};

// Exercise Status
export const EXERCISE_STATUS = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  ALL: 'Todos',
};

// Exercise Visibility
export const EXERCISE_VISIBILITY = {
  PUBLIC: 'publico',
  PRIVATE: 'privado',
  ALL: 'Todos',
};

// Customization Options
export const CUSTOMIZATION_OPTIONS = {
  YES: 'Sí',
  NO: 'No',
  ALL: 'Todos',
};

// Filter Options
export const FILTER_OPTIONS = {
  VISIBILITY: [EXERCISE_VISIBILITY.ALL, EXERCISE_VISIBILITY.PUBLIC, EXERCISE_VISIBILITY.PRIVATE],
  STATUS: [EXERCISE_STATUS.ALL, EXERCISE_STATUS.APPROVED, EXERCISE_STATUS.PENDING],
  CUSTOMIZATION: [CUSTOMIZATION_OPTIONS.ALL, CUSTOMIZATION_OPTIONS.YES, CUSTOMIZATION_OPTIONS.NO],
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THERAPIST_EMAIL: 'terapeutaEmail',
  USER_SESSION: 'userSession',
};

// Routes
export const ROUTES = {
  LOGIN: '/',
  DASHBOARD: '/dashboard',
  PATIENTS: '/pacientes',
  EXERCISES: '/ejercicios',
  NEW_EXERCISE: '/ejercicios/nuevo',
  NEW_EXERCISE_IA: '/ejercicios/nuevo/ia',
  PATIENT_DETAIL: '/pacientes/:pacienteId',
};

// UI Constants
export const UI = {
  DEBOUNCE_DELAY: 300,
  MODAL_ANIMATION_DURATION: 200,
  TOAST_DURATION: 3000,
  LOADING_TIMEOUT: 10000,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  AUTH_ERROR: 'Error de autenticación. Inicia sesión nuevamente.',
  GENERIC_ERROR: 'Ha ocurrido un error inesperado.',
  PATIENT_NOT_FOUND: 'No se encontró ningún paciente con ese ID.',
  EXERCISE_NOT_FOUND: 'No se encontró el ejercicio solicitado.',
  INVALID_CREDENTIALS: 'Credenciales incorrectas. Verifica tu email o contraseña.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PATIENT_ASSIGNED: 'Paciente asignado con éxito.',
  EXERCISE_CREATED: 'Ejercicio creado exitosamente.',
  EXERCISE_UPDATED: 'Ejercicio actualizado correctamente.',
  EXERCISE_DELETED: 'Ejercicio eliminado correctamente.',
  LOGIN_SUCCESS: 'Inicio de sesión exitoso.',
};

// Firebase Collections
export const COLLECTIONS = {
  THERAPISTS: 'terapeutas',
  PATIENTS: 'pacientes',
  EXERCISES: 'ejercicios',
  EXERCISES_VNEST: 'ejercicios_VNEST',
  EXERCISES_SR: 'ejercicios_SR',
  ASSIGNED_EXERCISES: 'ejercicios_asignados',
};

// Table Configuration
export const TABLE_CONFIG = {
  DEFAULT_SORT: 'fecha_creacion',
  SORT_ORDER: 'desc',
  ROW_HEIGHT: 60,
  HEADER_HEIGHT: 50,
};

// Form Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 6,
  MAX_INPUT_LENGTH: 255,
  REQUIRED_FIELD: 'Este campo es obligatorio',
  INVALID_EMAIL: 'Ingresa un email válido',
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 6 caracteres',
};
