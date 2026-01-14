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

export default function ProfilePage() {
   return (
      <div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-purple-500/30">

         {/* 🌌 Cosmic Background */}
         <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050510] to-[#1a0b2e]" />
            <div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
            <div className="bg-noise opacity-[0.15]" />
            <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[120px] animate-pulse mix-blend-screen" />
         </div>

         <div className="relative z-10">
            <TopNav />

            <div className="relative border-b border-white/10 bg-black/20 backdrop-blur-xl pb-20 pt-10 px-4">
               <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
                  <Avatar className="h-24 w-24 border-4 border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.4)] ring-4 ring-purple-500/20">
                     <AvatarImage src="/avatars/01.png" />
                     <AvatarFallback className="bg-zinc-900 text-purple-400 text-2xl font-bold">CP</AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left space-y-2 flex-1">
                     <div className="flex flex-col md:flex-row items-center gap-3">
                        <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-400">Cyber Philosopher</h1>
                        <Badge variant="outline" className="border-purple-500 text-purple-400 bg-purple-500/10 px-3 py-1 uppercase tracking-widest text-[10px]">Lvl 12 Strategist</Badge>
                     </div>
                     <p className="text-zinc-400 max-w-lg text-lg font-light leading-relaxed">
                        "I know that I know nothing, but I'm getting better at guessing."
                     </p>
                  </div>
                  <div className="flex gap-3">
                     <Link href="/profile/beliefs">
                        <Button variant="secondary" className="gap-2 bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-lg shadow-purple-900/20">
                           <Brain className="h-4 w-4" /> Beliefs
                        </Button>
                     </Link>
                     <Button variant="outline" className="text-white border-white/10 hover:bg-white/10 bg-black/50 backdrop-blur-md">Edit Profile</Button>
                  </div>
               </div>
            </div>

            <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full -mt-16 space-y-6">
               {/* Main Stats Grid */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                     <CardContent className="p-4 text-center space-y-1">
                        <Swords className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
                        <div className="text-2xl font-bold">42</div>
                        <div className="text-xs text-muted-foreground">Total Debates</div>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardContent className="p-4 text-center space-y-1">
                        <Zap className="h-5 w-5 mx-auto text-orange-500 mb-2" />
                        <div className="text-2xl font-bold text-orange-600">12</div>
                        <div className="text-xs text-muted-foreground">Views Changed</div>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardContent className="p-4 text-center space-y-1">
                        <Target className="h-5 w-5 mx-auto text-blue-500 mb-2" />
                        <div className="text-2xl font-bold">0.24</div>
                        <div className="text-xs text-muted-foreground">Brier Score</div>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardContent className="p-4 text-center space-y-1">
                        <Shield className="h-5 w-5 mx-auto text-emerald-500 mb-2" />
                        <div className="text-2xl font-bold">85%</div>
                        <div className="text-xs text-muted-foreground">Calm Score</div>
                     </CardContent>
                  </Card>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Cognitive Skills */}
                  <Card className="md:col-span-2">
                     <CardHeader>
                        <CardTitle>Cognitive Resume</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-6">
                        <div className="space-y-2">
                           <div className="flex justify-between text-sm">
                              <span>Logic & Reasoning</span>
                              <span className="font-bold">78%</span>
                           </div>
                           <Progress value={78} className="h-2" />
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-sm">
                              <span>Empathy & Steel-manning</span>
                              <span className="font-bold">65%</span>
                           </div>
                           <Progress value={65} className="h-2" />
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-sm">
                              <span>Fallacy Detection</span>
                              <span className="font-bold">92%</span>
                           </div>
                           <Progress value={92} className="h-2" />
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-sm">
                              <span>Bias Awareness</span>
                              <span className="font-bold">45%</span>
                           </div>
                           <Progress value={45} className="h-2 bg-slate-100 [&>div]:bg-red-500" />
                           <p className="text-xs text-red-500 flex items-center gap-1">
                              <Eye className="h-3 w-3" /> Blind Spot Detected
                           </p>
                        </div>
                        <Link href="/profile/blind-spots">
                           <Button variant="outline" size="sm" className="w-full mt-2">Analyze Blind Spots</Button>
                        </Link>
                     </CardContent>
                  </Card>

                  {/* Achievements */}
                  <Card>
                     <CardHeader>
                        <CardTitle>Badges</CardTitle>
                     </CardHeader>
                     <CardContent className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center text-center gap-1 p-2 rounded hover:bg-slate-50">
                           <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                              <Award className="h-5 w-5" />
                           </div>
                           <span className="text-xs font-medium">Truth Seeker</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-1 p-2 rounded hover:bg-slate-50">
                           <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                              <Brain className="h-5 w-5" />
                           </div>
                           <span className="text-xs font-medium">Master Debater</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-1 p-2 rounded hover:bg-slate-50 opacity-50">
                           <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                              <Target className="h-5 w-5" />
                           </div>
                           <span className="text-xs font-medium">Oracle</span>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </main>
         </div>
      </div>
   )
}
