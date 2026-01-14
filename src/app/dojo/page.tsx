"use client"
import { useState, useEffect, useRef } from "react"
import { TopNav } from "@/components/layout/TopNav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Send, Wind, AlertTriangle, Loader2, Sparkles, BrainCircuit, User, Terminal, Zap } from "lucide-react"
import { geminiModel } from "@/lib/gemini"
import { supabase } from "@/lib/supabase"

type DojoMessage = {
   id: number
   sender: "user" | "troll"
   text: string
   sentiment: "toxic" | "neutral" | "calm" | "triggered"
   analysis: string | null
}

export default function DojoPage() {
   const [calmScore, setCalmScore] = useState(85)
   const [messages, setMessages] = useState<DojoMessage[]>([
      {
         id: 1,
         sender: "troll",
         text: "LOL you actually believe that? You're obviously just brainwashed by the mainstream media. typical NPC behavior.",
         sentiment: "toxic",
         analysis: null
      }
   ])
   const [inputValue, setInputValue] = useState("")
   const [isTyping, setIsTyping] = useState(false)
   const messagesEndRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
   }, [messages, isTyping])

   const handleSend = async () => {
      if (!inputValue.trim()) return

      const userMsg: DojoMessage = {
         id: Date.now(),
         sender: "user",
         text: inputValue,
         sentiment: "neutral",
         analysis: "Analyzing..."
      }

      setMessages(prev => [...prev, userMsg])
      setInputValue("")
      setIsTyping(true)

      try {
         // 1. Analyze User Sentiment
         const analysisChat = geminiModel.startChat({
            generationConfig: { maxOutputTokens: 100 }
         })
         const analysisPrompt = `
        Analyze the following response to a toxic troll. 
        Determine if the response is "Calm/Rational" or "Triggered/Emotional".
        Give a brief 1 sentence reason.
        Response: "${inputValue}"
      `
         const analysisResult = await analysisChat.sendMessage(analysisPrompt)
         const analysisText = analysisResult.response.text()

         const isCalm = analysisText.toLowerCase().includes("calm") || analysisText.toLowerCase().includes("rational")

         // Update UI with analysis
         setMessages(prev => prev.map(m =>
            m.id === userMsg.id ? { ...m, analysis: analysisText, sentiment: isCalm ? "calm" : "triggered" } : m
         ))

         // Update Calm Score
         setCalmScore(prev => isCalm ? Math.min(100, prev + 5) : Math.max(0, prev - 10))

         // 2. Generate Troll Response
         const trollChat = geminiModel.startChat({
            history: messages.map(m => ({
               role: m.sender === 'user' ? 'user' : 'model',
               parts: [{ text: m.text }]
            }))
         })

         const trollPrompt = `
        You are an internet troll. Your goal is to make the user angry. 
        If they stayed calm, try a different angle (strawman, ad hominem, whataboutism).
        Keep it short and annoying.
      `
         const trollResult = await trollChat.sendMessage(trollPrompt)
         const trollResponse = trollResult.response.text()

         setMessages(prev => [...prev, {
            id: Date.now() + 1,
            sender: "troll",
            text: trollResponse,
            sentiment: "toxic",
            analysis: null
         }])

      } catch (error) {
         console.error("Gemini Error:", error)
         setMessages(prev => [...prev, {
            id: Date.now() + 1,
            sender: "troll",
            text: "You bore me. (API Error)",
            sentiment: "toxic",
            analysis: null
         }])
      } finally {
         setIsTyping(false)
      }
   }

   return (
      <div className="flex flex-col h-screen bg-black text-white relative overflow-hidden selection:bg-cyan-500/30 font-sans">
         {/* 🌌 Cosmic Background: Zen Void (Standardized) */}
         <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050510] to-[#0a0a15]" />
            <div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
            <div className="bg-noise opacity-[0.15]" />
            {/* Orbs - Cyan vs Red */}
            <div className="absolute top-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-cyan-600/10 rounded-full blur-[120px] animate-slow-spin" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-red-600/10 rounded-full blur-[150px] animate-slow-spin animation-delay-2000" />
         </div>

         <div className="relative z-10 w-full"><TopNav /></div>

         {/* Dojo Header */}
         <div className="relative z-20 bg-black/40 border-b border-white/5 backdrop-blur-xl p-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-cyan-500/10 rounded-2xl shadow-lg border border-cyan-500/20 group hover:border-cyan-500/50 transition-colors">
                  <Wind className="h-6 w-6 text-cyan-400" />
               </div>
               <div>
                  <div className="flex items-center gap-2">
                     <h3 className="font-black text-xl tracking-tight text-white">Zen Dojo</h3>
                     <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-wider border border-cyan-500/20">Simulation Active</span>
                  </div>
                  <p className="text-sm text-zinc-500 flex items-center gap-1.5 mt-0.5 font-medium">
                     Scenario <span className="text-zinc-700">::</span> <span className="font-bold text-zinc-300">The Internet Troll</span>
                  </p>
               </div>
            </div>

            {/* Calm Meter */}
            <div className="flex items-center gap-4 w-full md:w-1/3 holographic-card p-3 rounded-2xl border-white/10">
               <div className={`p-2 rounded-xl transition-colors ${calmScore < 50 ? 'bg-red-500/10 text-red-500' : 'bg-cyan-500/10 text-cyan-400'}`}>
                  <Sparkles className="h-5 w-5" />
               </div>
               <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                     <span>Inner Peace Synchronization</span>
                     <span className={`${calmScore < 50 ? 'text-red-500' : 'text-cyan-400'}`}>{calmScore}%</span>
                  </div>
                  <Progress value={calmScore} className={`h-1.5 bg-black/50 shadow-inner border border-white/5 [&>div]:duration-1000 ${calmScore < 50 ? '[&>div]:bg-red-500' : '[&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:to-blue-500'}`} />
               </div>
            </div>
         </div>

         {/* Chat Area */}
         <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full relative z-10 scroll-smooth custom-scrollbar">
            {messages.map((msg) => (
               <div key={msg.id} className={`flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className={`h-14 w-14 mt-1 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] ${msg.sender === 'user' ? 'ring-2 ring-cyan-500/20' : 'ring-2 ring-red-500/20'}`}>
                     <AvatarFallback className={msg.sender === 'user' ? 'bg-black text-cyan-500' : 'bg-black text-red-500'}>
                        {msg.sender === 'user' ? <User className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                     </AvatarFallback>
                  </Avatar>

                  <div className={`flex flex-col max-w-[85%] md:max-w-[60%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                     {msg.sender === 'troll' && (
                        <span className="text-[10px] font-black text-red-500 mb-2 flex items-center gap-1.5 uppercase tracking-widest ml-1 bg-red-500/5 px-2 py-0.5 rounded-full border border-red-500/10 self-start shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                           <Terminal className="h-3 w-3" /> Toxic Signal Detected
                        </span>
                     )}
                     <div className={`p-6 rounded-2xl backdrop-blur-md shadow-2xl text-base leading-relaxed border transition-all duration-300 hover:scale-[1.01] holographic-card ${msg.sender === 'user'
                        ? 'bg-gradient-to-br from-cyan-900/20 to-transparent border-cyan-500/30 text-cyan-50 rounded-tr-sm shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                        : 'bg-gradient-to-br from-red-900/20 to-transparent border-red-500/30 text-red-50 rounded-tl-sm shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                        }`}>
                        {msg.text}
                     </div>

                     {msg.sender === 'user' && msg.analysis && (
                        <div className={`text-[10px] mt-2 px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider inline-flex items-center gap-2 border backdrop-blur-md holographic-card ${msg.analysis.toLowerCase().includes('calm')
                           ? 'from-cyan-500/10 text-cyan-400 border-cyan-500/20'
                           : 'from-red-500/10 text-red-400 border-red-500/20'
                           }`}>
                           <BrainCircuit className="h-3 w-3" />
                           {msg.analysis}
                        </div>
                     )}
                  </div>
               </div>
            ))}
            {isTyping && (
               <div className="flex gap-6 animate-in fade-in pl-2">
                  <Avatar className="h-10 w-10 mt-1 border border-white/10 ring-2 ring-red-500/10">
                     <AvatarFallback className="bg-black text-red-500"><AlertTriangle className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div className="p-4 rounded-2xl rounded-tl-sm shadow-sm text-sm bg-white/5 border border-white/5 text-zinc-400 flex items-center gap-3 holographic-card">
                     <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                     <span className="font-mono text-xs uppercase tracking-widest">Opponent Generating Response...</span>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
         </div>

         {/* Input Area */}
         <div className="p-6 md:p-8 relative z-20">
            <div className="max-w-5xl mx-auto">
               <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-cyan-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl transition-colors group-hover:border-cyan-500/30">
                     <Input
                        placeholder="Respond without getting triggered..."
                        className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-6 h-12 text-base shadow-none text-white placeholder:text-zinc-600"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isTyping}
                     />
                     <Button
                        onClick={handleSend}
                        size="icon"
                        className={`h-12 w-12 rounded-full transition-all duration-300 ${inputValue.trim() ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 shadow-[0_0_15px_rgba(6,182,212,0.4)] text-black' : 'bg-white/5 text-zinc-600'}`}
                        disabled={isTyping || !inputValue.trim()}
                     >
                        <Send className="h-5 w-5" />
                     </Button>
                  </div>
               </div>
               <p className="text-[10px] text-center text-zinc-600 mt-4 font-black uppercase tracking-widest animate-pulse">
                  <span className="text-cyan-500">Objective:</span> Maintain emotional equilibrium. Do not engage in fallacy.
               </p>
            </div>
         </div>
      </div>
   )
}
