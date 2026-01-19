import { BaseService } from './base-service'
import {
	Community, CommunityChatMessage, CommunityActivity, DiscussionThread,
	DiscussionComment, CommunityMember, CommunityActivityFeedItem,
	CommunityDiscussion, CommunityEvent, CommunityRule, CommunityStat,
	CommunityIntegration
} from '../types'
import { withTimeout } from '../utils'
import { COMMUNITY_CONSTANTS } from '../constants/communities'
import {
	MOCK_COMMUNITIES, MOCK_COMMUNITY_ACTIVITIES, MOCK_DISCUSSION_THREADS,
	MOCK_DISCUSSION_COMMENTS, MOCK_COMMUNITY_EVENTS, MOCK_COMMUNITY_MEMBERS,
	MOCK_COMMUNITY_ACTIVITY_FEED, MOCK_COMMUNITY_DISCUSSIONS, MOCK_COMMUNITY_RULES,
	MOCK_COMMUNITY_STATS, MOCK_COMMUNITY_INTEGRATIONS
} from '../mock-data'

export class CommunityService extends BaseService {

	async createCommunity(communityData: {
		name: string
		description: string
		type: 'Public' | 'Private'
		category: string
		tags: string[]
		rules?: string
	}, creatorId: string): Promise<Community | null> {
		try {
			// Create the community
			const { data: newCommunityData, error: communityError } = await withTimeout(
				this.supabase
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
					.single(),
				COMMUNITY_CONSTANTS.API_TIMEOUT
			)

			if (communityError) throw communityError

			// Add creator as community member with founder role
			const { error: memberError } = await withTimeout(
				this.supabase
					.from('community_members')
					.insert({
						community_id: newCommunityData.id,
						user_id: creatorId,
						role: 'admin' // Using 'admin' as the highest role available in our schema
					}),
				COMMUNITY_CONSTANTS.API_TIMEOUT
			)

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
			throw error
		}
	}

	async updateCommunity(communityId: string, updates: Partial<Community>, userId: string): Promise<Community | null> {
		try {
			// Map frontend fields to DB columns
			const dbUpdates: any = {}
			if (updates.name) dbUpdates.name = updates.name
			if (updates.desc) dbUpdates.description = updates.desc
			if (updates.type) dbUpdates.type = updates.type.toLowerCase()
			if (updates.category) dbUpdates.category = updates.category
			if (updates.tags) dbUpdates.tags = updates.tags
			if (updates.rules) dbUpdates.rules = typeof updates.rules === 'string'
				? [{ title: 'Community Rules', description: updates.rules, priority: 'high' }]
				: updates.rules
			if (updates.coverImage) dbUpdates.cover_image_url = updates.coverImage
			if (updates.avatar) dbUpdates.avatar_url = updates.avatar

			const { data, error } = await withTimeout(
				this.supabase
					.from('communities')
					.update(dbUpdates)
					.eq('id', communityId)
					.select()
					.single(),
				COMMUNITY_CONSTANTS.API_TIMEOUT
			)

			if (error) throw error

			return this.transformCommunityData(data)
		} catch (error) {
			console.error("Error updating community:", error)
			throw error
		}
	}

	async uploadCommunityImage(communityId: string, file: File, type: 'cover' | 'avatar'): Promise<string | null> {
		try {
			const fileExt = file.name.split('.').pop()
			const fileName = `${communityId}/${type}-${Date.now()}.${fileExt}`
			const { error: uploadError } = await withTimeout(
				this.supabase.storage
					.from('community-assets')
					.upload(fileName, file),
				COMMUNITY_CONSTANTS.API_TIMEOUT
			)

			if (uploadError) throw uploadError

			const { data } = this.supabase.storage
				.from('community-assets')
				.getPublicUrl(fileName)

			return data.publicUrl
		} catch (error) {
			console.error("Error uploading image:", error)
			return null
		}
	}

	async deleteCommunity(communityId: string, userId: string): Promise<boolean> {
		try {
			const { error } = await withTimeout(
				this.supabase
					.from('communities')
					.delete()
					.eq('id', communityId),
				COMMUNITY_CONSTANTS.API_TIMEOUT
			)

			if (error) throw error
			return true
		} catch (error) {
			console.error("Error deleting community:", error)
			throw error
		}
	}

	private transformCommunityData(data: any): Community {
		return {
			id: data.id,
			name: data.name,
			members: data.member_count?.toString() || '0',
			type: data.type === 'public' ? 'Public' : 'Private',
			desc: data.description || '',
			category: data.category || 'General',
			tags: data.tags || [],
			createdDate: data.created_at,
			activityLevel: (data.activity_level as 'High' | 'Medium' | 'Low') || 'Low',
			rules: data.rules,
			upcomingEvents: 0,
			discussionCount: 0,
			linkedDebates: data.linked_debates || [],
			integrations: data.integrations || {
				debatesHosted: 0,
				gymRoomsActive: 0,
				crossCommunityEvents: 0
			},
			coverImage: data.cover_image_url,
			avatar: data.avatar_url
		}
	}

