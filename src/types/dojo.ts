// Zen Dojo Type Definitions

export type DojoMessage = {
	id: number
	sender: 'user' | 'troll'
	text: string
	sentiment: 'toxic' | 'neutral' | 'calm' | 'triggered'
	analysis: string | null
	timestamp?: number
}

export type DojoSession = {
	id: string
	user_id: string
	calm_score: number
	messages: DojoMessage[]
	scenario: DojoScenario
	difficulty: DojoDifficulty
	session_duration_seconds: number
	message_count: number
	created_at: string
	updated_at: string
	completed_at: string | null
}

export type DojoScenario = 'internet_troll' | 'political_debate' | 'workplace_conflict'

export type DojoDifficulty = 'easy' | 'medium' | 'hard' | 'extreme'

export type SentimentAnalysis = {
	analysis: string
	sentiment: 'calm' | 'triggered'
	isCalm: boolean
	calmScoreChange: number
}

export type TrollResponse = {
	response: string
	scenario: DojoScenario
	difficulty: DojoDifficulty
	fallback?: boolean
	error?: string
}

export type DojoSessionUpdate = {
	sessionId: string
	calmScore?: number
	messages?: DojoMessage[]
	messageCount?: number
	sessionDurationSeconds?: number
	completed?: boolean
}

export type DojoUIState = {
	isTyping: boolean
	isAnalyzing: boolean
	isGenerating: boolean
	error: string | null
	lastActivity: number
}

export type DojoPreferences = {
	autoSave: boolean
	showAnalysis: boolean
	theme: 'light' | 'dark' | 'system'
	soundEnabled: boolean
	keyboardShortcuts: boolean
}

export type DojoStats = {
	totalSessions: number
	averageCalmScore: number
	bestCalmScore: number
	totalMessages: number
	completionRate: number
	improvementTrend: number[]
}

export type DojoError = {
	type: 'network' | 'timeout' | 'auth' | 'validation' | 'server' | 'rate_limit' | 'unknown'
	message: string
	retryable: boolean
	statusCode?: number
}