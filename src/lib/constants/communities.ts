// Community-related constants
export const COMMUNITY_CONSTANTS = {
  // API Limits
  COMMUNITIES_LIST_LIMIT: 20,
  CHAT_MESSAGES_LIMIT: 50,
  DISCUSSIONS_LIMIT: 10,
  EVENTS_LIMIT: 10,
  MEMBERS_LIMIT: 50,
  ACTIVITY_FEED_LIMIT: 20,

  // Timeouts (in milliseconds)
  API_TIMEOUT: 30000, // 30 seconds
  DEBOUNCE_DELAY: 300, // 300ms for user interactions

  // Validation Limits
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
  TAGS_MAX_COUNT: 5,
  TAG_MAX_LENGTH: 20,

  // UI Animation delays (in milliseconds)
  ANIMATION_DELAY_BASE: 50,
  SKELETON_ANIMATION_DELAY: 100,

  // Categories
  ALLOWED_CATEGORIES: [
    'General',
    'Technology',
    'Philosophy',
    'Science',
    'Politics',
    'Gaming',
    'Sports',
    'Music',
    'Art',
    'Business',
    'Education',
    'Health',
    'Environment',
    'Travel',
    'Food',
    'Other'
  ] as const,

  // Activity levels
  ACTIVITY_LEVELS: ['Low', 'Medium', 'High'] as const,

  // Community types
  COMMUNITY_TYPES: ['Public', 'Private'] as const,

  // Storage
  LOCAL_STORAGE_KEYS: {
    COMMUNITY_EDIT_DRAFT: 'community_edit_draft',
    COMMUNITY_CREATE_DRAFT: 'community_create_draft'
  },

  // File upload limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
} as const

// Type exports for better TypeScript support
export type CommunityCategory = typeof COMMUNITY_CONSTANTS.ALLOWED_CATEGORIES[number]
export type ActivityLevel = typeof COMMUNITY_CONSTANTS.ACTIVITY_LEVELS[number]
export type CommunityType = typeof COMMUNITY_CONSTANTS.COMMUNITY_TYPES[number]