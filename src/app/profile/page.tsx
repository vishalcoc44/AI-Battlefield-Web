"use client"

import { TopNav } from "@/components/layout/TopNav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Award, Zap, Target, Eye, Shield, Swords, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { dataService } from "@/lib/data-service"
import { UserProfile } from "@/lib/types"
import { useUser } from "@/hooks/use-user"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
   const { user, loading: authLoading } = useUser()
   const router = useRouter()
   const [profile, setProfile] = useState<UserProfile | null>(null)
   const [loading, setLoading] = useState(true)
   const [isEditing, setIsEditing] = useState(false)
   const [editForm, setEditForm] = useState({
      fullName: "",
      bio: "",
      avatarUrl: ""
   })

   useEffect(() => {
      if (authLoading) return
      if (!user) {
         // router.push('/auth') // Optionally redirect
         setLoading(false)
         return
      }

      const loadProfile = async () => {
         try {
            const data = await dataService.getUserProfile(user.id)
            if (data) {
               setProfile(data)
               setEditForm({
                  fullName: data.fullName || "",
                  bio: data.bio || "",
                  avatarUrl: data.avatarUrl || ""
               })
            }
         } catch (error) {
            console.error("Failed to load profile", error)
         } finally {
            setLoading(false)
         }
      }
      loadProfile()
   }, [user, authLoading])

   const handleSaveProfile = async () => {
      if (!profile) return

      try {
         const success = await dataService.updateUserProfile(profile.id, {
            fullName: editForm.fullName,
            bio: editForm.bio,
            avatarUrl: editForm.avatarUrl
         })

         if (success) {
            setProfile({
               ...profile,
               fullName: editForm.fullName,
               bio: editForm.bio,
               avatarUrl: editForm.avatarUrl
            })
            setIsEditing(false)
         }
      } catch (error) {
         console.error("Failed to update profile", error)
      }
   }

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
         </div>
      )
   }

   return (
      <div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-purple-500/30">

         {/* 🌌 Cosmic Background (Consistent with System) */}
         <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050510] to-[#0a1a0f]" />
            <div className="absolute inset-0 bg-grid-white/[0.04]" />
            <div className="bg-noise opacity-[0.15]" />
            <div className="absolute top-[-20%] left-[20%] w-[60vw] h-[60vw] bg-teal-600/10 rounded-full blur-[150px] animate-pulse mix-blend-screen" />
         </div>

         <div className="relative z-10">
            <TopNav />

            {/* Profile Header - Standardized */}
            <div className="relative border-b border-white/5 bg-black/40 backdrop-blur-xl pb-16 pt-12 px-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
               <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                     <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                     <Avatar className="h-32 w-32 border-4 border-black shadow-2xl ring-2 ring-white/10 relative z-10 transition-transform duration-500 group-hover:scale-105">
                        <AvatarImage src={profile?.avatarUrl || "/avatars/01.png"} />
                        <AvatarFallback className="bg-zinc-900 text-transparent bg-clip-text bg-gradient-to-br from-teal-400 to-emerald-400 text-3xl font-black">{profile?.username?.[0]?.toUpperCase() || "CP"}</AvatarFallback>
                     </Avatar>
                     <div className="absolute bottom-2 right-2 h-6 w-6 bg-teal-500 border-4 border-black rounded-full z-20 shadow-[0_0_10px_rgba(20,184,166,0.5)]" title="Online" />
                  </div>

                  <div className="text-center md:text-left space-y-3 flex-1">
                     <div className="flex flex-col md:flex-row items-center gap-4">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white drop-shadow-sm font-display">{profile?.fullName || profile?.username || "Cyber Philosopher"}</h1>
                        <div className="flex gap-2">
                           <Badge variant="outline" className="border-teal-500/30 text-teal-300 bg-teal-500/10 px-3 py-1 uppercase tracking-widest text-[10px] font-bold backdrop-blur-sm">{profile?.rankTitle || "Lvl 12 Strategist"}</Badge>
                           <Badge variant="outline" className="border-blue-500/30 text-blue-300 bg-blue-500/10 px-3 py-1 uppercase tracking-widest text-[10px] font-bold backdrop-blur-sm">Top 5%</Badge>
                        </div>
                     </div>
                     <p className="text-zinc-400 max-w-2xl text-lg font-light leading-relaxed tracking-wide">
                        "{profile?.bio || "I know that I know nothing, but I'm getting better at guessing."}"
                     </p>
                  </div>

                  <div className="flex gap-4">
                     <Link href="/profile/beliefs">
                        <Button className="h-10 px-6 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-bold tracking-wide transition-all border-0">
                           <Brain className="h-4 w-4 mr-2" /> Beliefs
                        </Button>
                     </Link>

                     <Dialog open={isEditing} onOpenChange={setIsEditing}>
                        <DialogTrigger asChild>
                           <Button variant="outline" className="h-10 px-6 rounded-md border-white/10 hover:bg-white/5 hover:text-white text-zinc-400 font-bold tracking-wide transition-all">Edit Profile</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-950 border-white/10 text-white">
                           <DialogHeader>
                              <DialogTitle>Edit Profile</DialogTitle>
                           </DialogHeader>
                           <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                 <Label>Full Name</Label>
                                 <Input
                                    value={editForm.fullName}
                                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                    className="bg-zinc-900 border-white/10"
                                    placeholder="Enter your name"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label>Bio</Label>
                                 <Textarea
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    className="bg-zinc-900 border-white/10 min-h-[100px]"
                                    placeholder="Tell us about yourself"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label>Avatar URL</Label>
                                 <Input
                                    value={editForm.avatarUrl}
                                    onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                                    className="bg-zinc-900 border-white/10"
                                    placeholder="https://..."
                                 />
                              </div>
                           </div>
                           <DialogFooter>
                              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                              <Button onClick={handleSaveProfile} className="bg-teal-600 hover:bg-teal-500 text-white">
                                 <Save className="h-4 w-4 mr-2" /> Save Changes
                              </Button>
                           </DialogFooter>
                        </DialogContent>
                     </Dialog>
                  </div>
               </div>
            </div>

            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full -mt-24 relative z-20 space-y-8">
               {/* Main Stats Grid */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="holographic-card p-6 rounded-2xl text-center space-y-2 group transition-all duration-300 hover:bg-white/5 hover:scale-[1.02]">
                     <div className="h-10 w-10 mx-auto bg-zinc-900/50 rounded-full flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
                        <Swords className="h-5 w-5 text-zinc-400 group-hover:text-white transition-colors" />
                     </div>
                     <div className="text-3xl font-black text-white tracking-tight">{profile?.stats?.debatesWon || 42}</div>
                     <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Total Debates</div>
                  </div>
                  <div className="holographic-card p-6 rounded-2xl text-center space-y-2 group transition-all duration-300 hover:bg-orange-500/5 hover:scale-[1.02] hover:border-orange-500/20">
                     <div className="h-10 w-10 mx-auto bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/10 group-hover:border-orange-500/30 transition-colors">
                        <Zap className="h-5 w-5 text-orange-500" />
                     </div>
                     <div className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">{profile?.stats?.viewsChanged || 12}</div>
                     <div className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Views Changed</div>
                  </div>
                  <div className="holographic-card p-6 rounded-2xl text-center space-y-2 group transition-all duration-300 hover:bg-blue-500/5 hover:scale-[1.02] hover:border-blue-500/20">
                     <div className="h-10 w-10 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/10 group-hover:border-blue-500/30 transition-colors">
                        <Target className="h-5 w-5 text-blue-500" />
                     </div>
                     <div className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">{profile?.stats?.brierScore || 0.24}</div>
                     <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Brier Score</div>
                  </div>
                  <div className="holographic-card p-6 rounded-2xl text-center space-y-2 group transition-all duration-300 hover:bg-emerald-500/5 hover:scale-[1.02] hover:border-emerald-500/20">
                     <div className="h-10 w-10 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
                        <Shield className="h-5 w-5 text-emerald-500" />
                     </div>
                     <div className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">85%</div>
                     <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Calm Score</div>
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
                           <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Neural Analysis & Specs</p>
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
