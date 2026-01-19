"use client"

import { cn } from "@/lib/utils"

export function CyberSeparator({ className }: { className?: string }) {
	return (
		<div className={cn("relative w-full h-16 flex items-center justify-center overflow-hidden pointer-events-none z-20", className)}>
			{/* Central Light Source */}
			<div className="absolute top-1/2 left-1/2 w-[40%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent -translate-x-1/2 -translate-y-1/2 shadow-[0_0_30px_rgba(6,182,212,0.5)]" />

			{/* Scanning Laser */}
			<div className="absolute top-1/2 left-0 w-20 h-[2px] bg-cyan-400 blur-sm animate-[shimmer_3s_infinite_linear] shadow-[0_0_10px_rgba(6,182,212,0.8)]" />

			{/* Slit Clip Path */}
			<div className="absolute inset-x-0 h-[1px] bg-white/5" />

			{/* Decorative Notches */}
			<div className="absolute top-1/2 left-[20%] w-2 h-2 bg-black border border-white/20 rotate-45 -translate-y-1/2" />
			<div className="absolute top-1/2 right-[20%] w-2 h-2 bg-black border border-white/20 rotate-45 -translate-y-1/2" />
		</div>
	)
}
