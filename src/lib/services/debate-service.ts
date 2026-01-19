import { BaseService } from './base-service'
import { RecentDebate } from '../types'
import { MOCK_RECENT_DEBATES } from '../mock-data'

export class DebateService extends BaseService {
	async getRecentDebates(userId: string): Promise<RecentDebate[]> {
		if (this.useMock) return MOCK_RECENT_DEBATES

		try {
			const { data, error } = await this.supabase
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
}
