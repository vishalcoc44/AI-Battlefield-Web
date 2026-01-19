import { BaseService } from './base-service'
import { GymRoom, GymDrill, DrillAttempt, AIPersona, SparringSession, Wager } from '../types'
import { MOCK_GYM_ROOMS } from '../mock-data'

export class GymService extends BaseService {
	// --- ROOMS ---
	async getActiveGymRooms(): Promise<GymRoom[]> {
		if (this.useMock) {
			return MOCK_GYM_ROOMS.map(r => ({
				...r,
				status: 'active',
				endsAt: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
				votePro: 50,
				voteCon: 50
			})) as GymRoom[]
		}

		try {
			const { data, error } = await this.supabase
				.from('gym_rooms')
				.select('*')
				.eq('is_live', true)
				.order('active_participants', { ascending: false })

			if (error) throw error

			return data.map((r: any) => ({
				id: r.id,
				topic: r.topic,
				activeParticipants: r.active_participants || 0,
				category: r.category || (r.description ? r.description.split('|')[0] : "General"), // Fallback to old hack if needed
				isFeatured: r.active_participants > 50,
				// New Fields
				status: r.status || 'active',
				endsAt: r.ends_at,
				votePro: r.vote_pro || 0,
				voteCon: r.vote_con || 0,
				winnerSide: r.winner_side,
				createdBy: r.created_by
			})) as GymRoom[]
		} catch (error) {
			console.error("Error fetching gym rooms:", error)
			return []
		}
	}

	async createGymRoom(topic: string, category: string): Promise<GymRoom | null> {
		if (this.useMock) {
			const newRoom = {
				id: Date.now().toString(),
				topic,
				activeParticipants: 1,
				category,
				status: 'active',
				endsAt: new Date(Date.now() + 1000 * 600).toISOString(), // 10 mins
				votePro: 0,
				voteCon: 0
			} as GymRoom
			// MOCK_GYM_ROOMS.push(newRoom) // Mock array might not match type anymore, skipping push
			return newRoom
		}

		try {
			const { data: { user } } = await this.supabase.auth.getUser()
			if (!user) throw new Error("Not authenticated")

			const endsAt = new Date(Date.now() + 1000 * 60 * 30).toISOString() // 30 min debate
			const { data, error } = await this.supabase
				.from('gym_rooms')
				.insert({
					topic,
					category, // Now a real column
					description: `${category}|Created by user`, // Keeping for backward compat
					active_participants: 1,
					is_live: true,
					status: 'active',
					ends_at: endsAt,
					vote_pro: 0,
					vote_con: 0,
					created_by: user.id
				})
				.select()
				.single()

			if (error) throw error

			return {
				id: data.id,
				topic: data.topic,
				activeParticipants: data.active_participants,
				category: data.category,
				status: data.status,
				endsAt: data.ends_at,
				votePro: data.vote_pro,
				voteCon: data.vote_con,
				winnerSide: data.winner_side, // Map this
				createdBy: data.created_by // Map this
			}
		} catch (error) {
			console.error("Error creating gym room:", error)
			return null
		}
	}

	async updateGymRoom(roomId: string, updates: Partial<GymRoom>): Promise<GymRoom | null> {
		try {
			// Build update object with only provided fields
			const updateData: any = {}
			if (updates.topic !== undefined) updateData.topic = updates.topic
			if (updates.category !== undefined) updateData.category = updates.category
			if (updates.status !== undefined) {
				updateData.status = updates.status
				updateData.is_live = updates.status === 'active' // Sync live status
			}

			const { data, error } = await this.supabase
				.from('gym_rooms')
				.update(updateData)
				.eq('id', roomId)
				.select()

			if (error) throw error

			// Check if update was successful
			if (!data || data.length === 0) {
				console.error("Update returned 0 rows. This might be an RLS policy issue.")
				throw new Error("No permission to update this room or room not found")
			}

			const updated = data[0]

			return {
				id: updated.id,
				topic: updated.topic,
				activeParticipants: updated.active_participants,
				category: updated.category,
				status: updated.status,
				endsAt: updated.ends_at,
				votePro: updated.vote_pro,
				voteCon: updated.vote_con,
				winnerSide: updated.winner_side,
				createdBy: updated.created_by
			}
		} catch (error) {
			console.error("Error updating gym room:", error)
			return null
		}
	}

	async deleteGymRoom(roomId: string): Promise<boolean> {
		try {
			const { error } = await this.supabase
				.from('gym_rooms')
				.delete()
				.eq('id', roomId)

			if (error) throw error
			return true
		} catch (error) {
			console.error("Error deleting gym room:", error)
			return false
		}
	}

	async castVote(roomId: string, side: 'PRO' | 'CON'): Promise<boolean> {
		try {
			const { data: { user } } = await this.supabase.auth.getUser()
			if (!user) return false

			const { error } = await this.supabase
				.from('gym_room_votes')
				.upsert({
					room_id: roomId,
					user_id: user.id,
					side
				})

			if (error) throw error
			return true
		} catch (error) {
			console.error("Error casting vote:", error)
			return false
		}
	}