	async getCommunityChatMessages(communityId: string): Promise<CommunityChatMessage[]> {
		try {
			const { data, error } = await withTimeout(
				this.supabase
					.from('community_chat_messages')
					.select(`
              *,
              user:user_id (
                  username,
                  avatar_url
              )
          `)
					.eq('community_id', communityId)
					.order('created_at', { ascending: true })
					.limit(COMMUNITY_CONSTANTS.CHAT_MESSAGES_LIMIT),
				COMMUNITY_CONSTANTS.API_TIMEOUT
			)

			if (error) throw error

			return data.map((msg: any) => ({
				id: msg.id,
				communityId: msg.community_id,
				userId: msg.user_id,
				content: msg.content,
				createdAt: msg.created_at,
				user: msg.user ? {
					username: msg.user.username,
					avatarUrl: msg.user.avatar_url
				} : undefined
			}))
		} catch (error) {
			console.error("Error fetching chat messages:", error)
			throw error
		}
	}

	async sendCommunityChatMessage(communityId: string, userId: string, content: string): Promise<CommunityChatMessage | null> {
		try {
			const { data, error } = await withTimeout(
				this.supabase
					.from('community_chat_messages')
					.insert({
						community_id: communityId,
						user_id: userId,
						content: content
					})
					.select()
					.single(),
				COMMUNITY_CONSTANTS.API_TIMEOUT
			)

			if (error) throw error
			return {
				id: data.id,
				communityId: data.community_id,
				userId: data.user_id,
				content: data.content,
				createdAt: data.created_at
			}
		} catch (error) {
			console.error("Error sending chat message:", error)
			throw error
		}
	}

	async getCommunities(
		limit: number = COMMUNITY_CONSTANTS.COMMUNITIES_LIST_LIMIT,
		offset: number = 0,
		sortBy: 'name' | 'created_at' | 'member_count' | 'activity_level' = 'created_at',
		sortOrder: 'asc' | 'desc' = 'desc'
	): Promise<Community[]> {
		try {
			const { data, error } = await withTimeout(
				this.supabase
					.from('communities')
					.select('*')
					.order(sortBy, { ascending: sortOrder === 'asc' })
					.range(offset, offset + limit - 1)
					.limit(limit),
				COMMUNITY_CONSTANTS.API_TIMEOUT
			)

			if (error) throw error

			return data.map((c: any) => this.transformCommunityData(c)) as Community[]
		} catch (error) {
			console.error("Error fetching communities:", error)
			throw error // Explicitly throw to let UI handle error state
		}
	}

	async searchCommunities(
		searchQuery: string = '',
		filters: {
			category?: string
			type?: 'Public' | 'Private'
			memberCountRange?: { min?: number; max?: number }
			activityLevel?: 'Low' | 'Medium' | 'High'
		} = {},
		sortBy: 'name' | 'created_at' | 'member_count' | 'activity_level' = 'created_at',
		sortOrder: 'asc' | 'desc' = 'desc',
		limit: number = COMMUNITY_CONSTANTS.COMMUNITIES_LIST_LIMIT,
		offset: number = 0
	): Promise<Community[]> {
		try {
			let query = this.supabase
				.from('communities')
				.select('*')

			// Apply search query (search in name, description, tags)
			if (searchQuery.trim()) {
				const searchTerm = `%${searchQuery.trim()}%`
				query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
				// Note: For tags search, we'd need a more complex query or a separate tags table
			}

			// Apply filters
			if (filters.category && filters.category !== 'All') {
				query = query.eq('category', filters.category)
			}

			if (filters.type) {
				query = query.eq('type', filters.type.toLowerCase())
			}

			if (filters.activityLevel) {
				query = query.eq('activity_level', filters.activityLevel)
			}

			// Member count range filter (if we had this data)
			// if (filters.memberCountRange) {
			//   if (filters.memberCountRange.min !== undefined) {
			//     query = query.gte('member_count', filters.memberCountRange.min)
			//   }
			//   if (filters.memberCountRange.max !== undefined) {
			//     query = query.lte('member_count', filters.memberCountRange.max)
			//   }
			// }

			const { data, error } = await withTimeout(
				query
					.order(sortBy, { ascending: sortOrder === 'asc' })
					.range(offset, offset + limit - 1)
					.limit(limit),
				COMMUNITY_CONSTANTS.API_TIMEOUT
			)

			if (error) throw error

			return data.map((c: any) => this.transformCommunityData(c)) as Community[]
		} catch (error) {
			console.error("Error searching communities:", error)
			throw error
		}
	}

	async getCommunityById(id: string): Promise<Community | null> {
		try {
			const { data, error } = await withTimeout(
				this.supabase
					.from('communities')
					.select('*')
					.eq('id', id)
					.single(),
				COMMUNITY_CONSTANTS.API_TIMEOUT
			)

			if (error) throw error

			return this.transformCommunityData(data)
		} catch (error) {
			console.error(`Error fetching community ${id}:`, error)
			throw error
		}
	}

