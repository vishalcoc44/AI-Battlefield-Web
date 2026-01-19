
export type GymDrill = {
	id: string
	type: 'fallacy' | 'rebuttal'
	title: string
	difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
	content: any
	xpReward: number
}

export type DrillAttempt = {
	id: string
	userId: string
	drillId: string
	score: number
	feedback?: any
	createdAt: string
}

export type AIPersona = {
	id: string
	name: string
	avatarUrl?: string
	systemPrompt: string
	difficultyLevel: 'Easy' | 'Medium' | 'Hard' | 'Expert'
}

export type SparringSession = {
	id: string
	userId: string
	personaId?: string
	topic: string
	status: 'active' | 'completed' | 'abandoned'
	transcript: Array<{ role: 'user' | 'assistant' | 'system', content: string }>
	createdAt: string
	updatedAt: string
}

export type Wager = {
	id: string
	userId: string
	debateId: string
	amount: number
	predictionSide: 'PRO' | 'CON'
	status: 'pending' | 'won' | 'lost' | 'refunded'
	payout?: number
	createdAt: string
}
