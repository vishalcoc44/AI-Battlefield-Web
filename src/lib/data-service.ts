import { supabase } from './supabase'
import {
  Market, UserStats, RecentDebate, UserPrediction, GymRoom, Community,
  CommunityChatMessage, CommunityActivity, DiscussionThread, DiscussionComment,
  CommunityMember, CommunityActivityFeedItem, CommunityDiscussion, CommunityEvent,
  CommunityRule, CommunityStat, CommunityIntegration, IntelDossier, IntelSubmission,
  IntelRecord, IntelAnnotation
} from './types'
import { MarketService } from './services/market-service'
import { UserService } from './services/user-service'
import { DebateService } from './services/debate-service'
import { GymService } from './services/gym-service'
import { CommunityService } from './services/community-service'
import { IntelService } from './services/intel-service'

// Re-export types for backward compatibility
export * from './types'

class DataService {
  private marketService: MarketService
  private userService: UserService
  private debateService: DebateService
  private gymService: GymService
  private communityService: CommunityService
  private intelService: IntelService

  constructor() {
    this.marketService = new MarketService()
    this.userService = new UserService()
    this.debateService = new DebateService()
    this.gymService = new GymService()
    this.communityService = new CommunityService()
    this.intelService = new IntelService()
  }

  // Market Service Methods
  async getMarkets(): Promise<Market[]> {
    return this.marketService.getMarkets()
  }

  async submitPrediction(marketId: string, probability: number, userId: string): Promise<{ success: boolean }> {
    return this.marketService.submitPrediction(marketId, probability, userId)
  }

  // User Service Methods
  async getUserStats(userId: string): Promise<UserStats> {
    return this.userService.getUserStats(userId)
  }

  async getUserPredictions(userId: string): Promise<UserPrediction[]> {
    return this.userService.getUserPredictions(userId)
  }

  async getUserProfile(userId: string): Promise<import('./types').UserProfile | null> {
    return this.userService.getUserProfile(userId)
  }

  async updateUserProfile(userId: string, updates: Partial<import('./types').UserProfile>): Promise<boolean> {
    return this.userService.updateUserProfile(userId, updates)
  }

  // Debate Service Methods
  async getRecentDebates(userId: string): Promise<RecentDebate[]> {
    return this.debateService.getRecentDebates(userId)
  }

  // Gym Service Methods
  async getActiveGymRooms(): Promise<GymRoom[]> {
    return this.gymService.getActiveGymRooms()
  }

  async createGymRoom(topic: string, category: string): Promise<GymRoom | null> {
    return this.gymService.createGymRoom(topic, category)
  }

  async updateGymRoom(roomId: string, updates: Partial<GymRoom>): Promise<GymRoom | null> {
    return this.gymService.updateGymRoom(roomId, updates)
  }

  async deleteGymRoom(roomId: string): Promise<boolean> {
    return this.gymService.deleteGymRoom(roomId)
  }

  // Gym Drills & Dojo
  async getDrills(type: 'fallacy' | 'rebuttal'): Promise<import('./types').GymDrill[]> {
    return this.gymService.getDrills(type)
  }

  async submitDrillAttempt(drillId: string, score: number, feedback?: any): Promise<import('./types').DrillAttempt | null> {
    return this.gymService.submitDrillAttempt(drillId, score, feedback)
  }

  async castVote(roomId: string, side: 'PRO' | 'CON'): Promise<boolean> {
    return this.gymService.castVote(roomId, side)
  }

  // AI Sparring
  async getAIPersonas(): Promise<import('./types').AIPersona[]> {
    return this.gymService.getAIPersonas()
  }

  async startSparringSession(personaId: string, topic: string): Promise<import('./types').SparringSession | null> {
    return this.gymService.startSparringSession(personaId, topic)
  }

  async updateSparringTranscript(sessionId: string, messages: any[]): Promise<void> {
    return this.gymService.updateSparringTranscript(sessionId, messages)
  }

  // Wagers
  async placeWager(debateId: string, amount: number, side: 'PRO' | 'CON'): Promise<import('./types').Wager | null> {
    return this.gymService.placeWager(debateId, amount, side)
  }

  // Community Service Methods
  async createCommunity(communityData: {
    name: string
    description: string
    type: 'Public' | 'Private'
    category: string
    tags: string[]
    rules?: string
  }, creatorId: string): Promise<Community | null> {
    return this.communityService.createCommunity(communityData, creatorId)
  }

  async updateCommunity(communityId: string, updates: Partial<Community>, userId: string): Promise<Community | null> {
    return this.communityService.updateCommunity(communityId, updates, userId)
  }

  async uploadCommunityImage(communityId: string, file: File, type: 'cover' | 'avatar'): Promise<string | null> {
    return this.communityService.uploadCommunityImage(communityId, file, type)
  }

