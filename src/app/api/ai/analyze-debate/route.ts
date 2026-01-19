import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
import { NextResponse } from "next/server"
import { withTimeout } from "@/lib/utils"
import { GYM_CONSTANTS } from "@/lib/constants/gym"

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
	// Verify key presence
	const apiKey = process.env.GEMINI_API_KEY
	if (!apiKey) {
		console.error("Missing GEMINI_API_KEY")
		return NextResponse.json({ error: "Configuration Error" }, { status: 500 })
	}

	try {
		const { messages, topic } = await req.json()

		if (!messages || !Array.isArray(messages)) {
			return NextResponse.json({ error: "Invalid input: messages array required" }, { status: 400 })
		}

		console.log(`Analyzing debate with model gemma-3-27b-it. Messages: ${messages.length}, Topic: ${topic}`)

		const model = genAI.getGenerativeModel({
			model: "gemma-3-27b-it",
			// Disable safety settings for debate analysis to prevent blocking valid arguments
			safetySettings: [
				{ category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
				{ category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
				{ category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
				{ category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
			]
		})

		// Filter for user and ai messages only, exclude system
		const debateTranscript = messages
			.filter((m: any) => m.type === 'message')
			.map((m: any) => `${m.sender.name}: ${m.text}`)
			.join("\n")

		if (!debateTranscript.trim()) {
			return NextResponse.json({ fallacies: [], opportunities: [] })
		}

		const prompt = `
        You are an expert Debate Judge. Analyze the following debate transcript on the topic: "${topic}".
        
        Transcript:
        ${debateTranscript}

        Return a JSON object with two arrays:
        1. "fallacies": { "speaker": string, "fallacy": string, "explanation": string }
        2. "opportunities": { "suggestion": string, "context": string }
        
        Strictly limit to valid JSON output. No markdown.
        `

		const result = await withTimeout(
			model.generateContent(prompt),
			GYM_CONSTANTS.API_TIMEOUTS.AI_RESPONSE_MS,
			"AI analysis generation timed out"
		)
		const response = await result.response
		const responseText = response.text()

		// Attempt to parse JSON from the response
		let cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim()

		try {
			const analysis = JSON.parse(cleanJson)
			return NextResponse.json(analysis)
		} catch (e) {
			console.error("JSON Parse Error. Raw text:", responseText)
			return NextResponse.json({ fallacies: [], opportunities: [{ suggestion: "Analysis format error.", context: "System" }] })
		}

	} catch (error: any) {
		console.error("AI Analysis Critical Failure:", {
			message: error.message,
			cause: error.cause,
			key_configured: !!process.env.GEMINI_API_KEY
		})
		return NextResponse.json({ error: "Analysis Service Unavailable", details: error.message }, { status: 500 })
	}
}
