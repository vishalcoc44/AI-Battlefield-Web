import { Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface CalmScoreMeterProps {
   score: number
   className?: string
}

export function CalmScoreMeter({ score, className }: CalmScoreMeterProps) {
   const isLow = score < 50

   return (
      <div className={`flex items-center gap-4 w-full md:w-1/3 holographic-card p-3 rounded-2xl border-white/10 ${className || ''}`}>
         <div className={`p-2 rounded-xl transition-colors ${isLow ? 'bg-red-500/10 text-red-500' : 'bg-cyan-500/10 text-cyan-400'}`}>
            <Sparkles className="h-5 w-5" />
         </div>
         <div className="flex-1 space-y-1.5">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
               <span>Inner Peace Synchronization</span>
               <span className={`${isLow ? 'text-red-500' : 'text-cyan-400'}`}>{score}%</span>
            </div>
            <Progress
               value={score}
               className={`h-1.5 bg-black/50 shadow-inner border border-white/5 [&>div]:duration-1000 ${isLow ? '[&>div]:bg-red-500' : '[&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:to-blue-500'}`}
            />
         </div>
      </div>
   )
}