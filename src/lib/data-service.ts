import { supabase } from './supabase'

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

// Mock Data
const MOCK_MARKETS: Market[] = [
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

const MOCK_USER_STATS: UserStats = {
  level: 12,
  xp: 2450,
  viewsChanged: 12,
  debatesWon: 42
}

const MOCK_RECENT_DEBATES: RecentDebate[] = [
  { id: "101", topic: "Universal Basic Income", persona: "Socrates", status: "completed", date: "2 days ago" },
  { id: "102", topic: "AI Safety Regulation", persona: "Devil's Advocate", status: "active", date: "1 hour ago" }
]

const MOCK_USER_PREDICTIONS: UserPrediction[] = [
  { marketId: "1", question: "Will AGI be achieved by 2030?", probability: 65 },
  { marketId: "2", question: "Global emissions peak 2026?", probability: 30 }
]

const MOCK_GYM_ROOMS: GymRoom[] = [
  { id: "100", topic: "Is Privacy Dead in the Age of AI?", activeParticipants: 124, category: "Tech", isFeatured: true },
  { id: "101", topic: "UBI vs Jobs Guarantee", activeParticipants: 24, category: "Economics" },
  { id: "102", topic: "Does Free Will Exist?", activeParticipants: 18, category: "Philosophy" },
  { id: "103", topic: "Mars Colonization Ethics", activeParticipants: 12, category: "Space" },
  { id: "104", topic: "The Future of Democracy", activeParticipants: 45, category: "Politics" },
  { id: "105", topic: "CRISPR and Designer Babies", activeParticipants: 30, category: "Bioethics" }
]

const MOCK_COMMUNITIES: Community[] = [
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

const MOCK_COMMUNITY_ACTIVITIES: CommunityActivity[] = [
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

const MOCK_DISCUSSION_THREADS: DiscussionThread[] = [
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

const MOCK_DISCUSSION_COMMENTS: DiscussionComment[] = [
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

const MOCK_COMMUNITY_EVENTS: CommunityEvent[] = [
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

const MOCK_COMMUNITY_MEMBERS: CommunityMember[] = [
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

const MOCK_COMMUNITY_ACTIVITY_FEED: CommunityActivityFeedItem[] = [
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

const MOCK_COMMUNITY_DISCUSSIONS: CommunityDiscussion[] = [
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

const MOCK_COMMUNITY_RULES: CommunityRule[] = [
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

const MOCK_COMMUNITY_STATS: CommunityStat[] = [
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

const MOCK_COMMUNITY_INTEGRATIONS: CommunityIntegration[] = [
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

class DataService {
  private useMock: boolean
  private supabase: any

  constructor() {
    this.useMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_USE_MOCK === 'true'
    this.supabase = supabase
  }

  async getMarkets(): Promise<Market[]> {
    if (this.useMock) {
      return new Promise((resolve) => setTimeout(() => resolve(MOCK_MARKETS), 500))
    }

    try {
      const { data, error } = await supabase
        .from('prediction_markets')
        .select('*')

      if (error) throw error

      return data.map((m: any) => ({
        id: m.id,
        question: m.question,
        category: m.category || "General",
        deadline: new Date(m.deadline).toLocaleDateString(),
        volume: m.volume,
        consensus: 50
      })) as Market[]
    } catch (error) {
      console.error("Error fetching markets:", error)
      return MOCK_MARKETS
    }
  }

  async submitPrediction(marketId: string, probability: number, userId: string) {
    if (this.useMock) {
      console.log(`[Mock] Submitted ${probability}% for market ${marketId}`)
      return { success: true }
    }

    const { error } = await supabase
      .from('user_predictions')
      .upsert({
        market_id: marketId,
        user_id: userId,
        probability,
        amount: 0
      })

    if (error) throw error
    return { success: true }
  }

  async getUserStats(userId: string): Promise<UserStats> {
    if (this.useMock) return MOCK_USER_STATS

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('stats')
        .eq('id', userId)
        .single()

      if (error || !data) throw error

      return {
        level: data.stats?.level || 1,
        xp: data.stats?.xp || 0,
        viewsChanged: data.stats?.views_changed || 0,
        debatesWon: data.stats?.debates_won || 0
      }
    } catch (error) {
      console.error("Error fetching user stats:", error)
      return MOCK_USER_STATS
    }
  }

  async getRecentDebates(userId: string): Promise<RecentDebate[]> {
    if (this.useMock) return MOCK_RECENT_DEBATES

    try {
      const { data, error } = await supabase
        .from('debates')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error

      return data.map((d: any) => ({
        id: d.id,
        topic: d.topic,
        persona: d.persona_id, // Map ID to name if needed, using raw ID for now
        status: d.status,
        date: new Date(d.created_at).toLocaleDateString()
      })) as RecentDebate[]
    } catch (error) {
      console.error("Error fetching debates:", error)
      return MOCK_RECENT_DEBATES
    }
  }

  async getUserPredictions(userId: string): Promise<UserPrediction[]> {
    if (this.useMock) return MOCK_USER_PREDICTIONS

    try {
      const { data, error } = await supabase
        .from('user_predictions')
        .select(`
          market_id,
          probability,
          prediction_markets (question)
        `)
        .eq('user_id', userId)
        .limit(5)

      if (error) throw error

      return data.map((p: any) => ({
        marketId: p.market_id,
        question: p.prediction_markets?.question || "Unknown Market",
        probability: p.probability
      })) as UserPrediction[]
    } catch (error) {
      console.error("Error fetching user predictions:", error)
      return MOCK_USER_PREDICTIONS
    }
  }

  async getActiveGymRooms(): Promise<GymRoom[]> {
    if (this.useMock) return MOCK_GYM_ROOMS

    try {
      const { data, error } = await supabase
        .from('gym_rooms')
        .select('*')
        .eq('is_live', true)
        .order('active_participants', { ascending: false })

      if (error) throw error

      return data.map((r: any) => ({
        id: r.id,
        topic: r.topic,
        activeParticipants: r.active_participants || 0,
        category: r.description ? r.description.split('|')[0] : "General", // Simple hack to store category in description for now
        isFeatured: r.active_participants > 50
      })) as GymRoom[]
    } catch (error) {
      console.error("Error fetching gym rooms:", error)
      return MOCK_GYM_ROOMS
    }
  }

  async createGymRoom(topic: string, category: string): Promise<GymRoom | null> {
    if (this.useMock) {
      const newRoom = { id: Date.now().toString(), topic, activeParticipants: 1, category }
      MOCK_GYM_ROOMS.push(newRoom)
      return newRoom
    }

    try {
      const { data, error } = await supabase
        .from('gym_rooms')
        .insert({
          topic,
          description: `${category}|Created by user`,
          active_participants: 1,
          is_live: true
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        topic: data.topic,
        activeParticipants: data.active_participants,
        category
      }
    } catch (error) {
      console.error("Error creating gym room:", error)
      return null
    }
  }

  async createCommunity(communityData: {
    name: string
    description: string
    type: 'Public' | 'Private'
    category: string
    tags: string[]
    rules?: string
  }, creatorId: string): Promise<Community | null> {
    if (this.useMock) {
      const newCommunity: Community = {
        id: `community_${Date.now()}`,
        name: communityData.name,
        members: '1',
        type: communityData.type,
        desc: communityData.description,
        category: communityData.category,
        tags: communityData.tags,
        createdDate: new Date().toISOString(),
        activityLevel: 'Low',
        rules: communityData.rules,
        upcomingEvents: 0,
        discussionCount: 0,
        linkedDebates: [],
        communityGymRooms: [],
        integrations: {
          debatesHosted: 0,
          gymRoomsActive: 0,
          crossCommunityEvents: 0
        }
      }
      MOCK_COMMUNITIES.unshift(newCommunity)

      // Add creator as member with founder role
      const creatorMember: CommunityMember = {
        id: `member_${Date.now()}`,
        userId: creatorId,
        communityId: newCommunity.id,
        username: 'creator',
        displayName: 'Creator',
        role: 'founder',
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        postCount: 0,
        discussionCount: 0,
        reputation: 100,
        badges: ['founder'],
        bio: 'Community founder',
        expertise: []
      }
      MOCK_COMMUNITY_MEMBERS.push(creatorMember)

      return newCommunity
    }

    try {
      // Create the community
      const { data: newCommunityData, error: communityError } = await this.supabase
        .from('communities')
        .insert({
          name: communityData.name,
          description: communityData.description,
          type: communityData.type.toLowerCase(),
          category: communityData.category,
          tags: communityData.tags,
          rules: communityData.rules ? [{ title: 'Community Rules', description: communityData.rules, priority: 'high' }] : [],
          integrations: {
            debatesHosted: 0,
            gymRoomsActive: 0,
            crossCommunityEvents: 0
          },
          linked_debates: [],
          community_gym_rooms: []
        })
        .select()
        .single()

      if (communityError) throw communityError

      // Add creator as community member with founder role
      const { error: memberError } = await this.supabase
        .from('community_members')
        .insert({
          community_id: newCommunityData.id,
          user_id: creatorId,
          role: 'admin' // Using 'admin' as the highest role available in our schema
        })

      if (memberError) throw memberError

      // Convert to Community type
      return {
        id: newCommunityData.id,
        name: newCommunityData.name,
        members: newCommunityData.member_count?.toString() || '1',
        type: newCommunityData.type === 'public' ? 'Public' : 'Private',
        desc: newCommunityData.description || '',
        category: newCommunityData.category || 'General',
        tags: newCommunityData.tags || [],
        createdDate: newCommunityData.created_at,
        activityLevel: (newCommunityData.activity_level as 'High' | 'Medium' | 'Low') || 'Low',
        rules: newCommunityData.rules,
        upcomingEvents: 0,
        discussionCount: 0,
        linkedDebates: newCommunityData.linked_debates || [],
        communityGymRooms: newCommunityData.community_gym_rooms || [],
        integrations: newCommunityData.integrations
      }
    } catch (error) {
      console.error("Error creating community:", error)
      return null
    }
  }

  async getCommunities(): Promise<Community[]> {
    if (this.useMock) return MOCK_COMMUNITIES

    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .limit(20)

      if (error) throw error

      return data.map((c: any) => ({
        id: c.id,
        name: c.name,
        members: c.member_count?.toString() || '0',
        type: c.type === 'private' ? 'Private' : 'Public',
        desc: c.description || '',
        category: c.category || 'General',
        tags: c.tags || [],
        createdDate: c.created_at,
        activityLevel: (c.activity_level as 'High' | 'Medium' | 'Low') || 'Low',
        rules: c.rules,
        upcomingEvents: 0,
        discussionCount: 0,
        linkedDebates: c.linked_debates || [],
        communityGymRooms: c.community_gym_rooms || [],
        integrations: c.integrations || {
          debatesHosted: 0,
          gymRoomsActive: 0,
          crossCommunityEvents: 0
        }
      })) as Community[]
    } catch (error) {
      console.error("Error fetching communities:", error)
      return MOCK_COMMUNITIES
    }
  }

  async getCommunityById(id: string): Promise<Community | null> {
    if (this.useMock) {
      return MOCK_COMMUNITIES.find(c => c.id === id) || null
    }

    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.name,
        members: data.member_count?.toString() || '0',
        type: data.type === 'private' ? 'Private' : 'Public',
        desc: data.description || '',
        category: data.category || 'General',
        tags: data.tags || [],
        createdDate: data.created_at,
        activityLevel: (data.activity_level as 'High' | 'Medium' | 'Low') || 'Low',
        rules: data.rules,
        upcomingEvents: 0,
        discussionCount: 0,
        linkedDebates: data.linked_debates || [],
        communityGymRooms: data.community_gym_rooms || [],
        integrations: data.integrations || {
          debatesHosted: 0,
          gymRoomsActive: 0,
          crossCommunityEvents: 0
        }
      } as Community
    } catch (error) {
      console.error(`Error fetching community ${id}:`, error)
      return null
    }
  }

  async joinCommunity(communityId: string, userId: string) {
    if (this.useMock) {
      console.log(`[Mock] User ${userId} joined community ${communityId}`)
      return { success: true }
    }

    try {
      const { error } = await supabase
        .from('community_members')
        .insert({
          community_id: communityId,
          user_id: userId,
          role: 'member'
        })

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error("Error joining community:", error)
      throw error
    }
  }

  async getCommunityActivities(limit: number = 10): Promise<CommunityActivity[]> {
    if (this.useMock) return MOCK_COMMUNITY_ACTIVITIES.slice(0, limit)

    try {
      // This would be implemented with actual Supabase queries
      // For now, return mock data
      return MOCK_COMMUNITY_ACTIVITIES.slice(0, limit)
    } catch (error) {
      console.error("Error fetching community activities:", error)
      return MOCK_COMMUNITY_ACTIVITIES.slice(0, limit)
    }
  }

  async getDiscussionThreads(communityId?: string, limit: number = 10): Promise<DiscussionThread[]> {
    if (this.useMock) {
      const threads = communityId
        ? MOCK_DISCUSSION_THREADS.filter(t => t.communityId === communityId)
        : MOCK_DISCUSSION_THREADS
      return threads.slice(0, limit)
    }

    try {
      // This would be implemented with actual Supabase queries
      return []
    } catch (error) {
      console.error("Error fetching discussion threads:", error)
      return []
    }
  }

  async getDiscussionComments(threadId: string): Promise<DiscussionComment[]> {
    if (this.useMock) {
      return MOCK_DISCUSSION_COMMENTS.filter(c => c.threadId === threadId)
    }

    try {
      // This would be implemented with actual Supabase queries
      return []
    } catch (error) {
      console.error("Error fetching discussion comments:", error)
      return []
    }
  }

  async createDiscussionThread(communityId: string, title: string, content: string, tags: string[], userId: string): Promise<DiscussionThread | null> {
    if (this.useMock) {
      const newThread: DiscussionThread = {
        id: `thread${Date.now()}`,
        communityId,
        title,
        content,
        author: 'Current User', // Would get from auth
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        commentCount: 0,
        tags,
        isPinned: false,
        isLocked: false
      }
      MOCK_DISCUSSION_THREADS.unshift(newThread)
      return newThread
    }

    try {
      // This would be implemented with actual Supabase queries
      return null
    } catch (error) {
      console.error("Error creating discussion thread:", error)
      return null
    }
  }


  async rsvpToEvent(eventId: string, userId: string): Promise<boolean> {
    if (this.useMock) {
      console.log(`[Mock] User ${userId} RSVP'd to event ${eventId}`)
      return true
    }

    try {
      // This would be implemented with actual Supabase queries
      return true
    } catch (error) {
      console.error("Error RSVPing to event:", error)
      return false
    }
  }


  async leaveCommunity(communityId: string, userId: string): Promise<{ success: boolean; error?: any }> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 500))
      return { success: true }
    }

    try {
      const { error } = await this.supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', userId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error leaving community:', error)
      return { success: false, error }
    }
  }

  async getCommunityMemberProfile(userId: string, communityId: string): Promise<CommunityMember | null> {
    if (this.useMock) {
      return MOCK_COMMUNITY_MEMBERS.find(m => m.userId === userId && m.communityId === communityId) || null
    }

    try {
      const { data, error } = await this.supabase
        .from('community_members')
        .select(`
          user_id,
          role,
          joined_at,
          profiles:user_id (
            username,
            avatar_url,
            stats,
            bio,
            expertise,
            location
          )
        `)
        .eq('community_id', communityId)
        .eq('user_id', userId)
        .single()

      if (error) return null

      return {
        id: data.user_id,
        communityId: communityId,
        userId: data.user_id,
        displayName: data.profiles?.username || 'Unknown User',
        username: data.profiles?.username || 'unknown',
        avatar: data.profiles?.avatar_url,
        role: data.role as CommunityMember['role'],
        joinedAt: data.joined_at,
        bio: data.profiles?.bio,
        location: data.profiles?.location,
        expertise: data.profiles?.expertise || [],
        stats: data.profiles?.stats || {
          xp: 0,
          level: 1,
          brierScore: 0,
          debatesWon: 0,
          viewsChanged: 0
        },
        lastActive: new Date().toISOString(),
        postCount: 0,
        discussionCount: 0,
        reputation: 0,
        badges: []
      }
    } catch (error) {
      console.error("Error fetching community member profile:", error)
      return null
    }
  }

  async getCommunityCategories(): Promise<string[]> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return ["Technology", "Gaming", "Sports", "Music", "Art", "Science", "Business"];
    }

    try {
      const { data, error } = await this.supabase
        .from('communities')
        .select('category')
        .not('category', 'is', null);

      if (error) throw error;

      // Get unique categories
      const categories = [...new Set(data.map((item: any) => item.category as string))];
      return categories as string[];
    } catch (error) {
      console.error('Error fetching community categories:', error);
      return ["Technology", "Gaming", "Sports", "Music", "Art", "Science", "Business"];
    }
  }

  async getCommunityActivityFeed(communityId: string, limit: number = 20): Promise<CommunityActivityFeedItem[]> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_COMMUNITY_ACTIVITY_FEED.filter(a => a.communityId === communityId).slice(0, limit);
    }

    try {
      const { data, error } = await this.supabase
        .from('community_activity_feed')
        .select(`
          id,
          activity_type,
          description,
          created_at,
          user_id,
          community_id,
          related_id,
          communities(name),
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map((item: any) => ({
        id: item.id,
        type: item.activity_type as CommunityActivityFeedItem['type'],
        description: item.description,
        timestamp: item.created_at,
        communityName: item.communities?.name,
        // Using description as title if not available, or "Activity"
        title: item.description ? (item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description) : 'New Activity',
        user: {
          id: item.user_id,
          name: item.profiles?.username || 'Unknown User',
          avatar: item.profiles?.avatar_url
        },
        // Likes/Comments could be fetched with joined tables if needed, defaulting for now
        likes: 0,
        comments: 0
      }));
    } catch (error) {
      console.error('Error fetching community activity feed:', error);
      return MOCK_COMMUNITY_ACTIVITY_FEED.slice(0, limit);
    }
  }

  async getCommunityDiscussions(communityId: string, limit: number = 20): Promise<CommunityDiscussion[]> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_COMMUNITY_DISCUSSIONS.filter(d => d.communityId === communityId).slice(0, limit);
    }

    try {
      const { data, error } = await this.supabase
        .from('community_discussions')
        .select(`
          id,
          title,
          content,
          tags,
          is_pinned,
          is_locked,
          reply_count,
          created_at,
          updated_at,
          author_id,
          community_id,
          profiles:author_id (
            username,
            avatar_url
          )
        `)
        .eq('community_id', communityId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        tags: item.tags || [],
        likes: 0, // Defaulting likes as it probably needs a separate count query or view
        isPinned: item.is_pinned,
        isLocked: item.is_locked,
        replyCount: item.reply_count,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        communityId: item.community_id,
        author: {
          id: item.author_id,
          name: item.profiles?.username || 'Unknown User',
          avatar: item.profiles?.avatar_url
        }
      }));
    } catch (error) {
      console.error('Error fetching community discussions:', error);
      return [];
    }
  }

  async getCommunityEvents(communityId: string, limit: number = 20): Promise<CommunityEvent[]> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_COMMUNITY_EVENTS.filter(e => e.communityId === communityId).slice(0, limit);
    }

    try {
      const { data, error } = await this.supabase
        .from('community_events')
        .select(`
          id,
          title,
          description,
          event_type,
          start_time,
          end_time,
          location,
          max_participants,
          current_participants,
          is_cancelled,
          created_at,
          organizer_id,
          community_id,
          communities(name),
          profiles:organizer_id (
            username,
            avatar_url
          )
        `)
        .eq('community_id', communityId)
        .gte('start_time', new Date().toISOString())
        .eq('is_cancelled', false)
        .order('start_time', { ascending: true })
        .limit(limit);

      if (error) throw error;

      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.event_type as CommunityEvent['type'],
        startTime: item.start_time,
        endTime: item.end_time,
        location: item.location,
        tags: [], // Default empty tags
        maxParticipants: item.max_participants,
        currentParticipants: item.current_participants,
        isCancelled: item.is_cancelled,
        communityId: item.community_id,
        communityName: item.communities?.name,
        organizer: {
          id: item.organizer_id,
          name: item.profiles?.username || 'Unknown User',
          avatar: item.profiles?.avatar_url
        }
      }));
    } catch (error) {
      console.error('Error fetching community events:', error);
      return [];
    }
  }

  async getCommunityMembers(communityId: string, limit: number = 50): Promise<CommunityMember[]> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_COMMUNITY_MEMBERS.filter(m => m.communityId === communityId).slice(0, limit);
    }

    try {
      const { data, error } = await this.supabase
        .from('community_members')
        .select(`
          user_id,
          role,
          joined_at,
          profiles:user_id (
            username,
            avatar_url,
            stats,
            bio,
            expertise,
            location
          )
        `)
        .eq('community_id', communityId)
        .order('joined_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map((item: any) => ({
        id: item.user_id,
        communityId: communityId,
        userId: item.user_id,
        name: item.profiles?.username || 'Unknown User',
        displayName: item.profiles?.username || 'Unknown User',
        username: item.profiles?.username || 'unknown',
        avatar: item.profiles?.avatar_url,
        role: item.role as CommunityMember['role'],
        joinedAt: item.joined_at,
        bio: item.profiles?.bio,
        location: item.profiles?.location,
        expertise: item.profiles?.expertise || [],
        stats: item.profiles?.stats || {
          xp: 0,
          level: 1,
          brierScore: 0,
          debatesWon: 0,
          viewsChanged: 0
        }
      }));
    } catch (error) {
      console.error('Error fetching community members:', error);
      return [];
    }
  }

  async getCommunityRules(): Promise<CommunityRule[]> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_COMMUNITY_RULES;
    }

    try {
      // Get rules from the first community (assuming single community for now)
      const { data, error } = await this.supabase
        .from('communities')
        .select('rules')
        .limit(1)
        .single();

      if (error) throw error;

      return data.rules || [];
    } catch (error) {
      console.error('Error fetching community rules:', error);
      return MOCK_COMMUNITY_RULES;
    }
  }

  async getCommunityStats(): Promise<CommunityStat[]> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_COMMUNITY_STATS;
    }

    try {
      // Calculate stats from actual data
      const [membersResult, discussionsResult, eventsResult, activityResult] = await Promise.all([
        this.supabase.from('community_members').select('user_id', { count: 'exact' }),
        this.supabase.from('community_discussions').select('id', { count: 'exact' }),
        this.supabase.from('community_events').select('id', { count: 'exact' }),
        this.supabase.from('community_activity_feed').select('id', { count: 'exact' })
      ]);

      const stats: CommunityStat[] = [
        {
          label: 'Total Members',
          value: membersResult.count || 0,
          change: 5.2,
          changeType: 'increase'
        },
        {
          label: 'Active Discussions',
          value: discussionsResult.count || 0,
          change: 12.5,
          changeType: 'increase'
        },
        {
          label: 'Upcoming Events',
          value: eventsResult.count || 0,
          change: -2.1,
          changeType: 'decrease'
        },
        {
          label: 'Activity This Week',
          value: activityResult.count || 0,
          change: 8.7,
          changeType: 'increase'
        }
      ];

      return stats;
    } catch (error) {
      console.error('Error fetching community stats:', error);
      return MOCK_COMMUNITY_STATS;
    }
  }

  async getCommunityIntegrations(): Promise<CommunityIntegration[]> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_COMMUNITY_INTEGRATIONS;
    }

    try {
      // Get integrations from the first community (assuming single community for now)
      const { data, error } = await this.supabase
        .from('communities')
        .select('integrations, linked_debates, community_gym_rooms')
        .limit(1)
        .single();

      if (error) throw error;

      const integrations = data.integrations || {};

      return [
        {
          type: 'debates',
          title: 'Hosted Debates',
          description: 'Debates organized within this community',
          count: integrations.debatesHosted || 0,
          items: (data.linked_debates as string[]) || []
        },
        {
          type: 'gym_rooms',
          title: 'Active Gym Rooms',
          description: 'Real-time discussion spaces',
          count: integrations.gymRoomsActive || 0,
          items: (data.community_gym_rooms as string[]) || []
        },
        {
          type: 'events',
          title: 'Cross-Community Events',
          description: 'Events bridging multiple communities',
          count: integrations.crossCommunityEvents || 0,
          items: []
        }
      ];
    } catch (error) {
      console.error('Error fetching community integrations:', error);
      return MOCK_COMMUNITY_INTEGRATIONS;
    }
  }
}

export const dataService = new DataService()