	async joinCommunity(communityId: string, userId: string) {
		if (this.useMock) {
			console.log(`[Mock] User ${userId} joined community ${communityId}`)
			return { success: true }
		}

		try {
			const { error } = await withTimeout(
				this.supabase
					.from('community_members')
					.insert({
						community_id: communityId,
						user_id: userId,
						role: 'member'
					}),
				COMMUNITY_CONSTANTS.API_TIMEOUT
			)

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
			throw error
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
			throw error
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
			throw error
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
			const { error } = await withTimeout(
				this.supabase
					.from('community_members')
					.delete()
					.eq('community_id', communityId)
					.eq('user_id', userId),
				COMMUNITY_CONSTANTS.API_TIMEOUT
			)

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
			const { data, error } = await withTimeout(
				this.supabase
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
					.single(),
				COMMUNITY_CONSTANTS.API_TIMEOUT
			)

			if (error) return null

			const profile = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles

			return {
				id: data.user_id,
				communityId: communityId,
				userId: data.user_id,
				displayName: profile?.username || 'Unknown User',
				username: profile?.username || 'unknown',
				avatar: profile?.avatar_url,
				role: data.role as CommunityMember['role'],
				joinedAt: data.joined_at,
				bio: profile?.bio,
				location: profile?.location,
				expertise: profile?.expertise || [],
				stats: profile?.stats || {
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

	async getCommunityActivityFeed(communityId: string, limit: number = COMMUNITY_CONSTANTS.ACTIVITY_FEED_LIMIT): Promise<CommunityActivityFeedItem[]> {
		if (this.useMock) {
			await new Promise(resolve => setTimeout(resolve, 300));
			return MOCK_COMMUNITY_ACTIVITY_FEED.filter(a => a.communityId === communityId).slice(0, limit);
		}

		try {
			const { data, error } = await withTimeout(
				this.supabase
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
					.limit(limit),
				COMMUNITY_CONSTANTS.API_TIMEOUT
			);

			if (error) throw error;

			return data.map((item: any) => {
				const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
				return {
					id: item.id,
					type: item.activity_type as CommunityActivityFeedItem['type'],
					description: item.description,
					timestamp: item.created_at,
					communityName: item.communities?.name,
					// Using description as title if not available, or "Activity"
					title: item.description ? (item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description) : 'New Activity',
					user: {
						id: item.user_id,
						name: profile?.username || 'Unknown User',
						avatar: profile?.avatar_url
					},
					// Likes/Comments could be fetched with joined tables if needed, defaulting for now
					likes: 0,
					comments: 0
				}
			});
		} catch (error) {
			console.error('Error fetching community activity feed:', error);
			throw error;
		}
	}

	async getCommunityDiscussions(communityId: string, limit: number = COMMUNITY_CONSTANTS.DISCUSSIONS_LIMIT): Promise<CommunityDiscussion[]> {
		if (this.useMock) {
			await new Promise(resolve => setTimeout(resolve, 300));
			return MOCK_COMMUNITY_DISCUSSIONS.filter(d => d.communityId === communityId).slice(0, limit);
		}

		try {
			const { data, error } = await withTimeout(
				this.supabase
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
					.limit(limit),
				COMMUNITY_CONSTANTS.API_TIMEOUT
			);

			if (error) throw error;

			return data.map((item: any) => {
				const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
				return {
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
						name: profile?.username || 'Unknown User',
						avatar: profile?.avatar_url
					}
				}
			});
		} catch (error) {
			console.error('Error fetching community discussions:', error);
			throw error;
		}
	}

	async getCommunityEvents(communityId: string, limit: number = COMMUNITY_CONSTANTS.EVENTS_LIMIT): Promise<CommunityEvent[]> {
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

			return data.map((item: any) => {
				const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
				return {
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
						name: profile?.username || 'Unknown User',
						avatar: profile?.avatar_url
					}
				}
			});
		} catch (error) {
			console.error('Error fetching community events:', error);
			throw error;
		}
	}

	async getCommunityMembers(communityId: string, limit: number = COMMUNITY_CONSTANTS.MEMBERS_LIMIT): Promise<CommunityMember[]> {
		if (this.useMock) {
			await new Promise(resolve => setTimeout(resolve, 300));
			return MOCK_COMMUNITY_MEMBERS.filter(m => m.communityId === communityId).slice(0, limit);
		}

		try {
			const { data, error } = await withTimeout(
				this.supabase
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
					.limit(limit),
				COMMUNITY_CONSTANTS.API_TIMEOUT
			);

			if (error) throw error;

			return data.map((item: any) => {
				const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
				return {
					id: item.user_id,
					communityId: communityId,
					userId: item.user_id,
					name: profile?.username || 'Unknown User',
					displayName: profile?.username || 'Unknown User',
					username: profile?.username || 'unknown',
					avatar: profile?.avatar_url,
					role: item.role as CommunityMember['role'],
					joinedAt: item.joined_at,
					bio: profile?.bio,
					location: profile?.location,
					expertise: profile?.expertise || [],
					stats: profile?.stats || {
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
			});
		} catch (error) {
			console.error('Error fetching community members:', error);
			throw error;
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
