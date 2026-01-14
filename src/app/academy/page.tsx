"use client"

import { TopNav } from "@/components/layout/TopNav"
import { Button } from "@/components/ui/button"
import { GraduationCap, BookOpen, Lightbulb, Lock } from "lucide-react"

export default function AcademyPage() {
	return (
		<div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-blue-500/30">
			{/* 🌌 Cosmic Background */}
			<div className="fixed inset-0 z-0 pointer-events-none">
				<div className="absolute inset-0 bg-gradient-to-br from-black via-[#051015] to-[#000]" />
				<div className="absolute inset-0 bg-grid-white/[0.04]" />
				<div className="absolute top-[-20%] left-[20%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[150px] animate-pulse mix-blend-screen" />
			</div>

			<div className="relative z-10 flex flex-col min-h-screen">
				<TopNav />
				<main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full flex flex-col justify-center items-center text-center space-y-8">

					<div className="p-4 rounded-full bg-blue-500/10 text-blue-400 mb-4 animate-float">
						<GraduationCap className="h-12 w-12" />
					</div>

					<h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-200">
						THE ACADEMY
					</h1>

					<p className="text-xl text-zinc-400 max-w-2xl font-light">
						Standardized cognitive training. Master the fundamentals of <span className="text-white font-bold">Logic</span>, <span className="text-white font-bold">Rhetoric</span>, and <span className="text-white font-bold">Game Theory</span>.
					</p>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
						{[
							{ title: "Logic 101", icon: Lightbulb, status: "Open" },
							{ title: "Advanced Rhetoric", icon: BookOpen, status: "Locked" },
							{ title: "Cognitive Defense", icon: Lock, status: "Locked" },
						].map((course, i) => (
							<div key={i} className="holographic-card p-8 rounded-2xl flex flex-col items-center gap-4 group hover:scale-105 transition-transform cursor-pointer">
								<course.icon className={`h-8 w-8 ${course.status === 'Locked' ? 'text-zinc-600' : 'text-blue-400'}`} />
								<h3 className="font-bold text-lg">{course.title}</h3>
								{course.status === 'Locked' && <span className="text-[10px] uppercase tracking-widest text-zinc-600 bg-white/5 px-2 py-1 rounded">Module Locked</span>}
							</div>
						))}
					</div>

					<Button className="mt-8 h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest rounded-full">
						Begin Orientation
					</Button>
				</main>
			</div>
		</div>
	)
}
