import { BaseService } from './base-service'
import { UserStats, UserPrediction } from '../types'
import { MOCK_USER_STATS, MOCK_USER_PREDICTIONS } from '../mock-data'

export class UserService extends BaseService {
	async getUserStats(userId: string): Promise<UserStats> {
		if (this.useMock) return MOCK_USER_STATS

		try {
			const { data, error } = await this.supabase
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

	async getUserPredictions(userId: string): Promise<UserPrediction[]> {
		if (this.useMock) return MOCK_USER_PREDICTIONS

		try {
			const { data, error } = await this.supabase
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

	async getUserProfile(userId: string): Promise<import('../types').UserProfile | null> {
		if (this.useMock) {
			// Mock profile
			return {
				id: 'mock-user-1',
				username: 'Cyber Philosopher',
				fullName: 'Alex Chen',
				bio: "I know that I know nothing, but I'm getting better at guessing.",
				avatarUrl: '/avatars/01.png',
				stats: {
					...MOCK_USER_STATS,
					brierScore: MOCK_USER_STATS.brierScore || 0
				},
				rankTitle: 'Lvl 12 Strategist',
				currentStreak: 5
			}
		}

		try {
			const { data, error } = await this.supabase
				.from('profiles')
				.select('*')
				.eq('id', userId)
				.single()

			if (error) throw error
			if (!data) return null

			return {
				id: data.id,
				username: data.username || 'Anonymous',
				fullName: data.full_name,
				avatarUrl: data.avatar_url,
				bio: data.bio,
				stats: {
					xp: data.stats?.xp || 0,
					level: data.stats?.level || 1,
					brierScore: data.stats?.brier_score || 0,
					debatesWon: data.stats?.debates_won || 0,
					viewsChanged: data.stats?.views_changed || 0
				},
				rankTitle: data.rank_title,
				currentStreak: data.current_streak
			}
		} catch (error) {
			console.error("Error fetching user profile:", error)
			return null
		}
	}

	async updateUserProfile(userId: string, updates: Partial<import('../types').UserProfile>): Promise<boolean> {
		if (this.useMock) return true

		try {
			// Convert camelCase to snake_case for DB
			const dbUpdates: any = {}
			if (updates.username) dbUpdates.username = updates.username
			if (updates.fullName) dbUpdates.full_name = updates.fullName
			if (updates.bio) dbUpdates.bio = updates.bio
			if (updates.avatarUrl) dbUpdates.avatar_url = updates.avatarUrl

			if (Object.keys(dbUpdates).length === 0) return true

			const { error } = await this.supabase
				.from('profiles')
				.update(dbUpdates)
				.eq('id', userId)

			if (error) throw error
			return true
		} catch (error) {
			console.error("Error updating user profile:", error)
			return false
		}
	}
}
