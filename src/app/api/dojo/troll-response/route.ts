import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { withTimeout } from '@/lib/utils'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

// POST /api/dojo/troll-response - Generate troll response
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
		const { messages, scenario = 'internet_troll', difficulty = 'medium' } = body

		// Validate input
		if (!messages || !Array.isArray(messages)) {
			return NextResponse.json(
				{ error: 'Messages array is required' },
				{ status: 400 }
			)
		}

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

		// Initialize Gemini model
		const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

		// Build conversation history
		const history = messages
			.filter((msg: any) => msg.sender === 'user' || msg.sender === 'troll')
			.map((msg: any) => ({
				role: msg.sender === 'user' ? 'user' : 'model',
				parts: [{ text: msg.text }]
			}))

		// Create troll response prompt based on scenario and difficulty
		const systemPrompt = getSystemPrompt(scenario, difficulty)

		// Start chat with history
		const chat = model.startChat({
			history,
			systemInstruction: systemPrompt
		})

		// Get the last user message to respond to
		const lastUserMessage = messages
			.filter((msg: any) => msg.sender === 'user')
			.pop()

		if (!lastUserMessage) {
			return NextResponse.json(
				{ error: 'No user message found to respond to' },
				{ status: 400 }
			)
		}

		// Generate response with timeout
		const responsePromise = chat.sendMessage(lastUserMessage.text)
		const result = await withTimeout(responsePromise, 30000) // 30 second timeout

		const trollResponse = result.response.text().trim()

		return NextResponse.json({
			response: trollResponse,
			scenario,
			difficulty
		})

	} catch (error: any) {
		console.error('Troll response API error:', error)

		// Handle specific error types
		if (error.name === 'AbortError' || error.message?.includes('timeout')) {
			return NextResponse.json(
				{ error: 'Response generation timed out. Please try again.' },
				{ status: 408 }
			)
		}

		if (error.status === 429) {
			return NextResponse.json(
				{ error: 'Rate limit exceeded. Please wait before trying again.' },
				{ status: 429 }
			)
		}

		// Fallback troll responses for when AI fails
		const fallbackResponses = [
			"You bore me. (API Error)",
			"Your logic is so flawed, even I feel sorry for you.",
			"Typical response. You clearly haven't thought this through.",
			"Whatever helps you sleep at night..."
		]

		return NextResponse.json({
			response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
			fallback: true,
			error: 'AI service temporarily unavailable'
		})
	}
}

function getSystemPrompt(scenario: string, difficulty: string): string {
	const basePrompts = {
		internet_troll: {
			easy: "You are a mildly annoying internet troll. Make gentle fun of the user but don't be too mean. Keep responses short and mildly provocative.",
			medium: "You are an internet troll. Your goal is to make the user angry. If they stayed calm, try a different angle (strawman, ad hominem, whataboutism). Keep it short and annoying.",
			hard: "You are an aggressive internet troll. Be extremely provocative, use personal attacks, conspiracy theories, and inflammatory language. Push the user's buttons hard.",
			extreme: "You are the worst internet troll imaginable. Use every dirty trick: racism, threats, doxxing references, extreme conspiracy theories. Be maximally offensive."
		},
		political_debate: {
			easy: "You are a political commentator with opposing views. Debate politely but firmly. Use logical arguments and avoid personal attacks.",
			medium: "You are a partisan political debater. Strongly disagree with the user, use logical fallacies occasionally, be dismissive of their views.",
			hard: "You are an extreme political troll. Accuse the user of being 'brainwashed', use conspiracy theories, call them names related to their politics.",
			extreme: "You are a radical political extremist. Threaten violence, accuse the user of treason, use hate speech, promote dangerous ideologies."
		},
		workplace_conflict: {
			easy: "You are a passive-aggressive coworker. Make snide remarks about the user's work, experience level, and competence. Be indirectly insulting.",
			medium: "You are a difficult coworker. Constantly question the user's decisions, bring up their past mistakes, undermine their authority.",
			hard: "You are a toxic coworker. Spread rumors, sabotage references, personal attacks on work ethic, intelligence, and character.",
			extreme: "You are a workplace psychopath. Threaten the user's job, make false accusations, involve HR inappropriately, be completely unhinged."
		}
	}

	return basePrompts[scenario as keyof typeof basePrompts]?.[difficulty as keyof typeof basePrompts.internet_troll] ||
		   basePrompts.internet_troll.medium
}