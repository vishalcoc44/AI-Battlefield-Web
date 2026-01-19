"use client"

import { cn } from "@/lib/utils"

export function HeroHologram({ className }: { className?: string }) {
	return (
		<div className={cn("pointer-events-none select-none absolute inset-0 z-0 overflow-hidden flex items-center justify-center opacity-40", className)}>
			<div className="relative w-[800px] h-[800px] animate-[spin_60s_linear_infinite]">

				{/* Outer Ring */}
				<div className="absolute inset-0 rounded-full border border-cyan-500/10 border-dashed" />

				{/* Inner Ring Rotating Opposite */}
				<div className="absolute inset-[100px] rounded-full border border-blue-500/20 border-t-transparent border-l-transparent animate-[spin_20s_linear_infinite_reverse]" />

				{/* Core Hexagon */}
				<div className="absolute inset-0 flex items-center justify-center">
					<svg viewBox="0 0 100 100" className="w-[400px] h-[400px] text-cyan-500/5 animate-pulse">
						<path d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" fill="currentColor" />
					</svg>
				</div>

				{/* Orbiting Particles */}
				<div className="absolute inset-[50px] animate-[spin_10s_linear_infinite]">
					<div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
				</div>
				<div className="absolute inset-[150px] animate-[spin_15s_linear_infinite_reverse]">
					<div className="absolute bottom-0 right-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
				</div>

				{/* Vertical Scanning Beam */}
				<div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-500/5 to-transparent h-full w-[1px] left-1/2 -translate-x-1/2 animate-[pulse_4s_ease-in-out_infinite]" />
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent w-full h-[1px] top-1/2 -translate-y-1/2 animate-[pulse_4s_ease-in-out_infinite]" />

			</div>
		</div>
	)
}
