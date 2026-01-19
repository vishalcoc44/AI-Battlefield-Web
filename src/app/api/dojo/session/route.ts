import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { validateMessage } from '@/lib/utils'

// GET /api/dojo/session - Get current active session or session history
export async function GET(request: NextRequest) {
	const url = new URL(request.url)
	const history = url.searchParams.get('history')

	const cookieStore = await cookies()
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						cookieStore.set(name, value, options)
					)
				},
			},
		}
	)

	if (history === 'true') {
		const sessionId = url.searchParams.get('sessionId')
		const export_format = url.searchParams.get('export')

		try {
			const { data: { user }, error: authError } = await supabase.auth.getUser()

			if (authError || !user) {
				return NextResponse.json(
					{ error: 'Unauthorized' },
					{ status: 401 }
				)
			}

			if (sessionId) {
				// Export specific session
				const { data: session, error } = await supabase
					.from('dojo_sessions')
					.select('*')
					.eq('id', sessionId)
					.eq('user_id', user.id)
					.single()

				if (error || !session) {
					return NextResponse.json(
						{ error: 'Session not found or access denied' },
						{ status: 404 }
					)
				}

				if (export_format === 'json') {
					return new NextResponse(JSON.stringify(session, null, 2), {
						headers: {
							'Content-Type': 'application/json',
							'Content-Disposition': `attachment; filename="zen-dojo-session-${sessionId}.json"`
						}
					})
				}

				return NextResponse.json(session)
			} else {
				// Return session history
				const { data: sessions, error } = await supabase
					.from('dojo_sessions')
					.select('id, scenario, difficulty, calm_score, message_count, session_duration_seconds, created_at, updated_at, completed_at')
					.eq('user_id', user.id)
					.order('created_at', { ascending: false })
					.limit(20) // Last 20 sessions

				if (error) {
					console.error('Get session history error:', error)
					return NextResponse.json(
						{ error: 'Failed to retrieve session history' },
						{ status: 500 }
					)
				}

				return NextResponse.json(sessions)
			}
		} catch (error) {
			console.error('Session history API error:', error)
			return NextResponse.json(
				{ error: 'Internal server error' },
				{ status: 500 }
			)
		}
	} else {
		try {
			const { data: { user }, error: authError } = await supabase.auth.getUser()

			if (authError || !user) {
				return NextResponse.json(
					{ error: 'Unauthorized' },
					{ status: 401 }
				)
			}

			// Try to get the most recent active session
			const { data: session, error } = await supabase
				.from('dojo_sessions')
				.select('*')
				.eq('user_id', user.id)
				.is('completed_at', null)
				.order('updated_at', { ascending: false })
				.limit(1)
				.single()

			if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
				console.error('Get session error:', error)
				return NextResponse.json(
					{ error: 'Failed to retrieve session' },
					{ status: 500 }
				)
			}

			// If no active session found, create a new one
			if (!session) {
				const { data: newSession, error: createError } = await supabase
					.from('dojo_sessions')
					.insert({
						user_id: user.id,
						calm_score: 85,
						messages: [{
							id: Date.now(),
							sender: "troll",
							text: "LOL you actually believe that? You're obviously just brainwashed by the mainstream media. typical NPC behavior.",
							sentiment: "toxic",
							analysis: null
						}],
						scenario: 'internet_troll',
						difficulty: 'medium'
					})
					.select()
					.single()

				if (createError) {
					console.error('Create session error:', createError)
					return NextResponse.json(
						{ error: 'Failed to create session' },
						{ status: 500 }
					)
				}

				return NextResponse.json(newSession)
			}

			return NextResponse.json(session)

		} catch (error) {
			console.error('Session API error:', error)
			return NextResponse.json(
				{ error: 'Internal server error' },
				{ status: 500 }
			)
		}
	}
}

