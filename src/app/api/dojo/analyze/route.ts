import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { withTimeout, validateMessage } from '@/lib/utils'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

// POST /api/dojo/analyze - Analyze user response sentiment
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
		// Check authentication
		const { data: { user }, error: authError } = await supabase.auth.getUser()

		if (authError || !user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		// Check API key availability
		if (!genAI) {
			return NextResponse.json(
				{ error: 'AI service unavailable' },
				{ status: 503 }
			)
		}

		const body = await request.json()
		const { message, sessionId } = body

		// Validate input
		if (!message || typeof message !== 'string') {
			return NextResponse.json(
				{ error: 'Message is required and must be a string' },
				{ status: 400 }
			)
		}

		const messageValidation = validateMessage(message)
		if (!messageValidation.isValid) {
			return NextResponse.json(
				{ error: `Invalid message: ${messageValidation.error}` },
				{ status: 400 }
			)
		}

		// Verify session ownership if sessionId provided
		if (sessionId) {
			const { data: session, error: sessionError } = await supabase
				.from('dojo_sessions')
				.select('id')
				.eq('id', sessionId)
				.eq('user_id', user.id)
				.single()

			if (sessionError || !session) {
				return NextResponse.json(
					{ error: 'Session not found or access denied' },
					{ status: 404 }
				)
			}
		}

		// Initialize Gemini model
		const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

		// Create analysis prompt
		const analysisPrompt = `
Analyze the following response to a toxic troll.
Determine if the response is "Calm/Rational" or "Triggered/Emotional".
Give a brief 1 sentence reason.
Response: "${messageValidation.sanitized}"
		`.trim()

		// Make API call with timeout
		const analysisChat = model.startChat({
			generationConfig: { maxOutputTokens: 100 }
		})

		const analysisPromise = analysisChat.sendMessage(analysisPrompt)
		const analysisResult = await withTimeout(analysisPromise, 30000) // 30 second timeout

		const analysisText = analysisResult.response.text().trim()

		// Determine sentiment based on analysis
		const isCalm = analysisText.toLowerCase().includes('calm') ||
					  analysisText.toLowerCase().includes('rational') ||
					  analysisText.toLowerCase().includes('composed')

		const sentiment = isCalm ? 'calm' : 'triggered'

		return NextResponse.json({
			analysis: analysisText,
			sentiment,
			isCalm,
			calmScoreChange: isCalm ? 5 : -10
		})

	} catch (error: any) {
		console.error('Analysis API error:', error)

		// Handle specific error types
		if (error.name === 'AbortError' || error.message?.includes('timeout')) {
			return NextResponse.json(
				{ error: 'Analysis request timed out. Please try again.' },
				{ status: 408 }
			)
		}

		if (error.status === 429) {
			return NextResponse.json(
				{ error: 'Rate limit exceeded. Please wait before trying again.' },
				{ status: 429 }
			)
		}

		// Generic error response
		return NextResponse.json(
			{ error: 'Analysis failed. Please try again.' },
			{ status: 500 }
		)
	}
}