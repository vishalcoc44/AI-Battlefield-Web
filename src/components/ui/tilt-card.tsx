"use client"

import React, { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode
	className?: string
	spotlightColor?: string
}

export function TiltCard({ children, className, spotlightColor = "rgba(6,182,212,0.15)", ...props }: TiltCardProps) {
	const divRef = useRef<HTMLDivElement>(null)
	const [position, setPosition] = useState({ x: 0, y: 0 })
	const [opacity, setOpacity] = useState(0)
	const [rotation, setRotation] = useState({ x: 0, y: 0 })

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!divRef.current) return

		const rect = divRef.current.getBoundingClientRect()
		const width = rect.width
		const height = rect.height
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		// Spotlight position
		setPosition({ x, y })

		// Tilt calculation (max 15 degrees)
		const xPct = x / width
		const yPct = y / height
		const xRot = (yPct - 0.5) * 20 // -10 to 10
		const yRot = (xPct - 0.5) * -20 // 10 to -10

		setRotation({ x: xRot, y: yRot })
	}

	const handleMouseEnter = () => {
		setOpacity(1)
	}

	const handleMouseLeave = () => {
		setOpacity(0)
		setRotation({ x: 0, y: 0 })
	}

	return (
		<div
			ref={divRef}
			onMouseMove={handleMouseMove}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className={cn(
				"relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md transition-all duration-200 ease-out",
				className
			)}
			style={{
				transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1, 1, 1)`,
			}}
			{...props}
		>
			<div
				className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
				style={{
					opacity,
					background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
				}}
			/>
			<div className="relative z-10 h-full">{children}</div>
		</div>
	)
}
