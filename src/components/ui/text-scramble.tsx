"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface TextScrambleProps {
	text: string
	className?: string
	characters?: string
	speed?: number
	revealSpeed?: number
	trigger?: boolean
	delay?: number
}

export function TextScramble({
	text,
	className,
	characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()",
	speed = 50,
	revealSpeed = 100,
	trigger = true,
	delay = 0
}: TextScrambleProps) {
	const [displayText, setDisplayText] = useState(text)
	const [isScrambling, setIsScrambling] = useState(false)
	const intervalRef = useRef<NodeJS.Timeout>(null)
	const timeoutRef = useRef<NodeJS.Timeout>(null) // Added for delay timeout

	const startScramble = () => {
		if (intervalRef.current) clearInterval(intervalRef.current)
		if (timeoutRef.current) clearTimeout(timeoutRef.current) // Clear any pending delay timeout

		timeoutRef.current = setTimeout(() => {
			setIsScrambling(true)

			let iteration = 0
			const maxIterations = text.length * 3 // Only scramble for a short duration

			intervalRef.current = setInterval(() => {
				setDisplayText((current) =>
					text
						.split("")
						.map((char, index) => {
							if (index < iteration / 3) {
								return text[index]
							}
							return characters[Math.floor(Math.random() * characters.length)]
						})
						.join("")
				)

				if (iteration >= maxIterations) {
					clearInterval(intervalRef.current!)
					setDisplayText(text)
					setIsScrambling(false)
				}

				iteration += 1
			}, speed)
		}, delay)
	}

	useEffect(() => {
		if (trigger) startScramble()
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current)
			if (timeoutRef.current) clearTimeout(timeoutRef.current) // Clear timeout on unmount or re-trigger
		}
	}, [trigger, text, delay])

	return (
		<span
			className={cn("inline-block", className)}
			onMouseEnter={startScramble}
		>
			{displayText}
		</span>
	)
}
