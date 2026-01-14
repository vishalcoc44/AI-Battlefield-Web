"use client"

import { useEffect, useState } from "react"
import { TopNav } from "@/components/layout/TopNav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Swords, Users, Plus, Play, Radio, Loader2, Trophy, Dumbbell, Zap, ScanEye, Target, Flame } from "lucide-react"

import Link from "next/link"
import { dataService, type GymRoom } from "@/lib/data-service"
import { useRouter } from "next/navigation"

export default function GymPage() {
    const [rooms, setRooms] = useState<GymRoom[]>([])
    const [loading, setLoading] = useState(true)
    const [createOpen, setCreateOpen] = useState(false)
    const [newTopic, setNewTopic] = useState("")
    const [newCategory, setNewCategory] = useState("General")
    const [creating, setCreating] = useState(false)
    const router = useRouter()

    useEffect(() => {
        async function loadRooms() {
            setLoading(true)
            await new Promise(r => setTimeout(r, 800)) // Artificial delay for smoothness
            const data = await dataService.getActiveGymRooms()
            setRooms(data)
            setLoading(false)
        }
        loadRooms()
    }, [])

    const handleCreateRoom = async () => {
        if (!newTopic) return
        setCreating(true)
        const room = await dataService.createGymRoom(newTopic, newCategory)
        setCreating(false)
        setCreateOpen(false)

        if (room) {
            router.push(`/gym/${room.id}`)
        }
    }

    const featuredRoom = rooms.find(r => r.isFeatured) || rooms[0]
    const otherRooms = rooms.filter(r => r.id !== featuredRoom?.id)

    return (
        <div className="flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
            {/* 🌌 Cosmic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050510] to-[#0a0a15]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
                <div className="absolute top-[-20%] right-[-20%] w-[50vw] h-[50vw] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[150px] animate-pulse delay-1000 mix-blend-screen" />
            </div>

            <div className="relative z-10"><TopNav /></div>

            <main className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full space-y-12 relative z-10">
                {/* ⚡ Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Swords className="h-5 w-5 text-cyan-500 animate-pulse" />
                            <span className="text-xs font-mono text-cyan-500 tracking-widest uppercase">Combat Sector</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-4 drop-shadow-xl">
                            BATTLE GYM
                        </h1>
                        <p className="text-zinc-400 font-light tracking-wide max-w-lg text-lg border-l-2 border-cyan-500/30 pl-4">
                            Engage in high-velocity intellectual sparring. Sharpen your cognitive arsenal.
                        </p>
                    </div>

                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="gap-2 bg-white text-black hover:bg-zinc-200 border-0 font-black h-14 px-8 uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all hover:scale-105">
                                <Plus className="h-5 w-5" /> Initialize Ring
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-black/90 border-white/10 backdrop-blur-xl sm:max-w-[500px] text-white">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black tracking-tight uppercase">New Parameter Set</DialogTitle>
                                <DialogDescription className="text-zinc-400 font-mono text-xs uppercase tracking-widest">Configure conflict variable</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Conflict Premise</Label>
                                    <Input
                                        className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-cyan-500 h-12"
                                        placeholder="e.g. Is AGI an existential threat?"
                                        value={newTopic}
                                        onChange={(e) => setNewTopic(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Domain</Label>
                                    <Select value={newCategory} onValueChange={setNewCategory}>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                                            <SelectValue placeholder="Select domain" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-black border-white/10 text-white">
                                            <SelectItem value="General">General</SelectItem>
                                            <SelectItem value="Technology">Technology</SelectItem>
                                            <SelectItem value="Philosophy">Philosophy</SelectItem>
                                            <SelectItem value="Politics">Politics</SelectItem>
                                            <SelectItem value="Economics">Economics</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateRoom} disabled={!newTopic || creating} className="bg-cyan-600 hover:bg-cyan-700 text-white h-12 w-full font-bold uppercase tracking-wider">
                                    {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Deploy Ring
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20 h-96 items-center">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
                            <p className="text-zinc-500 font-mono animate-pulse uppercase tracking-widest text-xs">Calibrating Holodeck...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* 🏆 Hero / Featured Debate */}
                        {featuredRoom && (
                            <div className="col-span-1 md:col-span-12 lg:col-span-8 animate-in fade-in zoom-in-95 duration-700">
                                <Link href={`/gym/${featuredRoom.id}`}>
                                    <div className="group relative h-full min-h-[400px] rounded-[2rem] overflow-hidden shadow-2xl transition-all hover:scale-[1.01] cursor-pointer ring-1 ring-white/10 hover:ring-cyan-500/50">
                                        <div className="absolute inset-0 bg-black" />
                                        {/* Dynamic Gradient Flow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-blue-900/40 to-black opacity-80 group-hover:opacity-100 transition-opacity duration-700" />

                                        {/* Animated Grid */}
                                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 mix-blend-overlay" />

                                        <div className="relative p-10 h-full flex flex-col justify-between z-10">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-6">
                                                    <div className="flex gap-3">
                                                        <Badge variant="destructive" className="animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)] border-0 px-3 py-1 text-[10px] tracking-widest uppercase font-black bg-red-600">LIVE COMBAT</Badge>
                                                        <Badge className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 px-3 py-1 text-[10px] tracking-widest uppercase font-bold">{featuredRoom.category}</Badge>
                                                    </div>
                                                    <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.9] max-w-3xl drop-shadow-xl tracking-tighter">
                                                        "{featuredRoom.topic}"
                                                    </h2>
                                                </div>

                                                {/* VS Badge */}
                                                <div className="hidden md:flex items-center justify-center h-20 w-20 bg-white/5 backdrop-blur-md rounded-full border border-white/10 font-black text-white italic text-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500">
                                                    VS
                                                </div>
                                            </div>

                                            <div className="flex items-end justify-between mt-10">
                                                <div className="flex -space-x-4">
                                                    {[1, 2, 3, 4].map(i => (
                                                        <Avatar key={i} className="border-4 border-black ring-2 ring-white/20 h-12 w-12 transition-transform hover:scale-110 hover:z-10">
                                                            <AvatarImage src={`/avatars/0${i}.png`} />
                                                            <AvatarFallback className="bg-zinc-800 text-xs text-zinc-500 font-bold">O{i}</AvatarFallback>
                                                        </Avatar>
                                                    ))}
                                                    <div className="h-12 w-12 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/20 ml-2 border-4 border-black">
                                                        +{featuredRoom.activeParticipants}
                                                    </div>
                                                </div>

                                                <Button size="lg" className="bg-white text-black hover:bg-zinc-200 font-black border-0 shadow-[0_0_20px_rgba(255,255,255,0.2)] h-14 px-8 uppercase tracking-wider text-xs group-hover:translate-x-1 transition-all">
                                                    <Play className="h-4 w-4 mr-2 fill-black" /> Enter Spectator Mode
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* 📊 Stats Card - Vertical Stack */}
                        <div className="col-span-1 md:col-span-6 lg:col-span-4 space-y-6">
                            <div className="holographic-card rounded-[2rem] p-8 h-full flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-700 delay-100 border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[60px]" />

                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-wider">
                                        <Trophy className="h-6 w-6 text-yellow-500" /> Performance
                                    </h3>
                                    <Badge variant="outline" className="text-[10px] tracking-widest uppercase border-white/20 text-zinc-400">Season 3</Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="text-4xl font-black text-white mb-2">1,240</div>
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Elo Rating</div>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="text-4xl font-black text-green-400 mb-2">68%</div>
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Win Rate</div>
                                    </div>
                                </div>
                                <Button className="w-full mt-8 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5 font-bold uppercase tracking-widest text-xs h-12" variant="outline">Access Leaderboard</Button>
                            </div>
                        </div>

                        {/* 🛠️ Drills Section - Horizontal Span */}
                        <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Link href="/gym/drills/fallacy" className="group">
                                <div className="holographic-card p-8 rounded-[2rem] border-white/5 hover:border-blue-500/30 transition-all h-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                                            <ScanEye className="h-7 w-7" />
                                        </div>
                                        <Badge className="bg-green-500/10 text-green-400 border-0 uppercase tracking-widest text-[10px] font-bold">New Module</Badge>
                                    </div>
                                    <h3 className="text-2xl font-black mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight relative z-10">Fallacy Finder</h3>
                                    <p className="text-zinc-500 text-sm font-light relative z-10">Train your neural net to detect logical incoherence instantly.</p>
                                </div>
                            </Link>

                            <Link href="/gym/drills/rebuttal" className="group">
                                <div className="holographic-card p-8 rounded-[2rem] border-white/5 hover:border-yellow-500/30 transition-all h-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="h-14 w-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20 group-hover:scale-110 transition-transform">
                                            <Zap className="h-7 w-7" />
                                        </div>
                                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border border-white/5 px-2 py-1 rounded">High Score: 1200</span>
                                    </div>
                                    <h3 className="text-2xl font-black mb-2 group-hover:text-yellow-500 transition-colors uppercase tracking-tight relative z-10">Rapid Rebuttal</h3>
                                    <p className="text-zinc-500 text-sm font-light relative z-10">Construct vector-aligned arguments under temporal pressure.</p>
                                </div>
                            </Link>
                        </div>

                        {/* 🕹️ Other Active Rings Grid */}
                        <div className="col-span-1 md:col-span-12 mt-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                    <Radio className="h-5 w-5 text-red-500 animate-pulse" /> Active Signals
                                </h3>
                                <Button variant="link" className="text-zinc-400 hover:text-white uppercase tracking-widest text-xs font-bold">View All Rings <Play className="ml-2 h-3 w-3" /></Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {otherRooms.map((room, i) => (
                                    <Link href={`/gym/${room.id}`} key={room.id} className="h-full group">
                                        <div className={`glass-card p-6 rounded-3xl h-full border-white/5 hover:border-white/20 hover:-translate-y-1 transition-all cursor-pointer animate-in fade-in zoom-in-50 duration-500 relative overflow-hidden bg-black/40`}>
                                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <div className="flex justify-between items-start mb-4 relative z-10">
                                                <Badge variant="outline" className="font-bold border-white/10 text-zinc-400 text-[10px] tracking-widest uppercase">{room.category}</Badge>
                                                <div className="flex items-center text-[10px] text-zinc-500 gap-1 font-mono uppercase">
                                                    <Users className="h-3 w-3" /> {room.activeParticipants}
                                                </div>
                                            </div>
                                            <h4 className="font-black text-xl leading-tight mb-6 line-clamp-2 min-h-[3.5rem] text-zinc-200 group-hover:text-white transition-colors relative z-10">"{room.topic}"</h4>

                                            <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                                                <div className="flex -space-x-2">
                                                    <Avatar className="h-7 w-7 border-2 border-black"><AvatarImage src="/avatars/04.png" /></Avatar>
                                                    <Avatar className="h-7 w-7 border-2 border-black"><AvatarImage src="/avatars/05.png" /></Avatar>
                                                </div>
                                                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center">Scan Stream <Play className="ml-1 h-2 w-2" /></span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
