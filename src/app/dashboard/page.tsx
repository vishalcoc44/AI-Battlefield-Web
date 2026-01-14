"use client"

import { useEffect, useState } from "react"
import { TopNav } from "@/components/layout/TopNav"
import { ArgumentStrengthMeter } from "@/components/dashboard/ArgumentStrengthMeter"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, BrainCircuit, Swords, ArrowRight, TrendingUp, Target, MessageSquare, Zap, Activity, Globe, Sparkles, Users } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { dataService, type UserStats, type RecentDebate, type UserPrediction, type GymRoom } from "@/lib/data-service"
import { supabase } from "@/lib/supabase"
import { CosmicBackground } from "@/components/ui/cosmic-background"

export default function HomeScreen() {
   const [stats, setStats] = useState<UserStats | null>(null)
   const [recentDebates, setRecentDebates] = useState<RecentDebate[]>([])
   const [userPredictions, setUserPredictions] = useState<UserPrediction[]>([])
   const [gymRooms, setGymRooms] = useState<GymRoom[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      async function loadData() {
         setLoading(true)
         const { data: { user } } = await supabase.auth.getUser()
         const userId = user?.id || 'mock'

         const [userStats, debates, predictions, rooms] = await Promise.all([
            dataService.getUserStats(userId),
            dataService.getRecentDebates(userId),
            dataService.getUserPredictions(userId),
            dataService.getActiveGymRooms()
         ])

         setStats(userStats)
         setRecentDebates(debates)
         setUserPredictions(predictions)
         setGymRooms(rooms)
         setLoading(false)
      }
      loadData()
   }, [])

   const totalGymParticipants = gymRooms.reduce((acc, room) => acc + room.activeParticipants, 0)

   return (
      <div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-purple-500/30">

         {/* 🌌 Cosmic Background */}
         <CosmicBackground theme="indigo" />

         <div className="relative z-10">
            <TopNav />

            <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full space-y-10">

               {/* ⚡ HUD Header */}
               <section className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700">
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-mono text-green-500 tracking-widest uppercase">System Online</span>
                     </div>
                     <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                        COMMAND CENTER
                     </h1>
                     <p className="text-zinc-400 font-light tracking-wide max-w-lg">
                        Welcome back, Strategist. Neural synchronization at 98%. Ready for cognitive deployment.
                     </p>
                  </div>

                  {/* Player Level Card (Holographic) */}
                  <div className="relative group perspective-1000 w-full lg:w-auto">
                     <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     <div className="relative holographic-card rounded-2xl p-6 flex items-center gap-6 min-w-[350px]">
                        <div className="relative">
                           <div className="absolute inset-0 bg-cyan-500 blur-md opacity-50 animate-pulse" />
                           <div className="relative h-16 w-16 rounded-xl bg-black border border-cyan-500/50 flex items-center justify-center">
                              <Trophy className="h-8 w-8 text-cyan-400" />
                           </div>
                        </div>
                        <div className="flex-1 space-y-3">
                           <div className="flex justify-between items-end">
                              <span className="text-2xl font-bold font-mono">Lvl {stats?.level || 1}</span>
                              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Strategist</span>
                           </div>
                           <div className="space-y-1">
                              <div className="flex justify-between text-[10px] text-zinc-500 font-mono uppercase">
                                 <span>XP Progress</span>
                                 <span>{stats?.xp || 0} / 3000</span>
                              </div>
                              <Progress value={((stats?.xp || 0) / 3000) * 100} className="h-1.5 bg-zinc-900 border border-zinc-800 [&>div]:bg-cyan-500 [&>div]:shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                           </div>
                        </div>
                     </div>
                  </div>
               </section>

               {/* 📊 Bento Grid Layout */}
               <section className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">

                  {/* Stats (Views Changed) */}
                  <div className="md:col-span-3 holographic-card rounded-2xl p-6 flex flex-col justify-between group hover:border-violet-500/30 transition-colors">
                     <div className="flex justify-between items-start">
                        <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                           <BrainCircuit className="h-6 w-6" />
                        </div>
                        <Badge variant="outline" className="border-violet-500/30 text-violet-300 bg-violet-500/5 text-[10px] uppercase">
                           Insight
                        </Badge>
                     </div>
                     <div>
                        <div className="text-4xl font-black text-white mb-1 group-hover:text-violet-200 transition-colors">{stats?.viewsChanged || 0}</div>
                        <div className="text-sm text-zinc-500 font-medium">Views Shifted</div>
                     </div>
                  </div>

                  {/* Stats (Debates Won) */}
                  <div className="md:col-span-3 holographic-card rounded-2xl p-6 flex flex-col justify-between group hover:border-orange-500/30 transition-colors">
                     <div className="flex justify-between items-start">
                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                           <Swords className="h-6 w-6" />
                        </div>
                        <Badge variant="outline" className="border-orange-500/30 text-orange-300 bg-orange-500/5 text-[10px] uppercase">
                           Victory
                        </Badge>
                     </div>
                     <div>
                        <div className="text-4xl font-black text-white mb-1 group-hover:text-orange-200 transition-colors">{stats?.debatesWon || 0}</div>
                        <div className="text-sm text-zinc-500 font-medium">Debates Won</div>
                     </div>
                  </div>

                  {/* 🚀 Quick Action: Debate Gym (Large) */}
                  <div className="md:col-span-6 row-span-2 holographic-card rounded-2xl p-0 overflow-hidden group relative">
                     <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-black opacity-80 z-0" />
                     <div className="absolute inset-0 bg-[url('/gym-bg.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />

                     <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                           <div className="space-y-4 max-w-xs">
                              <div className="flex items-center gap-2 text-purple-400">
                                 <Users className="h-5 w-5" />
                                 <span className="text-xs font-bold uppercase tracking-widest">Multiplayer Arena</span>
                              </div>
                              <h3 className="text-3xl font-black text-white leading-none uppercase">
                                 Debate<br />Gym <span className="text-purple-500">Live</span>
                              </h3>
                              <p className="text-zinc-400 text-sm leading-relaxed">
                                 Join {totalGymParticipants} active strategists in real-time dialectic combat. Prove your logic in the ring.
                              </p>
                           </div>
                           <div className="flex -space-x-3">
                              {[1, 2, 3].map(i => (
                                 <Avatar key={i} className="h-10 w-10 border-2 border-black bg-zinc-800 flex items-center justify-center">
                                    <AvatarImage src={`/avatars/0${i}.png`} className="rounded-full" />
                                 </Avatar>
                              ))}
                           </div>
                        </div>

                        <Link href="/gym" className="w-full">
                           <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0 font-bold h-12 uppercase tracking-wider shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all">
                              Enter the Ring <ArrowRight className="ml-2 h-4 w-4" />
                           </Button>
                        </Link>
                     </div>
                  </div>

                  {/* Quick Action: Zen Dojo */}
                  <div className="md:col-span-3 holographic-card rounded-2xl p-6 flex flex-col justify-between group hover:border-emerald-500/30 transition-colors relative overflow-hidden">
                     <div className="absolute -right-4 -top-4 bg-emerald-500/10 w-32 h-32 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
                     <div>
                        <div className="flex items-center gap-2 mb-2 text-emerald-400">
                           <Zap className="h-5 w-5" />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Emotional Control</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Zen Dojo</h3>
                        <p className="text-xs text-zinc-500">Current: "The Bad Faith Debater"</p>
                     </div>
                     <Link href="/dojo" className="mt-4">
                        <Button variant="outline" className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300">
                           Train Focus
                        </Button>
                     </Link>
                  </div>

                  {/* Quick Action: Prediction Lab */}
                  <div className="md:col-span-3 holographic-card rounded-2xl p-6 flex flex-col justify-between group hover:border-blue-500/30 transition-colors relative overflow-hidden">
                     <div className="absolute -right-4 -top-4 bg-blue-500/10 w-32 h-32 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
                     <div>
                        <div className="flex items-center gap-2 mb-2 text-blue-400">
                           <Target className="h-5 w-5" />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Forecasting</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Prediction Lab</h3>
                        <p className="text-xs text-zinc-500 line-clamp-1">"Will AGI surpass human intelligence?"</p>
                     </div>
                     <Link href="/prediction" className="mt-4">
                        <Button variant="outline" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300">
                           Place Bets
                        </Button>
                     </Link>
                  </div>

                  {/* Chart Area */}
                  <div className="md:col-span-8 holographic-card rounded-2xl p-6 min-h-[300px]">
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                              <Activity className="h-5 w-5" />
                           </div>
                           <h3 className="text-lg font-bold text-white">Argument Strength</h3>
                        </div>
                        <div className="flex gap-2">
                           <Badge variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white cursor-pointer transition-colors">7 Days</Badge>
                           <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 cursor-pointer">30 Days</Badge>
                        </div>
                     </div>
                     {/* Embedded Chart Component with props for dark mode customization if needed, 
                    assuming ArgumentStrengthMeter handles its own internal styling nicely mostly */}
                     <div className="h-[250px] w-full">
                        <ArgumentStrengthMeter />
                     </div>
                  </div>

                  {/* Recent Activity Feed */}
                  <div className="md:col-span-4 holographic-card rounded-2xl p-6 min-h-[300px] flex flex-col">
                     <Tabs defaultValue="debates" className="w-full h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                           <h3 className="text-lg font-bold text-white">Live Feed</h3>
                           <TabsList className="bg-zinc-900 border border-zinc-800">
                              <TabsTrigger value="debates" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">Debates</TabsTrigger>
                              <TabsTrigger value="forecasts" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">Bets</TabsTrigger>
                           </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                           <TabsContent value="debates" className="mt-0 space-y-4">
                              {recentDebates.length > 0 ? (
                                 recentDebates.map((debate) => (
                                    <div key={debate.id} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-pointer">
                                       <div className="mt-1 p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-white group-hover:border-zinc-700 transition-all">
                                          <MessageSquare className="h-4 w-4" />
                                       </div>
                                       <div className="flex-1 min-w-0">
                                          <div className="flex justify-between items-start mb-1">
                                             <h4 className="font-bold text-sm text-zinc-200 truncate pr-2 group-hover:text-white transition-colors">{debate.topic}</h4>
                                             <Badge variant="outline" className={`text-[9px] border-zinc-800 uppercase px-1.5 h-4 ${debate.status === 'active' ? 'text-green-400 bg-green-900/10' : 'text-zinc-500'}`}>
                                                {debate.status}
                                             </Badge>
                                          </div>
                                          <p className="text-xs text-zinc-500 font-mono">VS {debate.persona} • {debate.date}</p>
                                       </div>
                                    </div>
                                 ))
                              ) : (
                                 <div className="text-center py-10 text-zinc-600 text-sm italic">
                                    No active debates recorded.
                                 </div>
                              )}
                           </TabsContent>

                           <TabsContent value="forecasts" className="mt-0 space-y-4">
                              {userPredictions.map((pred, i) => (
                                 <div key={i} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                    <div className="mt-1 p-2 rounded-full bg-blue-900/20 border border-blue-500/20 text-blue-400">
                                       <Target className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <p className="font-medium text-sm text-zinc-300 line-clamp-2 mb-2 group-hover:text-white transition-colors">{pred.question}</p>
                                       <div className="flex items-center gap-3">
                                          <Progress value={pred.probability} className="h-1 flex-1 bg-zinc-800 [&>div]:bg-blue-500" />
                                          <span className="text-xs font-bold text-blue-400 font-mono">{pred.probability}%</span>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </TabsContent>
                        </div>
                     </Tabs>
                  </div>
               </section>

            </main>
         </div>
      </div>
   )
}
