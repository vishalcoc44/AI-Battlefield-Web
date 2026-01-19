import {
	Market,
	UserStats,
	RecentDebate,
	UserPrediction,
	GymRoom,
	Community,
	CommunityActivity,
	DiscussionThread,
	DiscussionComment,
	CommunityMember,
	CommunityActivityFeedItem,
	CommunityDiscussion,
	CommunityRule,
	CommunityStat,
	CommunityIntegration,
	CommunityEvent
} from './types';

export const MOCK_MARKETS: Market[] = [
	{
		id: "1",
		question: "Will Artificial General Intelligence (AGI) be achieved by 2030?",
		category: "Technology",
		deadline: "Dec 2030",
		volume: 12500,
		consensus: 42
	},
	{
		id: "2",
		question: "Will global carbon emissions peak before 2026?",
		category: "Geopolitics",
		deadline: "Nov 2025",
		volume: 8200,
		consensus: 28
	},
	{
		id: "3",
		question: "Will SpaceX land humans on Mars before 2032?",
		category: "Space",
		deadline: "Jan 2032",
		volume: 5400,
		consensus: 55
	}
]

export const MOCK_USER_STATS: UserStats = {
	level: 12,
	xp: 2450,
	viewsChanged: 12,
	debatesWon: 42,
	brierScore: 0.24
}

export const MOCK_RECENT_DEBATES: RecentDebate[] = [
	{ id: "101", topic: "Universal Basic Income", persona: "Socrates", status: "completed", date: "2 days ago" },
	{ id: "102", topic: "AI Safety Regulation", persona: "Devil's Advocate", status: "active", date: "1 hour ago" }
]

export const MOCK_USER_PREDICTIONS: UserPrediction[] = [
	{ marketId: "1", question: "Will AGI be achieved by 2030?", probability: 65 },
	{ marketId: "2", question: "Global emissions peak 2026?", probability: 30 }
]

export const MOCK_GYM_ROOMS: GymRoom[] = [
	{ id: "100", topic: "Is Privacy Dead in the Age of AI?", activeParticipants: 124, category: "Tech", isFeatured: true, createdBy: "user1", status: "active", endsAt: null, votePro: 0, voteCon: 0 },
	{ id: "101", topic: "UBI vs Jobs Guarantee", activeParticipants: 24, category: "Economics", createdBy: "user2", status: "active", endsAt: null, votePro: 0, voteCon: 0 },
	{ id: "102", topic: "Does Free Will Exist?", activeParticipants: 18, category: "Philosophy", createdBy: "user1", status: "active", endsAt: null, votePro: 0, voteCon: 0 },
	{ id: "103", topic: "Mars Colonization Ethics", activeParticipants: 12, category: "Space", createdBy: "user3", status: "active", endsAt: null, votePro: 0, voteCon: 0 },
	{ id: "104", topic: "The Future of Democracy", activeParticipants: 45, category: "Politics", createdBy: "user4", status: "active", endsAt: null, votePro: 0, voteCon: 0 },
	{ id: "105", topic: "CRISPR and Designer Babies", activeParticipants: 30, category: "Bioethics", createdBy: "user1", status: "active", endsAt: null, votePro: 0, voteCon: 0 }
]

