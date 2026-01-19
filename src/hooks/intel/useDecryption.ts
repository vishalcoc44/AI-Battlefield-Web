import { useState, useEffect, useRef } from 'react'

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"

interface DecryptionOptions {
	speed?: number
	enabled?: boolean
	revealSpeed?: number
}

export function useDecryption(text: string | null | undefined, options: DecryptionOptions = {}) {
	const { speed = 30, enabled = true, revealSpeed = 50 } = options
	const [displayText, setDisplayText] = useState(text || "")
	const [isComplete, setIsComplete] = useState(false)

	// Keep track of original text to handle updates
	const originalTextRef = useRef(text)

	useEffect(() => {
		if (!enabled || !text) {
			setDisplayText(text || "")
			setIsComplete(true)
			return
		}

		// If text input changed, reset
		if (text !== originalTextRef.current) {
			setIsComplete(false)
			originalTextRef.current = text
		}

		let iteration = 0
		let interval: NodeJS.Timeout

		const startDecryption = () => {
			interval = setInterval(() => {
				setDisplayText(prev => {
					return text
						.split("")
						.map((char, index) => {
							if (index < iteration) {
								return text[index]
							}
							return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
						})
						.join("")
				})

				if (iteration >= text.length) {
					clearInterval(interval)
					setIsComplete(true)
				}

				iteration += 1 / (300 / (revealSpeed * text.length)) // Dynamic pacing based on length
				// Simpler pacing: iteration += 1/3
			}, speed)
		}

		startDecryption()

		return () => clearInterval(interval)
	}, [text, speed, enabled, revealSpeed])

	return { displayText, isComplete }
}
