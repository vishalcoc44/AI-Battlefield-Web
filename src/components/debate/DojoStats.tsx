"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Flame, Zap, Award } from "lucide-react"

interface DojoStatsProps {
	xp: number
	level: number
	streak: number
	rankTitle: string
}

export function DojoStats({ xp, level, streak, rankTitle }: DojoStatsProps) {
	// Determine progress to next level (simple formula: level * 1000)
	const xpForNextLevel = (level + 1) * 1000
	const xpProgress = (xp % 1000) / 10 // Assuming 1000 XP per level tiers for simplicity visualization

	return (
		<Card className="w-full bg-black/40 backdrop-blur-md border-white/10 text-white mb-6 shadow-2xl overflow-hidden relative">
			<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
				<CardTitle className="text-xl font-black flex items-center gap-2 uppercase tracking-wide italic">
					<Award className="h-5 w-5 text-yellow-500" />
					Dojo Status
				</CardTitle>
				<Badge variant="outline" className="border-yellow-500/30 text-yellow-500 bg-yellow-500/10 uppercase tracking-widest text-[10px] font-bold">
					{rankTitle || "Novice"}
				</Badge>
			</CardHeader>
			<CardContent className="relative z-10">
				<div className="grid grid-cols-3 gap-3 mb-6">
					<div className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/10">
						<span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Level</span>
						<span className="text-3xl font-black text-white leading-none">{level}</span>
					</div>
					<div className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/10">
						<span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">XP</span>
						<div className="flex items-center gap-1">
							<span className="text-xl font-bold text-white">{xp}</span>
						</div>
						<span className="text-[9px] text-zinc-600 font-mono">/ {xpForNextLevel}</span>
					</div>
					<div className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/10">
						<span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Streak</span>
						<div className="flex items-center gap-1 text-orange-500">
							<Flame className="h-5 w-5 fill-orange-500 animate-pulse" />
							<span className="text-xl font-bold">{streak}</span>
						</div>
					</div>
				</div>

				<div className="space-y-2">
					<div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
						<span>Next Rank Progress</span>
						<span>{Math.round(xpProgress)}%</span>
					</div>
					<Progress value={xpProgress} className="h-3 bg-black/50 border border-white/10 rounded-full" indicatorClassName="bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500" />
				</div>
			</CardContent>
		</Card>
	)
}
