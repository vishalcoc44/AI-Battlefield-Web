"use client"

import { useState, useEffect, useRef } from "react"
import { TopNav } from "@/components/layout/TopNav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
   Send, Users, Mic, Hand, Timer,
   ThumbsUp, ThumbsDown, Smile, MessageSquare, BrainCircuit, AlertTriangle, Target, Radio
} from "lucide-react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

type GymMessage = {
   id: number
   sender: {
      name: string
      role: "user" | "ai" | "system"
      avatar?: string
   }
   text: string
   timestamp: string
   type: "message" | "system"
}

export default function GroupDebateScreen() {
   const params = useParams()
   const [messages, setMessages] = useState<GymMessage[]>([])
   const [inputValue, setInputValue] = useState("")
   const [activeParticipants, setActiveParticipants] = useState(12)

   // New State for Features
   const [showAiPanel, setShowAiPanel] = useState(false)
   const [voteStats, setVoteStats] = useState({ pro: 45, anti: 55 })
   const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
   const [isRecording, setIsRecording] = useState(false)
   const [activeTab, setActiveTab] = useState("debate")
   const scrollRef = useRef<HTMLDivElement>(null)

   // Auto-scroll to bottom of chat
   useEffect(() => {
      if (scrollRef.current) {
         scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
   }, [messages])

   // Timer Effect
   useEffect(() => {
      const timer = setInterval(() => {
         setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
      return () => clearInterval(timer)
   }, [])

   const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
   }

   useEffect(() => {
      // 1. Fetch initial messages
      const fetchMessages = async () => {
         const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('session_id', params.id)
            .order('created_at', { ascending: true })
            .limit(50)

         if (data) {
            const mapped: GymMessage[] = data.map((m: any) => ({
               id: m.id,
               sender: {
                  name: m.sender_role === 'user' ? 'User' : 'System',
                  role: m.sender_role,
                  avatar: "/avatars/01.png"
               },
               text: m.content,
               timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
               type: m.sender_role === 'system' ? 'system' : 'message'
            }))
            if (mapped.length > 0) setMessages(mapped)
         }
      }

      // 2. Subscribe to Realtime
      const channel = supabase
         .channel(`room:${params.id}`)
         .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `session_id=eq.${params.id}`
         }, (payload) => {
            const newMsg = payload.new
            const formattedMsg: GymMessage = {
               id: newMsg.id,
               sender: {
                  name: newMsg.sender_role === 'user' ? 'User' : 'System',
                  role: newMsg.sender_role as any,
                  avatar: "/avatars/01.png"
               },
               text: newMsg.content,
               timestamp: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
               type: newMsg.sender_role === 'system' ? 'system' : 'message'
            }
            setMessages(prev => [...prev, formattedMsg])
         })
         .subscribe()

      return () => { supabase.removeChannel(channel) }
   }, [params.id])

   const handleSend = async () => {
      if (!inputValue.trim()) return

      const { data: { user } } = await supabase.auth.getUser()

      // Optimistic Update
      const newMsg: GymMessage = {
         id: Date.now(),
         sender: { name: "You", role: "user", avatar: "/avatars/01.png" },
         text: inputValue,
         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
         type: "message"
      }

      setMessages(prev => [...prev, newMsg])
      setInputValue("")

      try {
         await supabase.from('messages').insert({
            session_id: params.id,
            sender_id: user?.id,
            sender_role: 'user',
            content: inputValue
         })
      } catch (e) {
         console.error("Failed to send message", e)
      }
   }

   return (
      <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden selection:bg-cyan-500/30">
         {/* 🌌 Cosmic Background */}
         <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050510] to-[#0a0a15]" />
            <div className="absolute inset-0 bg-grid-white/[0.04]" />
            <div className="absolute top-[-10%] left-[20%] w-[50vw] h-[50vw] bg-indigo-600/5 rounded-full blur-[120px] animate-pulse mix-blend-screen" />
         </div>

         {/* Top Navigation */}
         <div className="z-50 relative">
            <TopNav />
         </div>

         {/* 📟 Tactical HUD Header */}
         <div className="z-40 glass-card border-b border-white/5 sticky top-0 px-6 py-3 flex items-center justify-between shadow-2xl backdrop-blur-xl bg-black/40">
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-4">
                  <Badge variant="destructive" className="animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)] border-0 px-3 py-1 font-black tracking-widest uppercase bg-red-600">LIVE SIGNAL</Badge>
                  <h2 className="text-xl font-black tracking-tighter uppercase text-white shadow-black drop-shadow-lg">Room #{params.id}: Does Free Will Exist?</h2>
                  <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full text-xs font-mono font-bold border border-white/10 shadow-inner">
                     <Timer className="h-3 w-3 text-cyan-500" />
                     <span className={timeLeft < 60 ? "text-red-500 animate-pulse" : "text-zinc-300"}>{formatTime(timeLeft)}</span>
                  </div>
               </div>

               {/* Voting Bar */}
               <div className="flex items-center gap-3 w-full max-w-md mt-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 w-16 text-right">{voteStats.pro}% Pro</span>
                  <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden flex relative ring-1 ring-white/10">
                     <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all duration-500" style={{ width: `${voteStats.pro}%` }} />
                     <div className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] transition-all duration-500 flex-1" />
                     {/* Center divider */}
                     <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black z-10 -translate-x-1/2" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 w-16">{voteStats.anti}% Anti</span>
               </div>
            </div>

            <div className="flex gap-3">
               <Button
                  variant={showAiPanel ? "default" : "outline"}
                  size="sm"
                  className={`gap-2 hidden md:flex transition-all h-9 font-bold uppercase tracking-wider text-[10px] border-white/10 ${showAiPanel ? 'bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_20px_rgba(79,70,229,0.4)] border-0 text-white' : 'hover:bg-white/10 text-zinc-400 hover:text-white bg-black/50'}`}
                  onClick={() => setShowAiPanel(!showAiPanel)}
               >
                  <BrainCircuit className="h-4 w-4" /> Neuro-Link
               </Button>
               <Button variant="outline" size="sm" className="gap-2 hidden md:flex hover:bg-white/10 border-white/10 bg-black/50 text-zinc-400 hover:text-white h-9 font-bold uppercase tracking-wider text-[10px]">
                  <Hand className="h-4 w-4" /> Signal Intent
               </Button>
               <Button variant="destructive" size="sm" className="shadow-[0_0_20px_rgba(220,38,38,0.4)] bg-red-600 hover:bg-red-700 h-9 font-bold uppercase tracking-wider text-[10px]">Disconnect</Button>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="flex-1 flex overflow-hidden relative z-0">
            {/* Chat Stream Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
               <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                  <div className="border-b border-white/5 bg-black/40 backdrop-blur-md z-10">
                     <TabsList className="bg-transparent h-12 w-full justify-start rounded-none p-0 flex gap-0">
                        <TabsTrigger
                           value="debate"
                           className="data-[state=active]:bg-white/5 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 data-[state=active]:text-white rounded-none h-12 px-8 text-zinc-500 hover:text-zinc-300 transition-all font-mono uppercase tracking-widest text-xs font-bold"
                        >
                           Combat Log
                        </TabsTrigger>
                        <TabsTrigger
                           value="spectator"
                           className="data-[state=active]:bg-white/5 data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-white rounded-none h-12 px-8 text-zinc-500 hover:text-zinc-300 transition-all font-mono uppercase tracking-widest text-xs font-bold"
                        >
                           Spectator Comms
                        </TabsTrigger>
                     </TabsList>
                  </div>

                  <TabsContent value="debate" className="flex-1 overflow-hidden data-[state=active]:flex flex-col mt-0 relative">
                     <ScrollArea className="flex-1 p-0" ref={scrollRef}>
                        <div className="space-y-6 max-w-5xl mx-auto p-6 md:p-8 pb-4">
                           {messages.map((msg) => (
                              <div key={msg.id} className={`group flex gap-4 ${msg.sender.name === 'You' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                 <Avatar className={`h-10 w-10 mt-1 border-2 ${msg.sender.name === 'You' ? 'border-cyan-500' : 'border-white/10'} shadow-lg ring-2 ring-black bg-black`}>
                                    <AvatarImage src={msg.sender.avatar} />
                                    <AvatarFallback className="bg-zinc-900 text-xs font-bold text-zinc-500">{msg.sender.name[0]}</AvatarFallback>
                                 </Avatar>

                                 <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${msg.sender.name === 'You' ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 mb-1 px-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                       <span className={`text-[10px] uppercase tracking-widest font-black ${msg.sender.role === 'ai' ? 'text-indigo-400' : 'text-zinc-400'}`}>
                                          {msg.sender.name}
                                       </span>
                                       <span className="text-[10px] text-zinc-600 font-mono">{msg.timestamp}</span>
                                    </div>

                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-md border ${msg.type === 'system' ? 'bg-white/5 text-zinc-400 border-white/5 w-full text-center py-2 font-mono text-xs uppercase tracking-wider' :
                                       msg.sender.name === 'You'
                                          ? 'bg-cyan-600/20 border-cyan-500/30 text-white rounded-tr-sm shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                          : msg.sender.role === 'ai'
                                             ? 'bg-indigo-900/20 border-indigo-500/30 text-indigo-100 rounded-tl-sm shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                             : 'bg-zinc-900/60 border-white/10 text-zinc-200 rounded-tl-sm hover:bg-zinc-900/80 hover:border-white/20 transition-colors'
                                       }`}>
                                       {msg.text}
                                    </div>
                                 </div>
                              </div>
                           ))}
                           <div className="h-4" /> {/* Spacer */}
                        </div>
                     </ScrollArea>
                  </TabsContent>

                  <TabsContent value="spectator" className="flex-1 overflow-hidden data-[state=active]:flex flex-col mt-0">
                     <div className="flex-1 flex items-center justify-center text-zinc-500 flex-col gap-4 animate-in zoom-in-95 duration-500">
                        <div className="p-6 bg-white/5 rounded-full border border-white/5">
                           <MessageSquare className="h-10 w-10 opacity-40" />
                        </div>
                        <p className="font-mono text-xs uppercase tracking-widest">Signal silence detected.</p>
                     </div>
                  </TabsContent>
               </Tabs>

               {/* Input Bar */}
               <div className="p-4 bg-black/60 backdrop-blur-xl border-t border-white/10 space-y-3 z-20 relative">
                  {/* Neon Glow Line */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                  {/* 8. Argument Templates */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mask-fade-right">
                     {["I respectfully disagree...", "Data suggests...", "The premise is flawed...", "To build on that point..."].map(temp => (
                        <div
                           key={temp}
                           className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-95 text-zinc-400 hover:text-white whitespace-nowrap"
                           onClick={() => setInputValue(prev => prev + temp + " ")}
                        >
                           {temp}
                        </div>
                     ))}
                  </div>

                  <div className="max-w-5xl mx-auto flex gap-3 items-end">
                     {/* 3. Reactions */}
                     <div className="hidden md:flex gap-1 mb-1 mr-2 p-1.5 bg-white/5 rounded-full border border-white/5 backdrop-blur-md">
                        <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full text-blue-500 hover:bg-blue-500/20 hover:text-blue-400 transition-colors">
                           <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full text-red-500 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                           <ThumbsDown className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-400 transition-colors">
                           <Smile className="h-4 w-4" />
                        </Button>
                     </div>

                     <div className="flex-1 relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-2xl opacity-20 group-focus-within:opacity-70 transition duration-500 blur" />
                        <Input
                           placeholder={activeTab === 'debate' ? "Transmit argument..." : "Broadcast to spectators..."}
                           className="relative flex-1 bg-black border-white/10 focus:border-white/20 h-14 pl-6 pr-14 rounded-2xl transition-all text-white placeholder:text-zinc-600 text-base shadow-xl"
                           value={inputValue}
                           onChange={(e) => setInputValue(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        {/* 7. Voice Input */}
                        <Button
                           size="icon"
                           variant="ghost"
                           className={`absolute right-2 top-2 h-10 w-10 rounded-xl transition-all ${isRecording ? "text-red-500 animate-pulse bg-red-500/10" : "text-zinc-500 hover:text-white hover:bg-white/10"}`}
                           onClick={() => setIsRecording(!isRecording)}
                        >
                           <Mic className="h-5 w-5" />
                        </Button>
                     </div>

                     <Button onClick={handleSend} size="icon" className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0 border border-white/10">
                        <Send className="h-5 w-5 text-white" />
                     </Button>
                  </div>
               </div>
            </div>

            {/* Sidebar (Desktop Only) - AI Panel Overlay */}
            <div className={`
               hidden lg:flex w-80 border-l border-white/5 glass-card transition-all duration-300 transform 
               ${showAiPanel ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full z-50'}
               ${!showAiPanel && 'w-0 border-l-0 overflow-hidden'}
            `}>
               <div className="flex flex-col h-full w-80 bg-black/80 backdrop-blur-xl">
                  <div className="p-4 border-b border-white/5 font-black text-indigo-400 uppercase tracking-widest text-xs flex items-center gap-2 bg-indigo-500/5">
                     <BrainCircuit className="h-4 w-4" /> Neural Analysis
                  </div>
                  <ScrollArea className="flex-1 p-4 space-y-6">
                     <div className="space-y-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-indigo-500/20 shadow-lg relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                           <h4 className="text-xs font-black mb-2 flex items-center gap-2 text-white uppercase tracking-wider">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                              Fallacy Detect
                           </h4>
                           <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                              User_103's last vector contains a <span className="text-orange-400 font-bold">"Slippery Slope"</span> anomaly. Recommend counter-measure: Demonstrate non-causality.
                           </p>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-blue-500/20 shadow-lg relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                           <h4 className="text-xs font-black mb-2 flex items-center gap-2 text-white uppercase tracking-wider">
                              <Target className="h-3 w-3 text-blue-500" />
                              Strategic Gap
                           </h4>
                           <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                              "Pro" faction has neglected economic impact vectors. Pushing on cost implications offers high probability of advantage.
                           </p>
                        </div>

                        <div className="p-4 bg-black rounded-xl border border-white/10">
                           <h4 className="text-[10px] font-black text-zinc-500 mb-3 uppercase tracking-widest">Momentum Flux</h4>
                           <div className="h-24 flex items-end justify-between gap-1">
                              {[30, 45, 60, 40, 70, 50, 65, 55, 75, 80].map((h, i) => (
                                 <div
                                    key={i}
                                    className="w-full bg-indigo-900/40 rounded-t-sm hover:bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)] transition-colors"
                                    style={{ height: `${h}%`, transitionDelay: `${i * 50}ms` }}
                                 />
                              ))}
                           </div>
                        </div>
                     </div>
                  </ScrollArea>
               </div>
            </div>

            {/* Participants Sidebar (Shown when AI Panel Hidden) */}
            {!showAiPanel && (
               <div className="hidden lg:flex w-72 border-l border-white/5 bg-black/60 backdrop-blur-md flex-col">
                  <div className="p-4 border-b border-white/5 font-black text-[10px] uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                     <Users className="h-3 w-3" /> Active Operatives
                  </div>
                  <ScrollArea className="flex-1">
                     <div className="p-3 space-y-2">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                           <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group border border-transparent hover:border-white/5">
                              <Avatar className="h-8 w-8 border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                                 <AvatarImage src={`/avatars/0${i % 4 + 1}.png`} />
                                 <AvatarFallback>U{i}</AvatarFallback>
                              </Avatar>
                              <div className="overflow-hidden flex-1">
                                 <div className="flex justify-between items-center">
                                    <p className="text-xs font-bold truncate text-zinc-300 group-hover:text-white transition-colors">User_{100 + i}</p>
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                                 </div>
                                 <Badge variant="outline" className="text-[9px] h-4 px-1 font-mono border-white/5 bg-black text-zinc-600 mt-1 uppercase tracking-wider">Lvl {5 + i}</Badge>
                              </div>
                           </div>
                        ))}
                     </div>
                  </ScrollArea>
               </div>
            )}
         </div>
      </div>
   )
}
