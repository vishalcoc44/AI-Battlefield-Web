import { BaseService } from './base-service'
import { Market, UserPrediction } from '../types'
import { MOCK_MARKETS, MOCK_USER_PREDICTIONS } from '../mock-data'

export class MarketService extends BaseService {
	async getMarkets(): Promise<Market[]> {
		if (this.useMock) {
			return new Promise((resolve) => setTimeout(() => resolve(MOCK_MARKETS), 500))
		}

		try {
			const { data, error } = await this.supabase
				.from('prediction_markets')
				.select('*')

			if (error) throw error

			return data.map((m: any) => ({
				id: m.id,
				question: m.question,
				category: m.category || "General",
				deadline: new Date(m.deadline).toLocaleDateString(),
				volume: m.volume,
				consensus: 50 // This might need a real calculation or separate query if not in DB
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

		const { error } = await this.supabase
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
}
