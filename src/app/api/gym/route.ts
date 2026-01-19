import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateTopic, validateCategory } from '@/lib/utils'
import { GYM_CONSTANTS } from '@/lib/constants/gym'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST /api/gym - Create a new gym room
export async function POST(request: NextRequest) {
	try {
		const { data: { user }, error: authError } = await supabase.auth.getUser()

		if (authError || !user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const body = await request.json()
		const { topic, category } = body

		// Validate inputs (server-side validation)
		const topicValidation = validateTopic(topic)
		if (!topicValidation.isValid) {
			return NextResponse.json(
				{ error: topicValidation.error },
				{ status: 400 }
			)
		}

		const categoryValidation = validateCategory(category)
		if (!categoryValidation.isValid) {
			return NextResponse.json(
				{ error: categoryValidation.error },
				{ status: 400 }
			)
		}

		// Create the room
		const endsAt = new Date(Date.now() + GYM_CONSTANTS.TIMER.INITIAL_DURATION_SECONDS * 1000).toISOString()

		const { data, error } = await supabase
			.from('gym_rooms')
			.insert({
				topic: topicValidation.sanitized,
				category,
				description: `${category}|Created by user`,
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

		if (error) {
			console.error('Create room error:', error)
			return NextResponse.json(
				{ error: 'Failed to create room' },
				{ status: 500 }
			)
		}

		return NextResponse.json(data)

	} catch (error) {
		console.error('Create room API error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}