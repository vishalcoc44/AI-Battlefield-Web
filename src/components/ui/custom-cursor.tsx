"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
	const [isHovered, setIsHovered] = useState(false)
	const [isVisible, setIsVisible] = useState(false)

	const mouseX = useMotionValue(0)
	const mouseY = useMotionValue(0)

	// Smooth spring physics for the cursor
	const springConfig = { damping: 25, stiffness: 400 }
	const cursorX = useSpring(mouseX, springConfig)
	const cursorY = useSpring(mouseY, springConfig)

	useEffect(() => {
		const moveCursor = (e: MouseEvent) => {
			mouseX.set(e.clientX)
			mouseY.set(e.clientY)
			if (!isVisible) setIsVisible(true)
		}

		const handleMouseEnter = () => setIsHovered(true)
		const handleMouseLeave = () => setIsHovered(false)

		// Attach listeners to all clickable elements
		const attachListeners = () => {
			const elements = document.querySelectorAll("a, button, [role='button'], input, textarea, select")
			elements.forEach((el) => {
				el.addEventListener("mouseenter", handleMouseEnter)
				el.addEventListener("mouseleave", handleMouseLeave)
			})
			return () => {
				elements.forEach((el) => {
					el.removeEventListener("mouseenter", handleMouseEnter)
					el.removeEventListener("mouseleave", handleMouseLeave)
				})
			}
		}

		window.addEventListener("mousemove", moveCursor)
		const cleanup = attachListeners()

		return () => {
			window.removeEventListener("mousemove", moveCursor)
			cleanup()
		}
	}, [isVisible, mouseX, mouseY])

	// Don't render on mobile/touch devices (simple check)
	if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
		return null
	}

	return (
		<>
			<style jsx global>{`
        body, a, button, [role='button'] {
          cursor: none !important;
        }
      `}</style>

			{/* Main defined cursor */}
			<motion.div
				className="fixed top-0 left-0 w-4 h-4 rounded-full bg-cyan-400 mix-blend-difference pointer-events-none z-[9999]"
				style={{
					x: cursorX,
					y: cursorY,
					translateX: "-50%",
					translateY: "-50%",
					scale: isHovered ? 2.5 : 1,
				}}
			/>

			{/* Outer ring */}
			<motion.div
				className="fixed top-0 left-0 w-8 h-8 rounded-full border border-cyan-500/50 mix-blend-difference pointer-events-none z-[9998]"
				style={{
					x: mouseX, // No spring for the outer ring for a "lag" effect
					y: mouseY,
					translateX: "-50%",
					translateY: "-50%",
					scale: isHovered ? 1.5 : 1,
				}}
				transition={{ duration: 0.1 }}
			/>
		</>
	)
}
