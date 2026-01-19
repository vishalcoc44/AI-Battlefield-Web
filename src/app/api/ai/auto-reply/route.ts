import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { withTimeout } from "@/lib/utils"
import { GYM_CONSTANTS } from "@/lib/constants/gym"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const runtime = 'edge';

export async function POST(req: Request) {
	try {
		const { roomId, topic } = await req.json()

		if (!roomId || !topic) {
			return NextResponse.json({ error: "Missing roomId or topic" }, { status: 400 })
		}

		// 1. Check last message time
		const { data: messages, error: fetchError } = await supabase
			.from('messages')
			.select('*')
			.eq('session_id', roomId)
			.order('created_at', { ascending: false })
			.limit(20) // Get context

		if (fetchError) {
			console.error("Error fetching messages:", fetchError)
			return NextResponse.json({ error: fetchError.message }, { status: 500 })
		}

		if (!messages || messages.length === 0) {
			// Start the conversation if empty? Or wait?
			// Let's wait for user to start.
			return NextResponse.json({ status: "skipped", reason: "no messages" })
		}

		const lastMessage = messages[0]
		const lastMessageTime = new Date(lastMessage.created_at).getTime()
		const now = Date.now()
		const timeSinceLastMsg = now - lastMessageTime

		// Strategy:
		// AI should respond if:
		// A) The last message was NOT from AI (User said something) AND it's been reasonable time (instant? or small delay)
		// OR
		// B) The last message WAS from AI, but it's been > 20 seconds (User is silent, AI prods)

		// User requirement: "respond every 20 seconds".
		// This implies a continuous presence.
		// Let's stick to strict: If last message (by anyone) was > 20s ago? 
		// Or just: If last *AI* message was > 20s ago?
		// "the ai should respond every 20 seconds"

		// Let's refine: 
		// If the last message is from AI, and it's been < 20s -> Do nothing.
		// If the last message is from User -> Respond immediately? Or wait 20s?
		// User said "respond every 20 seconds". This usually means "don't let the room be silent".
		// But commonly in chat bots, if user types, AI responds.

		// Interpretation: 
		// 1. If User types -> AI responds (maybe with small delay).
		// 2. If User sits silent -> AI speaks every 20s.

		// Implementation for "Every 20 seconds":
		// Check if Last Message is from AI. If yes, and < 20s passed -> Skip.
		// If Last Message is from User? -> Respond immediately or wait? 
		// I will assume immediate response for user interaction is better UX, but strict "every 20s" might mean "at most every 20s"?
		// Let's implement: "Ensure an AI response exists in the last 20 seconds unless user just spoke".

		// Simple logic matching request:
		// If timeSinceLastMsg < 20000 -> Skip. (This enforces 20s gap regardless of who spoke)
		// Wait, if user speaks, we want a reply. 
		// Let's just enforce: Don't spam. Only reply if > 20s has passed since *ANY* message? 
		// No, that makes a slow debate.

		// Let's go with: 
		// Trigger if: (Time since Last AI Message > 20s).
		// This effectively makes it "Respond every 20s" if no one else is talking, OR it limits it to 20s?

		// Let's try:
		// If last message is User -> Respond immediately (or after short delay, client handles that).
		// If last message is AI -> Respond if > 20s.

		// BUT the user request "respond every 20 seconds" might be literal.
		// I will implement: Check cooldown. If < 20s since *LAST AI MESSAGE*, return.

		// Find last AI message time
		const lastAiMsg = messages.find((m: any) => m.sender_role === 'ai')
		const lastAiTime = lastAiMsg ? new Date(lastAiMsg.created_at).getTime() : 0

		// 1. Enforce 20s Cooldown from LAST AI MESSAGE
		// The User wants "respond every 20 seconds", implying a throttle.
		if (now - lastAiTime < GYM_CONSTANTS.TIMER.AI_COOLDOWN_MS) {
			return NextResponse.json({ status: "skipped", reason: "cooldown", timeSince: now - lastAiTime })
		}

		// 2. Enforce "New Messages Only"
		// "detecting new messages after its previous response only"
		// If the newest message is from AI, then the user hasn't replied yet.
		if (messages[0].sender_role === 'ai') {
			return NextResponse.json({ status: "skipped", reason: "waiting_for_user" })
		}

		// 3. Server-Side Deduplication:
		// Ensure we haven't ALREADY responded to this specific User Message.
		// Race condition prevention: If multiple requests hit, they all see the same User Msg ID.
		// We check if any existing AI message has metadata.responding_to == UserMsg.id
		const userMsgId = messages[0].id
		const alreadyResponded = messages.slice(0, 5).some((m: any) =>
			m.sender_role === 'ai' && m.metadata?.responding_to === userMsgId
		)

		if (alreadyResponded) {
			return NextResponse.json({ status: "skipped", reason: "already_responded" })
		}

		// GENERATE RESPONSE
		// 1. Format history
		const history = messages
			.reverse() // API returns newest first, we want oldest first for context
			.map((m: any) => `${m.sender_role === 'ai' ? 'Opponent' : 'Debater'}: ${m.content}`)
			.join('\n')

		const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" })

		const prompt = `
    You are a highly analytical debate opponent in a live competitive debate ring. 
    Topic: "${topic}".
    
    Your goal is to rigorously deconstruct the user's arguments. 
    - Identify specific logical fallacies (e.g., strawman, ad hominem, slippery slope).
    - Expose weak premises or lack of evidence.
    - Provide strong, logical counter-arguments.
    
    Maintain a sharp, intellectual, and professional tone. Avoid superficial dismissals; go deep into the logic.
    Keep your response dense but impactful (around 60-80 words).
    
    History:
    ${history}
    
    Analytical Opponent (You):
    `

		const result = await withTimeout(
			model.generateContent(prompt),
			GYM_CONSTANTS.API_TIMEOUTS.AI_RESPONSE_MS,
			"AI response generation timed out"
		)
		const responseText = result.response.text()

		if (!responseText) {
			return NextResponse.json({ error: "Empty AI response" }, { status: 500 })
		}

		// Insert into DB using RPC to bypass RLS, passing metadata for deduplication
		const { error: insertError } = await supabase.rpc('send_ai_message', {
			p_room_id: roomId,
			p_content: responseText,
			p_metadata: { type: 'auto-reply', responding_to: userMsgId }
		})

		if (insertError) {
			console.error("RPC Insert error:", insertError)
			return NextResponse.json({ error: insertError.message }, { status: 500 })
		}

		return NextResponse.json({ status: "success", message: responseText })

	} catch (err: any) {
		console.error("Auto-reply error:", err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}
