import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/void/stats - Get active phantom count and statistics
export async function GET(request: NextRequest) {
	try {
		// Get count of active sessions (active phantoms)
		const { count: activePhantoms, error: phantomsError } = await supabase
			.from('void_sessions')
			.select('*', { count: 'exact', head: true })
			.eq('is_active', true)
			.gt('expires_at', new Date().toISOString())

		if (phantomsError) {
			console.error('Get active phantoms error:', phantomsError)
		}

		// Get count of active sessions
		const { count: activeSessions, error: sessionsError } = await supabase
			.from('void_sessions')
			.select('*', { count: 'exact', head: true })
			.eq('is_active', true)
			.gt('expires_at', new Date().toISOString())

		if (sessionsError) {
			console.error('Get active sessions error:', sessionsError)
		}

		// Get count of messages created today
		const todayStart = new Date()
		todayStart.setHours(0, 0, 0, 0)

		const { count: messagesToday, error: messagesError } = await supabase
			.from('void_messages')
			.select('*', { count: 'exact', head: true })
			.eq('is_deleted', false)
			.gte('created_at', todayStart.toISOString())

		if (messagesError) {
			console.error('Get messages today error:', messagesError)
		}

		// Get total count of active masks
		const { count: totalMasks, error: masksError } = await supabase
			.from('void_masks')
			.select('*', { count: 'exact', head: true })
			.eq('is_active', true)

		if (masksError) {
			console.error('Get total masks error:', masksError)
		}

		return NextResponse.json({
			activePhantoms: activePhantoms || 0,
			activeSessions: activeSessions || 0,
			messagesToday: messagesToday || 0,
			totalMasks: totalMasks || 0,
		})

	} catch (error) {
		console.error('Get void stats API error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
