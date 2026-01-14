"use client"

import { TopNav } from "@/components/layout/TopNav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Award, Zap, Target, Eye, Shield, Swords } from "lucide-react"
import Link from "next/link"


import { CosmicBackground } from "@/components/ui/cosmic-background"

export default function ProfilePage() {
   return (
      <div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-purple-500/30">

         {/* 🌌 Cosmic Background */}
         <CosmicBackground theme="purple" />

         <div className="relative z-10">
            <TopNav />

            {/* Profile Header */}
            <div className="relative border-b border-white/5 bg-black/40 backdrop-blur-xl pb-24 pt-12 px-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
               <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                     <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                     <Avatar className="h-32 w-32 border-4 border-black shadow-2xl ring-4 ring-white/10 relative z-10 transition-transform duration-500 group-hover:scale-105">
                        <AvatarImage src="/avatars/01.png" />
                        <AvatarFallback className="bg-zinc-900 text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-400 text-3xl font-black">CP</AvatarFallback>
                     </Avatar>
                     <div className="absolute bottom-2 right-2 h-6 w-6 bg-emerald-500 border-4 border-black rounded-full z-20 shadow-[0_0_10px_rgba(16,185,129,0.5)]" title="Online" />
                  </div>

                  <div className="text-center md:text-left space-y-3 flex-1">
                     <div className="flex flex-col md:flex-row items-center gap-4">
                        <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-400 drop-shadow-sm">Cyber Philosopher</h1>
                        <div className="flex gap-2">
                           <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/10 px-3 py-1 uppercase tracking-widest text-[10px] font-bold backdrop-blur-sm">Lvl 12 Strategist</Badge>
                           <Badge variant="outline" className="border-blue-500/30 text-blue-300 bg-blue-500/10 px-3 py-1 uppercase tracking-widest text-[10px] font-bold backdrop-blur-sm">Top 5%</Badge>
                        </div>
                     </div>
                     <p className="text-zinc-400 max-w-2xl text-lg font-light leading-relaxed tracking-wide">
                        "I know that I know nothing, but I'm getting better at guessing."
                     </p>
                  </div>

                  <div className="flex gap-4">
                     <Link href="/profile/beliefs">
                        <Button className="h-12 px-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold tracking-wide shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] border-0 transition-all hover:scale-105">
                           <Brain className="h-4 w-4 mr-2" /> Beliefs
                        </Button>
                     </Link>
                     <Button variant="outline" className="h-12 px-6 rounded-full border-white/10 hover:bg-white/10 bg-white/5 backdrop-blur-md text-white font-bold tracking-wide transition-all hover:scale-105">Edit Profile</Button>
                  </div>
               </div>
            </div>

            <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full -mt-20 relative z-20 space-y-8">
               {/* Main Stats Grid */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="holographic-card p-6 rounded-2xl text-center space-y-2 group transition-all duration-300 hover:bg-white/5 hover:scale-[1.02]">
                     <div className="h-10 w-10 mx-auto bg-zinc-900/50 rounded-full flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
                        <Swords className="h-5 w-5 text-zinc-400 group-hover:text-white transition-colors" />
                     </div>
                     <div className="text-3xl font-black text-white tracking-tight">42</div>
                     <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Total Debates</div>
                  </div>
                  <div className="holographic-card p-6 rounded-2xl text-center space-y-2 group transition-all duration-300 hover:bg-orange-500/5 hover:scale-[1.02] hover:border-orange-500/20">
                     <div className="h-10 w-10 mx-auto bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/10 group-hover:border-orange-500/30 transition-colors">
                        <Zap className="h-5 w-5 text-orange-500" />
                     </div>
                     <div className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">12</div>
                     <div className="text-[10px] text-orange-400 font-black uppercase tracking-widest">Views Changed</div>
                  </div>
                  <div className="holographic-card p-6 rounded-2xl text-center space-y-2 group transition-all duration-300 hover:bg-blue-500/5 hover:scale-[1.02] hover:border-blue-500/20">
                     <div className="h-10 w-10 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/10 group-hover:border-blue-500/30 transition-colors">
                        <Target className="h-5 w-5 text-blue-500" />
                     </div>
                     <div className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">0.24</div>
                     <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Brier Score</div>
                  </div>
                  <div className="holographic-card p-6 rounded-2xl text-center space-y-2 group transition-all duration-300 hover:bg-emerald-500/5 hover:scale-[1.02] hover:border-emerald-500/20">
                     <div className="h-10 w-10 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
                        <Shield className="h-5 w-5 text-emerald-500" />
                     </div>
                     <div className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">85%</div>
                     <div className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Calm Score</div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Cognitive Skills */}
                  <div className="lg:col-span-2 holographic-card rounded-3xl p-8 space-y-8 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px]" />

                     <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                        <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                           <Brain className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-white tracking-tight">Cognitive Resume</h3>
                           <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Neural Analysis & Spec</p>
                        </div>
                     </div>

                     <div className="space-y-8 relative z-10">
                        <div className="space-y-3 group">
                           <div className="flex justify-between text-sm">
                              <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">Logic & Reasoning</span>
                              <span className="font-mono font-bold text-cyan-400">78%</span>
                           </div>
                           <Progress value={78} className="h-1.5 bg-zinc-800/50 [&>div]:bg-gradient-to-r [&>div]:from-cyan-600 [&>div]:to-cyan-400 [&>div]:shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                        </div>
                        <div className="space-y-3 group">
                           <div className="flex justify-between text-sm">
                              <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">Empathy & Steel-manning</span>
                              <span className="font-mono font-bold text-pink-400">65%</span>
                           </div>
                           <Progress value={65} className="h-1.5 bg-zinc-800/50 [&>div]:bg-gradient-to-r [&>div]:from-pink-600 [&>div]:to-pink-400 [&>div]:shadow-[0_0_10px_rgba(244,114,182,0.5)]" />
                        </div>
                        <div className="space-y-3 group">
                           <div className="flex justify-between text-sm">
                              <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">Fallacy Detection</span>
                              <span className="font-mono font-bold text-emerald-400">92%</span>
                           </div>
                           <Progress value={92} className="h-1.5 bg-zinc-800/50 [&>div]:bg-gradient-to-r [&>div]:from-emerald-600 [&>div]:to-emerald-400 [&>div]:shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                        </div>
                        <div className="space-y-3 group">
                           <div className="flex justify-between text-sm">
                              <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">Bias Awareness</span>
                              <span className="font-mono font-bold text-red-500">45%</span>
                           </div>
                           <Progress value={45} className="h-1.5 bg-zinc-800/50 [&>div]:bg-red-500 [&>div]:shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1.5 bg-red-500/5 px-2 py-1 rounded w-fit border border-red-500/10">
                              <Eye className="h-3 w-3" /> Blind Spot Detected
                           </p>
                        </div>
                        <Link href="/profile/blind-spots" className="block pt-4">
                           <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all font-bold tracking-wide uppercase text-xs">
                              Initiate Deep Scan <Target className="ml-2 h-4 w-4" />
                           </Button>
                        </Link>
                     </div>
                  </div>

                  {/* Achievements */}
                  <div className="holographic-card rounded-3xl p-8 space-y-6 flex flex-col">
                     <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                        <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                           <Award className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-white tracking-tight">Honor Roll</h3>
                           <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Earned Medals</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 flex-1 content-start">
                        <div className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:scale-105 transition-all duration-300 cursor-pointer group">
                           <div className="h-12 w-12 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 ring-1 ring-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.2)] group-hover:shadow-[0_0_25px_rgba(234,179,8,0.4)] transition-shadow">
                              <Award className="h-6 w-6" />
                           </div>
                           <span className="text-xs font-bold text-zinc-300 group-hover:text-white">Truth Seeker</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:scale-105 transition-all duration-300 cursor-pointer group">
                           <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 ring-1 ring-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-shadow">
                              <Brain className="h-6 w-6" />
                           </div>
                           <span className="text-xs font-bold text-zinc-300 group-hover:text-white">Master Debater</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer group col-span-2">
                           <div className="h-12 w-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-500 ring-1 ring-purple-500/40">
                              <Target className="h-6 w-6" />
                           </div>
                           <div className="space-y-1">
                              <span className="text-xs font-bold text-zinc-300 block">Oracle</span>
                              <span className="text-[9px] uppercase tracking-widest text-zinc-500 block">Locked</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </main>
         </div>
      </div>
   )
}
