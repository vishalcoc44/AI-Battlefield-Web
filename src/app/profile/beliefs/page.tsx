"use client"

import { TopNav } from "@/components/layout/TopNav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, ArrowDownRight, Minus, RefreshCw, Activity } from "lucide-react"

const BELIEFS = [
   {
      topic: "Universal Basic Income",
      confidenceInitial: 20,
      confidenceCurrent: 85,
      status: "Reinforced",
      change: "+65%",
      trend: "up",
      description: "Initially skeptical about economic feasibility. Now convinced by automation arguments."
   },
   {
      topic: "Nuclear Energy",
      confidenceInitial: 40,
      confidenceCurrent: 75,
      status: "Shifted",
      change: "+35%",
      trend: "up",
      description: "Moved from 'dangerous' to 'necessary transitional source'."
   },
   {
      topic: "Remote Work Productivity",
      confidenceInitial: 90,
      confidenceCurrent: 45,
      status: "Shattered",
      change: "-45%",
      trend: "down",
      description: "Data on collaboration deficits challenged my view that 'office is dead'."
   }
]

export default function BeliefTrackerPage() {
   return (
      <div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-purple-500/30">

         {/* 🌌 Cosmic Background */}
         <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050510] to-[#0a0a15]" />
            <div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
            <div className="bg-noise opacity-[0.15]" />
            {/* Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px] animate-slow-spin" />
            <div className="absolute bottom-[-10%] right-[10%] w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[150px] animate-slow-spin animation-delay-2000" />
         </div>

         <div className="relative z-10 flex flex-col min-h-screen">
            <TopNav />
            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
               {/* ⚡ Header Section */}
               <div className="flex items-end justify-between border-b border-white/10 pb-6">
                  <div className="space-y-1">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-xs font-mono text-blue-500 tracking-widest uppercase">Cognitive Audit</span>
                     </div>
                     <h1 className="text-4xl font-black tracking-tighter text-white">Belief Tracker</h1>
                     <p className="text-zinc-400 font-light max-w-lg">Mapping the structural evolution of your worldview over time.</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 bg-black/40 border-white/10 hover:bg-white/5 hover:text-white transition-all rounded-full h-10 px-6 font-bold uppercase tracking-widest text-[10px]">
                     <RefreshCw className="h-3 w-3" /> Sync with Debates
                  </Button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                  <div className="holographic-card rounded-2xl p-6 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     <div className="relative z-10">
                        <div className="text-sm text-zinc-400 font-bold uppercase tracking-widest mb-2">Total Shifts</div>
                        <div className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">12</div>
                        <div className="mt-2 text-xs text-blue-400 font-mono">+3 this month</div>
                     </div>
                  </div>
                  <div className="holographic-card rounded-2xl p-6 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     <div className="relative z-10">
                        <div className="text-sm text-zinc-400 font-bold uppercase tracking-widest mb-2">Openness Lvl</div>
                        <div className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">V</div>
                        <div className="mt-2 text-xs text-orange-400 font-mono">Top 5% of users</div>
                     </div>
                  </div>
                  <div className="holographic-card rounded-2xl p-6 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     <div className="relative z-10">
                        <div className="text-sm text-zinc-400 font-bold uppercase tracking-widest mb-2">Reinforced</div>
                        <div className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">8</div>
                        <div className="mt-2 text-xs text-emerald-400 font-mono">Core axiomes</div>
                     </div>
                  </div>
                  <div className="holographic-card rounded-2xl p-6 flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-white/30 transition-colors">
                     <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="text-center space-y-2">
                        <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2 border border-white/10 group-hover:scale-110 transition-transform">
                           <RefreshCw className="h-5 w-5 text-white" />
                        </div>
                        <div className="font-bold text-white text-sm uppercase tracking-wider">Sync Analysis</div>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
                     <Activity className="h-6 w-6 text-zinc-500" />
                     Cognitive Ledger
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {BELIEFS.map((belief, i) => (
                        <div key={i} className="holographic-card rounded-2xl p-8 transition-all duration-300 hover:bg-white/5 hover:border-white/20 group relative overflow-hidden">
                           <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 transition-opacity group-hover:opacity-40 ${belief.status === 'Shattered' ? 'bg-red-500' :
                              belief.status === 'Reinforced' ? 'bg-emerald-500' : 'bg-orange-500'
                              }`} />

                           <div className="flex flex-col h-full justify-between gap-6 relative z-10">
                              <div className="space-y-4">
                                 <div className="flex justify-between items-start">
                                    <Badge variant="outline" className={`border-0 uppercase text-[10px] font-black tracking-widest px-3 py-1 rounded-full ${belief.status === 'Shattered' ? 'bg-red-500/10 text-red-500 ring-1 ring-red-500/20' :
                                       belief.status === 'Reinforced' ? 'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20' : 'bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20'
                                       }`}>
                                       {belief.status}
                                    </Badge>
                                    <div className={`flex items-center text-xs font-black ${belief.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                                       {belief.trend === 'up' ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                                       {belief.change}
                                    </div>
                                 </div>
                                 <h3 className="text-2xl font-black text-white leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">{belief.topic}</h3>
                                 <p className="text-sm text-zinc-400 leading-relaxed font-medium">{belief.description}</p>
                              </div>

                              <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                 <div>
                                    <div className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold mb-1">Initial Confidence</div>
                                    <Progress value={belief.confidenceInitial} className="h-1 bg-zinc-800 [&>div]:bg-zinc-600" />
                                    <div className="text-right text-xs font-mono text-zinc-500 mt-1">{belief.confidenceInitial}%</div>
                                 </div>
                                 <div>
                                    <div className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold mb-1">Current State</div>
                                    <Progress value={belief.confidenceCurrent} className={`h-1 bg-zinc-800 [&>div]:shadow-[0_0_10px] ${belief.trend === 'up' ? '[&>div]:bg-emerald-500 [&>div]:shadow-emerald-500/50' : '[&>div]:bg-red-500 [&>div]:shadow-red-500/50'}`} />
                                    <div className={`text-right text-xs font-mono mt-1 ${belief.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>{belief.confidenceCurrent}%</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </main>
         </div>
      </div>
   )
}
