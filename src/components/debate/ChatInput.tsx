"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Mic } from "lucide-react"
import { GYM_CONSTANTS } from "@/lib/constants/gym"

interface ChatInputProps {
  onSend: (message: string) => void
  placeholder?: string
  disabled?: boolean
  isSpectator?: boolean
}

export function ChatInput({
  onSend,
  placeholder = "Construct your argument...",
  disabled = false,
  isSpectator = false
}: ChatInputProps) {
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  const argumentTemplates = [
    "I respectfully disagree...",
    "Data suggests...",
    "The premise is flawed...",
    "To build on that point..."
  ]

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="shrink-0 p-6 z-30 flex flex-col gap-3 pointer-events-none">
      {/* Argument Templates */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide pointer-events-auto justify-center opacity-80 hover:opacity-100 transition-opacity">
        {argumentTemplates.map((template) => (
          <div
            key={template}
            className="px-4 py-1.5 rounded-full bg-slate-900/60 border border-white/5 backdrop-blur-md hover:bg-white/10 text-[10px] font-medium cursor-pointer transition-all text-slate-300 whitespace-nowrap shadow-sm hover:scale-105 active:scale-95"
            onClick={() => setInput(prev => prev + template + " ")}
          >
            {template}
          </div>
        ))}
      </div>

      <div className="max-w-4xl w-full mx-auto flex gap-3 items-end pointer-events-auto">
        <div className="flex-1 relative group">
          <div className="absolute inset-0 bg-blue-500/5 rounded-2xl blur-xl group-focus-within:bg-blue-500/20 transition-all duration-500" />
          <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isSpectator ? "Chat with spectators..." : placeholder}
              className="flex-1 min-h-[56px] pl-6 pr-12 bg-transparent border-none text-slate-200 placeholder:text-slate-500 focus-visible:ring-0 text-md"
              disabled={disabled}
              aria-label={isSpectator ? "Type spectator message" : "Type your debate argument"}
              aria-describedby="message-hint"
            />
            <div id="message-hint" className="sr-only">
              Press Enter to send, Shift+Enter for new line
            </div>
            <Button
              size="icon"
              variant="ghost"
              className={`absolute right-2 top-2 h-10 w-10 text-slate-400 hover:text-white rounded-xl ${isRecording ? "text-red-500 animate-pulse bg-red-500/10" : "hover:bg-white/5"}`}
              onClick={() => setIsRecording(!isRecording)}
              aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
              aria-pressed={isRecording}
            >
              <Mic className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <Button
          onClick={handleSend}
          size="icon"
          className="h-[56px] w-[56px] shrink-0 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all"
          aria-label="Send message"
          disabled={disabled || !input.trim()}
        >
          <Send className="h-6 w-6" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}