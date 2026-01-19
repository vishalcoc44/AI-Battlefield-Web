"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
	createVoidSession,
	getActiveVoidSession,
	endVoidSession,
	postVoidMessage,
	getVoidMessages,
	getVoidStats,
	getVoidMasks,
} from '@/lib/services/void-service'
import { VoidSession, VoidMessage, VoidMask, VoidStats } from '@/lib/types'
import { VOID_CONSTANTS } from '@/lib/constants/void'
import { throttle } from '@/lib/utils'
import { showToast } from '@/lib/toast'

interface UseVoidSessionReturn {
	session: VoidSession | null
	messages: VoidMessage[]
	masks: VoidMask[]
	stats: VoidStats
	isLoading: boolean
	isCreating: boolean
	isPosting: boolean
	error: string | null
	createSession: (maskId: string) => Promise<void>
	endSession: () => Promise<void>
	sendMessage: (content: string) => Promise<void>
	loadMessages: () => Promise<void>
	refreshStats: () => Promise<void>
}

export function useVoidSession(): UseVoidSessionReturn {
	const router = useRouter()
	const [session, setSession] = useState<VoidSession | null>(null)
	const [messages, setMessages] = useState<VoidMessage[]>([])
	const [masks, setMasks] = useState<VoidMask[]>([])
	const [stats, setStats] = useState<VoidStats>({
		activePhantoms: 0,
		activeSessions: 0,
		messagesToday: 0,
		totalMasks: 4,
	})
	const [isLoading, setIsLoading] = useState(true)
	const [isCreating, setIsCreating] = useState(false)
	const [isPosting, setIsPosting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const statsIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const messagesIntervalRef = useRef<NodeJS.Timeout | null>(null)

	// Load masks on mount
	useEffect(() => {
		const loadMasks = async () => {
			try {
				const loadedMasks = await getVoidMasks()
				setMasks(loadedMasks)
			} catch (err) {
				console.error('Failed to load masks:', err)
				// Use default masks as fallback
				setMasks(
					VOID_CONSTANTS.DEFAULT_MASKS.map((mask, index) => ({
						id: `default-${index}`,
						name: mask.name,
						iconType: mask.iconType,
						color: mask.color,
						isActive: true,
						createdAt: new Date().toISOString(),
					}))
				)
			}
		}
		loadMasks()
	}, [])

	// Load active session on mount
	useEffect(() => {
		const loadSession = async () => {
			try {
				const activeSession = await getActiveVoidSession()
				setSession(activeSession)
				if (activeSession) {
					// Load messages for active session
					await loadMessages()
				}
			} catch (err: any) {
				if (err?.status !== 404) {
					setError(err?.message || 'Failed to load session')
				}
			} finally {
				setIsLoading(false)
			}
		}
		loadSession()
	}, [])

	// Load stats on mount and set up polling
	useEffect(() => {
		const loadStats = async () => {
			try {
				const loadedStats = await getVoidStats()
				setStats(loadedStats)
			} catch (err) {
				console.error('Failed to load stats:', err)
			}
		}

		loadStats()

		// Set up polling for stats
		statsIntervalRef.current = setInterval(() => {
			loadStats()
		}, VOID_CONSTANTS.UI.ACTIVE_COUNT_UPDATE_INTERVAL_MS)

		return () => {
			if (statsIntervalRef.current) {
				clearInterval(statsIntervalRef.current)
			}
		}
	}, [])

	// Set up message polling if session is active
	useEffect(() => {
		if (!session || !session.is_active) {
			if (messagesIntervalRef.current) {
				clearInterval(messagesIntervalRef.current)
			}
			return
		}

		// Poll for new messages
		messagesIntervalRef.current = setInterval(() => {
			loadMessages()
		}, VOID_CONSTANTS.UI.MESSAGE_POLL_INTERVAL_MS)

		return () => {
			if (messagesIntervalRef.current) {
				clearInterval(messagesIntervalRef.current)
			}
		}
	}, [session])

	// Create session
	const createSession = useCallback(async (maskId: string) => {
		setIsCreating(true)
		setError(null)

		try {
			const newSession = await createVoidSession(maskId)
			setSession(newSession)
			showToast.success('Entered The Void', `You are now ${newSession.mask_name}`)
			// Navigate to session page
			router.push(`/void/${newSession.id}`)
		} catch (err: any) {
			setError(err?.message || 'Failed to create session')
			throw err
		} finally {
			setIsCreating(false)
		}
	}, [router])

	// End session
	const endSession = useCallback(async () => {
		if (!session) return

		try {
			await endVoidSession(session.id)
			setSession(null)
			setMessages([])
			showToast.success('Left The Void', 'Your anonymous session has ended')
			router.push('/void')
		} catch (err: any) {
			setError(err?.message || 'Failed to end session')
			throw err
		}
	}, [session, router])

	// Send message (throttled)
	const sendMessage = useCallback(
		throttle(async (content: string) => {
			if (!session || !content.trim()) return

			setIsPosting(true)
			setError(null)

			try {
				const newMessage = await postVoidMessage(session.id, content)
				setMessages((prev) => [newMessage, ...prev])
				// Refresh messages to get latest
				await loadMessages()
			} catch (err: any) {
				setError(err?.message || 'Failed to send message')
				throw err
			} finally {
				setIsPosting(false)
			}
		}, 2000), // Throttle to 1 message per 2 seconds
		[session]
	)

	// Load messages
	const loadMessages = useCallback(async () => {
		if (!session) return

		try {
			const result = await getVoidMessages(1, VOID_CONSTANTS.UI.MESSAGES_PER_PAGE)
			setMessages(result.messages)
		} catch (err) {
			console.error('Failed to load messages:', err)
		}
	}, [session])

	// Refresh stats
	const refreshStats = useCallback(async () => {
		try {
			const loadedStats = await getVoidStats()
			setStats(loadedStats)
		} catch (err) {
			console.error('Failed to refresh stats:', err)
		}
	}, [])

	return {
		session,
		messages,
		masks,
		stats,
		isLoading,
		isCreating,
		isPosting,
		error,
		createSession,
		endSession,
		sendMessage,
		loadMessages,
		refreshStats,
	}
}
