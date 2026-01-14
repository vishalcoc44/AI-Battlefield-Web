"use client"

import { useState, useEffect, useRef } from "react"
import { TopNav } from "@/components/layout/TopNav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Timer, Zap, Send, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react"

const DRILL_TOPICS = [
	{
		id: 1,
		argument: "Artificial Intelligence will inevitably lead to mass unemployment, so we must ban its development immediately.",
		context: "Tech Policy Debate"
	},
	{
		id: 2,
		argument: "Meat consumption is immoral because it causes suffering to sentient beings, therefore everyone should be legally required to be vegan.",
		context: "Ethics Debate"
	},
	{
		id: 3,
		argument: "Space exploration is a waste of money when we have so many problems on Earth to fix first.",
		context: "Resource Allocation Debate"
	}
]

export default function RapidRebuttalPage() {
	const [activeTopic, setActiveTopic] = useState(0)
	const [timeLeft, setTimeLeft] = useState(60)
	const [isActive, setIsActive] = useState(false)
	const [rebuttal, setRebuttal] = useState("")
	const [isFinished, setIsFinished] = useState(false)
	const [feedback, setFeedback] = useState<any>(null)

	const timerRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		if (isActive && timeLeft > 0) {
			timerRef.current = setInterval(() => {
				setTimeLeft((prev) => prev - 1)
			}, 1000)
		} else if (timeLeft === 0 && isActive) {
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
		setTimeLeft(60)
		setRebuttal("")
	}

	const handleSubmit = () => {
		if (timerRef.current) clearInterval(timerRef.current)
		setIsActive(false)
		setIsFinished(true)

		// Mock AI Analysis
		const wordCount = rebuttal.trim().split(/\s+/).length
		const score = Math.min(Math.round((wordCount / 50) * 100) + Math.random() * 20, 100) // Mock score logic

		setTimeout(() => {
			setFeedback({
				score: Math.min(score, 98),
				strengths: ["Addressed the core premise", "Good use of counter-examples"],
				improvements: ["Could be more concise", "Missed the economic angle"]
			})
		}, 1500)
	}

	const handleNext = () => {
		setActiveTopic(prev => (prev + 1) % DRILL_TOPICS.length)
		setIsFinished(false)
		setFeedback(null)
		setRebuttal("")
		setIsActive(false)
		setTimeLeft(60)
	}

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
							<p className="text-muted-foreground">Construct a convincing counter-argument before time runs out.</p>
						</div>

						{!isFinished && isActive && (
							<div className={`text-2xl font-mono font-bold flex items-center gap-2 ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-slate-700'}`}>
								<Timer className="h-6 w-6" /> {timeLeft}s
							</div>
						)}
					</div>

					<Card className="shadow-xl border-slate-200 dark:border-slate-800 overflow-hidden">
						{/* Progress Line */}
						{isActive && (
							<Progress value={(timeLeft / 60) * 100} className="h-1 rounded-none" />
						)}

						<CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b pb-6">
							<Badge variant="secondary" className="w-fit mb-2">{DRILL_TOPICS[activeTopic].context}</Badge>
							<CardTitle className="text-xl md:text-2xl leading-relaxed">
								"{DRILL_TOPICS[activeTopic].argument}"
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

									<div className="flex justify-center mt-8">
										<Button variant="outline" onClick={handleNext} size="lg" className="w-full md:w-auto">
											Next Scenario <RotateCcw className="ml-2 h-4 w-4" />
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
