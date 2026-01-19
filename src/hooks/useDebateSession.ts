import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { DEBATE_CONSTANTS } from "@/lib/constants/debate"
import type { DebateMessage, DebateSession } from "@/types/debate"
import { toast } from "sonner"
import { geminiModel } from "@/lib/gemini"

export function useDebateSession() {
	const router = useRouter();
	const [messages, setMessages] = useState<DebateMessage[]>([])
	const [session, setSession] = useState<DebateSession | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isTyping, setIsTyping] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [hasMore, setHasMore] = useState(false)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const MESSAGE_LIMIT = 20;

	const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

	// Initialize Session
	useEffect(() => {
		async function initSession() {
			try {
				const { data: { user } } = await supabase.auth.getUser()
				if (!user) {
					setIsLoading(false);
					return;
				}

				// 1. Get active session or create new
				const { data: activeDebate, error: fetchError } = await supabase
					.from('debates')
					.select('*')
					.eq('user_id', user.id)
					.eq('status', 'active')
					.order('created_at', { ascending: false })
					.limit(1)
					.single()

				if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows found"
					throw fetchError;
				}

				let currentSession = activeDebate as DebateSession | null;

				if (!currentSession) {
					const { data: newDebate, error: createError } = await supabase
						.from('debates')
						.insert({
							user_id: user.id,
							persona_id: DEBATE_CONSTANTS.PERSONA.SOCRATES.id,
							topic: DEBATE_CONSTANTS.DEFAULT_TOPIC,
							status: 'active'
						})
						.select()
						.single()

					if (createError) throw createError;
					currentSession = newDebate as DebateSession;
				}

				setSession(currentSession);

				// 2. Load Messages (Paginated - Last N)
				const { data: msgs, error: msgError } = await supabase
					.from('messages')
					.select('*')
					.eq('session_id', currentSession.id)
					.order('created_at', { ascending: false }) // Get latest first
					.limit(MESSAGE_LIMIT + 1) // Fetch one extra to check if there are more

				if (msgError) throw msgError;

				if (msgs && msgs.length > 0) {
					const hasMoreData = msgs.length > MESSAGE_LIMIT;
					const visibleMessages = hasMoreData ? msgs.slice(0, MESSAGE_LIMIT) : msgs;
					// Reverse back to chronological order for display
					setMessages(visibleMessages.reverse() as DebateMessage[]);
					setHasMore(hasMoreData);
				} else {
					// Initial AI Message (optimistic)
					const initialMsg: DebateMessage = {
						id: Date.now(), // Temporary ID
						session_id: currentSession.id,
						sender_id: null,
						sender_role: 'ai',
						content: DEBATE_CONSTANTS.MESSAGES.INITIAL,
						metadata: { steelman: null, factCheck: null },
						created_at: new Date().toISOString()
					};
					setMessages([initialMsg]);
					// Persist initial message
					await supabase.from('messages').insert({
						session_id: currentSession.id,
						sender_role: 'ai',
						content: initialMsg.content,
						metadata: initialMsg.metadata
					});
				}

			} catch (error: any) {
				console.error("Debate Init Error:", error);
				toast.error("Failed to start debate session", { description: error.message });
			} finally {
				setIsLoading(false);
			}
		}

		initSession();
	}, [])

	// Real-time Subscription
	useEffect(() => {
		if (!session?.id) return;

		channelRef.current = supabase.channel(`debate:${session.id}`)
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'messages',
					filter: `session_id=eq.${session.id}`
				},
				(payload) => {
					const newMsg = payload.new as DebateMessage;
					setMessages(prev => {
						if (prev.some(m => m.id === newMsg.id)) return prev; // Dedupe
						return [...prev, newMsg];
					});
					// If we received an AI message, stop typing indicator
					if (newMsg.sender_role === 'ai') {
						setIsTyping(false);
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channelRef.current!);
		}
	}, [session?.id])

	const loadMoreMessages = async () => {
		if (!session || isLoadingMore || !messages.length) return;

		setIsLoadingMore(true);
		try {
			const oldestMessage = messages[0];
			const { data: oldMsgs, error } = await supabase
				.from('messages')
				.select('*')
				.eq('session_id', session.id)
				.lt('created_at', oldestMessage.created_at)
				.order('created_at', { ascending: false })
				.limit(MESSAGE_LIMIT + 1);

			if (error) throw error;

			if (oldMsgs && oldMsgs.length > 0) {
				const hasMoreData = oldMsgs.length > MESSAGE_LIMIT;
				const visibleOldMessages = hasMoreData ? oldMsgs.slice(0, MESSAGE_LIMIT) : oldMsgs;

				setMessages(prev => [...visibleOldMessages.reverse() as DebateMessage[], ...prev]);
				setHasMore(hasMoreData);
			} else {
				setHasMore(false);
			}

		} catch (error) {
			console.error("Load more error:", error);
			toast.error("Failed to load previous messages");
		} finally {
			setIsLoadingMore(false);
		}
	};

	// Timeout logic wrapper for AI generation
	const promiseWithTimeout = <T>(promise: Promise<T>, ms: number, timeoutError = new Error('Timeout')): Promise<T> => {
		return new Promise((resolve, reject) => {
			const timeoutId = setTimeout(() => {
				reject(timeoutError);
			}, ms);
			promise.then(
				(res) => {
					clearTimeout(timeoutId);
					resolve(res);
				},
				(err) => {
					clearTimeout(timeoutId);
					reject(err);
				}
			);
		});
	};

	const sendMessage = useCallback(async (text: string) => {
		if (!session) return;

		// Optimistic Update
		const { data: { user } } = await supabase.auth.getUser();

		// We don't add to state here if we rely on subscription for user msg too,
		// BUT subscription might be slow. Better to add optimistically.
		// However, if we add optimistically, we need to handle dedupe in subscription.
		// Subscription event comes with DB ID (bigint), optimistic has Date.now().
		// We will just let subscription render it to be safe, OR we render optimistic and replace.
		// Given the prototype nature, waiting for 100ms roundtrip is acceptable for "Resilience" vs "Complexity".
		// Actually, improved UX: show optimistic.

		// User Message
		setIsTyping(true);

		try {
			const { error } = await supabase.from('messages').insert({
				session_id: session.id,
				sender_id: user?.id,
				sender_role: 'user',
				content: text.trim(),
				metadata: { factCheck: 'pending' }
			});

			if (error) throw error;

			// Trigger AI Response (Client-side trigger for now)
			generateAIResponse(text, messages);

		} catch (error: any) {
			toast.error("Failed to send message", { description: error.message });
			setIsTyping(false);
			// Don't swallow error completely so UI can react if needed, 
			// but for now we won't clear input (handled by caller logic if we exposed success/fail)
			throw error;
		}
	}, [session, messages]);

	const generateAIResponse = async (userText: string, history: DebateMessage[]) => {
		try {
			// Mock Fact Check
			setTimeout(() => {
				// We can't easily update the specific user message without its real ID.
				// This requires robust syncing. For now, we skip "visual" fact check update on past message
				// and just focus on AI response.

				// In a real app, we'd have a separate "fact_check" table or update row.
			}, DEBATE_CONSTANTS.FACT_CHECK.DELAY_MS);

			const chatHistory = history.map(m => ({
				role: m.sender_role === 'user' ? 'user' : 'model',
				parts: [{ text: m.content }]
			}));

			const chat = geminiModel.startChat({
				history: chatHistory,
				generationConfig: { maxOutputTokens: DEBATE_CONSTANTS.GEMINI.MAX_TOKENS },
			});

			const result = await promiseWithTimeout(
				chat.sendMessage(userText),
				30000, // 30s timeout
				new Error("AI generation timed out")
			);

			const response = await result.response;
			const aiText = response.text();

			if (!session) return;

			await supabase.from('messages').insert({
				session_id: session.id,
				sender_role: 'ai',
				content: aiText,
				metadata: {
					steelman: Math.floor(Math.random() * 30) + 70 // Mock score
				}
			});

		} catch (error: any) {
			console.error("Gemini Error:", error);
			if (error.message === "AI generation timed out") {
				toast.error("AI is taking too long to respond. Please try again.");
			} else {
				toast.error("AI failed to respond. Please try again.");
			}
			setIsTyping(false);
		}
	};

	const endDebate = async () => {
		// Logic to end debate
		if (!session) return;
		try {
			await supabase.from('debates').update({ status: 'completed' }).eq('id', session.id);
			toast.success("Debate concluded.");
			router.push('/gym/completed'); // Redirect to summary or gym home
		} catch (error) {
			toast.error("Failed to end debate");
		}
	};

	const deleteDebate = async () => {
		if (!session) return;
		setIsDeleting(true);
		try {
			const { error } = await supabase.from('debates').delete().eq('id', session.id);
			if (error) throw error;
			toast.success("Debate deleted.");
			router.push('/gym');
		} catch (error: any) {
			console.error("Delete error:", error);
			toast.error("Failed to delete debate", { description: error.message });
			setIsDeleting(false);
		}
	};

	return {
		messages,
		session,
		isLoading,
		isTyping,
		sendMessage,
		endDebate,
		deleteDebate,
		isDeleting,
		loadMoreMessages,
		hasMore,
		isLoadingMore
	}
}
