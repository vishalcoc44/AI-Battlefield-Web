/**
 * Void Service - Handles all API interactions for The Void
 */

import { VOID_CONSTANTS } from '@/lib/constants/void'
import { VoidMask, VoidSession, VoidMessage, VoidStats } from '@/lib/types'
import { withTimeout, sanitizeText } from '@/lib/utils'
import { showErrorToast } from '@/lib/toast'

const API_BASE = '/api/void'

/**
 * Create a new void session with selected mask
 */
export async function createVoidSession(maskId: string): Promise<VoidSession> {
	try {
		const response = await withTimeout(
			fetch(`${API_BASE}/session`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ maskId }),
			}),
			VOID_CONSTANTS.API_TIMEOUT_MS
		)

		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: 'Failed to create session' }))
			throw { status: response.status, message: error.error || 'Failed to create session' }
		}

		return await response.json()
	} catch (error: any) {
		showErrorToast(error, 'Failed to Enter The Void', 'Could not create your anonymous session')
		throw error
	}
}

/**
 * Get current active void session
 */
export async function getActiveVoidSession(): Promise<VoidSession | null> {
	try {
		const response = await withTimeout(
			fetch(`${API_BASE}/session`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}),
			VOID_CONSTANTS.API_TIMEOUT_MS
		)

		if (response.status === 404) {
			return null
		}

		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: 'Failed to get session' }))
			throw { status: response.status, message: error.error || 'Failed to get session' }
		}

		return await response.json()
	} catch (error: any) {
		showErrorToast(error, 'Session Error', 'Could not retrieve your session')
		throw error
	}
}

/**
 * End current void session
 */
export async function endVoidSession(sessionId: string): Promise<void> {
	try {
		const response = await withTimeout(
			fetch(`${API_BASE}/session`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sessionId }),
			}),
			VOID_CONSTANTS.API_TIMEOUT_MS
		)

		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: 'Failed to end session' }))
			throw { status: response.status, message: error.error || 'Failed to end session' }
		}
	} catch (error: any) {
		showErrorToast(error, 'Session Error', 'Could not end your session')
		throw error
	}
}

/**
 * Post an anonymous message to The Void
 */
export async function postVoidMessage(sessionId: string, content: string): Promise<VoidMessage> {
	// Sanitize content
	const sanitizedContent = sanitizeText(content).trim()

	// Validate content
	if (sanitizedContent.length < VOID_CONSTANTS.VALIDATION.MESSAGE_CONTENT.MIN_LENGTH) {
		throw { status: 400, message: 'Message cannot be empty' }
	}

	if (sanitizedContent.length > VOID_CONSTANTS.VALIDATION.MESSAGE_CONTENT.MAX_LENGTH) {
		throw {
			status: 400,
			message: `Message must be less than ${VOID_CONSTANTS.VALIDATION.MESSAGE_CONTENT.MAX_LENGTH} characters`,
		}
	}

	try {
		const response = await withTimeout(
			fetch(`${API_BASE}/messages`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sessionId,
					content: sanitizedContent,
				}),
			}),
			VOID_CONSTANTS.API_TIMEOUT_MS
		)

		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: 'Failed to post message' }))
			throw { status: response.status, message: error.error || 'Failed to post message' }
		}

		return await response.json()
	} catch (error: any) {
		showErrorToast(error, 'Message Error', 'Could not post your message')
		throw error
	}
}

/**
 * Get recent void messages (paginated)
 */
export async function getVoidMessages(page: number = 1, limit: number = VOID_CONSTANTS.UI.MESSAGES_PER_PAGE): Promise<{
	messages: VoidMessage[]
	total: number
	hasMore: boolean
}> {
	try {
		const response = await withTimeout(
			fetch(`${API_BASE}/messages?page=${page}&limit=${limit}`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}),
			VOID_CONSTANTS.API_TIMEOUT_MS
		)

		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: 'Failed to get messages' }))
			throw { status: response.status, message: error.error || 'Failed to get messages' }
		}

		return await response.json()
	} catch (error: any) {
		showErrorToast(error, 'Message Error', 'Could not load messages')
		throw error
	}
}

/**
 * Get void statistics (active phantoms, etc.)
 */
export async function getVoidStats(): Promise<VoidStats> {
	try {
		const response = await withTimeout(
			fetch(`${API_BASE}/stats`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}),
			VOID_CONSTANTS.API_TIMEOUT_MS
		)

		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: 'Failed to get stats' }))
			throw { status: response.status, message: error.error || 'Failed to get stats' }
		}

		return await response.json()
	} catch (error: any) {
		// Don't show error toast for stats - it's not critical
		console.error('Failed to get void stats:', error)
		// Return default stats
		return {
			activePhantoms: 0,
			activeSessions: 0,
			messagesToday: 0,
			totalMasks: 4,
		}
	}
}

/**
 * Get available void masks
 */
export async function getVoidMasks(): Promise<VoidMask[]> {
	try {
		const response = await withTimeout(
			fetch(`${API_BASE}/masks`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}),
			VOID_CONSTANTS.API_TIMEOUT_MS
		)

		if (!response.ok) {
			// Fallback to default masks if API fails
			console.warn('Failed to load masks from API, using defaults')
			return VOID_CONSTANTS.DEFAULT_MASKS.map((mask, index) => ({
				id: `default-${index}`,
				name: mask.name,
				iconType: mask.iconType,
				color: mask.color,
				isActive: true,
				createdAt: new Date().toISOString(),
			}))
		}

		return await response.json()
	} catch (error: any) {
		// Fallback to default masks
		console.warn('Error loading masks, using defaults:', error)
		return VOID_CONSTANTS.DEFAULT_MASKS.map((mask, index) => ({
			id: `default-${index}`,
			name: mask.name,
			iconType: mask.iconType,
			color: mask.color,
			isActive: true,
			createdAt: new Date().toISOString(),
		}))
	}
}
