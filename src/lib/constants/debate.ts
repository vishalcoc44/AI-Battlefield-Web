export const DEBATE_CONSTANTS = {
	PERSONA: {
		SOCRATES: {
			id: 'socrates',
			name: 'Socrates',
			role: 'Philosophical Challenger',
			avatarFallback: 'S',
		},
	},
	DEFAULT_TOPIC: 'General Debate',
	MESSAGES: {
		INITIAL: 'Welcome. I am Socrates. What truth do you seek to challenge today?',
		ERROR: "I apologize, but I'm having trouble processing that thought right now.",
		THINKING: 'Thinking...',
		VERIFYING: 'Verifying...',
	},
	FACT_CHECK: {
		DELAY_MS: 1500,
	},
	GEMINI: {
		MAX_TOKENS: 200,
	},
	UI: {
		MAX_INPUT_LENGTH: 1000,
	},
} as const;
