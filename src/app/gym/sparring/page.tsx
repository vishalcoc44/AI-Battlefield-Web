"use client"

import { useState, useEffect, useRef } from "react"
import { TopNav } from "@/components/layout/TopNav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2, Sparkles, AlertCircle } from "lucide-react"
import { dataService } from "@/lib/data-service"
import { AIPersona } from "@/lib/types"
import { sanitizeText } from "@/lib/utils"

interface Message {
	id: string
	role: 'user' | 'assistant'
	content: string
}

export default function GymSparringPage() {
	const [personas, setPersonas] = useState<AIPersona[]>([])
	const [selectedPersona, setSelectedPersona] = useState<AIPersona | null>(null)
	const [messages, setMessages] = useState<Message[]>([])
	const [input, setInput] = useState("")
	const [loading, setLoading] = useState(false) // Sending message
	const [initializing, setInitializing] = useState(true) // Loading personas
	const scrollRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		async function loadPersonas() {
			try {
				const data = await dataService.getAIPersonas()
				setPersonas(data)
			} catch (e) {
				console.error("Failed to load personas", e)
			} finally {
				setInitializing(false)
			}
		}
		loadPersonas()
	}, [])

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	const [sessionId, setSessionId] = useState<string | null>(null)
	// ... existing state ...

	const handleSend = async () => {
		if (!input.trim() || !selectedPersona) return

		let currentSessionId = sessionId
		const newMessage = { role: 'user', content: input }
		const newHistory = [...messages, newMessage]

		const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input }
		setMessages(prev => [...prev, userMsg])
		setInput("")
		setLoading(true)

		try {
			// 1. Create Session if not exists
			if (!currentSessionId) {
				const session = await dataService.startSparringSession(selectedPersona.id, "General Sparring")
				if (session) {
					currentSessionId = session.id
					setSessionId(session.id)
				}
			}

			// 2. Persist User Message
			if (currentSessionId) {
				// In a real app, we might wait for the AI reply to save both, but saving user msg first is safer
				await dataService.updateSparringTranscript(currentSessionId, [...messages, userMsg])
			}

			// 3. Call AI
			const res = await fetch('/api/ai/sparring', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					messages: newHistory.map(m => ({ role: m.role, content: m.content })),
					persona: selectedPersona
				})
			})

			const data = await res.json()

			if (data.reply) {
				const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply }
				setMessages(prev => [...prev, aiMsg])

				// 4. Persist AI Message
				if (currentSessionId) {
					await dataService.updateSparringTranscript(currentSessionId, [...messages, userMsg, aiMsg])
				}
			} else {
				setMessages(prev => [...prev, { id: 'error', role: 'assistant', content: "[System]: AI Service unavailable." }])
			}

		} catch (error) {
			console.error("Chat error", error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-hidden selection:bg-purple-500/30">
			{/* Background */}
			<div className="fixed inset-0 z-0 pointer-events-none">
				<div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
				<div className="absolute inset-0 bg-grid-white/[0.02]" />
			</div>

			<div className="relative z-10 flex flex-col h-screen">
				<TopNav />

				<main className="flex-1 flex overflow-hidden">
					{/* Sidebar / Persona Selector */}
					<aside className="w-80 border-r border-white/10 bg-black/40 flex flex-col hidden md:flex">
						<div className="p-4 border-b border-white/10">
							<h2 className="text-xl font-bold flex items-center gap-2">
								<Bot className="text-purple-500" /> AI Opponents
							</h2>
						</div>
						<ScrollArea className="flex-1 p-4">
							{initializing ? (
								<div className="space-y-4">
									{[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded animate-pulse" />)}
								</div>
							) : (
								<div className="space-y-2">
									{personas.map(persona => (
										<button
											key={persona.id}
											onClick={() => { setSelectedPersona(persona); setMessages([]); setSessionId(null); }}
											className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all text-left ${selectedPersona?.id === persona.id ? 'bg-purple-900/30 border border-purple-500/50' : 'hover:bg-white/5 border border-transparent'}`}
										>
											<Avatar>
												<AvatarImage src={persona.avatarUrl} />
												<AvatarFallback>{persona.name[0]}</AvatarFallback>
											</Avatar>
											<div>
												<div className="font-bold text-sm">{persona.name}</div>
												<Badge variant="secondary" className="text-[10px] h-5">{persona.difficultyLevel}</Badge>
											</div>
										</button>
									))}
									{personas.length === 0 && (
										<div className="text-center p-6 space-y-4">
											<Bot className="h-8 w-8 text-purple-500/50 mx-auto" />
											<div className="text-sm text-muted-foreground">
												<div className="font-medium text-purple-400 mb-1">AI Opponents Unavailable</div>
												<div className="text-xs">Training personas are being deployed. Check back soon.</div>
											</div>
										</div>
									)}
								</div>
							)}
						</ScrollArea>
					</aside>

					{/* Chat Area */}
					<div className="flex-1 flex flex-col relative">
						{selectedPersona ? (
							<>
								<header className="h-16 border-b border-white/10 flex items-center px-6 bg-black/20 backdrop-blur">
									<div className="flex items-center gap-3">
										<Avatar className="h-10 w-10 ring-2 ring-purple-500/20">
											<AvatarImage src={selectedPersona.avatarUrl} />
											<AvatarFallback>{selectedPersona.name[0]}</AvatarFallback>
										</Avatar>
										<div>
											<h3 className="font-bold flex items-center gap-2">
												{selectedPersona.name}
												<Badge variant="outline" className="text-xs font-normal border-purple-500/30 text-purple-400">AI</Badge>
											</h3>
											<p className="text-xs text-muted-foreground">Sparring Session • {selectedPersona.difficultyLevel}</p>
										</div>
									</div>
								</header>

								<ScrollArea className="flex-1 p-6">
									<div className="max-w-3xl mx-auto space-y-6">
										{messages.length === 0 && (
											<div className="text-center py-20 opacity-50">
												<Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-500" />
												<p>Select a topic or just say hello to start debating.</p>
											</div>
										)}
										{messages.map((msg) => (
											<div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
												<Avatar className="h-8 w-8 mt-1">
													{msg.role === 'user' ? (
														<>
															<AvatarImage src="/avatars/01.png" />
															<AvatarFallback><User size={14} /></AvatarFallback>
														</>
													) : (
														<>
															<AvatarImage src={selectedPersona.avatarUrl} />
															<AvatarFallback><Bot size={14} /></AvatarFallback>
														</>
													)}
												</Avatar>
												<div className={`rounded-2xl p-4 max-w-[80%] text-sm leading-relaxed ${msg.role === 'user'
													? 'bg-purple-600 text-white rounded-tr-sm'
													: 'bg-white/10 text-slate-200 rounded-tl-sm border border-white/5'
													}`}>
													{sanitizeText(msg.content)}
												</div>
											</div>
										))}
										{loading && (
											<div className="flex gap-4">
												<Avatar className="h-8 w-8"><AvatarFallback><Bot size={14} /></AvatarFallback></Avatar>
												<div className="bg-white/5 rounded-2xl p-4 flex items-center gap-2">
													<Loader2 className="h-4 w-4 animate-spin text-purple-500" />
													<span className="text-xs text-muted-foreground">Thinking...</span>
												</div>
											</div>
										)}
										<div ref={scrollRef} />
									</div>
								</ScrollArea>

								<div className="p-4 border-t border-white/10 bg-black/40">
									<div className="max-w-3xl mx-auto relative">
										<Input
											value={input}
											onChange={(e) => setInput(e.target.value)}
											onKeyDown={(e) => e.key === 'Enter' && handleSend()}
											placeholder={`Debate with ${selectedPersona.name}...`}
											className="pr-12 bg-white/5 border-white/10 focus-visible:ring-purple-500"
										/>
										<Button
											size="icon"
											className="absolute right-1 top-1 h-8 w-8 bg-purple-600 hover:bg-purple-700"
											onClick={handleSend}
											disabled={loading || !input.trim()}
										>
											<Send className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</>
						) : (
							<div className="flex-1 flex items-center justify-center flex-col text-center p-8">
								<Bot className="h-24 w-24 text-white/10 mb-6" />
								<h2 className="text-2xl font-bold mb-2">Select an Opponent</h2>
								<p className="text-muted-foreground max-w-md">
									Choose an AI persona from the sidebar to begin your sparring session.
									Each opponent serves a different role in honing your skills.
								</p>
								<div className="mt-8 md:hidden w-full max-w-sm">
									{/* Mobile selector placeholder */}
									<p className="text-xs text-purple-400">Open menu to select persona on mobile</p>
								</div>
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	)
}
