"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users } from "lucide-react"

interface OnlineUser {
  user_id: string
  online_at: string
}

interface ParticipantsListProps {
  onlineUsers: OnlineUser[]
  activeParticipants: number
}

export function ParticipantsList({ onlineUsers, activeParticipants }: ParticipantsListProps) {
  return (
    <div className="hidden lg:flex w-72 border-l border-slate-800 bg-slate-950/50 backdrop-blur-xl flex-col">
      <div className="p-4 border-b border-slate-800 font-bold text-xs text-slate-500 flex items-center gap-2">
        <Users className="h-3 w-3" />
        Active Participants ({activeParticipants})
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {onlineUsers.length > 0 ? onlineUsers.map((u, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors group">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/9.x/dylan/svg?seed=${u.user_id || i}`} />
                <AvatarFallback className="text-xs bg-slate-800 text-slate-400">U</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-medium truncate text-slate-300 group-hover:text-white transition-colors">
                    {u.user_id ? `User ${u.user_id.slice(0, 4)}` : "Anonymous"}
                  </p>
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                </div>
                <Badge variant="secondary" className="text-[9px] h-4 px-1 mt-0.5 font-normal text-slate-500 bg-slate-900">
                  Online
                </Badge>
              </div>
            </div>
          )) : (
            // Fallback Mock while waiting for others
            [1].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors group opacity-50">
                <div className="h-8 w-8 rounded-full bg-slate-800" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Waiting for peers...</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}