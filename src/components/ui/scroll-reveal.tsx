"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode
	className?: string
	width?: "fit-content" | "100%"
	delay?: number
	duration?: number
	variant?: "fade-up" | "blur-in" | "slide-left" | "slide-right" | "zoom-in"
	threshold?: number
	once?: boolean
}

export function ScrollReveal({
	children,
	className,
	width = "100%",
	delay = 0,
	duration = 1000,
	variant = "fade-up",
	threshold = 0.2, // 20% visible to trigger
	once = false,
	...props
}: ScrollRevealProps) {
	const ref = useRef<HTMLDivElement>(null)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true)
					if (once && ref.current) {
						observer.unobserve(ref.current)
					}
				} else if (!once) {
					setIsVisible(false)
				}
			},
			{ threshold, rootMargin: "0px 0px -50px 0px" } // Trigger slightly before full view
		)

		if (ref.current) {
			observer.observe(ref.current)
		}

		return () => {
			if (ref.current) {
				observer.unobserve(ref.current)
			}
		}
	}, [once, threshold])

	// Map variants to starting styles
	const getVariantClasses = () => {
		switch (variant) {
			case "blur-in":
				return "translate-y-0 scale-100 reveal-hidden" // Just blur/opacity
			case "slide-left":
				return "reveal-hidden -translate-x-12 translate-y-0"
			case "slide-right":
				return "reveal-hidden translate-x-12 translate-y-0"
			case "zoom-in":
				return "reveal-hidden scale-90 translate-y-0"
			default: // fade-up
				return "reveal-hidden" // Default transform is translateY(30px)
		}
	}

	return (
		<div
			ref={ref}
			style={{
				width,
				transitionDuration: `${duration}ms`,
				transitionDelay: `${delay}ms`,
			}}
			className={cn(
				// Base state
				getVariantClasses(),
				// Active state
				isVisible ? "reveal-visible !translate-x-0 !translate-y-0 !scale-100" : "",
				className
			)}
			{...props}
		>
			{children}
		</div>
	)
}
