"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { DojoSession, DojoMessage, SentimentAnalysis, TrollResponse, DojoUIState, DojoError } from '@/types/dojo'
import { DOJO_CONSTANTS } from '@/lib/constants/dojo'
import { showToast, showErrorToast } from '@/lib/toast'
import { classifyError, withRetry } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

export function useDojoSession() {
	const [session, setSession] = useState<DojoSession | null>(null)
	const [uiState, setUIState] = useState<DojoUIState>({
		isTyping: false,
		isAnalyzing: false,
		isGenerating: false,
		error: null,
		lastActivity: Date.now()
	})
	const [isLoading, setIsLoading] = useState(true)
	const rateLimitRef = useRef<{ lastRequest: number; requestCount: number }>({
		lastRequest: 0,
		requestCount: 0
	})

	// Load or create session on mount
	useEffect(() => {
		loadSession()
	}, [])

	// Auto-save session data to localStorage
	useEffect(() => {
		if (session && !isLoading) {
			localStorage.setItem(DOJO_CONSTANTS.STORAGE_KEYS.SESSION_DATA, JSON.stringify({
				session,
				timestamp: Date.now()
			}))
		}
	}, [session, isLoading])

	// Rate limiting check
	const checkRateLimit = useCallback((): boolean => {
		const now = Date.now()
		const timeWindow = 60000 // 1 minute
		const { lastRequest, requestCount } = rateLimitRef.current

		// Reset counter if time window passed
		if (now - lastRequest > timeWindow) {
			rateLimitRef.current = { lastRequest: now, requestCount: 1 }
			return true
		}

		// Check if under limit
		if (requestCount < DOJO_CONSTANTS.RATE_LIMIT.MAX_REQUESTS_PER_MINUTE) {
			rateLimitRef.current.requestCount++
			return true
		}

		return false
	}, [])

	// Load session from API
	const loadSession = useCallback(async () => {
		try {
			setIsLoading(true)
			setUIState(prev => ({ ...prev, error: null }))

			// Check authentication first
			const { data: { user }, error: authError } = await supabase.auth.getUser()
			if (authError || !user) {
				setUIState(prev => ({ ...prev, error: 'Please sign in to continue' }))
				setIsLoading(false)
				return
			}

			const response = await fetch('/api/dojo/session')

			if (!response.ok) {
				if (response.status === 401) {
					setUIState(prev => ({ ...prev, error: 'Please sign in to continue' }))
					return
				}
				throw new Error(`Failed to load session: ${response.status}`)
			}

			const sessionData: DojoSession = await response.json()
			setSession(sessionData)

			// Restore draft message if exists
			const draft = localStorage.getItem(DOJO_CONSTANTS.STORAGE_KEYS.DRAFT_MESSAGE)
			if (draft) {
				setUIState(prev => ({ ...prev, draftMessage: draft }))
			}

		} catch (error: any) {
			console.error('Load session error:', error)
			const classifiedError = classifyError(error)
			setUIState(prev => ({ ...prev, error: classifiedError.message }))

			// Try to load from localStorage as fallback
			const cached = localStorage.getItem(DOJO_CONSTANTS.STORAGE_KEYS.SESSION_DATA)
			if (cached) {
				try {
					const { session: cachedSession } = JSON.parse(cached)
					setSession(cachedSession)
					showToast.warning('Using cached session', 'Connection issues detected')
				} catch (parseError) {
					console.error('Cache parse error:', parseError)
				}
			}
		} finally {
			setIsLoading(false)
		}
	}, [])

	// Create new session
	const createSession = useCallback(async (scenario: string = 'internet_troll', difficulty: string = 'medium') => {
		try {
			setUIState(prev => ({ ...prev, error: null }))

			const response = await fetch('/api/dojo/session', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ scenario, difficulty })
			})

			if (!response.ok) {
				throw new Error(`Failed to create session: ${response.status}`)
			}

			const newSession: DojoSession = await response.json()
			setSession(newSession)

			showToast.success('New session started', `Scenario: ${scenario.replace('_', ' ')}`)
			return newSession

		} catch (error: any) {
			console.error('Create session error:', error)
			const classifiedError = classifyError(error)
			setUIState(prev => ({ ...prev, error: classifiedError.message }))
			showErrorToast(error)
			return null
		}
	}, [])

	// Send user message and get analysis + troll response
	const sendMessage = useCallback(async (message: string) => {
		if (!session || !message.trim()) return

		// Check rate limit
		if (!checkRateLimit()) {
			showToast.error('Rate limit exceeded', 'Please wait before sending another message')
			return
		}

		// Check message length
		if (message.length > DOJO_CONSTANTS.MESSAGE_LIMITS.MAX_USER_MESSAGE_LENGTH) {
			showToast.error('Message too long', `Maximum ${DOJO_CONSTANTS.MESSAGE_LIMITS.MAX_USER_MESSAGE_LENGTH} characters`)
			return
		}

		setUIState(prev => ({
			...prev,
			isAnalyzing: true,
			isGenerating: true,
			error: null,
			lastActivity: Date.now()
		}))

		try {
			// Create user message
			const userMessage: DojoMessage = {
				id: Date.now(),
				sender: 'user',
				text: message,
				sentiment: 'neutral',
				analysis: 'Analyzing...',
				timestamp: Date.now()
			}

			// Add user message to local state immediately
			const messagesWithUser = [...session.messages, userMessage]
			setSession(prev => prev ? { ...prev, messages: messagesWithUser } : null)

			// Clear draft
			localStorage.removeItem(DOJO_CONSTANTS.STORAGE_KEYS.DRAFT_MESSAGE)

			// Step 1: Analyze sentiment
			let analysisResult: SentimentAnalysis | null = null

			try {
				const analysisResponse = await withRetry(
					() => fetch('/api/dojo/analyze', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ message, sessionId: session.id })
					}),
					2, // max retries
					1000, // base delay
					(error) => error.status >= 500 || !navigator.onLine // retry on server errors or network issues
				)

				if (analysisResponse.ok) {
					analysisResult = await analysisResponse.json()
				} else {
					throw new Error(`Analysis failed: ${analysisResponse.status}`)
				}
			} catch (analysisError) {
				console.error('Analysis error:', analysisError)
				// Use fallback analysis
				analysisResult = {
					analysis: 'Analysis unavailable - connection issues',
					sentiment: 'neutral',
					isCalm: true,
					calmScoreChange: 0
				}
			}

			// Update user message with analysis
			const updatedUserMessage = {
				...userMessage,
				analysis: analysisResult.analysis,
				sentiment: analysisResult.sentiment
			}

			const messagesWithAnalysis = messagesWithUser.map(msg =>
				msg.id === userMessage.id ? updatedUserMessage : msg
			)

			setUIState(prev => ({ ...prev, isAnalyzing: false }))

			// Step 2: Generate troll response
			let trollResult: TrollResponse | null = null

			try {
				const trollResponse = await withRetry(
					() => fetch('/api/dojo/troll-response', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							messages: messagesWithAnalysis,
							scenario: session.scenario,
							difficulty: session.difficulty
						})
					}),
					2,
					1000,
					(error) => error.status >= 500 || !navigator.onLine
				)

				if (trollResponse.ok) {
					trollResult = await trollResponse.json()
				} else {
					throw new Error(`Troll response failed: ${trollResponse.status}`)
				}
			} catch (trollError) {
				console.error('Troll response error:', trollError)
				// Use fallback response
				trollResult = {
					response: "You bore me. (Connection issues)",
					scenario: session.scenario,
					difficulty: session.difficulty,
					fallback: true,
					error: 'Service temporarily unavailable'
				}
			}

			// Create troll message
			const trollMessage: DojoMessage = {
				id: Date.now() + 1,
				sender: 'troll',
				text: trollResult.response,
				sentiment: 'toxic',
				analysis: null,
				timestamp: Date.now()
			}

			// Update session with new messages and score
			const finalMessages = [...messagesWithAnalysis, trollMessage]
			const newCalmScore = DOJO_CONSTANTS.SCORING.INITIAL_CALM_SCORE // Recalculate from initial, or use analysisResult.calmScoreChange

			const updatedSession = {
				...session,
				messages: finalMessages,
				calm_score: Math.max(0, Math.min(100, session.calm_score + (analysisResult?.calmScoreChange || 0))),
				message_count: session.message_count + 2, // user + troll
				session_duration_seconds: Math.floor((Date.now() - new Date(session.created_at).getTime()) / 1000)
			}

			setSession(updatedSession)

			// Save to server
			try {
				await fetch('/api/dojo/session', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						sessionId: session.id,
						messages: finalMessages,
						calmScore: updatedSession.calm_score,
						messageCount: updatedSession.message_count,
						sessionDurationSeconds: updatedSession.session_duration_seconds
					})
				})
			} catch (saveError) {
				console.error('Save session error:', saveError)
				// Don't show error to user, local state is preserved
			}

			setUIState(prev => ({
				...prev,
				isGenerating: false,
				lastActivity: Date.now()
			}))

			// Show feedback based on performance
			if (analysisResult?.isCalm) {
				showToast.success('Well done!', 'You maintained your composure')
			} else {
				showToast.warning('Stay calm', 'Try to respond more rationally next time')
			}

		} catch (error: any) {
			console.error('Send message error:', error)
			const classifiedError = classifyError(error)
			setUIState(prev => ({ ...prev, error: classifiedError.message, isAnalyzing: false, isGenerating: false }))
			showErrorToast(error)
		}
	}, [session, checkRateLimit])

	// Reset session
	const resetSession = useCallback(async () => {
		if (!session) return

		try {
			// Mark current session as completed
			await fetch('/api/dojo/session', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sessionId: session.id,
					completed: true
				})
			})

			// Clear local storage
			localStorage.removeItem(DOJO_CONSTANTS.STORAGE_KEYS.DRAFT_MESSAGE)
			localStorage.removeItem(DOJO_CONSTANTS.STORAGE_KEYS.SESSION_DATA)

			// Create new session
			await createSession(session.scenario, session.difficulty)

		} catch (error) {
			console.error('Reset session error:', error)
			showErrorToast(error)
		}
	}, [session, createSession])

	// Save draft message
	const saveDraft = useCallback((message: string) => {
		if (message.trim()) {
			localStorage.setItem(DOJO_CONSTANTS.STORAGE_KEYS.DRAFT_MESSAGE, message)
		} else {
			localStorage.removeItem(DOJO_CONSTANTS.STORAGE_KEYS.DRAFT_MESSAGE)
		}
	}, [])

	return {
		session,
		uiState,
		isLoading,
		loadSession,
		createSession,
		sendMessage,
		resetSession,
		saveDraft
	}
}