// POST /api/dojo/session - Create a new session
export async function POST(request: NextRequest) {
	const cookieStore = await cookies()
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						cookieStore.set(name, value, options)
					)
				},
			},
		}
	)

	try {
		const { data: { user }, error: authError } = await supabase.auth.getUser()

		if (authError || !user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const body = await request.json()
		const { scenario = 'internet_troll', difficulty = 'medium' } = body

		// Validate scenario and difficulty
		const validScenarios = ['internet_troll', 'political_debate', 'workplace_conflict']
		const validDifficulties = ['easy', 'medium', 'hard', 'extreme']

		if (!validScenarios.includes(scenario)) {
			return NextResponse.json(
				{ error: 'Invalid scenario' },
				{ status: 400 }
			)
		}

		if (!validDifficulties.includes(difficulty)) {
			return NextResponse.json(
				{ error: 'Invalid difficulty' },
				{ status: 400 }
			)
		}

		const initialMessage = getInitialMessage(scenario)

		const { data, error } = await supabase
			.from('dojo_sessions')
			.insert({
				user_id: user.id,
				calm_score: 85,
				messages: [initialMessage],
				scenario,
				difficulty
			})
			.select()
			.single()

		if (error) {
			console.error('Create session error:', error)
			return NextResponse.json(
				{ error: 'Failed to create session' },
				{ status: 500 }
			)
		}

		return NextResponse.json(data)

	} catch (error) {
		console.error('Create session API error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

// PUT /api/dojo/session - Update current session
export async function PUT(request: NextRequest) {
	const cookieStore = await cookies()
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						cookieStore.set(name, value, options)
					)
				},
			},
		}
	)

	try {
		const { data: { user }, error: authError } = await supabase.auth.getUser()

		if (authError || !user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const body = await request.json()
		const { sessionId, calmScore, messages, messageCount, sessionDurationSeconds, completed } = body

		if (!sessionId) {
			return NextResponse.json(
				{ error: 'Session ID is required' },
				{ status: 400 }
			)
		}

		// Verify the session belongs to the user
		const { data: existingSession, error: fetchError } = await supabase
			.from('dojo_sessions')
			.select('id')
			.eq('id', sessionId)
			.eq('user_id', user.id)
			.single()

		if (fetchError || !existingSession) {
			return NextResponse.json(
				{ error: 'Session not found or access denied' },
				{ status: 404 }
			)
		}

		const updateData: any = {
			updated_at: new Date().toISOString()
		}

		if (calmScore !== undefined) updateData.calm_score = Math.max(0, Math.min(100, calmScore))
		if (messages !== undefined) updateData.messages = messages
		if (messageCount !== undefined) updateData.message_count = messageCount
		if (sessionDurationSeconds !== undefined) updateData.session_duration_seconds = sessionDurationSeconds
		if (completed) updateData.completed_at = new Date().toISOString()

		const { data, error } = await supabase
			.from('dojo_sessions')
			.update(updateData)
			.eq('id', sessionId)
			.select()
			.single()

		if (error) {
			console.error('Update session error:', error)
			return NextResponse.json(
				{ error: 'Failed to update session' },
				{ status: 500 }
			)
		}

		return NextResponse.json(data)

	} catch (error) {
		console.error('Update session API error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

function getInitialMessage(scenario: string) {
	const messages = {
		internet_troll: {
			id: Date.now(),
			sender: "troll",
			text: "LOL you actually believe that? You're obviously just brainwashed by the mainstream media. typical NPC behavior.",
			sentiment: "toxic",
			analysis: null
		},
		political_debate: {
			id: Date.now(),
			sender: "troll",
			text: "Your political views are so outdated. Everyone knows the real truth is the opposite of what you're saying. Wake up sheeple!",
			sentiment: "toxic",
			analysis: null
		},
		workplace_conflict: {
			id: Date.now(),
			sender: "troll",
			text: "You think you're so smart with your fancy degree? I've been doing this job longer than you've been alive. Back in my day...",
			sentiment: "toxic",
			analysis: null
		}
	}

	return messages[scenario as keyof typeof messages] || messages.internet_troll
}