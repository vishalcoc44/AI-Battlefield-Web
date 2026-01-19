"use client"

import { IntelDossier } from "@/lib/data-service"
import { useMemo } from "react"

interface GlobalHeatmapProps {
	dossiers: IntelDossier[]
}

export function GlobalHeatmap({ dossiers }: GlobalHeatmapProps) {
	// Generate a simple dot grid to represent the world
	// In a real app we'd use a D3 geo projection or SVG map path
	// For this cyber aesthetic, a grid with "active" zones looks cool.

	const activePoints = useMemo(() => {
		return dossiers
			.filter(d => d.originCoordinates)
			.map(d => {
				// Approximate Mapping:
				// Lat: 90 (Top) to -90 (Bottom) -> 0 to 100%
				// Lng: -180 (Left) to 180 (Right) -> 0 to 100%
				const x = ((d.originCoordinates!.lng + 180) / 360) * 100
				const y = ((90 - d.originCoordinates!.lat) / 180) * 100
				return { x, y, city: d.originCoordinates!.city, title: d.title }
			})
	}, [dossiers])

	return (
		<div className="w-full aspect-[2/1] bg-black/40 rounded-xl border border-emerald-500/20 relative overflow-hidden group">
			<div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

			{/* World Map Silhouette (Simplified CSS/SVG representation or just the dots) */}
			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				<h3 className="text-[10rem] font-black text-white/5 tracking-tighter select-none">WORLD MAP</h3>
			</div>

			{/* Radar Sweep Effect */}
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent w-[5%] h-full animate-scan" style={{ animationDuration: '4s' }} />

			{/* Data Points */}
			{activePoints.length > 0 ? (
				activePoints.map((point, i) => (
					<div
						key={i}
						className="absolute w-3 h-3 -ml-1.5 -mt-1.5"
						style={{ left: `${point.x}%`, top: `${point.y}%` }}
					>
						<div className="relative group/point">
							<div className="absolute w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75" />
							<div className="relative w-3 h-3 bg-emerald-500 rounded-full border border-black shadow-[0_0_10px_rgba(16,185,129,0.8)] cursor-pointer" />

							{/* Tooltip */}
							<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-black/90 border border-emerald-500/50 p-2 rounded text-xs opacity-0 group-hover/point:opacity-100 transition-opacity pointer-events-none z-20">
								<p className="text-emerald-500 font-bold font-mono uppercase">{point.city}</p>
								<p className="text-white truncate">{point.title}</p>
							</div>
						</div>
					</div>
				))
			) : (
				/* Empty State */
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="text-center space-y-2">
						<div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center">
							<div className="w-3 h-3 bg-emerald-500/50 rounded-full"></div>
						</div>
						<p className="text-zinc-400 text-sm">No active intelligence nodes</p>
						<p className="text-zinc-500 text-xs">Global threats will appear here</p>
					</div>
				</div>
			)}

			<div className="absolute bottom-4 left-4 p-2 bg-black/80 border border-white/10 rounded backdrop-blur-sm">
				<p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
					Live Intel Feed // Active Nodes: {activePoints.length}
				</p>
			</div>
		</div>
	)
}
