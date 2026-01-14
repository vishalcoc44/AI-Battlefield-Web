"use client"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface MagneticButtonProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode
	strength?: number
}

export function MagneticButton({
	children,
	className,
	strength = 0.5,
	...props
}: MagneticButtonProps) {
	const ref = useRef<HTMLDivElement>(null)
	const [position, setPosition] = useState({ x: 0, y: 0 })

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const { clientX, clientY } = e
		const { left, top, width, height } = ref.current!.getBoundingClientRect()

		const x = (clientX - (left + width / 2)) * strength
		const y = (clientY - (top + height / 2)) * strength

		setPosition({ x, y })
	}

	const handleMouseLeave = () => {
		setPosition({ x: 0, y: 0 })
	}

	return (
		<div
			ref={ref}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			style={{
				transform: `translate(${position.x}px, ${position.y}px)`,
				transition: "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)"
			}}
			className={cn("inline-block transition-transform duration-200 ease-out", className)}
			{...props}
		>
			{children}
		</div>
	)
}
