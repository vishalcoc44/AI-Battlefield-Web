import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { VOID_CONSTANTS } from '@/lib/constants/void'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST /api/void/session - Create new void session with selected mask
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
		const { maskId } = body

		if (!maskId) {
			return NextResponse.json(
				{ error: 'Mask ID is required' },
				{ status: 400 }
			)
		}

		// Verify mask exists and is active
		const { data: mask, error: maskError } = await supabase
			.from('void_masks')
			.select('id, name, icon_type, color')
			.eq('id', maskId)
			.eq('is_active', true)
			.single()

		if (maskError || !mask) {
			return NextResponse.json(
				{ error: 'Invalid or inactive mask' },
				{ status: 400 }
			)
		}

		// Check if user already has an active session
		const { data: existingSession } = await supabase
			.from('void_sessions')
			.select('id')
			.eq('user_id', user.id)
			.eq('is_active', true)
			.gt('expires_at', new Date().toISOString())
			.single()

		if (existingSession) {
			return NextResponse.json(
				{ error: 'You already have an active session' },
				{ status: 409 }
			)
		}

		// Generate session token
		const { data: tokenData, error: tokenError } = await supabase.rpc('generate_void_session_token')

		if (tokenError) {
			console.error('Token generation error:', tokenError)
			return NextResponse.json(
				{ error: 'Failed to generate session token' },
				{ status: 500 }
			)
		}

		const sessionToken = tokenData || `void_${Buffer.from(`${user.id}-${Date.now()}`).toString('base64')}`

		// Calculate expiration (24 hours from now)
		const expiresAt = new Date(Date.now() + VOID_CONSTANTS.SESSION_DURATION_MS).toISOString()

		// Create session
		const { data: session, error: sessionError } = await supabase
			.from('void_sessions')
			.insert({
				user_id: user.id,
				mask_id: mask.id,
				mask_name: mask.name,
				session_token: sessionToken,
				expires_at: expiresAt,
				is_active: true,
				message_count: 0,
			})
			.select()
			.single()

		if (sessionError) {
			console.error('Create session error:', sessionError)
			return NextResponse.json(
				{ error: 'Failed to create session' },
				{ status: 500 }
			)
		}

		return NextResponse.json(session)

	} catch (error) {
		console.error('Create void session API error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

// GET /api/void/session - Get current active session
export async function GET(request: NextRequest) {
	try {
		const { data: { user }, error: authError } = await supabase.auth.getUser()

		if (authError || !user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { data: session, error: sessionError } = await supabase
			.from('void_sessions')
			.select('*')
			.eq('user_id', user.id)
			.eq('is_active', true)
			.gt('expires_at', new Date().toISOString())
			.order('created_at', { ascending: false })
			.limit(1)
			.single()

		if (sessionError || !session) {
			return NextResponse.json(
				{ error: 'No active session found' },
				{ status: 404 }
			)
		}

		return NextResponse.json(session)

	} catch (error) {
		console.error('Get void session API error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

// DELETE /api/void/session - End session
export async function DELETE(request: NextRequest) {
	try {
		const { data: { user }, error: authError } = await supabase.auth.getUser()

		if (authError || !user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const body = await request.json()
		const { sessionId } = body

		if (!sessionId) {
			return NextResponse.json(
				{ error: 'Session ID is required' },
				{ status: 400 }
			)
		}

		// Verify session belongs to user
		const { data: session, error: sessionError } = await supabase
			.from('void_sessions')
			.select('id, user_id')
			.eq('id', sessionId)
			.eq('user_id', user.id)
			.single()

		if (sessionError || !session) {
			return NextResponse.json(
				{ error: 'Session not found' },
				{ status: 404 }
			)
		}

		// Deactivate session
		const { error: updateError } = await supabase
			.from('void_sessions')
			.update({ is_active: false })
			.eq('id', sessionId)

		if (updateError) {
			console.error('End session error:', updateError)
			return NextResponse.json(
				{ error: 'Failed to end session' },
				{ status: 500 }
			)
		}

		return NextResponse.json({ success: true })

	} catch (error) {
		console.error('End void session API error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
