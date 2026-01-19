"use client"

import Link from "next/link"
import { Sword, Github, Twitter, Disc, Activity } from "lucide-react"
import { MagneticButton } from "./magnetic-button"

export function Footer() {
	return (
		<footer className="relative w-full bg-black pt-32 pb-12 overflow-hidden border-t border-white/5">
			{/* 🏙️ Massive Background Logotype */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none select-none overflow-hidden opacity-[0.03]">
				<h1 className="text-[15vw] font-black text-white whitespace-nowrap text-center leading-none tracking-tighter">BATTLEFIELD</h1>
			</div>

			<div className="container px-4 md:px-6 mx-auto relative z-10">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

					{/* Brand Column */}
					<div className="col-span-1 md:col-span-2 space-y-8">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
								<Sword className="h-5 w-5 text-white" />
							</div>
							<span className="text-xl font-black tracking-widest text-white uppercase">AI Battlefield</span>
						</div>
						<p className="text-zinc-500 max-w-sm leading-relaxed">
							The premier cognitive arena for human-AI dialectics.
							Train your logic, map your biases, and steel-man your worldview against procedural opponents.
						</p>

						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
								<div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
								<span className="text-emerald-500 text-xs font-mono font-bold uppercase tracking-wider">All Systems Normal</span>
							</div>
							<span className="text-zinc-600 text-xs font-mono">LATENCY: 12ms</span>
						</div>
					</div>

					{/* Links Column 1 */}
					<div className="space-y-6">
						<h4 className="text-white font-bold uppercase tracking-widest text-sm">Platform</h4>
						<ul className="space-y-4">
							{['Live Arena', 'Training Modules', 'Leaderboard', 'Manifesto'].map((item) => (
								<li key={item}>
									<Link href="#" className="text-zinc-500 hover:text-cyan-400 transition-colors text-sm hover:pl-2 duration-300 block">
										{item}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Links Column 2 */}
					<div className="space-y-6">
						<h4 className="text-white font-bold uppercase tracking-widest text-sm">Company</h4>
						<ul className="space-y-4">
							{['About', 'Research', 'Careers', 'Sponsorship'].map((item) => (
								<li key={item}>
									<Link href="#" className="text-zinc-500 hover:text-cyan-400 transition-colors text-sm hover:pl-2 duration-300 block">
										{item}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-8">
					<span className="text-zinc-600 text-xs font-mono">
						© 2024 AI BATTLEFIELD INC. // PROTOCOL V2.4
					</span>

					<div className="flex items-center gap-6">
						{[Github, Twitter, Disc].map((Icon, i) => (
							<MagneticButton key={i} strength={0.2}>
								<button className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black hover:scale-110 transition-all duration-300">
									<Icon className="w-4 h-4" />
								</button>
							</MagneticButton>
						))}
					</div>
				</div>
			</div>
		</footer>
	)
}
