"use client"

import { useState, useEffect, useRef } from "react"
import { TopNav } from "@/components/layout/TopNav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Timer, Zap, Send, RotateCcw, CheckCircle2, Loader2, Trophy } from "lucide-react"
import { dataService } from "@/lib/data-service"
import { GymDrill } from "@/lib/types"
import { sanitizeText } from "@/lib/utils"
import { GYM_CONSTANTS } from "@/lib/constants/gym"

export default function RapidRebuttalPage() {
	const [drills, setDrills] = useState<GymDrill[]>([])
	const [loading, setLoading] = useState(true)
	const [activeDrillIndex, setActiveDrillIndex] = useState(0)

	const [timeLeft, setTimeLeft] = useState(GYM_CONSTANTS.TIMER.DRILL_DURATION_SECONDS)
	const [isActive, setIsActive] = useState(false)
	const [rebuttal, setRebuttal] = useState("")
	const [isFinished, setIsFinished] = useState(false)
	const [feedback, setFeedback] = useState<any>(null)
	const [saving, setSaving] = useState(false)

	const timerRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		async function loadDrills() {
			setLoading(true)
			try {
				const data = await dataService.getDrills('rebuttal')
				if (data && data.length > 0) {
					setDrills(data)
				} else {
					setDrills([])
				}
			} catch (error) {
				console.error("Failed to load rebuttal drills", error)
			} finally {
				setLoading(false)
			}
		}
		loadDrills()
	}, [])

	useEffect(() => {
		if (isActive && timeLeft > 0) {
			timerRef.current = setInterval(() => {
				setTimeLeft((prev) => prev - 1)
			}, 1000)
		} else if (timeLeft <= 0 && isActive) {
			handleSubmit()
		}

		return () => {
			if (timerRef.current) clearInterval(timerRef.current)
		}
	}, [isActive, timeLeft])

	const startDrill = () => {
		setIsActive(true)
		setIsFinished(false)
		setFeedback(null)
		setTimeLeft(GYM_CONSTANTS.TIMER.DRILL_DURATION_SECONDS)
		setRebuttal("")
	}

	const handleSubmit = async () => {
		if (timerRef.current) clearInterval(timerRef.current)
		setIsActive(false)
		setIsFinished(true)

		// Mock AI Analysis (Phase 2 limitation: we don't have real AI endpoint for grading yet, or we use client-side heuristic)
		// For consistency with old code, we keep local heuristic, but SAVE it to DB.
		const wordCount = rebuttal.trim().split(/\s+/).length
		const rawScore = Math.min(Math.round((wordCount / 50) * 100) + Math.random() * 20, 100)
		const finalScore = Math.min(Math.round(rawScore), 100)

		const generatedFeedback = {
			score: finalScore,
			strengths: ["Addressed the core premise (Simulated)", "Good use of counter-examples (Simulated)"],
			improvements: ["Could be more concise", "Consider alternative viewpoints"]
		}

		setFeedback(generatedFeedback)

		// Persist via API
		if (drills[activeDrillIndex]) {
			setSaving(true)
			try {
				const response = await fetch('/api/drills/attempt', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						drillId: drills[activeDrillIndex].id,
						score: finalScore,
						feedback: { rebuttalText: rebuttal, ...generatedFeedback }
					})
				})

				if (!response.ok) {
					console.error('Failed to submit drill attempt')
				}
			} catch (e) {
				console.error("Failed to save attempt", e)
			} finally {
				setSaving(false)
			}
		}
	}

	const handleNext = () => {
		setActiveDrillIndex(prev => (prev + 1) % drills.length)
		setIsFinished(false)
		setFeedback(null)
		setRebuttal("")
		setIsActive(false)
		setTimeLeft(GYM_CONSTANTS.TIMER.DRILL_DURATION_SECONDS)
	}

	if (loading) return (
		<div className="dark min-h-screen flex items-center justify-center bg-black text-white">
			<Loader2 className="h-10 w-10 animate-spin text-yellow-600" />
		</div>
	)

	if (drills.length === 0) return (
		<div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-yellow-500/30">
			{/* 🌌 Cosmic Background */}
			<div className="fixed inset-0 z-0 pointer-events-none">
				<div className="absolute inset-0 bg-gradient-to-br from-black via-[#050510] to-[#0b102e]" />
				<div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
				<div className="bg-noise opacity-[0.15]" />
				<div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse mix-blend-screen" />
			</div>

			<div className="relative z-10 flex flex-col min-h-screen">
				<TopNav />
				<main className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full flex flex-col justify-center">
					<div className="text-center space-y-6">
						<div className="relative">
							<div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
							<div className="relative bg-black/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
								<Zap className="h-16 w-16 text-yellow-500 mx-auto mb-4 animate-pulse fill-yellow-500" />
								<h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
									Rapid Fire Chambers Empty
								</h3>
								<p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
									The rebuttal training algorithms are being upgraded. Sharpen your wit elsewhere for now.
								</p>
								<div className="flex gap-3 justify-center">
									<Button variant="outline" onClick={() => window.history.back()} className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
										Return to Gym
									</Button>
									<Button className="bg-yellow-600 hover:bg-yellow-700 text-white" onClick={() => window.location.reload()}>
										Check Again
									</Button>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	)

	const currentDrill = drills[activeDrillIndex]
	// Expecting content: { argument, context }
	const argument = currentDrill.content?.argument || "Argument missing"
	const context = currentDrill.content?.context || "General Debate"

	return (
		<div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-yellow-500/30">
			{/* 🌌 Cosmic Background */}
			<div className="fixed inset-0 z-0 pointer-events-none">
				<div className="absolute inset-0 bg-gradient-to-br from-black via-[#050510] to-[#0b102e]" />
				<div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
				<div className="bg-noise opacity-[0.15]" />
				<div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse mix-blend-screen" />
			</div>

			<div className="relative z-10 flex flex-col min-h-screen">
				<TopNav />
				<main className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full flex flex-col justify-center">
					<div className="flex justify-between items-center mb-6">
						<div>
							<h1 className="text-2xl font-bold flex items-center gap-2">
								<Zap className="h-6 w-6 text-yellow-500 fill-yellow-500" /> Rapid Rebuttal
							</h1>
							<p className="text-muted-foreground mr-2">Construct a convincing counter-argument before time runs out.</p>
						</div>

						{!isFinished && isActive && (
							<div className={`text-2xl font-mono font-bold flex items-center gap-2 ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-slate-700'}`}>
								<Timer className="h-6 w-6" /> {timeLeft}s
							</div>
						)}
					</div>

					<Card className="shadow-xl border-slate-200 dark:border-slate-800 overflow-hidden">
						{/* Progress Line */}
						{isActive && (
							<Progress value={(timeLeft / GYM_CONSTANTS.TIMER.DRILL_DURATION_SECONDS) * 100} className="h-1 rounded-none" />
						)}

						<CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b pb-6">
							<Badge variant="secondary" className="w-fit mb-2">{context}</Badge>
							<CardTitle className="text-xl md:text-2xl leading-relaxed">
								"{sanitizeText(argument)}"
							</CardTitle>
						</CardHeader>

						<CardContent className="p-6">
							{!isActive && !isFinished ? (
								<div className="text-center py-12 space-y-4">
									<div className="bg-yellow-100 dark:bg-yellow-900/20 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
										<Zap className="h-10 w-10 text-yellow-600" />
									</div>
									<h3 className="text-xl font-bold">Ready to Start?</h3>
									<p className="text-muted-foreground max-w-md mx-auto">
										You have 60 seconds to write a rebuttal. Focus on logic, clarity, and impact.
									</p>
									<Button size="lg" onClick={startDrill} className="bg-yellow-600 hover:bg-yellow-700 text-white mt-4">
										Start Timer
									</Button>
								</div>
							) : (
								<div className="space-y-4">
									<Textarea
										placeholder="Type your rebuttal here..."
										className="min-h-[200px] text-lg resize-none p-4"
										value={rebuttal}
										onChange={(e) => setRebuttal(e.target.value)}
										disabled={isFinished}
										autoFocus
									/>

									{!isFinished && (
										<div className="flex justify-between items-center text-sm text-muted-foreground">
											<span>{rebuttal.length} characters</span>
											<Button onClick={handleSubmit} disabled={rebuttal.length < 10}>
												Submit Rebuttal <Send className="ml-2 h-4 w-4" />
											</Button>
										</div>
									)}
								</div>
							)}

							{/* Feedback Section */}
							{isFinished && (
								<div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
									<h3 className="font-bold text-lg mb-4 flex items-center gap-2">
										<CheckCircle2 className="h-5 w-5 text-green-500" /> AI Feedback
									</h3>

									{feedback ? (
										<div className="grid gap-4 md:grid-cols-2">
											<div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
												<div className="text-center mb-4">
													<div className="text-4xl font-black text-blue-600">{feedback.score}</div>
													<div className="text-xs font-bold uppercase text-muted-foreground">Impact Score</div>
												</div>
												<Progress value={feedback.score} className="h-2" />
											</div>

											<div className="space-y-2 text-sm">
												<div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-100 dark:border-green-900">
													<span className="font-bold text-green-700 block mb-1">Strengths</span>
													<ul className="list-disc list-inside text-slate-700 dark:text-slate-300">
														{feedback.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
													</ul>
												</div>
												<div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-100 dark:border-orange-900">
													<span className="font-bold text-orange-700 block mb-1">Improvements</span>
													<ul className="list-disc list-inside text-slate-700 dark:text-slate-300">
														{feedback.improvements.map((s: string, i: number) => <li key={i}>{s}</li>)}
													</ul>
												</div>
											</div>
										</div>
									) : (
										<div className="h-32 flex items-center justify-center text-muted-foreground animate-pulse">
											Analyzing your argument...
										</div>
									)}

									{saving && <p className="text-center text-xs text-muted-foreground mt-2 animate-pulse">Saving results...</p>}

									<div className="flex justify-center mt-8 gap-4">
										<Button variant="outline" onClick={handleNext} size="lg">
											Next Scenario <RotateCcw className="ml-2 h-4 w-4" />
										</Button>
										<Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.history.back()}>
											Return to Gym
										</Button>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</main>
			</div>
		</div>
	)
}
