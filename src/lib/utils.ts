"use client"

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useState, useEffect } from "react"
import DOMPurify from "dompurify"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitizes HTML content by removing dangerous elements and attributes to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return ""

  // Configure DOMPurify to allow basic formatting but remove dangerous content
  const config = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'blockquote'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false
  }

  return DOMPurify.sanitize(html, config)
}

/**
 * Sanitizes plain text content by escaping dangerous characters to prevent XSS attacks
 * Use this for content that should be displayed as plain text only
 * @param text - The text string to sanitize
 * @returns Sanitized text string safe for rendering
 */
export function sanitizeText(text: string | null | undefined): string {
  if (!text) return ""

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/\\/g, "&#x5C;")
    .replace(/`/g, "&#x60;")
}


/**
 * Retries a function with exponential backoff
 * @param fn - Function to retry
 * @param maxAttempts - Maximum number of attempts
 * @param baseDelay - Base delay in milliseconds
 * @param shouldRetry - Function to determine if error should be retried
 * @returns Promise that resolves with the function result or rejects after max attempts
 */
export async function withRetry<T>(
	fn: () => Promise<T>,
	maxAttempts: number = 3,
	baseDelay: number = 1000,
	shouldRetry?: (error: any) => boolean
): Promise<T> {
	let lastError: any

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			return await fn()
		} catch (error) {
			lastError = error

			// Don't retry if this is the last attempt
			if (attempt === maxAttempts) break

			// Check if we should retry this error
			if (shouldRetry && !shouldRetry(error)) break

			// Calculate delay with exponential backoff and jitter
			const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000
			await new Promise(resolve => setTimeout(resolve, delay))
		}
	}

	throw lastError
}

/**
 * Debounces a function call
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: NodeJS.Timeout | null = null

	return (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId)
		}

		timeoutId = setTimeout(() => {
			fn(...args)
		}, delay)
	}
}

/**
 * Throttles a function call
 * @param fn - Function to throttle
 * @param interval - Minimum interval between calls in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
	fn: T,
	interval: number
): (...args: Parameters<T>) => void {
	let lastCallTime = 0

	return (...args: Parameters<T>) => {
		const now = Date.now()
		if (now - lastCallTime >= interval) {
			lastCallTime = now
			fn(...args)
		}
	}
}

import { GYM_CONSTANTS } from './constants/gym'

/**
 * Input validation utilities
 */
export const ValidationRules = {
  // Text validation
  text: {
    minLength: (text: string, min: number) => text.trim().length >= min || `Must be at least ${min} characters`,
    maxLength: (text: string, max: number) => text.trim().length <= max || `Must be no more than ${max} characters`,
    notEmpty: (text: string) => text.trim().length > 0 || 'This field is required',
    noSpecialChars: (text: string) => GYM_CONSTANTS.PATTERNS.TEXT.test(text) || 'Contains invalid characters'
  },

  // Topic validation (for debate topics)
  topic: {
    maxLength: GYM_CONSTANTS.LIMITS.MAX_TOPIC_LENGTH,
    pattern: GYM_CONSTANTS.PATTERNS.TOPIC
  },

  // Message validation
  message: {
    maxLength: GYM_CONSTANTS.LIMITS.MAX_MESSAGE_LENGTH,
    minLength: 1
  },

  // Room/category validation
  category: {
    allowedValues: GYM_CONSTANTS.CATEGORIES,
    maxLength: GYM_CONSTANTS.LIMITS.MAX_CATEGORY_LENGTH
  }
}

/**
 * Validates text input against rules
 * @param text - Text to validate
 * @param rules - Array of validation functions
 * @returns Validation result with error message if invalid
 */
export function validateText(text: string, rules: ((text: string) => string | true)[]): { isValid: boolean; error?: string } {
  for (const rule of rules) {
    const result = rule(text)
    if (result !== true) {
      return { isValid: false, error: result }
    }
  }
  return { isValid: true }
}

/**
 * Sanitizes and validates debate topic
 * @param topic - Topic to validate
 * @returns Validation result
 */
export function validateTopic(topic: string): { isValid: boolean; error?: string; sanitized?: string } {
  const trimmed = topic.trim()

  if (!trimmed) {
    return { isValid: false, error: 'Topic is required' }
  }

  if (trimmed.length > ValidationRules.topic.maxLength) {
    return { isValid: false, error: `Topic must be ${ValidationRules.topic.maxLength} characters or less` }
  }

  if (!ValidationRules.topic.pattern.test(trimmed)) {
    return { isValid: false, error: 'Topic contains invalid characters. Use only letters, numbers, spaces, and basic punctuation.' }
  }

  return { isValid: true, sanitized: trimmed }
}

/**
 * Sanitizes and validates message content
 * @param message - Message to validate
 * @returns Validation result
 */
export function validateMessage(message: string): { isValid: boolean; error?: string; sanitized?: string } {
  const trimmed = message.trim()

  if (!trimmed) {
    return { isValid: false, error: 'Message cannot be empty' }
  }

  if (trimmed.length > ValidationRules.message.maxLength) {
    return { isValid: false, error: `Message must be ${ValidationRules.message.maxLength} characters or less` }
  }

  return { isValid: true, sanitized: trimmed }
}

/**
 * Validates category selection
 * @param category - Category to validate
 * @returns Validation result
 */
export function validateCategory(category: string): { isValid: boolean; error?: string } {
  if (!ValidationRules.category.allowedValues.includes(category)) {
    return { isValid: false, error: 'Invalid category selected' }
  }

  return { isValid: true }
}

/**
 * Custom hook for network status detection
 * @returns Object with online status and connection type
 */

export function useNetworkStatus() {
  // Initialize to true on server (assume online) to prevent hydration mismatch
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window === 'undefined') return true
    return navigator.onLine
  })
  const [connectionType, setConnectionType] = useState<string>('unknown')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    const updateConnectionType = () => {
      // @ts-ignore - navigator.connection is not in all browsers
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      if (connection) {
        setConnectionType(connection.effectiveType || 'unknown')
      }
    }

    // Initial check
    updateOnlineStatus()
    updateConnectionType()

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Listen for connection changes if available
    // @ts-ignore
    if (navigator.connection) {
      // @ts-ignore
      navigator.connection.addEventListener('change', updateConnectionType)
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      // @ts-ignore
      if (navigator.connection) {
        // @ts-ignore
        navigator.connection.removeEventListener('change', updateConnectionType)
      }
    }
  }, [])

  return { isOnline: mounted ? isOnline : true, connectionType }
}

/**
 * Creates a timeout promise that rejects after the specified time
 * @param ms - Timeout in milliseconds
 * @returns Promise that rejects with timeout error
 */
export function createTimeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout after ${ms}ms`))
    }, ms)
  })
}