export const MOCK_COMMUNITIES: Community[] = [
	{
		id: "1",
		name: "Rationalists United",
		members: "12.5k",
		type: "Public",
		desc: "Applying Bayes' theorem to everyday life.",
		category: "Philosophy",
		tags: ["rationality", "bayesian", "decision-making", "cognitive-bias"],
		createdDate: "2023-06-15",
		activityLevel: "High",
		discussionCount: 1247,
		upcomingEvents: 3,
		linkedDebates: ["debate1", "debate2"],
		communityGymRooms: ["gym1", "gym2"],
		integrations: {
			debatesHosted: 12,
			gymRoomsActive: 3,
			crossCommunityEvents: 2
		},
		rules: "1. Use evidence and reasoning in all discussions\n2. Be civil and respectful to all members\n3. Cite sources when making factual claims\n4. No political or religious proselytizing\n5. Focus on rationality and clear thinking\n6. Give the benefit of doubt when interpreting others' statements"
	},
	{
		id: "2",
		name: "Stoic Circle",
		members: "8.2k",
		type: "Public",
		desc: "Daily meditations and emotional control training.",
		category: "Philosophy",
		tags: ["stoicism", "meditation", "emotional-control", "mindfulness"],
		createdDate: "2023-04-22",
		activityLevel: "Medium",
		discussionCount: 892,
		upcomingEvents: 1,
		linkedDebates: ["debate3"],
		communityGymRooms: ["gym3"],
		integrations: {
			debatesHosted: 8,
			gymRoomsActive: 2,
			crossCommunityEvents: 1
		},
		rules: "1. Practice daily meditation and reflection\n2. Focus on what you can control, accept what you cannot\n3. Be kind and supportive to fellow practitioners\n4. Share personal experiences and insights\n5. Respect different paths to wisdom\n6. Maintain confidentiality in personal sharing"
	},
	{
		id: "3",
		name: "The Agora",
		members: "500",
		type: "Private",
		desc: "Invite-only high level debate club.",
		category: "Debate",
		tags: ["debate", "elite", "intellectual", "invite-only"],
		createdDate: "2023-08-10",
		activityLevel: "High",
		discussionCount: 456,
		upcomingEvents: 5,
		linkedDebates: ["debate4", "debate5", "debate6"],
		communityGymRooms: ["gym4", "gym5"],
		integrations: {
			debatesHosted: 25,
			gymRoomsActive: 5,
			crossCommunityEvents: 8
		},
		rules: "1. Maintain high standards of argumentation\n2. Respect the structured debate format\n3. No ad hominem attacks or personal attacks\n4. Cite evidence and reasoning for all claims\n5. Listen actively to opposing viewpoints\n6. Keep discussions civil and productive\n7. Members must maintain invitation-only status"
	},
	{
		id: "4",
		name: "Effective Altruism",
		members: "15k",
		type: "Public",
		desc: "Doing the most good possible.",
		category: "Ethics",
		tags: ["altruism", "impact", "charity", "giving"],
		createdDate: "2023-01-18",
		activityLevel: "High",
		discussionCount: 2156,
		upcomingEvents: 7,
		rules: "1. Focus on evidence-based approaches to doing good\n2. Be open to changing your mind based on new evidence\n3. Respect different cause areas and approaches\n4. Share research and data when making claims\n5. Be supportive of others' charitable choices\n6. Maintain high standards of discourse and evidence"
	},
	{
		id: "5",
		name: "Tech Ethics Board",
		members: "3.1k",
		type: "Public",
		desc: "Debating the moral implications of AI.",
		category: "Technology",
		tags: ["AI", "ethics", "technology", "regulation"],
		createdDate: "2023-09-05",
		activityLevel: "High",
		discussionCount: 678,
		upcomingEvents: 2,
		rules: "1. Focus on evidence-based discussion of AI ethics\n2. Respect diverse perspectives on technology\n3. Cite technical papers and research when possible\n4. Avoid doomsday scenarios without evidence\n5. Be open to constructive criticism of ideas\n6. Maintain civil discourse even on controversial topics"
	},
	{
		id: "6",
		name: "Political Centrists",
		members: "9.8k",
		type: "Public",
		desc: "Finding common ground in a polarized world.",
		category: "Politics",
		tags: ["politics", "centrism", "compromise", "dialogue"],
		createdDate: "2023-03-12",
		activityLevel: "Medium",
		discussionCount: 1543,
		upcomingEvents: 4,
		rules: "1. Focus on finding common ground and compromise\n2. Respect differing political viewpoints\n3. Use evidence and data in political discussions\n4. Avoid inflammatory rhetoric and name-calling\n5. Be open to changing positions based on evidence\n6. Maintain civil discourse even on divisive topics\n7. Focus on policy solutions rather than personal attacks"
	}
]

