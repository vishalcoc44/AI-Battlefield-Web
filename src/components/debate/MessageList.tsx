"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BrainCircuit, MessageSquare } from "lucide-react"
import { sanitizeText } from "@/lib/utils"
import { GYM_CONSTANTS } from "@/lib/constants/gym"

interface GymMessage {
  id: string
  sender: {
    id: string
    name: string
    role: 'user' | 'ai' | 'system'
    avatar?: string
  }
  text: string
  timestamp: string
  type: 'message' | 'system'
  metadata?: any
}

interface MessageListProps {
  messages: GymMessage[]
  currentUserId: string | null
  scrollRef: React.RefObject<HTMLDivElement>
  bottomRef: React.RefObject<HTMLDivElement>
}

export function MessageList({ messages, currentUserId, scrollRef, bottomRef }: MessageListProps) {
  const filteredMessages = messages.filter(m =>
    !m.metadata?.context || m.metadata.context !== GYM_CONSTANTS.TABS.SPECTATOR
  )

  return (
    <ScrollArea className="flex-1 h-full p-0" ref={scrollRef}>
      <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6 pb-4">
        {filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4 max-w-md">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" />
                <div className="relative bg-black/30 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                  <MessageSquare className="h-12 w-12 text-cyan-500/70 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-white mb-2">Debate Arena Ready</h4>
                  <p className="text-zinc-400 text-sm">
                    Send your opening argument to begin the intellectual battle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div key={msg.id} className={`group flex gap-4 ${msg.sender.name === 'You' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <Avatar className={`h-9 w-9 mt-1 border-2 shadow-lg ${msg.sender.name === 'You' ? 'border-blue-500/50' :
                msg.sender.role === 'ai' ? 'border-red-500/50' : 'border-slate-700/50'
              }`}>
                <AvatarImage src={msg.sender.avatar} />
                <AvatarFallback className="bg-slate-800 text-slate-400 text-xs">{msg.sender.name[0]}</AvatarFallback>
              </Avatar>

              <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${msg.sender.name === 'You' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${msg.sender.name === 'You' ? 'text-blue-400' :
                    msg.sender.role === 'ai' ? 'text-red-400 flex items-center gap-1' : 'text-slate-400'
                  }`}>
                    {msg.sender.role === 'ai' && <BrainCircuit className="h-3 w-3" />}
                    {msg.sender.name}
                  </span>
                  <span className="text-[9px] text-slate-600 font-mono">{msg.timestamp}</span>
                </div>

                <div className={`p-5 rounded-3xl text-sm leading-7 shadow-xl border backdrop-blur-sm transition-all duration-300 ${msg.type === 'system' ? 'bg-white/5 border-white/5 text-slate-400 w-full text-center py-2 font-medium text-xs italic rounded-full' :
                  msg.sender.name === 'You'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-sm border-blue-500/20 shadow-blue-500/10'
                    : msg.sender.role === 'ai'
                      ? 'bg-gradient-to-br from-slate-900 to-red-950/40 text-slate-200 rounded-tl-sm border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                      : 'bg-slate-900/80 border-slate-700/50 text-slate-200 rounded-tl-sm hover:border-slate-600'
                }`}>
                  {sanitizeText(msg.text)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} className="h-8" />
      </div>
    </ScrollArea>
  )
}