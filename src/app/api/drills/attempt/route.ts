import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateMessage } from '@/lib/utils'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST /api/drills/attempt - Submit a drill attempt
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
		let { drillId, score, feedback } = body

		// Validate input
		if (!drillId || typeof drillId !== 'string') {
			return NextResponse.json(
				{ error: 'Drill ID is required and must be a string' },
				{ status: 400 }
			)
		}

		if (typeof score !== 'number' || score < 0 || score > 100) {
			return NextResponse.json(
				{ error: 'Score must be a number between 0 and 100' },
				{ status: 400 }
			)
		}

		// Validate feedback if provided
		if (feedback && typeof feedback === 'object' && feedback.rebuttalText) {
			const rebuttalValidation = validateMessage(feedback.rebuttalText)
			if (!rebuttalValidation.isValid) {
				return NextResponse.json(
					{ error: `Invalid rebuttal: ${rebuttalValidation.error}` },
					{ status: 400 }
				)
			}
			feedback.rebuttalText = rebuttalValidation.sanitized
		}

		// Verify drill exists
		const { data: drill, error: drillError } = await supabase
			.from('gym_drills')
			.select('id, xp_reward')
			.eq('id', drillId)
			.single()

		if (drillError || !drill) {
			return NextResponse.json(
				{ error: 'Drill not found' },
				{ status: 404 }
			)
		}

		// Record the attempt
		const { data, error: attemptError } = await supabase
			.from('user_drill_attempts')
			.insert({
				user_id: user.id,
				drill_id: drillId,
				score,
				feedback
			})
			.select()
			.single()

		if (attemptError) {
			console.error('Submit drill attempt error:', attemptError)
			return NextResponse.json(
				{ error: 'Failed to submit drill attempt' },
				{ status: 500 }
			)
		}

		// Award XP
		const xpToAward = Math.floor((score / 100) * drill.xp_reward)
		if (xpToAward > 0) {
			const { error: xpError } = await supabase.rpc('increment_user_xp', {
				user_uuid: user.id,
				xp_amount: xpToAward
			})

			if (xpError) {
				console.error('XP award error:', xpError)
				// Don't fail the request if XP award fails
			}
		}

		return NextResponse.json(data)

	} catch (error) {
		console.error('Drill attempt API error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}