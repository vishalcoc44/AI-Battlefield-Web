"use client"

import { useState, useEffect } from "react"
import { TopNav } from "@/components/layout/TopNav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Shield, AlertCircle, CheckCircle, Info, Loader2 } from "lucide-react"
import { geminiModel } from "@/lib/gemini"
import { supabase } from "@/lib/supabase"

type Message = {
  id: number
  sender: "user" | "ai"
  text: string
  steelman: number | null
  factCheck: string | null
}

export default function DebatePage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    // Initialize debate session
    async function initSession() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Create a new debate session if one doesn't exist for today/topic
      // For simplicity, we create a new one every visit or load existing active one
      // This is a simplified logic. Real app would have a debate list.
      const { data: activeDebate } = await supabase
        .from('debates')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      let currentSessionId = activeDebate?.id

      if (!currentSessionId) {
        const { data: newDebate, error } = await supabase
          .from('debates')
          .insert({
            user_id: user.id,
            persona_id: 'socrates',
            topic: 'General Debate'
          })
          .select()
          .single()
        
        if (newDebate) currentSessionId = newDebate.id
      }

      setSessionId(currentSessionId)

      // Load messages
      if (currentSessionId) {
        const { data: msgs } = await supabase
          .from('messages')
          .select('*')
          .eq('session_id', currentSessionId)
          .order('created_at', { ascending: true })

        if (msgs && msgs.length > 0) {
          setMessages(msgs.map(m => ({
            id: m.id,
            sender: m.sender_role as "user" | "ai",
            text: m.content,
            steelman: m.metadata?.steelman || null,
            factCheck: m.metadata?.factCheck || null
          })))
        } else {
          // Initial AI Message
          setMessages([{
            id: Date.now(),
            sender: "ai",
            text: "Welcome. I am Socrates. What truth do you seek to challenge today?",
            steelman: null,
            factCheck: null
          }])
        }
      }
    }

    initSession()
  }, [])

  const saveMessage = async (msg: Message, sessionId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('messages').insert({
      session_id: sessionId,
      sender_id: msg.sender === 'user' ? user?.id : null,
      sender_role: msg.sender,
      content: msg.text,
      metadata: {
        steelman: msg.steelman,
        factCheck: msg.factCheck
      }
    })
  }

  const handleSend = async () => {
    if (!inputValue.trim() || !sessionId) return

    // 1. Add user message
    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: inputValue,
      steelman: null,
      factCheck: "pending"
    }
    
    setMessages(prev => [...prev, userMsg])
    setInputValue("")
    setIsTyping(true)
    saveMessage(userMsg, sessionId)

    try {
      // 2. Mock Fact Check Delay
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === userMsg.id ? { ...m, factCheck: "verified" } : m
        ))
      }, 1500)

      // 3. Call Gemini
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }))

      const chat = geminiModel.startChat({
        history: history,
        generationConfig: { maxOutputTokens: 200 },
      });

      const result = await chat.sendMessage(userMsg.text);
      const response = await result.response;
      const text = response.text();

      // 4. Add AI Response
      const aiMsg: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: text,
        steelman: Math.floor(Math.random() * (100 - 70 + 1) + 70),
        factCheck: null
      }
      setMessages(prev => [...prev, aiMsg])
      saveMessage(aiMsg, sessionId)

    } catch (error) {
      console.error("Gemini Error:", error)
      const errorMsg: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: "I apologize, but I'm having trouble processing that thought right now.",
        steelman: 0,
        factCheck: null
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950">
      <TopNav />
      
      {/* Debate Header */}
      <div className="bg-card border-b p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center sticky top-16 z-40 shadow-sm">
         <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-red-500">
               <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <div>
               <h3 className="font-bold">Socrates</h3>
               <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" /> Steel-man Level: <span className="text-green-600 font-bold">92%</span>
               </div>
            </div>
         </div>

         {/* Stance Bar */}
         <div className="flex flex-col items-center w-full">
            <div className="flex justify-between w-full text-xs font-bold mb-1 px-1">
               <span className="text-red-600">AI Stance</span>
               <span className="text-blue-600">Your Stance</span>
            </div>
            <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden flex">
               <div className="h-full bg-red-500 transition-all duration-500" style={{ width: '45%' }} />
               <div className="h-full bg-slate-800 w-1 z-10" /> {/* Center Marker */}
               <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: '55%' }} />
            </div>
         </div>

         <div className="hidden md:flex justify-end">
            <Button variant="outline" size="sm" className="text-xs">End Debate</Button>
         </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-4xl mx-auto w-full">
         {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
               <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className={msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}>
                     {msg.sender === 'user' ? 'U' : 'AI'}
                  </AvatarFallback>
               </Avatar>
               
               <div className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl shadow-sm text-sm ${
                     msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-slate-800 border rounded-tl-none'
                  }`}>
                     {msg.text}
                  </div>
                  
                  <div className="flex gap-2 mt-1">
                     {msg.factCheck === 'verified' && (
                        <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200 gap-1">
                           <CheckCircle className="h-3 w-3" /> Fact Checked
                        </Badge>
                     )}
                     {msg.factCheck === 'pending' && (
                        <Badge variant="outline" className="text-[10px] bg-yellow-50 text-yellow-700 border-yellow-200 gap-1 animate-pulse">
                           <Info className="h-3 w-3" /> Verifying...
                        </Badge>
                     )}
                     {msg.sender === 'ai' && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                           Logic Score: {msg.steelman}%
                        </span>
                     )}
                  </div>
               </div>
            </div>
         ))}
         {isTyping && (
            <div className="flex gap-4">
               <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-red-600 text-white">AI</AvatarFallback>
               </Avatar>
               <div className="p-4 rounded-2xl shadow-sm text-sm bg-white dark:bg-slate-800 border rounded-tl-none flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
               </div>
            </div>
         )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t sticky bottom-0">
         <div className="max-w-4xl mx-auto flex gap-2">
            <Input 
               placeholder="Construct your argument..." 
               className="flex-1"
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               disabled={isTyping}
            />
            <Button onClick={handleSend} size="icon" className="bg-blue-600 hover:bg-blue-700" disabled={isTyping}>
               <Send className="h-4 w-4" />
            </Button>
         </div>
      </div>
    </div>
  )
}