export const MOCK_COMMUNITY_ACTIVITIES: CommunityActivity[] = [
	{
		id: "act1",
		communityId: "1",
		communityName: "Rationalists United",
		type: "discussion",
		title: "New Bayesian reasoning framework discussion",
		description: "Exploring the latest developments in probabilistic reasoning...",
		author: "Alice Chen",
		timestamp: "2 hours ago",
		likes: 24,
		comments: 8
	},
	{
		id: "act2",
		communityId: "4",
		communityName: "Effective Altruism",
		type: "event",
		title: "Charity Impact Workshop",
		description: "Learn how to maximize your charitable giving impact",
		author: "Bob Martinez",
		timestamp: "4 hours ago",
		likes: 12,
		comments: 3
	},
	{
		id: "act3",
		communityId: "5",
		communityName: "Tech Ethics Board",
		type: "post",
		title: "Thoughts on AI alignment research",
		description: "Recent breakthroughs in AI safety research and their implications...",
		author: "Carol Davis",
		timestamp: "6 hours ago",
		likes: 45,
		comments: 16
	},
	{
		id: "act4",
		communityId: "3",
		communityName: "The Agora",
		type: "debate_started",
		title: "Climate Change Policy Debate",
		description: "Structured debate on carbon pricing vs regulation approaches",
		author: "David Wilson",
		timestamp: "8 hours ago",
		likes: 18,
		comments: 7
	},
	{
		id: "act5",
		communityId: "2",
		communityName: "Stoic Circle",
		type: "member_joined",
		title: "Welcome new members!",
		description: "Three new members joined our meditation community",
		author: "Emma Thompson",
		timestamp: "12 hours ago",
		likes: 8,
		comments: 2
	},
	{
		id: "act6",
		communityId: "6",
		communityName: "Political Centrists",
		type: "discussion",
		title: "Finding compromise in healthcare reform",
		description: "Exploring middle-ground solutions for healthcare policy...",
		author: "Frank Garcia",
		timestamp: "1 day ago",
		likes: 31,
		comments: 12
	}
]

export const MOCK_DISCUSSION_THREADS: DiscussionThread[] = [
	{
		id: "thread1",
		communityId: "1",
		title: "Best practices for Bayesian reasoning in everyday decisions",
		content: "I've been trying to apply Bayesian thinking to my daily life, but I'm struggling with complex scenarios involving multiple variables. What frameworks or tools do you recommend for breaking down complex decision trees?",
		author: "Alice Chen",
		createdAt: "2024-01-14T10:30:00Z",
		updatedAt: "2024-01-14T14:20:00Z",
		likes: 24,
		commentCount: 8,
		tags: ["bayesian", "decision-making", "frameworks"],
		isPinned: true
	},
	{
		id: "thread2",
		communityId: "4",
		title: "Global health interventions: What's working in 2024?",
		content: "With the recent WHO reports on global health progress, I'm curious about which interventions are showing the most impact per dollar spent. Malaria nets? Deworming programs? Vitamin A supplementation?",
		author: "Bob Martinez",
		createdAt: "2024-01-13T16:45:00Z",
		updatedAt: "2024-01-13T16:45:00Z",
		likes: 18,
		commentCount: 12,
		tags: ["global-health", "impact", "interventions"]
	},
	{
		id: "thread3",
		communityId: "5",
		title: "AI alignment research: Current bottlenecks and opportunities",
		content: "As someone new to AI safety research, I'm trying to understand where the field is currently bottlenecked. Is it theoretical work, empirical validation, or something else? What areas seem most promising for new researchers?",
		author: "Carol Davis",
		createdAt: "2024-01-13T09:15:00Z",
		updatedAt: "2024-01-13T11:30:00Z",
		likes: 31,
		commentCount: 15,
		tags: ["AI-safety", "research", "alignment"]
	},
	{
		id: "thread4",
		communityId: "2",
		title: "Morning meditation routine for busy professionals",
		content: "I have a demanding job and family responsibilities, but I want to maintain a consistent meditation practice. What routines work best for people with similar constraints? 10 minutes? 20 minutes? Apps vs traditional methods?",
		author: "David Wilson",
		createdAt: "2024-01-12T07:20:00Z",
		updatedAt: "2024-01-12T07:20:00Z",
		likes: 15,
		commentCount: 9,
		tags: ["meditation", "routine", "productivity"]
	},
	{
		id: "thread5",
		communityId: "6",
		title: "Finding compromise on immigration policy",
		content: "With polarized views on immigration, what policy frameworks have shown promise in finding middle ground? Guest worker programs? Points-based systems? Skills-based immigration? What evidence supports different approaches?",
		author: "Emma Thompson",
		createdAt: "2024-01-11T20:10:00Z",
		updatedAt: "2024-01-12T08:45:00Z",
		likes: 22,
		commentCount: 18,
		tags: ["immigration", "policy", "compromise"]
	}
]

