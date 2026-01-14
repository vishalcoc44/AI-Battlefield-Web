"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TopNav } from "@/components/layout/TopNav"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Globe, Lock, Users, Plus, Loader2, Filter, TrendingUp, Calendar, MessageCircle, ScrollText, Zap } from "lucide-react"
import { dataService, type Community } from "@/lib/data-service"
import { supabase } from "@/lib/supabase"
import { CommunityActivityFeed } from "@/components/CommunityActivityFeed"
import { CommunityRules } from "@/components/CommunityRules"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [joiningId, setJoiningId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [showFilters, setShowFilters] = useState(false)
  const [rulesDialogOpen, setRulesDialogOpen] = useState(false)
  const [selectedCommunityForRules, setSelectedCommunityForRules] = useState<Community | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [creatingCommunity, setCreatingCommunity] = useState(false)
  const [newCommunityData, setNewCommunityData] = useState({
    name: '',
    description: '',
    type: 'Public' as 'Public' | 'Private',
    category: 'General',
    tags: '',
    rules: ''
  })

  useEffect(() => {
    async function loadCommunities() {
      setLoading(true)
      const data = await dataService.getCommunities()
      setCommunities(data)
      setLoading(false)
    }
    loadCommunities()
  }, [])

  const handleCreateCommunity = async () => {
    if (!newCommunityData.name.trim()) return

    setCreatingCommunity(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id || 'mock-user'
      const tags = newCommunityData.tags.split(',').map(t => t.trim()).filter(t => t)

      const newCommunity = await dataService.createCommunity({
        name: newCommunityData.name,
        description: newCommunityData.description,
        type: newCommunityData.type,
        category: newCommunityData.category,
        tags,
        rules: newCommunityData.rules || undefined
      }, userId)

      if (newCommunity) {
        setCommunities(prev => [newCommunity, ...prev])
        setCreateDialogOpen(false)
        setNewCommunityData({ name: '', description: '', type: 'Public', category: 'General', tags: '', rules: '' })
      }
    } catch (error) {
      console.error("Failed to create community:", error)
    } finally {
      setCreatingCommunity(false)
    }
  }

  const handleJoin = async (id: string) => {
    try {
      setJoiningId(id)
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id || 'mock-user'
      const response = await dataService.joinCommunity(id, userId)
      if (response.success) alert("Joined community successfully!")
    } catch (error: any) {
      if (error?.code === "23505") alert("You are already a member of this community.")
      else alert("Failed to join community.")
    } finally {
      setJoiningId(null)
    }
  }

  const categories = ["All", ...Array.from(new Set(communities.map(c => c.category)))]

  const filteredCommunities = communities.filter(c => {
    const matchesSearch = (c.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (c.desc?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (c.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) || false)
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const showRules = (community: Community) => {
    setSelectedCommunityForRules(community)
    setRulesDialogOpen(true)
  }

  return (
    <div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-teal-500/30">

      {/* 🌌 Cosmic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050510] to-[#0a1a0f]" />
        <div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
        <div className="bg-noise opacity-[0.15]" />

        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-teal-600/10 rounded-full blur-[120px] animate-slow-spin mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-600/10 rounded-full blur-[120px] animate-slow-spin animation-delay-2000 mix-blend-screen" />
      </div>

      <div className="relative z-10">
        <TopNav />

        <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full space-y-10">

          {/* ⚡ Header Section */}
          <section className="flex flex-col md:flex-row justify-between items-end gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-xs font-mono text-teal-500 tracking-widest uppercase">Nexus Uplink</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 mb-4">
                TRIBE FINDER
              </h1>
              <p className="text-zinc-400 font-light tracking-wide max-w-lg text-lg">
                Find your faction. Align your neural pathways with like-minded strategists.
              </p>
            </div>

            <Button
              className="bg-zinc-100 text-black hover:bg-white border-0 font-bold h-12 px-8 uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="h-5 w-5 mr-2" /> Initialize Tribe
            </Button>
          </section>

          {/* 🔍 Search & Filter HUD */}
          <div className="sticky top-24 z-30 holographic-card rounded-2xl p-2 border-white/10 backdrop-blur-xl flex flex-col sm:flex-row gap-2 shadow-2xl">
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-teal-400 transition-colors" />
              <Input
                placeholder="Search frequencies (name, tag, description)..."
                className="pl-12 bg-transparent border-0 h-12 text-white placeholder:text-zinc-600 focus-visible:ring-0 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 p-1 overflow-x-auto custom-scrollbar">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer px-4 h-10 rounded-xl transition-all border-zinc-800 ${selectedCategory === category
                    ? "bg-zinc-800 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                    }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 📜 Main List */}
            <div className="lg:col-span-9 space-y-6">
              {loading ? (
                <div className="flex justify-center py-32">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-teal-500" />
                    <p className="text-sm text-zinc-500 font-mono animate-pulse">Scanning frequencies...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCommunities.map((comm, index) => (
                    <Card
                      key={comm.id}
                      className="group holographic-card border-white/5 bg-black/40 hover:bg-white/5 transition-all duration-500 cursor-pointer overflow-hidden relative"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('button')) return;
                        router.push(`/communities/${comm.id}`)
                      }}
                    >
                      {/* Hover Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <CardHeader className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <Avatar className="h-16 w-16 border-2 border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500 element-glow">
                            <AvatarFallback className="bg-zinc-900 text-zinc-400 font-black text-xl">
                              {comm.name?.[0] || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <Badge variant="outline" className={`border-white/10 bg-black/50 backdrop-blur-md px-3 py-1 uppercase tracking-wider text-[10px] ${comm.type === 'Private' ? 'text-zinc-500' : 'text-green-400'}`}>
                            {comm.type === 'Private' ? <Lock className="h-3 w-3 mr-1" /> : <Globe className="h-3 w-3 mr-1" />}
                            {comm.type}
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 group-hover:to-white transition-all truncate pr-2">
                          {comm.name}
                        </CardTitle>
                        <p className="text-zinc-500 text-xs font-mono flex items-center gap-2 mt-1">
                          <Users className="h-3 w-3" /> {comm.members} Members
                          <span className="text-zinc-700">|</span>
                          <span>{comm.category}</span>
                        </p>
                      </CardHeader>

                      <CardContent className="relative z-10 space-y-4">
                        <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed min-h-[2.5rem]">
                          {comm.desc}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {comm.tags?.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-1 rounded bg-white/5 text-zinc-400 border border-white/5">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>

                      <CardFooter className="relative z-10 pt-0 pb-6 flex gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 border border-white/10 hover:bg-white/5 hover:text-white"
                          onClick={() => showRules(comm)}
                        >
                          <ScrollText className="h-4 w-4 mr-2" /> Protocol
                        </Button>
                        <Button
                          size="sm"
                          className={`flex-1 ${comm.type === 'Private' ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-teal-600 hover:bg-teal-700'} text-white border-0 font-bold`}
                          onClick={() => handleJoin(comm.id)}
                          disabled={joiningId === comm.id}
                        >
                          {joiningId === comm.id && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                          {comm.type === 'Private' ? 'Request Access' : 'Join Tribe'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* 📊 Side Panel (Trending) */}
            <div className="lg:col-span-3 space-y-6 hidden lg:block">
              <div className="sticky top-40 space-y-6">
                <div className="holographic-card rounded-2xl p-6 border-white/5">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-teal-400">
                    <Zap className="h-4 w-4" /> Live Signals
                  </h3>
                  <CommunityActivityFeed limit={5} />
                </div>

                <div className="relative overflow-hidden rounded-2xl p-6 group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-emerald-800 opacity-90 transition-opacity group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
                  <div className="relative z-10 text-white">
                    <h3 className="font-bold text-lg mb-2">Host Tournament</h3>
                    <p className="text-xs text-white/80 mb-4 leading-relaxed">
                      Create a debate ring for your tribe. Winner takes total dominion.
                    </p>
                    <Button size="sm" className="w-full bg-white text-teal-600 hover:bg-zinc-100 border-0 font-bold">
                      Initialize Event
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>

      {createDialogOpen && (
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Initialize New Tribe</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Establish a new faction in the network.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-500">Tribe Name</label>
                <Input
                  value={newCommunityData.name}
                  onChange={(e) => setNewCommunityData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-zinc-900 border-white/10 focus-visible:ring-teal-500"
                  placeholder="e.g. The Rationalists"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-500">Description</label>
                <Input
                  value={newCommunityData.description}
                  onChange={(e) => setNewCommunityData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-zinc-900 border-white/10 focus-visible:ring-teal-500"
                  placeholder="Manifesto..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-500">Access</label>
                  <select
                    className="w-full h-10 rounded-md bg-zinc-900 border border-white/10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={newCommunityData.type}
                    onChange={(e) => setNewCommunityData(prev => ({ ...prev, type: e.target.value as any }))}
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-500">Category</label>
                  <select
                    className="w-full h-10 rounded-md bg-zinc-900 border border-white/10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={newCommunityData.category}
                    onChange={(e) => setNewCommunityData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="General">General</option>
                    <option value="Technology">Technology</option>
                    <option value="Philosophy">Philosophy</option>
                  </select>
                </div>
              </div>
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold"
                onClick={handleCreateCommunity}
                disabled={creatingCommunity}
              >
                {creatingCommunity ? <Loader2 className="h-4 w-4 animate-spin" /> : "Establish Tribe"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Rules Dialog */}
      <Dialog open={rulesDialogOpen} onOpenChange={setRulesDialogOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Tribe Protocol</DialogTitle>
          </DialogHeader>
          {selectedCommunityForRules && (
            <CommunityRules community={selectedCommunityForRules} showHeader={false} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