  async deleteCommunity(communityId: string, userId: string): Promise<boolean> {
    return this.communityService.deleteCommunity(communityId, userId)
  }

  async getCommunityChatMessages(communityId: string): Promise<CommunityChatMessage[]> {
    return this.communityService.getCommunityChatMessages(communityId)
  }

  async sendCommunityChatMessage(communityId: string, userId: string, content: string): Promise<CommunityChatMessage | null> {
    return this.communityService.sendCommunityChatMessage(communityId, userId, content)
  }

  async getCommunities(): Promise<Community[]> {
    return this.communityService.getCommunities()
  }

  async getCommunityById(id: string): Promise<Community | null> {
    return this.communityService.getCommunityById(id)
  }

  async joinCommunity(communityId: string, userId: string): Promise<{ success: boolean }> {
    return this.communityService.joinCommunity(communityId, userId)
  }

  async getCommunityActivities(limit: number = 10): Promise<CommunityActivity[]> {
    return this.communityService.getCommunityActivities(limit)
  }

  async getDiscussionThreads(communityId?: string, limit: number = 10): Promise<DiscussionThread[]> {
    return this.communityService.getDiscussionThreads(communityId, limit)
  }

  async getDiscussionComments(threadId: string): Promise<DiscussionComment[]> {
    return this.communityService.getDiscussionComments(threadId)
  }

  async createDiscussionThread(communityId: string, title: string, content: string, tags: string[], userId: string): Promise<DiscussionThread | null> {
    return this.communityService.createDiscussionThread(communityId, title, content, tags, userId)
  }

  async rsvpToEvent(eventId: string, userId: string): Promise<boolean> {
    return this.communityService.rsvpToEvent(eventId, userId)
  }

  async leaveCommunity(communityId: string, userId: string): Promise<{ success: boolean; error?: any }> {
    return this.communityService.leaveCommunity(communityId, userId)
  }

  async getCommunityMemberProfile(userId: string, communityId: string): Promise<CommunityMember | null> {
    return this.communityService.getCommunityMemberProfile(userId, communityId)
  }

  async getCommunityCategories(): Promise<string[]> {
    return this.communityService.getCommunityCategories()
  }

  async getCommunityActivityFeed(communityId: string, limit: number = 20): Promise<CommunityActivityFeedItem[]> {
    return this.communityService.getCommunityActivityFeed(communityId, limit)
  }

  async getCommunityDiscussions(communityId: string, limit: number = 20): Promise<CommunityDiscussion[]> {
    return this.communityService.getCommunityDiscussions(communityId, limit)
  }

  async getCommunityEvents(communityId: string, limit: number = 20): Promise<CommunityEvent[]> {
    return this.communityService.getCommunityEvents(communityId, limit)
  }

  async getCommunityMembers(communityId: string, limit: number = 50): Promise<CommunityMember[]> {
    return this.communityService.getCommunityMembers(communityId, limit)
  }

  async getCommunityRules(): Promise<CommunityRule[]> {
    return this.communityService.getCommunityRules()
  }

  async getCommunityStats(): Promise<CommunityStat[]> {
    return this.communityService.getCommunityStats()
  }

  async getCommunityIntegrations(): Promise<CommunityIntegration[]> {
    return this.communityService.getCommunityIntegrations()
  }

  // Intel Service Methods
  async createIntelSubmission(submission: { title: string, description: string, contentUrl?: string }): Promise<boolean> {
    return this.intelService.createIntelSubmission(submission)
  }

  async uploadIntelFile(file: File): Promise<string | null> {
    return this.intelService.uploadFile(file)
  }

  async getIntelAnnotations(dossierId: string, page: number = 1, limit: number = 20): Promise<{ data: IntelAnnotation[], count: number }> {
    return this.intelService.getIntelAnnotations(dossierId, page, limit)
  }

  async createIntelAnnotation(annotation: { dossierId: string, selectedText: string, comment: string, color?: string }): Promise<IntelAnnotation | null> {
    return this.intelService.createIntelAnnotation(annotation)
  }

  async getIntelDossiers(options?: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: { status?: string, category?: string }
  }): Promise<{ data: IntelDossier[], count: number }> {
    return this.intelService.getIntelDossiers(options)
  }

  async getIntelDossierById(id: string): Promise<IntelDossier | null> {
    return this.intelService.getIntelDossierById(id)
  }

  async getIntelRecords(dossierId: string): Promise<IntelRecord[]> {
    return this.intelService.getIntelRecords(dossierId)
  }

  getUserIntelSubmissions(): Promise<IntelSubmission[]> {
    return this.intelService.getUserIntelSubmissions()
  }
}

export const dataService = new DataService()
