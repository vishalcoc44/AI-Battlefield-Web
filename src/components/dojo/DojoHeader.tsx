import { Wind, Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { SessionHistory } from "./SessionHistory"
import { ScenarioSelector } from "./ScenarioSelector"
import { DojoSession, DojoScenario, DojoDifficulty } from "@/types/dojo"

interface DojoHeaderProps {
   session: DojoSession
   onStartNew?: (scenario: DojoScenario, difficulty: DojoDifficulty) => Promise<void>
}

export function DojoHeader({ session, onStartNew }: DojoHeaderProps) {
   return (
      <div className="relative z-20 bg-black/40 border-b border-white/5 backdrop-blur-xl p-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-2xl shadow-lg border border-cyan-500/20 group hover:border-cyan-500/50 transition-colors">
               <Wind className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
               <div className="flex items-center gap-2">
                  <h3 className="font-black text-xl tracking-tight text-white">Zen Dojo</h3>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-wider border border-cyan-500/20">
                     Simulation Active
                  </span>
               </div>
               <p className="text-sm text-zinc-500 flex items-center gap-1.5 mt-0.5 font-medium">
                  Scenario <span className="text-zinc-700">::</span> <span className="font-bold text-zinc-300 capitalize">
                     {session.scenario.replace('_', ' ')}
                  </span>
               </p>
            </div>
         </div>

         {/* Calm Meter & Controls */}
         <div className="flex items-center gap-2 w-full md:w-1/3">
            <div className="flex-1 holographic-card p-3 rounded-2xl border-white/10">
               <div className={`p-2 rounded-xl transition-colors mb-2 ${session.calm_score < 50 ? 'bg-red-500/10 text-red-500' : 'bg-cyan-500/10 text-cyan-400'}`}>
                  <Sparkles className="h-5 w-5" />
               </div>
               <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                     <span>Inner Peace Synchronization</span>
                     <span className={`${session.calm_score < 50 ? 'text-red-500' : 'text-cyan-400'}`}>{session.calm_score}%</span>
                  </div>
                  <Progress value={session.calm_score} className={`h-1.5 bg-black/50 shadow-inner border border-white/5 [&>div]:duration-1000 ${session.calm_score < 50 ? '[&>div]:bg-red-500' : '[&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:to-blue-500'}`} />
               </div>
            </div>

            <div className="flex flex-col gap-1">
               {onStartNew && (
                  <ScenarioSelector
                     currentScenario={session.scenario}
                     currentDifficulty={session.difficulty}
                     onStartNew={onStartNew}
                  />
               )}
               <SessionHistory />
            </div>
         </div>
      </div>
   )
}