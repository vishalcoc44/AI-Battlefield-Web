"use client"

import { TopNav } from "@/components/layout/TopNav"
import { Button } from "@/components/ui/button"
import { Database, Search, FileText, FolderLock } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function IntelPage() {
	return (
		<div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-emerald-500/30">
			{/* 🌌 Cosmic Background - Matrix Theme */}
			<div className="fixed inset-0 z-0 pointer-events-none">
				<div className="absolute inset-0 bg-gradient-to-br from-black via-[#051005] to-[#000]" />
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff0012_1px,transparent_1px),linear-gradient(to_bottom,#00ff0012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
				<div className="absolute top-[-20%] right-[20%] w-[60vw] h-[60vw] bg-emerald-600/10 rounded-full blur-[150px] animate-pulse mix-blend-screen" />
			</div>

			<div className="relative z-10 flex flex-col min-h-screen">
				<TopNav />
				<main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full flex flex-col items-center">

					<div className="text-center space-y-4 mb-12">
						<div className="inline-flex p-3 bg-emerald-500/10 rounded-xl text-emerald-500 mb-2 border border-emerald-500/20">
							<Database className="h-8 w-8" />
						</div>
						<h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
							INTEL OPS
						</h1>
						<p className="text-lg text-zinc-400 max-w-xl mx-auto">
							Classified dossiers. Steel-manned arguments. The source of truth.
						</p>
					</div>

					<div className="w-full max-w-2xl relative mb-16">
						<div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-20" />
						<div className="relative flex items-center bg-black/80 backdrop-blur-xl border border-white/10 rounded-full p-2 h-16 shadow-2xl">
							<Search className="ml-4 h-5 w-5 text-zinc-500" />
							<Input
								placeholder="Search archives for topics (e.g., 'UBI', 'AI Safety')..."
								className="bg-transparent border-0 focus-visible:ring-0 text-lg px-4 text-white placeholder:text-zinc-600 h-full"
							/>
							<Button className="rounded-full h-12 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
								Access
							</Button>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
						{[
							{ title: "Project: Technocracy", count: "14 Files", type: "Active" },
							{ title: "Op: Moral Realism", count: "8 Files", type: "Active" },
							{ title: "Archive: 2024 Election", count: "Locked", type: "Classified" },
						].map((file, i) => (
							<div key={i} className="glass p-6 rounded-xl border-l-4 border-l-emerald-500 hover:bg-white/5 transition-all cursor-pointer group">
								<div className="flex justify-between items-start mb-4">
									<FolderLock className="h-6 w-6 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
									<span className="text-[10px] font-mono text-emerald-500 uppercase border border-emerald-500/20 px-2 py-0.5 rounded bg-emerald-500/10">{file.type}</span>
								</div>
								<h3 className="font-bold text-lg text-white group-hover:underline decoration-emerald-500 underline-offset-4">{file.title}</h3>
								<p className="text-sm text-zinc-500 mt-2 font-mono flex items-center gap-2">
									<FileText className="h-3 w-3" /> {file.count}
								</p>
							</div>
						))}
					</div>

				</main>
			</div>
		</div>
	)
}
