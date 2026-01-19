import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { VOID_CONSTANTS } from '@/lib/constants/void'
import { sanitizeText } from '@/lib/utils'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST /api/void/messages - Post anonymous message
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
		const { sessionId, content } = body

		if (!sessionId || !content) {
			return NextResponse.json(
				{ error: 'Session ID and content are required' },
				{ status: 400 }
			)
		}

		// Sanitize content
		const sanitizedContent = sanitizeText(content).trim()

		// Validate content length
		if (sanitizedContent.length < VOID_CONSTANTS.VALIDATION.MESSAGE_CONTENT.MIN_LENGTH) {
			return NextResponse.json(
				{ error: 'Message cannot be empty' },
				{ status: 400 }
			)
		}

		if (sanitizedContent.length > VOID_CONSTANTS.VALIDATION.MESSAGE_CONTENT.MAX_LENGTH) {
			return NextResponse.json(
				{ error: `Message must be less than ${VOID_CONSTANTS.VALIDATION.MESSAGE_CONTENT.MAX_LENGTH} characters` },
				{ status: 400 }
			)
		}

		// Verify session exists and belongs to user
		const { data: session, error: sessionError } = await supabase
			.from('void_sessions')
			.select('id, user_id, mask_name, is_active, expires_at')
			.eq('id', sessionId)
			.single()

		if (sessionError || !session) {
			return NextResponse.json(
				{ error: 'Session not found' },
				{ status: 404 }
			)
		}

		if (session.user_id !== user.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			)
		}

		if (!session.is_active || new Date(session.expires_at) <= new Date()) {
			return NextResponse.json(
				{ error: 'Session is expired or inactive' },
				{ status: 400 }
			)
		}

		// Calculate message expiration (24 hours from now)
		const expiresAt = new Date(Date.now() + VOID_CONSTANTS.MESSAGE_EXPIRATION_MS).toISOString()

		// Create message
		const { data: message, error: messageError } = await supabase
			.from('void_messages')
			.insert({
				session_id: sessionId,
				mask_name: session.mask_name,
				content: sanitizedContent,
				expires_at: expiresAt,
				is_deleted: false,
			})
			.select()
			.single()

		if (messageError) {
			console.error('Create message error:', messageError)
			return NextResponse.json(
				{ error: 'Failed to post message' },
				{ status: 500 }
			)
		}

		return NextResponse.json(message)

	} catch (error) {
		console.error('Post void message API error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

// GET /api/void/messages - Get recent messages (paginated)
export async function GET(request: NextRequest) {
	try {
		const url = new URL(request.url)
		const page = parseInt(url.searchParams.get('page') || '1', 10)
		const limit = parseInt(url.searchParams.get('limit') || String(VOID_CONSTANTS.UI.MESSAGES_PER_PAGE), 10)

		if (page < 1 || limit < 1 || limit > 100) {
			return NextResponse.json(
				{ error: 'Invalid pagination parameters' },
				{ status: 400 }
			)
		}

		const offset = (page - 1) * limit

		// Get active messages (not deleted, not expired, from active sessions)
		const { data: messages, error: messagesError } = await supabase
			.from('void_messages')
			.select('*')
			.eq('is_deleted', false)
			.gt('expires_at', new Date().toISOString())
			.order('created_at', { ascending: false })
			.range(offset, offset + limit - 1)

		if (messagesError) {
			console.error('Get messages error:', messagesError)
			return NextResponse.json(
				{ error: 'Failed to get messages' },
				{ status: 500 }
			)
		}

		// Get total count for pagination
		const { count, error: countError } = await supabase
			.from('void_messages')
			.select('*', { count: 'exact', head: true })
			.eq('is_deleted', false)
			.gt('expires_at', new Date().toISOString())

		if (countError) {
			console.error('Get messages count error:', countError)
		}

		const total = count || 0
		const hasMore = offset + messages.length < total

		return NextResponse.json({
			messages: messages || [],
			total,
			hasMore,
		})

	} catch (error) {
		console.error('Get void messages API error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