export const MOCK_DISCUSSION_COMMENTS: DiscussionComment[] = [
	{
		id: "comment1",
		threadId: "thread1",
		content: "I recommend starting with simple decision trees and gradually building complexity. The key is identifying the key variables that actually matter for your decision.",
		author: "Frank Garcia",
		createdAt: "2024-01-14T11:15:00Z",
		likes: 8
	},
	{
		id: "comment2",
		threadId: "thread1",
		content: "Second the recommendation for decision trees. Also check out the 'Thinking, Fast and Slow' framework for understanding when to apply different types of reasoning.",
		author: "Grace Lee",
		createdAt: "2024-01-14T12:30:00Z",
		likes: 12,
		parentId: "comment1"
	}
]

export const MOCK_COMMUNITY_EVENTS: CommunityEvent[] = [
	{
		id: "event1",
		title: "Global Health Impact Workshop",
		description: "Learn how to maximize your charitable giving impact with evidence-based approaches to global health interventions.",
		type: "Workshop",
		startTime: "2024-01-20T14:00:00Z",
		endTime: "2024-01-20T17:00:00Z",
		location: "Virtual",
		maxParticipants: 100,
		currentParticipants: 45,
		isCancelled: false,
		organizer: {
			id: "user6",
			name: "Bob Martinez",
			avatar: undefined
		}
	},
	{
		id: "event2",
		title: "AI Alignment Research Meetup",
		description: "Discussing recent breakthroughs in AI safety research and exploring collaboration opportunities.",
		type: "Discussion",
		startTime: "2024-01-25T18:30:00Z",
		endTime: "2024-01-25T21:00:00Z",
		location: "San Francisco, CA",
		maxParticipants: 50,
		currentParticipants: 28,
		isCancelled: false,
		organizer: {
			id: "user7",
			name: "Carol Davis",
			avatar: undefined
		}
	},
	{
		id: "event3",
		title: "Structured Debate: Universal Basic Income",
		description: "A formal debate exploring the economic and social implications of implementing universal basic income policies.",
		type: "Debate",
		startTime: "2024-01-18T19:00:00Z",
		endTime: "2024-01-18T22:00:00Z",
		location: "Virtual",
		maxParticipants: 200,
		currentParticipants: 67,
		isCancelled: false,
		organizer: {
			id: "user8",
			name: "David Wilson",
			avatar: undefined
		}
	},
	{
		id: "event4",
		title: "Meditation and Mindfulness Retreat",
		description: "A weekend retreat focused on deep meditation practices, emotional resilience training, and community building.",
		type: "Social",
		startTime: "2024-02-10T09:00:00Z",
		endTime: "2024-02-11T18:00:00Z",
		location: "Sedona, AZ",
		maxParticipants: 20,
		currentParticipants: 12,
		isCancelled: false,
		organizer: {
			id: "user9",
			name: "Emma Thompson",
			avatar: undefined
		}
	}
]

