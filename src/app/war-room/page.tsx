"use client"

import { TopNav } from "@/components/layout/TopNav"
import { Button } from "@/components/ui/button"
import { Globe, Map, Activity, ShieldAlert } from "lucide-react"

export default function WarRoomPage() {
	return (
		<div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-red-500/30">
			{/* 🌌 Cosmic Background - Red Alert Theme */}
			<div className="fixed inset-0 z-0 pointer-events-none">
				<div className="absolute inset-0 bg-gradient-to-br from-black via-[#100505] to-[#000]" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent opacity-50" />
				<div className="absolute inset-0 bg-grid-white/[0.04]" />
			</div>

			<div className="relative z-10 flex flex-col min-h-screen">
				<TopNav />
				<main className="flex-1 p-6 md:p-12 max-w-[1600px] mx-auto w-full flex flex-col items-center">

					<div className="w-full flex justify-between items-end border-b border-white/10 pb-6 mb-12">
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-red-500 animate-pulse">
								<Activity className="h-4 w-4" />
								<span className="text-xs font-mono uppercase tracking-widest">Live Conflict Feed</span>
							</div>
							<h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
								WAR ROOM
							</h1>
						</div>
						<div className="hidden md:flex gap-4">
							<div className="text-right">
								<div className="text-xs text-zinc-500 uppercase font-bold">Active Fronts</div>
								<div className="text-2xl font-black text-white">142</div>
							</div>
							<div className="text-right">
								<div className="text-xs text-zinc-500 uppercase font-bold">Threat Level</div>
								<div className="text-2xl font-black text-red-500">CRITICAL</div>
							</div>
						</div>
					</div>

					{/* Map Placeholder */}
					<div className="w-full h-[50vh] holographic-card rounded-3xl border-white/10 relative overflow-hidden flex items-center justify-center group">
						<div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] bg-cover bg-center opacity-10 grayscale group-hover:opacity-20 transition-opacity" />
						<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

						<div className="text-center relative z-10 p-8 glass rounded-2xl border-red-500/30">
							<Globe className="h-16 w-16 text-red-500 mx-auto mb-4 animate-pulse" />
							<h3 className="text-2xl font-bold text-white mb-2">Global Heatmap Initializing...</h3>
							<p className="text-zinc-400 text-sm">Synchronizing with node clusters in EU, NA, and ASIA sectors.</p>
						</div>

						{/* Random pings */}
						<div className="absolute top-[30%] left-[20%] w-3 h-3 bg-red-500 rounded-full animate-ping" />
						<div className="absolute top-[40%] right-[30%] w-3 h-3 bg-red-500 rounded-full animate-ping delay-700" />
						<div className="absolute bottom-[30%] left-[45%] w-3 h-3 bg-orange-500 rounded-full animate-ping delay-300" />
					</div>

				</main>
			</div>
		</div>
	)
}
