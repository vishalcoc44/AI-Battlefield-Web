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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Swords, Users, Plus, Play, Radio, Loader2, Trophy, Dumbbell, Zap, ScanEye, Target, Flame, MoreVertical, Trash, Edit } from "lucide-react"

import Link from "next/link"
import { dataService, type GymRoom } from "@/lib/data-service"
import { useRouter } from "next/navigation"
import { DojoStats } from "@/components/debate/DojoStats"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { sanitizeText, validateTopic, validateCategory } from "@/lib/utils"

export default function GymPage() {
    const [rooms, setRooms] = useState<GymRoom[]>([])
    const [loading, setLoading] = useState(true)
    const [createOpen, setCreateOpen] = useState(false)
    const [newTopic, setNewTopic] = useState("")
    const [newCategory, setNewCategory] = useState("General")
    const [creating, setCreating] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [stats, setStats] = useState<any>(null)

    // Edit State
    const [editingRoom, setEditingRoom] = useState<GymRoom | null>(null)
    const [editTopic, setEditTopic] = useState("")
    const [editCategory, setEditCategory] = useState("General")
    const [editing, setEditing] = useState(false)

    // Delete State
    const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)

    const router = useRouter()

    useEffect(() => {
        async function loadRooms() {
            setLoading(true)
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) setCurrentUserId(user.id)

                await new Promise(r => setTimeout(r, 800)) // Artificial delay for smoothness
                const data = await dataService.getActiveGymRooms()
                setRooms(data)
            } catch (error) {
                console.error("Failed to load rooms:", error)
                toast.error("Failed to load debate rooms. Please try refreshing the page.")
                setRooms([]) // Ensure we don't show stale data
            } finally {
                setLoading(false)
            }
        }
        loadRooms()
    }, [])

    const handleCreateRoom = async () => {
        // Validate inputs
        const topicValidation = validateTopic(newTopic)
        if (!topicValidation.isValid) {
            toast.error(topicValidation.error)
            return
        }

        const categoryValidation = validateCategory(newCategory)
        if (!categoryValidation.isValid) {
            toast.error(categoryValidation.error)
            return
        }

        setCreating(true)

        try {
            const response = await fetch('/api/gym', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: topicValidation.sanitized,
                    category: newCategory
                })
            })

            if (response.ok) {
                const room = await response.json()
                setCreateOpen(false)
                setNewTopic("")
                setNewCategory("General")
                router.push(`/gym/${room.id}`)
            } else {
                const error = await response.json()
                toast.error(error.error || "Failed to create room")
            }
        } catch (error) {
            console.error("Create room error:", error)
            toast.error("Failed to create room")
        }

        setCreating(false)
    }

    const startEditing = (room: GymRoom) => {
        setEditingRoom(room)
        setEditTopic(room.topic)
        setEditCategory(room.category || "General")
    }

    const handleUpdateRoom = async () => {
        if (!editingRoom) return

        // Validate inputs
        const topicValidation = validateTopic(editTopic)
        if (!topicValidation.isValid) {
            toast.error(topicValidation.error)
            return
        }

        const categoryValidation = validateCategory(editCategory)
        if (!categoryValidation.isValid) {
            toast.error(categoryValidation.error)
            return
        }

        setEditing(true)

        try {
            const response = await fetch(`/api/gym/${editingRoom.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: editTopic,
                    category: editCategory
                })
            })

            if (response.ok) {
                const updated = await response.json()
                setRooms(prev => prev.map(r => r.id === updated.id ? {
                    ...updated,
                    activeParticipants: r.activeParticipants,
                    isFeatured: r.isFeatured,
                    status: updated.status || 'active',
                    endsAt: updated.ends_at,
                    votePro: updated.vote_pro || 0,
                    voteCon: updated.vote_con || 0,
                    winnerSide: updated.winner_side,
                    createdBy: updated.created_by
                } : r))
                toast.success("Room updated successfully")
                setEditingRoom(null)
            } else {
                const error = await response.json()
                toast.error(error.error || "Failed to update room")
            }
        } catch (error) {
            console.error("Update room error:", error)
            toast.error("Failed to update room")
        }

        setEditing(false)
    }

    const confirmDelete = (e: React.MouseEvent, roomId: string) => {
        e.preventDefault()
        e.stopPropagation()
        setDeletingRoomId(roomId)
    }

    const handleDeleteRoom = async () => {
        if (!deletingRoomId) return
        setDeleting(true)

        try {
            const response = await fetch(`/api/gym/${deletingRoomId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                toast.success("Room deleted successfully")
                setRooms(prev => prev.filter(r => r.id !== deletingRoomId))
                setDeletingRoomId(null)
            } else {
                const error = await response.json()
                toast.error(error.error || "Failed to delete room")
            }
        } catch (error) {
            console.error("Delete room error:", error)
            toast.error("Failed to delete room")
        }

        setDeleting(false)
    }



    return (
        <div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
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

                    <div className="flex gap-4">
                        {/* Edit Room Dialog */}
                        <Dialog open={!!editingRoom} onOpenChange={(open) => !open && setEditingRoom(null)}>
                            <DialogContent className="bg-black/90 border-white/10 backdrop-blur-xl sm:max-w-[500px] text-white">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black tracking-tight uppercase">Update Parameters</DialogTitle>
                                    <DialogDescription className="text-zinc-400 font-mono text-xs uppercase tracking-widest">Reconfigure conflict variables</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 py-4">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Conflict Premise</Label>
                                        <Input
                                            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-cyan-500 h-12"
                                            placeholder="e.g. Is AGI an existential threat?"
                                            value={editTopic}
                                            onChange={(e) => setEditTopic(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Domain</Label>
                                        <Select value={editCategory} onValueChange={setEditCategory}>
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
                                    <Button onClick={handleUpdateRoom} disabled={!editTopic || editing} className="bg-cyan-600 hover:bg-cyan-700 text-white h-12 w-full font-bold uppercase tracking-wider">
                                        {editing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Update Ring
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Delete Confirmation Dialog */}
                        <Dialog open={!!deletingRoomId} onOpenChange={(open) => !open && setDeletingRoomId(null)}>
                            <DialogContent className="bg-black/90 border-red-500/20 backdrop-blur-xl sm:max-w-[500px] text-white">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black tracking-tight uppercase text-red-500 flex items-center gap-2">
                                        <Trash className="h-6 w-6" /> Delete Room?
                                    </DialogTitle>
                                    <DialogDescription className="text-zinc-400 font-mono text-xs uppercase tracking-widest">
                                        This action cannot be undone
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <p className="text-zinc-300 text-sm">
                                        Are you sure you want to permanently delete this debate room? All data associated with this room will be lost.
                                    </p>
                                </div>
                                <DialogFooter className="flex gap-3">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setDeletingRoomId(null)}
                                        className="h-12 px-6 font-bold uppercase tracking-wider border border-white/10 hover:bg-white/5"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleDeleteRoom}
                                        disabled={deleting}
                                        className="bg-red-600 hover:bg-red-700 text-white h-12 px-6 font-bold uppercase tracking-wider"
                                    >
                                        {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {deleting ? 'Deleting...' : 'Delete Room'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    size="lg"
                                    className="gap-2 bg-white text-black hover:bg-zinc-200 border-0 font-black h-14 px-8 uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all hover:scale-105"
                                    aria-label="Create new debate room"
                                >
                                    <Plus className="h-5 w-5" aria-hidden="true" /> Initialize Ring
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
                </div>

                {loading ? (
                    <div className="flex justify-center py-20 h-96 items-center">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
                            <p className="text-zinc-500 font-mono animate-pulse uppercase tracking-widest text-xs">Calibrating Holodeck...</p>
                        </div>
                    </div>
                ) : rooms.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[60vh] animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="text-center space-y-6 max-w-md mx-auto">
                            <div className="relative">
                                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
                                <div className="relative bg-black/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                                    <Swords className="h-16 w-16 text-cyan-500 mx-auto mb-4 animate-pulse" />
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                                        No Active Debates
                                    </h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                        The battlefield is quiet. Be the first to ignite the flames of intellectual combat.
                                    </p>
                                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="lg" className="gap-2 bg-white text-black hover:bg-zinc-200 border-0 font-black h-12 px-6 uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all hover:scale-105">
                                                <Plus className="h-5 w-5" /> Ignite First Battle
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
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* 🕹️ Active Signals (TOP PRIORITY - NOW FIRST) */}
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                    <Radio className="h-5 w-5 text-red-500 animate-pulse" /> Active Signals
                                </h3>
                                <div className="text-zinc-500 text-sm font-mono">
                                    {rooms.length} Active Simulations
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                {rooms.map((room, i) => {
                                    return (
                                        <div key={room.id} className="h-full group relative">
                                                <div
                                                    onClick={() => router.push(`/gym/${room.id}`)}
                                                    className="relative h-full min-h-[320px] rounded-[2rem] overflow-hidden shadow-2xl transition-all hover:scale-[1.02] cursor-pointer ring-1 ring-white/10 hover:ring-cyan-500/50 p-8 flex flex-col justify-between"
                                                    role="button"
                                                    tabIndex={0}
                                                    aria-label={`Join debate room: ${room.topic}`}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault()
                                                            router.push(`/gym/${room.id}`)
                                                        }
                                                    }}
                                                >
                                                <div className="absolute inset-0 bg-black" />
                                                {/* Dynamic Gradient Flow */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-black to-black opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 mix-blend-overlay" />

                                                {/* Hover Glow */}
                                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2rem] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex gap-2">
                                                            <Badge className="bg-white/5 hover:bg-white/10 text-white backdrop-blur-md border border-white/10 px-2 py-0.5 text-[10px] tracking-widest uppercase font-bold">{room.category}</Badge>
                                                            {i === 0 && <Badge variant="destructive" className="animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)] border-0 px-2 py-0.5 text-[10px] tracking-widest uppercase font-black bg-red-600">LIVE</Badge>}
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center text-[10px] text-zinc-400 gap-1 font-mono uppercase bg-black/50 px-2 py-1 rounded-full border border-white/5">
                                                                <Users className="h-3 w-3" /> {room.activeParticipants}
                                                            </div>

                                                            {/* Three Dots Menu */}
                                                            {currentUserId && (
                                                                <div onClick={(e) => e.stopPropagation()} className="relative z-50">
                                                                    <DropdownMenu modal={false}>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button
                                                                                size="icon"
                                                                                variant="ghost"
                                                                                className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                                                                                aria-label="Room options"
                                                                            >
                                                                                <MoreVertical className="h-4 w-4" aria-hidden="true" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end" className="bg-black/90 border-white/10 text-white backdrop-blur-xl z-[100]">
                                                                            <DropdownMenuItem
                                                                                className="text-xs uppercase font-bold focus:bg-white/10 focus:text-cyan-500 cursor-pointer py-2"
                                                                                onClick={(e) => { e.stopPropagation(); startEditing(room) }}
                                                                                aria-label={`Edit room: ${room.topic}`}
                                                                            >
                                                                                <Edit className="h-3 w-3 mr-2" aria-hidden="true" /> Edit Room
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                className="text-xs uppercase font-bold text-red-500 focus:bg-red-950/30 focus:text-red-400 cursor-pointer py-2"
                                                                                onClick={(e) => confirmDelete(e as any, room.id)}
                                                                                aria-label={`Delete room: ${room.topic}`}
                                                                            >
                                                                                <Trash className="h-3 w-3 mr-2" aria-hidden="true" /> Delete Room
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <h4 className="font-black text-2xl md:text-3xl leading-[0.9] mb-4 text-white drop-shadow-lg tracking-tighter group-hover:text-cyan-100 transition-colors line-clamp-3">
                                                        "{sanitizeText(room.topic)}"
                                                    </h4>
                                                </div>

                                                <div className="relative z-10 flex items-end justify-between mt-4">
                                                    <div className="flex -space-x-3">
                                                        {[1, 2].map(idx => (
                                                            <Avatar key={idx} className="h-8 w-8 border-2 border-black ring-1 ring-white/10">
                                                                <AvatarImage src={`/avatars/0${idx + 2}.png`} />
                                                            </Avatar>
                                                        ))}
                                                        <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-500 border-2 border-black ring-1 ring-white/10">
                                                            +
                                                        </div>
                                                    </div>

                                                    <Button size="sm" className="bg-white text-black hover:bg-zinc-200 font-black border-0 shadow-[0_0_15px_rgba(255,255,255,0.1)] h-9 px-4 uppercase tracking-wider text-[10px] group-hover:translate-x-1 transition-all">
                                                        Join <Play className="ml-2 h-3 w-3 fill-black" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* 📊 Bottom Section: Stats & Drills (NOW AT BOTTOM) */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-white/5 opacity-80 hover:opacity-100 transition-opacity">
                            <div className="col-span-1 md:col-span-8 lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Link href="/gym/drills/fallacy" className="group">
                                    <div className="holographic-card p-6 rounded-[1.5rem] border-white/5 hover:border-blue-500/30 transition-all h-full relative overflow-hidden bg-white/[0.02]">
                                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                                                <ScanEye className="h-5 w-5" />
                                            </div>
                                            <Badge className="bg-green-500/10 text-green-400 border-0 uppercase tracking-widest text-[10px] font-bold">Recommended</Badge>
                                        </div>
                                        <h3 className="text-xl font-black mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight relative z-10">Fallacy Finder</h3>
                                        <p className="text-zinc-500 text-xs font-light relative z-10">Detect logical incoherence.</p>
                                    </div>
                                </Link>

                                <Link href="/gym/drills/rebuttal" className="group">
                                    <div className="holographic-card p-6 rounded-[1.5rem] border-white/5 hover:border-yellow-500/30 transition-all h-full relative overflow-hidden bg-white/[0.02]">
                                        <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20 group-hover:scale-110 transition-transform">
                                                <Zap className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black mb-1 group-hover:text-yellow-500 transition-colors uppercase tracking-tight relative z-10">Rapid Rebuttal</h3>
                                        <p className="text-zinc-500 text-xs font-light relative z-10">Arguments under pressure.</p>
                                    </div>
                                </Link>
                            </div>

                            <div className="col-span-1 md:col-span-4 lg:col-span-3 flex flex-col gap-6">
                                <DojoStats xp={2450} level={12} streak={5} rankTitle="Cyber Philosopher" />
                                <Link href="/gym/sparring" className="group block">
                                    <div className="rounded-[1.5rem] p-6 border border-white/5 bg-purple-900/10 hover:bg-purple-900/20 transition-colors relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-wider text-white">
                                                <Target className="h-4 w-4 text-purple-500" /> AI Sparring
                                            </h3>
                                        </div>
                                        <p className="text-zinc-500 text-[10px] mb-4">Adaptive AI personas.</p>
                                        <Button className="w-full bg-purple-600/80 hover:bg-purple-600 text-white font-bold uppercase tracking-widest text-[10px] h-8">Train</Button>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
