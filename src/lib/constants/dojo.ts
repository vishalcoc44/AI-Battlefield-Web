// Zen Dojo Constants and Configuration

export const DOJO_CONSTANTS = {
	// Scoring system
	SCORING: {
		INITIAL_CALM_SCORE: 85,
		CALM_BONUS: 5,
		TRIGGERED_PENALTY: -10,
		MIN_SCORE: 0,
		MAX_SCORE: 100
	},

	// Rate limiting
	RATE_LIMIT: {
		MAX_REQUESTS_PER_MINUTE: 6, // Allow 1 request every 10 seconds on average
		ANALYSIS_TIMEOUT_MS: 30000,
		TROLL_RESPONSE_TIMEOUT_MS: 30000
	},

	// Message limits
	MESSAGE_LIMITS: {
		MAX_USER_MESSAGE_LENGTH: 5000,
		MAX_SESSION_MESSAGES: 100,
		MIN_USER_MESSAGE_LENGTH: 1
	},

	// Scenarios
	SCENARIOS: {
		INTERNET_TROLL: 'internet_troll',
		POLITICAL_DEBATE: 'political_debate',
		WORKPLACE_CONFLICT: 'workplace_conflict'
	} as const,

	// Difficulties
	DIFFICULTIES: {
		EASY: 'easy',
		MEDIUM: 'medium',
		HARD: 'hard',
		EXTREME: 'extreme'
	} as const,

	// Initial messages for each scenario
	INITIAL_MESSAGES: {
		internet_troll: {
			id: 0, // Will be replaced with timestamp
			sender: "troll",
			text: "LOL you actually believe that? You're obviously just brainwashed by the mainstream media. typical NPC behavior.",
			sentiment: "toxic",
			analysis: null
		},
		political_debate: {
			id: 0,
			sender: "troll",
			text: "Your political views are so outdated. Everyone knows the real truth is the opposite of what you're saying. Wake up sheeple!",
			sentiment: "toxic",
			analysis: null
		},
		workplace_conflict: {
			id: 0,
			sender: "troll",
			text: "You think you're so smart with your fancy degree? I've been doing this job longer than you've been alive. Back in my day...",
			sentiment: "toxic",
			analysis: null
		}
	},

	// UI Constants
	UI: {
		ANIMATION_DURATION: 500,
		AUTO_SCROLL_DELAY: 100,
		LOADING_SPINNER_SIZE: 20,
		MESSAGE_FADE_IN_DURATION: 300
	},

	// Local storage keys
	STORAGE_KEYS: {
		DRAFT_MESSAGE: 'dojo_draft_message',
		SESSION_DATA: 'dojo_session_data',
		USER_PREFERENCES: 'dojo_preferences'
	}
} as const

// Type exports for better TypeScript support
export type DojoScenario = typeof DOJO_CONSTANTS.SCENARIOS[keyof typeof DOJO_CONSTANTS.SCENARIOS]
export type DojoDifficulty = typeof DOJO_CONSTANTS.DIFFICULTIES[keyof typeof DOJO_CONSTANTS.DIFFICULTIES]

// Utility functions for constants
export const getInitialMessage = (scenario: DojoScenario) => ({
	...DOJO_CONSTANTS.INITIAL_MESSAGES[scenario],
	id: Date.now()
})

export const validateScenario = (scenario: string): scenario is DojoScenario => {
	return Object.values(DOJO_CONSTANTS.SCENARIOS).includes(scenario as DojoScenario)
}

export const validateDifficulty = (difficulty: string): difficulty is DojoDifficulty => {
	return Object.values(DOJO_CONSTANTS.DIFFICULTIES).includes(difficulty as DojoDifficulty)
}

export const calculateNewCalmScore = (currentScore: number, isCalm: boolean): number => {
	const change = isCalm ? DOJO_CONSTANTS.SCORING.CALM_BONUS : DOJO_CONSTANTS.SCORING.TRIGGERED_PENALTY
	return Math.max(DOJO_CONSTANTS.SCORING.MIN_SCORE,
		   Math.min(DOJO_CONSTANTS.SCORING.MAX_SCORE, currentScore + change))
}