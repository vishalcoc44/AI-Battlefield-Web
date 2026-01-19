import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, RotateCcw } from "lucide-react"
import { DOJO_CONSTANTS } from "@/lib/constants/dojo"

interface DojoInputProps {
   value: string
   onChange: (value: string) => useState
   onSend: () => void
   onReset: () => void
   disabled?: boolean
   isAnalyzing?: boolean
   isGenerating?: boolean
   maxLength?: number
   className?: string
}

export function DojoInput({
   value,
   onChange,
   onSend,
   onReset,
   disabled = false,
   isAnalyzing = false,
   isGenerating = false,
   maxLength = DOJO_CONSTANTS.MESSAGE_LIMITS.MAX_USER_MESSAGE_LENGTH,
   className
}: DojoInputProps) {
   const isProcessing = isAnalyzing || isGenerating
   const canSend = value.trim() && !isProcessing && !disabled

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault()
         if (canSend) onSend()
      }
      if (e.key === 'Escape') {
         onChange("")
      }
   }

   return (
      <div className={`p-6 md:p-8 relative z-20 ${className || ''}`}>
         <div className="max-w-5xl mx-auto space-y-4">
            {/* Action buttons */}
            <div className="flex justify-center gap-2">
               <Button
                  onClick={onReset}
                  variant="outline"
                  size="sm"
                  className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                  aria-label="Reset current training session"
               >
                  <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
                  Reset Session
               </Button>
            </div>

            <div className="relative group">
               <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-cyan-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="relative flex items-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl transition-colors group-hover:border-cyan-500/30">
                  <Input
                     placeholder="Respond without getting triggered..."
                     className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-6 h-12 text-base shadow-none text-white placeholder:text-zinc-600"
                     value={value}
                     onChange={(e) => onChange(e.target.value)}
                     onKeyDown={handleKeyDown}
                     disabled={disabled || isProcessing}
                     maxLength={maxLength}
                     aria-label="Your response to the dojo challenge"
                     aria-describedby="input-help character-count"
                  />
                  <Button
                     onClick={onSend}
                     size="icon"
                     className={`h-12 w-12 rounded-full transition-all duration-300 ${canSend ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 shadow-[0_0_15px_rgba(6,182,212,0.4)] text-black' : 'bg-white/5 text-zinc-600'}`}
                     disabled={!canSend}
                     aria-label={isProcessing ? "Processing your response" : "Send your response"}
                  >
                     <Send className="h-5 w-5" aria-hidden="true" />
                  </Button>
               </div>
            </div>

            <div className="text-center space-y-2">
               <p
                  id="input-help"
                  className="text-[10px] text-zinc-600 font-black uppercase tracking-widest animate-pulse"
               >
                  <span className="text-cyan-500">Objective:</span> Maintain emotional equilibrium. Do not engage in fallacy.
               </p>
               {value.length > maxLength * 0.8 && (
                  <p
                     id="character-count"
                     className="text-[10px] text-yellow-400"
                     aria-live="polite"
                  >
                     {value.length}/{maxLength} characters
                  </p>
               )}
               <p className="text-[8px] text-zinc-500">
                  Press Enter to send • Ctrl+Enter to send • Esc to clear • Ctrl+R to reset
               </p>
            </div>
         </div>
      </div>
   )
}