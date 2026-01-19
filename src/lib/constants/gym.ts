// Gym-related constants
export const GYM_CONSTANTS = {
  // Timer settings
  TIMER: {
    INITIAL_DURATION_SECONDS: 600, // 10 minutes
    DRILL_DURATION_SECONDS: 60, // 1 minute for rebuttal drills
    POLLING_INTERVAL_MS: 30000, // 30 seconds for safety polling
    AI_COOLDOWN_MS: 20000, // 20 seconds between AI responses
    AI_TRIGGER_DELAY_MS: 2000, // Delay before triggering AI
    DEBOUNCE_DELAY_MS: 500, // Debounce delay for inputs
  },

  // Message and data limits
  LIMITS: {
    INITIAL_MESSAGES: 100,
    MESSAGE_HISTORY_LIMIT: 20,
    MAX_MESSAGE_LENGTH: 2000,
    MAX_TOPIC_LENGTH: 200,
    MAX_CATEGORY_LENGTH: 50,
    POLLING_BATCH_SIZE: 5,
    VOTE_DEFAULT_PERCENTAGE: 50,
  },

  // Room statuses
  STATUS: {
    WAITING: 'waiting',
    ACTIVE: 'active',
    COMPLETED: 'completed',
  } as const,

  // Message roles
  ROLES: {
    USER: 'user',
    AI: 'ai',
    SYSTEM: 'system',
  } as const,

  // Tab identifiers
  TABS: {
    DEBATE: 'debate',
    SPECTATOR: 'spectator',
  } as const,

  // Categories
  CATEGORIES: [
    'General',
    'Technology',
    'Philosophy',
    'Politics',
    'Economics'
  ] as const,

  // Validation patterns
  PATTERNS: {
    TOPIC: /^[a-zA-Z0-9\s\-.,!?()]+$/,
    TEXT: /^[\w\s\-.,!?()]+$/,
  } as const,

  // API timeouts
  API_TIMEOUTS: {
    AI_RESPONSE_MS: 30000, // 30 seconds
    GENERAL_REQUEST_MS: 10000, // 10 seconds
  },

  // Retry settings
  RETRY: {
    MAX_ATTEMPTS: 3,
    BASE_DELAY_MS: 1000,
  },

  // Vote sides
  VOTES: {
    PRO: 'PRO',
    CON: 'CON',
  } as const,

  // Error messages
  ERRORS: {
    ROOM_NOT_FOUND: 'Debate room not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN_UPDATE: 'Only room creator can update',
    FORBIDDEN_DELETE: 'Only room creator can delete',
    TOPIC_REQUIRED: 'Topic is required',
    MESSAGE_REQUIRED: 'Message cannot be empty',
  } as const,
} as const

// Type exports for better TypeScript support
export type GymStatus = typeof GYM_CONSTANTS.STATUS[keyof typeof GYM_CONSTANTS.STATUS]
export type MessageRole = typeof GYM_CONSTANTS.ROLES[keyof typeof GYM_CONSTANTS.ROLES]
export type TabType = typeof GYM_CONSTANTS.TABS[keyof typeof GYM_CONSTANTS.TABS]
export type CategoryType = typeof GYM_CONSTANTS.CATEGORIES[number]
export type VoteSide = typeof GYM_CONSTANTS.VOTES[keyof typeof GYM_CONSTANTS.VOTES]