/**
 * Wraps a promise with a timeout
 * @param promise - The promise to wrap
 * @param timeoutMs - Timeout in milliseconds (default: 30000)
 * @returns Promise that resolves/rejects with the original promise or timeout
 */
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> {
  return Promise.race([
    promise,
    createTimeoutPromise(timeoutMs)
  ])
}

/**
 * Classifies errors into specific types for better user feedback
 * @param error - The error object to classify
 * @returns Object with error type and user-friendly message
 */
export function classifyError(error: unknown): { type: string; message: string; retryable: boolean } {
  // Network errors (no internet, DNS issues, etc.)
  if (!navigator.onLine) {
    return {
      type: 'network',
      message: 'No internet connection. Check your WiFi/mobile data and try again.',
      retryable: true
    }
  }

  // Timeout errors
  if (error?.name === 'AbortError' || error?.message?.includes('timeout')) {
    return {
      type: 'timeout',
      message: 'Request timed out. The server may be overloaded. Please try again in a few moments.',
      retryable: true
    }
  }

  // Supabase auth errors
  if (error?.message?.includes('JWT') || error?.message?.includes('auth') || error?.status === 401) {
    return {
      type: 'auth',
      message: 'Session expired. Please refresh the page and log in again.',
      retryable: false
    }
  }

  // Permission/forbidden errors
  if (error?.status === 403) {
    return {
      type: 'permission',
      message: 'Access forbidden. You don\'t have permission to view this content.',
      retryable: false
    }
  }

  if (error?.status === 404) {
    return {
      type: 'permission',
      message: 'Content not found. The item may have been deleted or you may not have access.',
      retryable: false
    }
  }

  // Server errors
  if (error?.status >= 500 || error?.message?.includes('server')) {
    return {
      type: 'server',
      message: 'Server temporarily unavailable. Our team has been notified. Please try again later.',
      retryable: true
    }
  }

  // Rate limiting
  if (error?.status === 429 || error?.message?.includes('rate limit')) {
    return {
      type: 'rate-limit',
      message: 'Too many requests. Please wait 30 seconds before trying again.',
      retryable: true
    }
  }

  // Default case - try to extract more specific information
  let detailedMessage = 'An unexpected error occurred.'

  if (error instanceof Error) {
    // Check for common error patterns
    if (error.message?.includes('fetch')) {
      detailedMessage = 'Network request failed. Check your connection and try again.'
    } else if (error.message?.includes('JSON')) {
      detailedMessage = 'Data parsing error. The server may be returning invalid data.'
    } else if (error.message?.includes('network')) {
      detailedMessage = 'Network connectivity issue. Please check your internet connection.'
    }
  }

  return {
    type: 'unknown',
    message: `${detailedMessage} If this persists, please contact support.`,
    retryable: true
  }
}