export const MOCK_COMMUNITY_MEMBERS: CommunityMember[] = [
	{
		id: "member1",
		userId: "user1",
		communityId: "1",
		username: "alice_chen",
		displayName: "Alice Chen",
		avatar: undefined,
		role: "founder",
		joinedAt: "2023-06-15T00:00:00Z",
		lastActive: "2024-01-14T10:30:00Z",
		postCount: 145,
		discussionCount: 23,
		reputation: 1250,
		badges: ["founder", "top-contributor", "bayesian-expert"],
		bio: "PhD in Cognitive Science, passionate about applying Bayesian reasoning to everyday life.",
		expertise: ["Bayesian Statistics", "Decision Theory", "Cognitive Bias"]
	},
	{
		id: "member2",
		userId: "user2",
		communityId: "1",
		username: "bob_smith",
		displayName: "Bob Smith",
		role: "moderator",
		joinedAt: "2023-07-22T00:00:00Z",
		lastActive: "2024-01-13T15:45:00Z",
		postCount: 89,
		discussionCount: 12,
		reputation: 890,
		badges: ["moderator", "helpful"],
		bio: "Software engineer with a passion for rational thinking and clear communication.",
		expertise: ["Programming", "Logic", "Debate"]
	},
	{
		id: "member3",
		userId: "user3",
		communityId: "4",
		username: "carol_davis",
		displayName: "Carol Davis",
		role: "admin",
		joinedAt: "2023-01-18T00:00:00Z",
		lastActive: "2024-01-14T09:15:00Z",
		postCount: 203,
		discussionCount: 45,
		reputation: 2100,
		badges: ["admin", "top-contributor", "impact-expert"],
		bio: "Researcher focused on global health and effective altruism. Formerly at GiveWell.",
		expertise: ["Global Health", "Cost-Effectiveness Analysis", "Research Methodology"]
	},
	{
		id: "member4",
		userId: "user4",
		communityId: "5",
		username: "david_wilson",
		displayName: "David Wilson",
		role: "member",
		joinedAt: "2023-09-05T00:00:00Z",
		lastActive: "2024-01-12T14:20:00Z",
		postCount: 67,
		discussionCount: 8,
		reputation: 650,
		badges: ["new-member"],
		bio: "AI researcher exploring alignment problems and safety concerns.",
		expertise: ["Machine Learning", "AI Safety", "Technical Writing"]
	},
	{
		id: "member5",
		userId: "user5",
		communityId: "2",
		username: "emma_thompson",
		displayName: "Emma Thompson",
		role: "moderator",
		joinedAt: "2023-04-22T00:00:00Z",
		lastActive: "2024-01-13T11:30:00Z",
		postCount: 134,
		discussionCount: 18,
		reputation: 980,
		badges: ["moderator", "meditation-guide"],
		bio: "Mindfulness teacher and stoic philosophy enthusiast. Leading meditation sessions.",
		expertise: ["Stoicism", "Meditation", "Emotional Intelligence"]
	}
]

export const MOCK_COMMUNITY_ACTIVITY_FEED: CommunityActivityFeedItem[] = [
	{
		id: "feed1",
		type: "joined",
		description: "Sarah Johnson joined the community",
		timestamp: "2024-01-14T10:30:00Z",
		user: {
			id: "user5",
			name: "Sarah Johnson",
			avatar: undefined
		}
	},
	{
		id: "feed2",
		type: "posted",
		description: "Created a new discussion: 'The importance of critical thinking'",
		timestamp: "2024-01-14T09:15:00Z",
		user: {
			id: "user2",
			name: "Bob Wilson",
			avatar: undefined
		}
	},
	{
		id: "feed3",
		type: "replied",
		description: "Replied to 'Bayesian reasoning fundamentals'",
		timestamp: "2024-01-14T08:45:00Z",
		user: {
			id: "user1",
			name: "Alice Chen",
			avatar: undefined
		}
	},
	{
		id: "feed4",
		type: "created_event",
		description: "Created event: 'Weekly Debate Night'",
		timestamp: "2024-01-13T16:20:00Z",
		user: {
			id: "user3",
			name: "Charlie Brown",
			avatar: undefined
		}
	}
]

