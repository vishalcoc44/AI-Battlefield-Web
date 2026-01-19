"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { TopNav } from "@/components/layout/TopNav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { dataService } from "@/lib/data-service"
import { toast } from "sonner"
import { sanitizeText, debounce, validateMessage } from "@/lib/utils"
import { GYM_CONSTANTS } from "@/lib/constants/gym"
import { MessageList } from "@/components/debate/MessageList"
import { VoteBar } from "@/components/debate/VoteBar"
import { Timer } from "@/components/debate/Timer"
import { ChatInput } from "@/components/debate/ChatInput"
import { AIPanel } from "@/components/debate/AIPanel"
import { ParticipantsList } from "@/components/debate/ParticipantsList"
import { RoomHeader } from "@/components/debate/RoomHeader"

type GymMessage = {
   id: string
   sender: {
      id: string
      name: string
      role: "user" | "ai" | "system"
      avatar?: string
   }
   text: string
   timestamp: string
   type: "message" | "system"
   metadata?: any
}

type AIAnalysis = {
   fallacies: { speaker: string; fallacy: string; explanation: string }[]
   opportunities: { suggestion: string; context: string }[]
}

export default function GroupDebateScreen() {
   const params = useParams()
   const router = useRouter()
   const [messages, setMessages] = useState<GymMessage[]>([])
   const [inputValue, setInputValue] = useState("")
   const [activeParticipants, setActiveParticipants] = useState(1)
   const [onlineUsers, setOnlineUsers] = useState<any[]>([])

   // New State for Features
   const [showAiPanel, setShowAiPanel] = useState(false)
   const [analyzing, setAnalyzing] = useState(false)
   const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
   const [voteStats, setVoteStats] = useState({ pro: 50, anti: 50 })
   const [timeLeft, setTimeLeft] = useState(GYM_CONSTANTS.TIMER.INITIAL_DURATION_SECONDS)
   const [activeTab, setActiveTab] = useState("debate")
   const scrollRef = useRef<HTMLDivElement>(null)

   const [currentUserId, setCurrentUserId] = useState<string | null>(null)

   const bottomRef = useRef<HTMLDivElement>(null)
   const lastTriggeredId = useRef<string | null>(null) // Prevent duplicate triggers for same msg

   // Auto-scroll to bottom
   useEffect(() => {
      // Use timeout to ensure DOM update
      setTimeout(() => {
         bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
   }, [messages])

   // Room State
   const [room, setRoom] = useState<any>(null)
   // voteStats and timeLeft are already declared above

   // Timer Sync
   useEffect(() => {
      if (!room?.ends_at) return

      const interval = setInterval(() => {
         const end = new Date(room.ends_at).getTime()
         const now = Date.now()
         const diff = Math.max(0, Math.floor((end - now) / 1000))
         setTimeLeft(diff)
      }, 1000)

      return () => clearInterval(interval)
   }, [room?.ends_at])

   // AI Trigger Logic (Event Driven) - Debounced to prevent race conditions
   const triggerAI = async (retryData?: { attempt: number }) => {
      if (!room || room.status === 'completed') return

      try {
         const res = await fetch('/api/ai/auto-reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomId: params.id, topic: room.topic })
         })

         if (res.ok) {
            const data = await res.json()
            if (data.status === 'skipped' && data.reason === 'cooldown') {
               // Retry after remaining time + buffer
               const wait = GYM_CONSTANTS.TIMER.AI_COOLDOWN_MS - (data.timeSince || 0) + 1000
               if (wait > 0 && (!retryData || retryData.attempt < 3)) {
                  console.log(`AI Cooldown. Retrying in ${wait / 1000}s...`)
                  setTimeout(() => triggerAI({ attempt: (retryData?.attempt || 0) + 1 }), wait)
               }
            }
         }
      } catch (e) {
         console.error("AI Trigger failed", e)
      }
   }

   // Debounced version to prevent multiple rapid triggers
   const debouncedTriggerAI = debounce(triggerAI, 1000)

   // Watch for MY new messages to trigger AI
   useEffect(() => {
      if (messages.length === 0) return
      const last = messages[messages.length - 1]

      // Only I trigger AI for MY messages
      // And ensure it's not an optimistic one (wait for real ID usually, but here ID is always string...)
      // Effective Trigger:
      // 1. Must be MY message
      // 2. Must be role='user'
      // Removing strict ID length check to ensure trigger fires even if ID swap is slow.
      // Server-side dedupe will handle 2nd trigger if needed.
      if (last.sender.id === currentUserId && last.sender.role === 'user') {
         // Prevent duplicate triggers for same message ID
         if (lastTriggeredId.current === last.id) return
         lastTriggeredId.current = last.id

         // Small delay to let DB settle, then trigger AI (debounced)
         setTimeout(() => debouncedTriggerAI(), GYM_CONSTANTS.TIMER.AI_TRIGGER_DELAY_MS)
      }
   }, [messages, currentUserId, room])

   // Data Fetching & Realtime
   useEffect(() => {
      let mounted = true
      const abortController = new AbortController()

      const init = async () => {
         try {
            const { data: { user } } = await supabase.auth.getUser()
            if (mounted && user) setCurrentUserId(user.id)

            // 1. Fetch Room Details
            const { data: roomData, error: roomError } = await supabase
               .from('gym_rooms')
               .select('*')
               .eq('id', params.id)
               .single()

            if (roomError) {
               if (roomError.code === 'PGRST116') { // Not found
                  toast.error("Debate room not found")
                  router.push('/gym')
                  return
               }
               throw roomError
            }

            if (mounted && roomData) {
               setRoom(roomData)
               updateVoteStats(roomData.vote_pro, roomData.vote_con)
            }

            // 2. Fetch initial messages
            const { data: messagesData, error: messagesError } = await supabase
               .from('messages')
               .select('*')
               .eq('session_id', params.id)
               .order('created_at', { ascending: true })
               .limit(GYM_CONSTANTS.LIMITS.INITIAL_MESSAGES)

            if (messagesError) {
               console.error("Failed to load messages:", messagesError)
               toast.error("Failed to load conversation history")
               // Continue with empty messages - don't fail completely
            }

            if (mounted && messagesData) {
               const mapped: GymMessage[] = messagesData.map((m: any) => ({
                  id: m.id,
                  sender: {
                     id: m.sender_id,
                     name: m.sender_id === (user?.id) ? 'You' : (m.sender_role === 'user' ? 'User' : 'System'),
                     role: m.sender_role,
                     avatar: m.sender_role === 'ai' ? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=ai` : `https://api.dicebear.com/9.x/dylan/svg?seed=${m.sender_id}`
                  },
                  text: m.content,
                  timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  type: m.sender_role === 'system' ? 'system' : 'message',
                  metadata: m.metadata // Pass through metadata
               }))
               setMessages(mapped)
            }
         } catch (error: any) {
            console.error("Failed to initialize debate room:", error)
            toast.error("Failed to load debate room. Please try again.")
            router.push('/gym')
         }
      }
      init()

      return () => {
         mounted = false
         abortController.abort()
      }

      // 3. Subscribe to Realtime
      const channel = supabase.channel(`room:${params.id}`)
         .on('postgres_changes', {
            event: 'INSERT', schema: 'public', table: 'messages', filter: `session_id=eq.${params.id}`
         }, (payload) => {
            const newMsg = payload.new
            console.log("Realtime INSERT:", newMsg) // Debug for user
            const formattedMsg: GymMessage = {
               id: newMsg.id.toString(),
               sender: {
                  id: newMsg.sender_id || 'ai-opponent', // Handle null sender_id
                  name: newMsg.sender_id === currentUserId ? 'You' :
                     (newMsg.sender_role === 'ai' ? 'Opponent' :
                        (newMsg.sender_role === 'user' ? 'User' : 'System')),
                  role: newMsg.sender_role as any,
                  avatar: newMsg.sender_role === 'ai' ? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=ai` : `https://api.dicebear.com/9.x/dylan/svg?seed=${newMsg.sender_id}`
               },
               text: newMsg.content,
               timestamp: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
               type: newMsg.sender_role === 'system' ? 'system' : 'message',
               metadata: newMsg.metadata
            }

            setMessages(prev => {
               // Deduplication logic: Check if we have a matching optimistic message
               // Match if: Same sender AND same text AND content was added recently (optimistic ID is timestamp-ish)
               const exists = prev.some(m => {
                  if (m.id === formattedMsg.id) return true;
                  // Check for optimistic duplicate
                  const isOptimistic = m.id.length > 10 && !isNaN(Number(m.id)); // Simple heuristic for our Date.now() IDs
                  return isOptimistic &&
                     m.sender.id === formattedMsg.sender.id &&
                     m.text === formattedMsg.text;
               });

               if (exists) {
                  // Replace the optimistic message with the real one to get the real ID
                  return prev.map(m => {
                     const isOptimistic = m.id.length > 10 && !isNaN(Number(m.id));
                     if (isOptimistic && m.sender.id === formattedMsg.sender.id && m.text === formattedMsg.text) {
                        return formattedMsg;
                     }
                     return m;
                  });
               }
               return [...prev, formattedMsg]
            })
         })
         .on('postgres_changes', {
            event: 'UPDATE', schema: 'public', table: 'gym_rooms', filter: `id=eq.${params.id}`
         }, (payload) => {
            const updatedRoom = payload.new
            setRoom(updatedRoom)
            updateVoteStats(updatedRoom.vote_pro, updatedRoom.vote_con)
         })
         .on('presence', { event: 'sync' }, () => {
            // ... existing presence logic
            const userState = channel.presenceState()
            const users = Object.values(userState).flat()
            setOnlineUsers(users)
            setActiveParticipants(users.length > 0 ? users.length : 1)
         })
         .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
               const { data: { user } } = await supabase.auth.getUser()
               if (user) {
                  await channel.track({
                     user_id: user.id,
                     online_at: new Date().toISOString()
                  })
               }
            }
         })

      return () => { supabase.removeChannel(channel) }
   }, [params.id])

   // Polling Fallback - Only run when realtime might be unreliable
   // This is kept as a safety net but runs less frequently to avoid conflicts
   useEffect(() => {
      if (!room || room.status === 'completed') return

      // Only poll every 30 seconds as a safety net for missed realtime events
      const sync = async () => {
         try {
            const { data, error } = await supabase
               .from('messages')
               .select('*')
               .eq('session_id', params.id)
               .order('created_at', { ascending: false })
               .limit(GYM_CONSTANTS.LIMITS.POLLING_BATCH_SIZE)

            if (error) {
               console.warn("Polling sync failed:", error)
               return
            }

            if (data && data.length > 0) {
               setMessages(prev => {
                  const existingIds = new Set(prev.map(p => p.id))
                  let hasNewMessages = false

                  const newMessages = data
                     .filter((newMsg: any) => !existingIds.has(newMsg.id))
                     .map((newMsg: any) => ({
                        id: newMsg.id,
                        sender: {
                           id: newMsg.sender_id || 'ai-opponent',
                           name: newMsg.sender_id === currentUserId ? 'You' :
                              (newMsg.sender_role === 'ai' ? 'Opponent' :
                                 (newMsg.sender_role === 'user' ? 'User' : 'System')),
                           role: newMsg.sender_role,
                           avatar: newMsg.sender_role === 'ai' ? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=ai` : `https://api.dicebear.com/9.x/dylan/svg?seed=${newMsg.sender_id}`
                        },
                        text: newMsg.content,
                        timestamp: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        type: (newMsg.sender_role === 'system' ? 'system' : 'message') as "system" | "message",
                        metadata: newMsg.metadata
                     }))

                  if (newMessages.length > 0) {
                     hasNewMessages = true
                  }

                  return hasNewMessages ? [...prev, ...newMessages] : prev
               })
            }
         } catch (error) {
            console.warn("Polling sync error:", error)
         }
      }

      // Poll every 30 seconds instead of 3 seconds to reduce load and conflicts
      const interval = setInterval(sync, GYM_CONSTANTS.TIMER.POLLING_INTERVAL_MS)
      return () => clearInterval(interval)
   }, [room, params.id, currentUserId])


   const updateVoteStats = (pro: number, con: number) => {
      const total = pro + con
      if (total === 0) {
         setVoteStats({ pro: GYM_CONSTANTS.LIMITS.VOTE_DEFAULT_PERCENTAGE, anti: GYM_CONSTANTS.LIMITS.VOTE_DEFAULT_PERCENTAGE })
      } else {
         setVoteStats({
            pro: Math.round((pro / total) * 100),
            anti: Math.round((con / total) * 100)
         })
      }
   }

   const handleVote = async (side: 'PRO' | 'CON') => {
      try {
         const response = await fetch(`/api/gym/${params.id}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ side })
         })

         if (!response.ok) {
            const error = await response.json()
            toast.error(error.error || 'Failed to cast vote')
         }
         // Vote counts will be updated via realtime subscription
      } catch (error) {
         console.error('Vote error:', error)
         toast.error('Failed to cast vote')
      }
   }

   const handleSend = useCallback(async () => {
      // Validate message
      const messageValidation = validateMessage(inputValue)
      if (!messageValidation.isValid) {
         toast.error(messageValidation.error)
         return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const isSpectator = activeTab === GYM_CONSTANTS.TABS.SPECTATOR

      // Optimistic Update
      const tempId = Date.now().toString()
      const newMsg: GymMessage = {
         id: tempId,
         sender: { id: user.id, name: "You", role: GYM_CONSTANTS.ROLES.USER, avatar: `https://api.dicebear.com/9.x/dylan/svg?seed=${user.id}` },
         text: inputValue,
         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
         type: "message",
         metadata: isSpectator ? { context: 'spectator' } : {}
      }

      setMessages(prev => [...prev, newMsg])
      setInputValue("")

      try {
         const { error } = await supabase.from('messages').insert({
            session_id: params.id,
            sender_id: user.id,
            sender_role: GYM_CONSTANTS.ROLES.USER,
            content: inputValue,
            metadata: isSpectator ? { context: 'spectator' } : {}
         })

         if (error) {
            console.error("Failed to send message:", error)
            toast.error("Failed to send message. Please try again.")
            // Remove optimistic message on failure
            setMessages(prev => prev.filter(m => m.id !== tempId))
            setInputValue(inputValue) // Restore input
            return
         }
      } catch (e) {
         console.error("Failed to send message:", e)
         toast.error("Failed to send message. Please check your connection.")
         // Remove optimistic message on failure
         setMessages(prev => prev.filter(m => m.id !== tempId))
         setInputValue(inputValue) // Restore input
         return
      }
   }, [session, inputValue, activeTab])

   // Debounced send to prevent rapid-fire messages
   const debouncedSend = useCallback(debounce(() => {
      if (inputValue.trim() && !loading) {
         handleSend()
      }
   }, 500), [inputValue, loading, handleSend])

   const handleLeave = () => {
      router.push('/gym')
   }

   const handleRaiseHand = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      try {
         await supabase.from('messages').insert({
            session_id: params.id,
            sender_id: user.id,
            sender_role: 'system',
            content: 'Raised their hand ✋'
         })
         toast.success("Hand raised!")
      } catch (error) {
         console.error("Failed to raise hand", error)
      }
   }

   const handleAIAnalysis = async () => {
      setShowAiPanel(true)
      setAnalyzing(true)

      try {
         // Fetch ALL messages for complete context, ignoring the UI limit
         const { data: allMessages } = await supabase
            .from('messages')
            .select('*')
            .eq('session_id', params.id)
            .order('created_at', { ascending: true })

         // Process messages for AI API format
         const formattedMessages = (allMessages || messages).map((m: any) => ({
            id: m.id || m.created_at, // Fallback ID
            sender: {
               name: m.sender_id === (supabase.auth.getUser() as any).data?.user?.id ? 'You' : (m.sender_role === 'user' ? 'User' : 'System'),
            },
            text: m.content,
            type: m.sender_role === 'system' ? 'system' : 'message',
            metadata: m.metadata
         }))

         const response = await fetch('/api/ai/analyze-debate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: formattedMessages, topic: room?.topic || "Current Debate" })
         })

         if (response.ok) {
            const data = await response.json()
            setAnalysis(data)
         } else {
            toast.error("Analysis failed")
         }
      } catch (error) {
         console.error("Analysis error", error)
      } finally {
         setAnalyzing(false)
      }
   }

   return (
      <div className="dark flex flex-col h-[100dvh] bg-black text-slate-200 font-sans overflow-hidden selection:bg-indigo-500/30">
         {/* Rich Animated Background */}
         <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_#0f172a_50%,_#020617_100%)] opacity-80" />
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-500/20 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[180px] opacity-60" />
            <div className="absolute top-[40%] left-[20%] w-[30vw] h-[30vw] bg-cyan-500/5 rounded-full blur-[100px]" />
         </div>

         {/* Top Navigation */}
         <div className="z-50 relative shrink-0">
            <TopNav />
         </div>

         <RoomHeader
            roomId={params.id as string}
            timeLeft={timeLeft}
            voteStats={voteStats}
            showAiPanel={showAiPanel}
            analyzing={analyzing}
            onAIAnalysis={handleAIAnalysis}
            onRaiseHand={handleRaiseHand}
            onLeave={handleLeave}
            onVote={handleVote}
         />

         {/* Main Content Area */}
         <div className="flex-1 flex overflow-hidden relative z-0">
            {/* Chat Stream Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-transparent relative min-h-0">
               <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                  <div className="pt-4 px-6 z-10 shrink-0 flex justify-center">
                     <TabsList className="bg-black/20 backdrop-blur-md border border-white/5 h-10 p-1 rounded-full flex gap-1 shadow-xl">
                        <TabsTrigger
                           value="debate"
                           className="rounded-full px-6 text-xs h-full data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-400 hover:text-slate-200 transition-all flex items-center gap-2"
                        >
                           <MessageSquare className="h-3.5 w-3.5" /> Debate Log
                        </TabsTrigger>
                        <TabsTrigger
                           value="spectator"
                           className="rounded-full px-6 text-xs h-full data-[state=active]:bg-white/10 data-[state=active]:text-green-400 text-slate-400 hover:text-slate-200 transition-all flex items-center gap-2"
                        >
                           <Users className="h-3.5 w-3.5" /> Spectators
                        </TabsTrigger>
                     </TabsList>
                  </div>

                  <TabsContent value="debate" className="flex-1 overflow-hidden data-[state=active]:flex flex-col mt-0 relative min-h-0">
                     <MessageList
                        messages={messages}
                        currentUserId={currentUserId}
                        scrollRef={scrollRef}
                        bottomRef={bottomRef}
                     />
                  </TabsContent>

                  <TabsContent value="spectator" className="flex-1 overflow-hidden data-[state=active]:flex flex-col mt-0 min-h-0">
                     <ScrollArea className="flex-1 h-full p-0">
                        <div className="space-y-4 max-w-4xl mx-auto p-4 md:p-6 pb-4">
                           {messages.some(m => m.metadata?.context === 'spectator') ? (
                              messages
                                 .filter(m => m.metadata?.context === 'spectator')
                                 .map((msg) => (
                                    <div key={msg.id} className={`group flex gap-3 ${msg.sender.name === 'You' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                       <Avatar className="h-6 w-6 mt-1 opacity-70">
                                          <AvatarImage src={msg.sender.avatar} />
                                          <AvatarFallback className="text-[10px] bg-slate-800 text-slate-400">{msg.sender.name[0]}</AvatarFallback>
                                       </Avatar>
                                       <div className={`flex flex-col max-w-[90%] ${msg.sender.name === 'You' ? 'items-end' : 'items-start'}`}>
                                          <div className="flex items-center gap-2 mb-1 px-1 opacity-50">
                                             <span className="text-[10px] font-bold text-slate-400">{msg.sender.name}</span>
                                          </div>
                                          <div className={`px-3 py-2 rounded-2xl text-xs shadow-sm border backdrop-blur-md ${msg.sender.name === 'You'
                                             ? 'bg-green-900/30 text-green-100 border-green-500/30'
                                             : 'bg-slate-900/40 text-slate-300 border-slate-800/50'
                                             }`}>
                                             {sanitizeText(msg.text)}
                                          </div>
                                       </div>
                                    </div>
                                 ))
                           ) : (
                              <div className="flex-1 flex items-center justify-center text-slate-600 flex-col gap-4 py-32">
                                 <div className="p-4 bg-slate-900/50 rounded-full border border-slate-800">
                                    <MessageSquare className="h-6 w-6 opacity-30" />
                                 </div>
                                 <p className="text-[10px] font-medium uppercase tracking-widest opacity-50">Spectator Comms Silent</p>
                              </div>
                           )}
                        </div>
                     </ScrollArea>
                  </TabsContent>
               </Tabs>

               <ChatInput
                  onSend={(message) => {
                     setInputValue(message)
                     handleSend()
                  }}
                  placeholder={activeTab === GYM_CONSTANTS.TABS.DEBATE ? "Construct your argument..." : "Chat with spectators..."}
                  isSpectator={activeTab === GYM_CONSTANTS.TABS.SPECTATOR}
               />
            </div>

            {/* Sidebar (Desktop Only) - AI Panel Overlay */}
            <div className={`
               hidden lg:flex w-80 border-l border-slate-800 bg-slate-950/50 backdrop-blur-xl transition-all duration-300 transform
               ${showAiPanel ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full z-50'}
               ${!showAiPanel && 'w-0 border-l-0 overflow-hidden'}
            `}>
               <AIPanel analysis={analysis} analyzing={analyzing} />
            </div>

            {/* Participants Sidebar */}
            {!showAiPanel && (
               <ParticipantsList onlineUsers={onlineUsers} activeParticipants={activeParticipants} />
            )}
         </div>
      </div>
   )
}
