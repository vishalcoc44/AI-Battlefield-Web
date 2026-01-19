import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
	if (!GEMINI_API_KEY) {
		return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
	}

	try {
		const { messages, persona } = await req.json();

		if (!messages || !Array.isArray(messages)) {
			return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
		}

		const systemPrompt = `You are playing the role of ${persona?.name || "a debater"}. 
    Difficulty Level: ${persona?.difficultyLevel || "Medium"}.
    Style: ${persona?.systemPrompt || "Logical and precise."}
    Your goal is to debate the user on the given topic. Keep responses concise (under 150 words).`;

		// Construct prompt for Gemini (using simplified text-only model or chat)
		// Gemini 1.5 Flash is recommended for speed/cost
		const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

		// Convert history to Gemini format
		// User -> role: "user"
		// Assistant -> role: "model"
		const contents = messages.map((m: any) => ({
			role: m.role === 'user' ? 'user' : 'model',
			parts: [{ text: m.content }]
		}));

		// Add System Prompt via system_instruction if supported, or prepend to first message
		// For simplicity in REST, prepending context or strict system instruction
		const payload = {
			contents: contents,
			system_instruction: {
				parts: [{ text: systemPrompt }]
			}
		};

		const response = await fetch(apiEndpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		const data = await response.json();

		if (!response.ok) {
			console.error("Gemini API Error:", data);
			return NextResponse.json({ error: 'AI Service Unavailable' }, { status: 502 });
		}

		const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Interesting point.";

		return NextResponse.json({ reply: aiText });

	} catch (error) {
		console.error("AI Chat Error:", error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
