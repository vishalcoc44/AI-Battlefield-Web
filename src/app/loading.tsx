import { Loader2 } from "lucide-react"

export default function Loading() {
	return (
		<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white overflow-hidden">
			{/* Cosmic Background - Simplified for Performance */}
			<div className="absolute inset-0 bg-gradient-to-br from-black via-[#050510] to-[#0a0a15]" />
			<div className="absolute inset-0 bg-grid-white/[0.02]" />

			{/* Animated Orbs */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" />

			<div className="relative z-10 flex flex-col items-center gap-6">
				<div className="relative">
					<div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
					<Loader2 className="h-16 w-16 text-cyan-500 animate-spin relative z-10" />
				</div>

				<div className="text-center space-y-2">
					<h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 tracking-tighter animate-pulse">
						INITIALIZING
					</h2>
					<p className="text-xs text-cyan-500/70 font-mono uppercase tracking-[0.3em]">
						Establishing Neural Link...
					</p>
				</div>
			</div>
		</div>
	)
}