	// --- DRILLS ---
	async getDrills(type: 'fallacy' | 'rebuttal'): Promise<GymDrill[]> {
		try {
			const { data, error } = await this.supabase
				.from('gym_drills')
				.select('*')
				.eq('type', type)

			if (error) throw error
			if (!data || data.length === 0) return [] // or return mocks if needed

			return data.map((d: any) => ({
				id: d.id,
				type: d.type,
				title: d.title,
				difficulty: d.difficulty,
				content: d.content,
				xpReward: d.xp_reward
			}))
		} catch (error) {
			console.error(`Error fetching ${type} drills:`, error)
			return []
		}
	}

	async submitDrillAttempt(drillId: string, score: number, feedback?: any): Promise<DrillAttempt | null> {
		try {
			const { data: { user } } = await this.supabase.auth.getUser()
			if (!user) throw new Error("User not authenticated")

			// 1. Record Attempt
			const { data, error } = await this.supabase
				.from('user_drill_attempts')
				.insert({
					user_id: user.id,
					drill_id: drillId,
					score,
					feedback
				})
				.select()
				.single()

			if (error) throw error

			// 2. Award XP/Reward via RPC or Client update
			// For now, client update approach or trigger (better done via DB trigger, but ensuring safety here)
			const { error: profileError } = await this.supabase.rpc('increment_xp', { amount: score * 2, user_uuid: user.id })
			// Note: ensure 'increment_xp' function exists, or update profile directly:
			// await this.supabase.from('profiles').update({ xp: user.xp + score }).eq('id', user.id)
			// Using direct update for safety if RPC missing:
			if (profileError) {
				// Fallback manual update
				// This requires fetching current XP first which is race-condition prone, DB trigger is preferred.
				console.warn("Could not increment XP via RPC", profileError)
			}

			return {
				id: data.id,
				userId: data.user_id,
				drillId: data.drill_id,
				score: data.score,
				feedback: data.feedback,
				createdAt: data.created_at
			}
		} catch (error) {
			console.error("Error submitting drill attempt:", error)
			return null
		}
	}

	// --- AI SPARRING ---
	async getAIPersonas(): Promise<AIPersona[]> {
		try {
			const { data, error } = await this.supabase
				.from('ai_personas')
				.select('id, name, avatar_url, difficulty_level') // Exclude system_prompt for security

			if (error) throw error
			return data.map((p: any) => ({
				id: p.id,
				name: p.name,
				avatarUrl: p.avatar_url,
				systemPrompt: "", // Hidden
				difficultyLevel: p.difficulty_level
			}))
		} catch (error) {
			console.error("Error fetching personas:", error)
			return []
		}
	}

	async startSparringSession(personaId: string, topic: string): Promise<SparringSession | null> {
		try {
			const { data: { user } } = await this.supabase.auth.getUser()
			if (!user) throw new Error("Not authenticated")

			const { data, error } = await this.supabase
				.from('gym_sparring_sessions')
				.insert({
					user_id: user.id,
					persona_id: personaId,
					topic,
					status: 'active',
					transcript: []
				})
				.select()
				.single()

			if (error) throw error

			return {
				id: data.id,
				userId: data.user_id,
				personaId: data.persona_id,
				topic: data.topic,
				status: data.status,
				transcript: data.transcript,
				createdAt: data.created_at,
				updatedAt: data.updated_at
			}
		} catch (error) {
			console.error("Error starting sparring session:", error)
			return null
		}
	}

	async updateSparringTranscript(sessionId: string, newMessages: any[]): Promise<void> {
		try {
			await this.supabase
				.from('gym_sparring_sessions')
				.update({
					transcript: newMessages,
					updated_at: new Date().toISOString()
				})
				.eq('id', sessionId)
		} catch (error) {
			console.error("Error updating sparring transcript:", error)
		}
	}

	// --- WAGERS ---
	async placeWager(debateId: string, amount: number, side: 'PRO' | 'CON'): Promise<Wager | null> {
		try {
			const { data: { user } } = await this.supabase.auth.getUser()
			if (!user) throw new Error("Not authenticated")

			// Check balance would go here normally (e.g. intel-service check)

			const { data, error } = await this.supabase
				.from('wagers')
				.insert({
					user_id: user.id,
					debate_id: debateId,
					amount,
					prediction_side: side,
					status: 'pending'
				})
				.select()
				.single()

			if (error) throw error

			return {
				id: data.id,
				userId: data.user_id,
				debateId: data.debate_id,
				amount: data.amount,
				predictionSide: data.prediction_side,
				status: data.status,
				createdAt: data.created_at
			}
		} catch (error) {
			console.error("Error placing wager:", error)
			return null
		}
	}
}
