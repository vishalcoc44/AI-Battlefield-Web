/**
 * Constants for The Void - Anonymous ephemeral messaging system
 */

export const VOID_CONSTANTS = {
	// Session duration (24 hours in milliseconds)
	SESSION_DURATION_MS: 24 * 60 * 60 * 1000,
	SESSION_DURATION_SECONDS: 24 * 60 * 60,

	// Message expiration (24 hours)
	MESSAGE_EXPIRATION_MS: 24 * 60 * 60 * 1000,
	MESSAGE_EXPIRATION_SECONDS: 24 * 60 * 60,

	// Cleanup intervals
	CLEANUP_INTERVAL_MS: 60 * 60 * 1000, // 1 hour
	HARD_DELETE_AFTER_DAYS: 7,

	// API timeouts
	API_TIMEOUT_MS: 30000, // 30 seconds

	// Rate limiting
	RATE_LIMIT: {
		MESSAGE_CREATE: {
			MAX_REQUESTS: 10,
			WINDOW_MS: 60000, // 1 minute
		},
		SESSION_CREATE: {
			MAX_REQUESTS: 5,
			WINDOW_MS: 60000, // 1 minute
		},
	},

	// Input validation
	VALIDATION: {
		MESSAGE_CONTENT: {
			MIN_LENGTH: 1,
			MAX_LENGTH: 2000,
		},
		MASK_NAME: {
			MAX_LENGTH: 50,
		},
	},

	// LocalStorage keys
	STORAGE_KEYS: {
		SELECTED_MASK: 'void_selected_mask',
		SELECTED_MASK_EXPIRY: 'void_selected_mask_expiry',
		ACTIVE_SESSION: 'void_active_session',
		ACTIVE_SESSION_TOKEN: 'void_active_session_token',
	},

	// Default mask icon types
	MASK_ICON_TYPES: {
		VENETIAN_MASK: 'venetian_mask',
		USER: 'user',
		GHOST: 'ghost',
		SCAN_FACE: 'scan_face',
	} as const,

	// Default masks (will be loaded from database)
	DEFAULT_MASKS: [
		{ name: 'Neon Fox', iconType: 'venetian_mask' as const, color: '#f97316' },
		{ name: 'Cyber Monk', iconType: 'user' as const, color: '#3b82f6' },
		{ name: 'Null Pointer', iconType: 'ghost' as const, color: '#a855f7' },
		{ name: 'Glitch Face', iconType: 'scan_face' as const, color: '#10b981' },
	],

	// UI constants
	UI: {
		MESSAGES_PER_PAGE: 50,
		MESSAGE_POLL_INTERVAL_MS: 5000, // 5 seconds for polling (fallback if realtime fails)
		ACTIVE_COUNT_UPDATE_INTERVAL_MS: 10000, // 10 seconds
		MASK_SELECTION_EXPIRY_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
	},
} as const
