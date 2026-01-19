import { forwardRef } from "react"
import { Loader2 } from "lucide-react"
import { DojoMessage } from "@/types/dojo"
import { DojoMessageBubble } from "./DojoMessageBubble"
import { DojoEmptyState } from "./DojoEmptyState"

interface DojoMessageListProps {
   messages: DojoMessage[]
   scenario: string
   isAnalyzing?: boolean
   isGenerating?: boolean
   className?: string
}

export const DojoMessageList = forwardRef<HTMLDivElement, DojoMessageListProps>(
   ({ messages, scenario, isAnalyzing, isGenerating, className }, ref) => {
      return (
         <div
            ref={ref}
            className={`flex-1 overflow-y-auto p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full relative z-10 scroll-smooth custom-scrollbar ${className || ''}`}
            role="log"
            aria-label="Dojo conversation"
            aria-live="polite"
            aria-atomic="false"
         >
            {messages.length === 0 ? (
               <DojoEmptyState scenario={scenario} onStartNew={() => {}} />
            ) : (
               messages.map((message) => (
                  <DojoMessageBubble key={message.id} message={message} />
               ))
            )}

            {/* Loading states */}
            {isAnalyzing && (
               <div className="flex gap-6 animate-in fade-in flex-row-reverse pr-2">
                  <div className="h-10 w-10 mt-1 border border-white/10 ring-2 ring-cyan-500/10 rounded-full bg-black flex items-center justify-center">
                     <div className="bg-cyan-500 rounded-full p-1">
                        <div className="w-4 h-4 bg-black rounded-full animate-pulse" />
                     </div>
                  </div>
                  <div className="p-4 rounded-2xl rounded-tr-sm shadow-sm text-sm bg-white/5 border border-white/5 text-zinc-400 flex items-center gap-3 holographic-card">
                     <Loader2 className="h-4 w-4 animate-spin text-cyan-500" />
                     <span className="font-mono text-xs uppercase tracking-widest">Analyzing Response...</span>
                  </div>
               </div>
            )}

            {isGenerating && (
               <div className="flex gap-6 animate-in fade-in pl-2">
                  <div className="h-10 w-10 mt-1 border border-white/10 ring-2 ring-red-500/10 rounded-full bg-black flex items-center justify-center">
                     <div className="bg-red-500 rounded-full p-1">
                        <div className="w-4 h-4 bg-black rounded-full animate-pulse" />
                     </div>
                  </div>
                  <div className="p-4 rounded-2xl rounded-tl-sm shadow-sm text-sm bg-white/5 border border-white/5 text-zinc-400 flex items-center gap-3 holographic-card">
                     <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                     <span className="font-mono text-xs uppercase tracking-widest">Opponent Generating Response...</span>
                  </div>
               </div>
            )}

            <div className="h-4" />
         </div>
      )
   }
)

DojoMessageList.displayName = "DojoMessageList"