export const MOCK_COMMUNITY_DISCUSSIONS: CommunityDiscussion[] = [
	{
		id: "disc1",
		title: "The importance of critical thinking in modern society",
		content: "With the rise of misinformation and AI-generated content, developing strong critical thinking skills has never been more important. How do we teach these skills effectively?",
		tags: ["critical-thinking", "education", "society"],
		isPinned: true,
		isLocked: false,
		replyCount: 23,
		createdAt: "2024-01-14T09:15:00Z",
		updatedAt: "2024-01-14T10:30:00Z",
		author: {
			id: "user2",
			name: "Bob Wilson",
			avatar: undefined
		}
	},
	{
		id: "disc2",
		title: "Bayesian reasoning fundamentals",
		content: "Let's discuss the core principles of Bayesian probability and how they apply to decision making under uncertainty.",
		tags: ["bayesian", "probability", "decision-making"],
		isPinned: false,
		isLocked: false,
		replyCount: 15,
		createdAt: "2024-01-13T14:20:00Z",
		updatedAt: "2024-01-14T08:45:00Z",
		author: {
			id: "user1",
			name: "Alice Chen",
			avatar: undefined
		}
	},
	{
		id: "disc3",
		title: "Community guidelines and moderation",
		content: "Discussing our approach to maintaining a healthy discussion environment while preserving free speech.",
		tags: ["moderation", "community", "guidelines"],
		isPinned: false,
		isLocked: false,
		replyCount: 8,
		createdAt: "2024-01-12T11:00:00Z",
		updatedAt: "2024-01-13T09:15:00Z",
		author: {
			id: "user4",
			name: "Diana Prince",
			avatar: undefined
		}
	}
]

export const MOCK_COMMUNITY_RULES: CommunityRule[] = [
	{
		id: "rule1",
		title: "Respectful Discourse",
		description: "Treat all members with respect. Personal attacks, harassment, or discriminatory language will not be tolerated.",
		priority: "high"
	},
	{
		id: "rule2",
		title: "Evidence-Based Arguments",
		description: "Support your claims with evidence and reasoning. Avoid unsubstantiated opinions in serious discussions.",
		priority: "high"
	},
	{
		id: "rule3",
		title: "Stay On Topic",
		description: "Keep discussions relevant to the thread topic. Off-topic posts may be moved or removed.",
		priority: "medium"
	},
	{
		id: "rule4",
		title: "No Spam or Self-Promotion",
		description: "Avoid excessive self-promotion or spam. Quality contributions are valued over quantity.",
		priority: "medium"
	},
	{
		id: "rule5",
		title: "Privacy Respect",
		description: "Do not share personal information about others without their explicit consent.",
		priority: "low"
	}
]

export const MOCK_COMMUNITY_STATS: CommunityStat[] = [
	{
		label: "Total Members",
		value: 1247,
		change: 5.2,
		changeType: "increase"
	},
	{
		label: "Active Discussions",
		value: 89,
		change: 12.5,
		changeType: "increase"
	},
	{
		label: "Upcoming Events",
		value: 15,
		change: -2.1,
		changeType: "decrease"
	},
	{
		label: "Activity This Week",
		value: 2341,
		change: 8.7,
		changeType: "increase"
	}
]

export const MOCK_COMMUNITY_INTEGRATIONS: CommunityIntegration[] = [
	{
		type: "debates",
		title: "Hosted Debates",
		description: "Debates organized within this community",
		count: 12,
		items: ["debate1", "debate2", "debate3"]
	},
	{
		type: "gym_rooms",
		title: "Active Gym Rooms",
		description: "Real-time discussion spaces",
		count: 5,
		items: ["gym1", "gym2", "gym3", "gym4", "gym5"]
	},
	{
		type: "events",
		title: "Cross-Community Events",
		description: "Events bridging multiple communities",
		count: 3,
		items: ["event1", "event2", "event3"]
	}
]
