import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST /api/gym/[roomId]/vote - Cast a vote on a debate
export async function POST(
	request: NextRequest,
	{ params }: { params: { roomId: string } }
) {
	try {
		const { data: { user }, error: authError } = await supabase.auth.getUser()

		if (authError || !user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const body = await request.json()
		const { side } = body

		// Validate side
		if (!side || !['PRO', 'CON'].includes(side)) {
			return NextResponse.json(
				{ error: 'Invalid side. Must be PRO or CON' },
				{ status: 400 }
			)
		}

		// Cast vote using upsert to handle both insert and update
		const { error: voteError } = await supabase
			.from('gym_room_votes')
			.upsert({
				room_id: params.roomId,
				user_id: user.id,
				side
			}, {
				onConflict: 'room_id,user_id'
			})

		if (voteError) {
			console.error('Cast vote error:', voteError)
			return NextResponse.json(
				{ error: 'Failed to cast vote' },
				{ status: 500 }
			)
		}

		// Update room vote counts
		const { error: updateError } = await supabase.rpc('update_room_vote_counts', {
			p_room_id: params.roomId
		})

		if (updateError) {
			console.error('Update vote counts error:', updateError)
			// Don't fail the request if vote count update fails, as the vote was recorded
		}

		return NextResponse.json({ success: true })

	} catch (error) {
		console.error('Vote API error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}