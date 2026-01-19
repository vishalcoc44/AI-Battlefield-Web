// Belief system constants and configuration

export const BELIEF_CONSTANTS = {
  // Status thresholds for automatic status calculation
  STATUS_THRESHOLDS: {
    REINFORCED_MIN_CHANGE: 30, // 30%+ increase = Reinforced
    SHATTERED_MIN_CHANGE: 30,  // 30%+ decrease = Shattered
    SHIFTED_MIN_CHANGE: 10,    // 10%+ change = Shifted
  },

  // API endpoints
  API: {
    BASE: '/api/beliefs',
    SYNC_DEBATES: '/api/beliefs/sync-debates',
  },

  // Storage keys for localStorage
  STORAGE_KEYS: {
    DRAFT_BELIEF: 'belief_draft',
    FILTERS: 'belief_filters',
    PAGINATION: 'belief_pagination',
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },

  // Auto-refresh interval (30 seconds)
  REFRESH_INTERVAL: 30000,

  // Rate limiting
  RATE_LIMITS: {
    SYNC_DEBATES: {
      MAX_REQUESTS: 1,
      WINDOW_MINUTES: 1,
    },
    CREATE_BELIEF: {
      MAX_REQUESTS: 5,
      WINDOW_MINUTES: 1,
    },
  },

  // Sort options
  SORT_OPTIONS: [
    { value: 'created_at', label: 'Date Created' },
    { value: 'updated_at', label: 'Last Updated' },
    { value: 'confidence_current', label: 'Current Confidence' },
    { value: 'topic', label: 'Topic (A-Z)' },
  ] as const,

  // Status options for filters
  STATUS_OPTIONS: [
    { value: 'Reinforced', label: 'Reinforced', color: 'emerald' },
    { value: 'Shifted', label: 'Shifted', color: 'orange' },
    { value: 'Shattered', label: 'Shattered', color: 'red' },
    { value: 'Neutral', label: 'Neutral', color: 'gray' },
  ] as const,

  // Trend options for filters
  TREND_OPTIONS: [
    { value: 'up', label: 'Increasing', icon: 'ArrowUp' },
    { value: 'down', label: 'Decreasing', icon: 'ArrowDown' },
    { value: 'neutral', label: 'Stable', icon: 'Minus' },
  ] as const,

  // Animation durations
  ANIMATIONS: {
    CARD_HOVER: 300,
    LOADING_SPINNER: 500,
    TOAST_DURATION: 4000,
  },

  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
    AUTH_ERROR: 'Authentication required. Please sign in to continue.',
    PERMISSION_ERROR: 'You do not have permission to perform this action.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    SERVER_ERROR: 'Server error occurred. Please try again later.',
    NOT_FOUND: 'Belief not found.',
    RATE_LIMITED: 'Too many requests. Please wait before trying again.',
  },

  // Success messages
  SUCCESS_MESSAGES: {
    BELIEF_CREATED: 'Belief created successfully!',
    BELIEF_UPDATED: 'Belief updated successfully!',
    BELIEF_DELETED: 'Belief deleted successfully!',
    SYNC_COMPLETED: 'Beliefs synced with debates successfully!',
    FILTERS_APPLIED: 'Filters applied successfully.',
  },

  // Confirmation messages
  CONFIRMATION_MESSAGES: {
    DELETE_BELIEF: 'Are you sure you want to delete this belief? This action cannot be undone.',
    SYNC_DEBATES: 'This will analyze your recent debates and may create or update beliefs. Continue?',
  },

  // Empty state content
  EMPTY_STATE: {
    TITLE: 'No Beliefs Yet',
    DESCRIPTION: 'Track your evolving worldview by creating your first belief. Start with something you feel strongly about.',
    ACTION_TEXT: 'Create Your First Belief',
  },

  // Loading messages
  LOADING_MESSAGES: {
    FETCHING: 'Loading your beliefs...',
    CREATING: 'Creating belief...',
    UPDATING: 'Updating belief...',
    DELETING: 'Deleting belief...',
    SYNCING: 'Analyzing debates and syncing beliefs...',
  },

  // Accessibility labels
  ACCESSIBILITY: {
    CREATE_BUTTON: 'Create new belief',
    EDIT_BUTTON: 'Edit belief',
    DELETE_BUTTON: 'Delete belief',
    SYNC_BUTTON: 'Sync with debates',
    SEARCH_INPUT: 'Search beliefs',
    FILTER_BUTTON: 'Filter beliefs',
    SORT_BUTTON: 'Sort beliefs',
    LOAD_MORE_BUTTON: 'Load more beliefs',
    CONFIDENCE_SLIDER: 'Confidence level',
  },

  // UI configuration
  UI: {
    CARD_HEIGHT: 'auto',
    GRID_COLUMNS: {
      MOBILE: 1,
      TABLET: 2,
      DESKTOP: 2,
      LARGE: 3,
    },
    PROGRESS_BAR_HEIGHT: 'h-1',
    BADGE_MAX_WIDTH: 'max-w-[120px]',
  },

  // Validation rules (duplicate from types for runtime use)
  VALIDATION: {
    TOPIC: {
      REQUIRED: true,
      MIN_LENGTH: 1,
      MAX_LENGTH: 200,
      PATTERN: /^.{1,200}$/,
    },
    DESCRIPTION: {
      REQUIRED: false,
      MAX_LENGTH: 1000,
    },
    CONFIDENCE: {
      REQUIRED: true,
      MIN: 0,
      MAX: 100,
    },
    TAGS: {
      REQUIRED: false,
      MAX_COUNT: 10,
      MAX_LENGTH: 50,
    },
  },

  // Feature flags (for gradual rollout)
  FEATURES: {
    SYNC_DEBATES: true,
    BELIEF_HISTORY: true,
    ADVANCED_FILTERS: true,
    EXPORT_BELIEFS: false, // TODO: Implement later
    BULK_ACTIONS: false,   // TODO: Implement later
  },
} as const;

// Type helpers
export type SortOption = typeof BELIEF_CONSTANTS.SORT_OPTIONS[number]['value'];
export type StatusOption = typeof BELIEF_CONSTANTS.STATUS_OPTIONS[number]['value'];
export type TrendOption = typeof BELIEF_CONSTANTS.TREND_OPTIONS[number]['value'];

// Utility functions
export const getStatusColor = (status: StatusOption): string => {
  return BELIEF_CONSTANTS.STATUS_OPTIONS.find(option => option.value === status)?.color || 'gray';
};

export const getTrendIcon = (trend: TrendOption): string => {
  return BELIEF_CONSTANTS.TREND_OPTIONS.find(option => option.value === trend)?.icon || 'Minus';
};

export const calculateStatusFromConfidence = (
  initial: number,
  current: number
): { status: StatusOption; trend: TrendOption } => {
  const diff = current - initial;
  const absDiff = Math.abs(diff);

  let trend: TrendOption = 'neutral';
  if (diff > 0) trend = 'up';
  else if (diff < 0) trend = 'down';

  let status: StatusOption = 'Neutral';
  if (absDiff >= BELIEF_CONSTANTS.STATUS_THRESHOLDS.REINFORCED_MIN_CHANGE) {
    status = trend === 'up' ? 'Reinforced' : 'Shattered';
  } else if (absDiff >= BELIEF_CONSTANTS.STATUS_THRESHOLDS.SHIFTED_MIN_CHANGE) {
    status = 'Shifted';
  }

  return { status, trend };
};