import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BrainCircuit, User, AlertTriangle, Terminal } from "lucide-react"
import { DojoMessage } from "@/types/dojo"

interface DojoMessageBubbleProps {
   message: DojoMessage
}

export function DojoMessageBubble({ message }: DojoMessageBubbleProps) {
   const isUser = message.sender === 'user'

   return (
      <div
         className={`flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${isUser ? 'flex-row-reverse' : ''}`}
         role="article"
         aria-label={`${isUser ? 'Your' : 'Opponent'} message`}
      >
         <Avatar className={`h-14 w-14 mt-1 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] ${isUser ? 'ring-2 ring-cyan-500/20' : 'ring-2 ring-red-500/20'}`}>
            <AvatarFallback className={isUser ? 'bg-black text-cyan-500' : 'bg-black text-red-500'}>
               {isUser ? <User className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
            </AvatarFallback>
         </Avatar>

         <div className={`flex flex-col max-w-[85%] md:max-w-[60%] ${isUser ? 'items-end' : 'items-start'}`}>
            {!isUser && (
               <span
                  className="text-[10px] font-black text-red-500 mb-2 flex items-center gap-1.5 uppercase tracking-widest ml-1 bg-red-500/5 px-2 py-0.5 rounded-full border border-red-500/10 self-start shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                  role="status"
                  aria-label="Toxic content warning"
               >
                  <Terminal className="h-3 w-3" aria-hidden="true" /> Toxic Signal Detected
               </span>
            )}

            <div className={`p-6 rounded-2xl backdrop-blur-md shadow-2xl text-base leading-relaxed border transition-all duration-300 hover:scale-[1.01] holographic-card ${isUser
               ? 'bg-gradient-to-br from-cyan-900/20 to-transparent border-cyan-500/30 text-cyan-50 rounded-tr-sm shadow-[0_0_20px_rgba(6,182,212,0.1)]'
               : 'bg-gradient-to-br from-red-900/20 to-transparent border-red-500/30 text-red-50 rounded-tl-sm shadow-[0_0_20px_rgba(239,68,68,0.1)]'
               }`}>
               {message.text}
            </div>

            {isUser && message.analysis && (
               <div
                  className={`text-[10px] mt-2 px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider inline-flex items-center gap-2 border backdrop-blur-md holographic-card ${message.sentiment === 'calm'
                     ? 'from-cyan-500/10 text-cyan-400 border-cyan-500/20'
                     : 'from-red-500/10 text-red-400 border-red-500/20'
                     }`}
                  role="status"
                  aria-label={`Response analysis: ${message.sentiment}`}
               >
                  <BrainCircuit className="h-3 w-3" aria-hidden="true" />
                  {message.analysis}
               </div>
            )}
         </div>
      </div>
   )
}