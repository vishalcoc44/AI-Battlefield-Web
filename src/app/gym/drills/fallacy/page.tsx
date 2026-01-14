"use client"

import { useState } from "react"
import { TopNav } from "@/components/layout/TopNav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, ChevronRight, RotateCcw, Trophy } from "lucide-react"

const FALLACY_QUESTIONS = [
	{
		id: 1,
		statement: "You can't prove that ghosts don't exist, so they must exist.",
		options: ["Ad Hominem", "Appeal to Ignorance", "Straw Man", "Red Herring"],
		answer: "Appeal to Ignorance",
		explanation: "This fallacy asserts that a proposition is true because it has not yet been proven false."
	},
	{
		id: 2,
		statement: "My opponent suggests we lower taxes, but what he really wants is to leave the poor to starve.",
		options: ["Slippery Slope", "False Dilemma", "Straw Man", "Circular Reasoning"],
		answer: "Straw Man",
		explanation: "This misrepresents the opponent's argument to make it easier to attack."
	},
	{
		id: 3,
		statement: "If we allow students to use phones in class, soon they'll be bringing TVs and gaming consoles to school!",
		options: ["Slippery Slope", "Hasty Generalization", "Post Hoc", "Appeal to Authority"],
		answer: "Slippery Slope",
		explanation: "This assumes that a relatively small first step will inevitably lead to a chain of related events."
	},
	{
		id: 4,
		statement: "Senator Jones implies that we should not trust the new legislative bill because he was late to the meeting.",
		options: ["Ad Hominem", "Genetic Fallacy", "Tu Quoque", "Equivocation"],
		answer: "Ad Hominem",
		explanation: "This attacks the character of the person rather than the argument itself."
	},
	{
		id: 5,
		statement: "Either we ban all cars or we destroy the planet.",
		options: ["False Dilemma", "Begging the Question", "No True Scotsman", "Appeal to Emotion"],
		answer: "False Dilemma",
		explanation: "This presents only two options when more possibilities exist."
	}
]

export default function FallacyFinderPage() {
	const [currentQ, setCurrentQ] = useState(0)
	const [score, setScore] = useState(0)
	const [selected, setSelected] = useState<string | null>(null)
	const [isFinished, setIsFinished] = useState(false)

	const handleSelect = (option: string) => {
		if (selected) return
		setSelected(option)
		if (option === FALLACY_QUESTIONS[currentQ].answer) {
			setScore(s => s + 1)
		}
	}

	const handleNext = () => {
		if (currentQ < FALLACY_QUESTIONS.length - 1) {
			setCurrentQ(q => q + 1)
			setSelected(null)
		} else {
			setIsFinished(true)
		}
	}

	const handleRetry = () => {
		setCurrentQ(0)
		setScore(0)
		setSelected(null)
		setIsFinished(false)
	}

	return (
		<div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-purple-500/30">

			{/* 🌌 Cosmic Background */}
			<div className="fixed inset-0 z-0 pointer-events-none">
				<div className="absolute inset-0 bg-gradient-to-br from-black via-[#050510] to-[#0b102e]" />
				<div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
				<div className="bg-noise opacity-[0.15]" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse mix-blend-screen" />
			</div>

			<div className="relative z-10 flex flex-col min-h-screen">
				<TopNav />
				<main className="flex-1 p-4 md:p-8 max-w-2xl mx-auto w-full flex flex-col justify-center">

					{!isFinished ? (
						<Card className="w-full shadow-lg border-2 border-slate-100 dark:border-slate-800">
							<CardHeader>
								<div className="flex justify-between items-center mb-2">
									<Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
										Question {currentQ + 1}/{FALLACY_QUESTIONS.length}
									</Badge>
									<span className="text-sm font-bold text-muted-foreground">Score: {score}</span>
								</div>
								<Progress value={((currentQ) / FALLACY_QUESTIONS.length) * 100} className="h-2" />
								<CardTitle className="text-2xl mt-6">Identify the Fallacy</CardTitle>
								<CardDescription className="text-lg mt-2 font-medium text-slate-800 dark:text-slate-200">
									"{FALLACY_QUESTIONS[currentQ].statement}"
								</CardDescription>
							</CardHeader>
							<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
								{FALLACY_QUESTIONS[currentQ].options.map((option) => (
									<Button
										key={option}
										variant={
											selected === option
												? option === FALLACY_QUESTIONS[currentQ].answer ? "default" : "destructive"
												: selected && option === FALLACY_QUESTIONS[currentQ].answer ? "default" : "outline"
										}
										className={`h-14 text-base justify-start px-4 ${selected && option === FALLACY_QUESTIONS[currentQ].answer ? "bg-green-600 hover:bg-green-700 text-white border-green-600" : ""
											}`}
										onClick={() => handleSelect(option)}
										disabled={!!selected}
									>
										{option}
										{selected === option && option === FALLACY_QUESTIONS[currentQ].answer && <CheckCircle2 className="ml-auto h-5 w-5" />}
										{selected === option && option !== FALLACY_QUESTIONS[currentQ].answer && <AlertCircle className="ml-auto h-5 w-5" />}
									</Button>
								))}
							</CardContent>
							<CardFooter className="flex flex-col items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50 p-6">
								{selected && (
									<div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
										<div className={`p-4 rounded-lg border flex gap-3 ${selected === FALLACY_QUESTIONS[currentQ].answer
											? "bg-green-50 border-green-200 text-green-800"
											: "bg-red-50 border-red-200 text-red-800"
											}`}>
											{selected === FALLACY_QUESTIONS[currentQ].answer
												? <CheckCircle2 className="h-5 w-5 shrink-0" />
												: <AlertCircle className="h-5 w-5 shrink-0" />
											}
											<div>
												<p className="font-bold mb-1">
													{selected === FALLACY_QUESTIONS[currentQ].answer ? "Correct!" : `Incorrect. It's ${FALLACY_QUESTIONS[currentQ].answer}.`}
												</p>
												<p className="text-sm opacity-90">{FALLACY_QUESTIONS[currentQ].explanation}</p>
											</div>
										</div>
										<Button className="w-full" onClick={handleNext}>
											{currentQ < FALLACY_QUESTIONS.length - 1 ? (
												<>Next Question <ChevronRight className="ml-2 h-4 w-4" /></>
											) : (
												<>Finish Quiz <Trophy className="ml-2 h-4 w-4" /></>
											)}
										</Button>
									</div>
								)}
							</CardFooter>
						</Card>
					) : (
						<Card className="text-center p-8">
							<div className="flex justify-center mb-6">
								<div className="h-24 w-24 bg-yellow-100 rounded-full flex items-center justify-center">
									<Trophy className="h-12 w-12 text-yellow-600" />
								</div>
							</div>
							<CardTitle className="text-3xl mb-2">Quiz Complete!</CardTitle>
							<CardDescription className="text-lg mb-8">
								You scored {score} out of {FALLACY_QUESTIONS.length}
							</CardDescription>

							<div className="flex gap-4 justify-center">
								<Button variant="outline" onClick={handleRetry} className="gap-2">
									<RotateCcw className="h-4 w-4" /> Try Again
								</Button>
								<Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.history.back()}>
									Return to Gym
								</Button>
							</div>
						</Card>
					)}
				</main>
			</div>
		</div>
	)
}
