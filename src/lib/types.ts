export type Market = {
	id: string
	question: string
	category: string
	deadline: string
	volume: number
	consensus: number
}

export type UserStats = {
	level: number
	xp: number
	viewsChanged: number
	debatesWon: number
	brierScore?: number
}

export type RecentDebate = {
	id: string
	topic: string
	persona: string
	status: 'active' | 'completed'
	date: string
}

export type UserPrediction = {
	marketId: string
	question: string
	probability: number
}

export type GymRoom = {
	id: string
	topic: string
	activeParticipants: number
	category?: string
	isFeatured?: boolean
	// New Schema Fields
	status: 'waiting' | 'active' | 'completed'
	endsAt: string | null
	votePro: number
	voteCon: number
	winnerSide?: 'PRO' | 'CON' | 'DRAW' | null
	createdBy?: string
}

export type Community = {
	id: string
	name: string
	members: string
	type: "Public" | "Private"
	desc: string
	category: string
	tags: string[]
	createdDate: string
	activityLevel: 'High' | 'Medium' | 'Low'
	rules?: string | CommunityRule[]
	upcomingEvents?: number
	discussionCount?: number
	linkedDebates?: string[]
	communityGymRooms?: string[]
	integrations?: {
		debatesHosted: number
		gymRoomsActive: number
		crossCommunityEvents: number
	}
	coverImage?: string
	avatar?: string
}

export type CommunityChatMessage = {
	id: string
	communityId: string
	userId: string
	content: string
	createdAt: string
	user?: {
		username: string
		avatarUrl?: string
	}
}

export type CommunityActivity = {
	id: string
	communityId: string
	communityName: string
	type: 'post' | 'discussion' | 'event' | 'member_joined' | 'debate_started'
	title: string
	description: string
	author: string
	timestamp: string
	likes?: number
	comments?: number
}

export type DiscussionThread = {
	id: string
	communityId: string
	title: string
	content: string
	author: string
	authorAvatar?: string
	createdAt: string
	updatedAt: string
	likes: number
	commentCount: number
	tags: string[]
	isPinned?: boolean
	isLocked?: boolean
}

export type DiscussionComment = {
	id: string
	threadId: string
	content: string
	author: string
	authorAvatar?: string
	createdAt: string
	likes: number
	parentId?: string // For nested replies
}

export type CommunityMember = {
	id: string
	userId: string
	communityId: string
	username: string
	displayName: string
	avatar?: string
	role: 'member' | 'moderator' | 'admin' | 'founder'
	joinedAt: string
	lastActive: string
	postCount: number
	discussionCount: number
	reputation: number
	badges: string[]
	bio?: string
	expertise: string[]
	stats?: {
		xp: number
		level: number
		brierScore: number
		debatesWon: number
		viewsChanged: number
	}
	location?: string
}

export type CommunityCategory = string

export type CommunityActivityFeedItem = {
	id: string
	type: 'joined' | 'posted' | 'replied' | 'created_event' | 'left' | 'moderated'
	description: string
	title?: string
	timestamp: string
	user: {
		id: string
		name: string
		avatar?: string
	}
	communityId?: string
	communityName?: string
	likes?: number
	comments?: number
}

export type CommunityDiscussion = {
	id: string
	title: string
	likes?: number
	content: string
	tags: string[]
	isPinned: boolean
	isLocked: boolean
	replyCount: number
	createdAt: string
	updatedAt: string
	author: {
		id: string
		name: string
		avatar?: string
	}
	communityId?: string
}

export type CommunityEvent = {
	id: string
	title: string
	description: string
	tags?: string[]
	type: 'Discussion' | 'Debate' | 'Workshop' | 'Social'
	startTime: string
	endTime?: string
	location?: string
	maxParticipants?: number
	currentParticipants: number
	isCancelled: boolean
	organizer: {
		id: string
		name: string
		avatar?: string
	}
	communityId?: string
	communityName?: string
}

export type CommunityRule = {
	id: string
	title: string
	description: string
	priority: 'high' | 'medium' | 'low'
}

export type CommunityStat = {
	label: string
	value: number
	change: number
	changeType: 'increase' | 'decrease'
}

export type CommunityIntegration = {
	type: 'debates' | 'gym_rooms' | 'events'
	title: string
	description: string
	count: number
	items: string[]
}

export type IntelDossier = {
	id: string
	title: string
	description?: string
	status: 'Active' | 'Classified' | 'Locked' | 'Archived'
	category: 'Project' | 'Op' | 'Archive'
	tags: string[]
	coverImage?: string

	minXp?: number
	originCoordinates?: { lat: number, lng: number, city: string }
	createdAt: string
}

export interface IntelSubmission {
	id: string
	title: string
	status: 'Pending' | 'Approved' | 'Rejected'
	createdAt: string
}

export type IntelRecord = {
	id: string
	dossierId: string
	title: string
	contentType: 'text' | 'pdf' | 'image' | 'video' | 'audio'
	categoryId?: string
	contentUrl?: string
	summary?: string
	confidenceScore?: number // New field for Phase 4
	createdAt: string
}

export type IntelAnnotation = {
	id: string
	dossierId: string
	userId: string
	selectedText: string
	comment: string
	color: string
	createdAt: string
	user: {
		username: string
		avatarUrl?: string
	}
}

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

export type UserProfile = {
	id: string
	username: string
	fullName?: string
	avatarUrl?: string
	bio?: string
	stats?: {
		xp: number
		level: number
		brierScore: number
		debatesWon: number
		viewsChanged: number
	}
	rankTitle?: string
	currentStreak?: number
}

export type VoidMask = {
	id: string
	name: string
	iconType: 'venetian_mask' | 'user' | 'ghost' | 'scan_face'
	color: string
	description?: string
	isActive: boolean
	createdAt: string
}

export type VoidSession = {
	id: string
	userId?: string
	maskId: string
	maskName: string
	sessionToken: string
	expiresAt: string
	isActive: boolean
	messageCount: number
	createdAt: string
	lastActivityAt: string
}

export type VoidMessage = {
	id: string
	sessionId: string
	maskName: string
	content: string
	expiresAt: string
	isDeleted: boolean
	createdAt: string
}

export type VoidStats = {
	activePhantoms: number
	activeSessions: number
	messagesToday: number
	totalMasks: number
}