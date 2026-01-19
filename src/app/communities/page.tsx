"use client"

import { useEffect, useState, useCallback, useRef } from "react"
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
import { COMMUNITY_CONSTANTS } from "@/lib/constants/communities"
import { CommunityCreateFormData, DEFAULT_COMMUNITY_CREATE_DATA } from "@/lib/types/community-forms"
import { validateCommunityData } from "@/lib/utils/validation"
import { classifyError, withRetry, sanitizeText } from "@/lib/utils"
import { showToast } from "@/lib/toast"
import { CommunityActivityFeed } from "@/components/CommunityActivityFeed"
import { CommunityRules } from "@/components/CommunityRules"
import { CommunityErrorState } from "@/components/CommunityErrorState"
import { CommunityEmptyState } from "@/components/CommunityEmptyState"
import { CommunityCardSkeleton } from "@/components/CommunityCardSkeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [joiningId, setJoiningId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [showFilters, setShowFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState<{
    type?: 'Public' | 'Private'
    activityLevel?: 'Low' | 'Medium' | 'High'
    memberCountRange?: { min?: number; max?: number }
  }>({})
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'member_count' | 'activity_level'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [rulesDialogOpen, setRulesDialogOpen] = useState(false)
  const [selectedCommunityForRules, setSelectedCommunityForRules] = useState<Community | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [creatingCommunity, setCreatingCommunity] = useState(false)
  const [newCommunityData, setNewCommunityData] = useState<CommunityCreateFormData>(DEFAULT_COMMUNITY_CREATE_DATA)
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string[]}>({})
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // Helper to determine if Load More should be shown
  const shouldShowLoadMore = hasMore && !loading && !error && communities.length >= COMMUNITY_CONSTANTS.COMMUNITIES_LIST_LIMIT

  // Load saved create form data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(COMMUNITY_CONSTANTS.LOCAL_STORAGE_KEYS.COMMUNITY_CREATE_DRAFT)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        // Only use saved data if it's recent (within 1 hour)
        if (Date.now() - parsedData.timestamp < 60 * 60 * 1000) {
          setNewCommunityData(parsedData.data)
        }
      } catch (error) {
        console.error('Failed to parse saved create form data:', error)
      }
    }
  }, [])

  // Save create form data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      data: newCommunityData,
      timestamp: Date.now()
    }
    localStorage.setItem(COMMUNITY_CONSTANTS.LOCAL_STORAGE_KEYS.COMMUNITY_CREATE_DRAFT, JSON.stringify(dataToSave))
  }, [newCommunityData])

  const loadCommunitiesWithRetry = async (page: number = 0, append: boolean = false) => {
    if (page === 0) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    setError(null)
    try {
      const shouldUseSearch = debouncedSearchTerm.trim() || Object.keys(advancedFilters).length > 0

      const data = await withRetry(
        () => {
          if (shouldUseSearch) {
            return dataService.searchCommunities(
              debouncedSearchTerm.trim(),
              {
                category: selectedCategory !== 'All' ? selectedCategory : undefined,
                ...advancedFilters
              },
              sortBy,
              sortOrder,
              COMMUNITY_CONSTANTS.COMMUNITIES_LIST_LIMIT,
              page * COMMUNITY_CONSTANTS.COMMUNITIES_LIST_LIMIT
            )
          } else {
            return dataService.getCommunities(
              COMMUNITY_CONSTANTS.COMMUNITIES_LIST_LIMIT,
              page * COMMUNITY_CONSTANTS.COMMUNITIES_LIST_LIMIT,
              sortBy,
              sortOrder
            )
          }
        },
        3, // max attempts
        1000, // base delay
        (error) => {
          const classification = classifyError(error)
          return classification.retryable
        }
      )

      if (append) {
        setCommunities(prev => [...prev, ...data])
      } else {
        setCommunities(data)
      }

      // Check if we have more data
      setHasMore(data.length === COMMUNITY_CONSTANTS.COMMUNITIES_LIST_LIMIT)
      setCurrentPage(page)
    } catch (err: any) {
      console.error("Failed to load communities:", err)
      const classification = classifyError(err)
      setError(classification.message)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    loadCommunitiesWithRetry()

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // "/" to focus search
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
        searchInput?.focus()
      }

      // "c" to open create dialog
      if (e.key === 'c' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        e.preventDefault()
        setCreateDialogOpen(true)
      }

      // "Escape" to close dialogs
      if (e.key === 'Escape') {
        if (createDialogOpen) {
          setCreateDialogOpen(false)
        } else if (rulesDialogOpen) {
          setRulesDialogOpen(false)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      if (joinTimeoutRef.current) {
        clearTimeout(joinTimeoutRef.current)
      }
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [createDialogOpen, rulesDialogOpen])

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, COMMUNITY_CONSTANTS.DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset pagination when filters or sorting change
  useEffect(() => {
    setCurrentPage(0)
    setHasMore(true)
    loadCommunitiesWithRetry(0, false)
  }, [debouncedSearchTerm, selectedCategory, advancedFilters, sortBy, sortOrder])

  const handleCreateCommunity = async () => {
    // Validate form data
    const tags = newCommunityData.tags.split(',').map(t => t.trim()).filter(t => t)
    const validation = validateCommunityData({
      ...newCommunityData,
      tags
    })

    if (!validation.isValid) {
      setValidationErrors(validation.fieldErrors)
      return
    }

    setCreatingCommunity(true)
    setValidationErrors({})
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        showToast.error("Authentication Required", "Please sign in to create a community.")
        return
      }
      const userId = user.id

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
        setNewCommunityData(DEFAULT_COMMUNITY_CREATE_DATA)
        setValidationErrors({})
        // Clear saved draft data since it was successfully created
        localStorage.removeItem(COMMUNITY_CONSTANTS.LOCAL_STORAGE_KEYS.COMMUNITY_CREATE_DRAFT)
        showToast.success("Community Created", "Your new tribe has been established!")
      }
    } catch (error) {
      console.error("Failed to create community:", error)
      showToast.error("Creation Failed", "Unable to create community. Please try again.")
    } finally {
      setCreatingCommunity(false)
    }
  }

  const joinTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleJoin = useCallback(async (id: string) => {
    // Prevent race conditions - check if already joining
    if (joiningId) return

    // Clear any existing timeout
    if (joinTimeoutRef.current) {
      clearTimeout(joinTimeoutRef.current)
    }

    // Set debouncing timeout to prevent rapid clicks
    joinTimeoutRef.current = setTimeout(async () => {
      try {
        setJoiningId(id)
        const { data: { user } } = await supabase.auth.getUser()
        const userId = user?.id || 'mock-user'
      const response = await dataService.joinCommunity(id, userId)
      if (response.success) showToast.success("Welcome!", "You have successfully joined the community.")
    } catch (error: any) {
      if (error?.code === "23505") showToast.warning("Already a Member", "You are already part of this community.")
      else showToast.error("Join Failed", "Unable to join community. Please try again.")
    } finally {
        setJoiningId(null)
      }
    }, COMMUNITY_CONSTANTS.DEBOUNCE_DELAY)
  }, [joiningId])

  const categories = ["All", ...(communities ? Array.from(new Set(communities.map(c => c.category))) : [])]

  const showRules = (community: Community) => {
    setSelectedCommunityForRules(community)
    setRulesDialogOpen(true)
  }

  return (
    <TooltipProvider>
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
                aria-label="Search communities"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchTerm('')
                    setSelectedCategory('All')
                  }
                }}
                className={`${searchTerm !== debouncedSearchTerm ? 'ring-1 ring-yellow-500/50' : ''}`}
              />
            </div>
            <div
              className="flex gap-2 p-1 overflow-x-auto custom-scrollbar"
              role="tablist"
              aria-label="Community categories"
            >
              {categories.map((category, index) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer px-4 h-10 rounded-xl transition-all border-zinc-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-black ${selectedCategory === category
                    ? "bg-zinc-800 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                    }`}
                  onClick={() => setSelectedCategory(category)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedCategory(category)
                    } else if (e.key === 'ArrowRight' && index < categories.length - 1) {
                      e.preventDefault()
                      const nextBadge = e.currentTarget.nextElementSibling as HTMLElement
                      nextBadge?.focus()
                    } else if (e.key === 'ArrowLeft' && index > 0) {
                      e.preventDefault()
                      const prevBadge = e.currentTarget.previousElementSibling as HTMLElement
                      prevBadge?.focus()
                    }
                  }}
                  tabIndex={selectedCategory === category ? 0 : -1}
                  role="tab"
                  aria-selected={selectedCategory === category}
                  aria-label={`Filter by ${category} category`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="holographic-card rounded-2xl p-6 border-white/5 bg-black/20 backdrop-blur-sm animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400">Advanced Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-500">Sort By</label>
                  <select
                    className="w-full h-10 rounded-md bg-zinc-900 border border-white/10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  >
                    <option value="created_at">Date Created</option>
                    <option value="name">Name</option>
                    <option value="member_count">Member Count</option>
                    <option value="activity_level">Activity Level</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-500">Sort Order</label>
                  <select
                    className="w-full h-10 rounded-md bg-zinc-900 border border-white/10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                  >
                    <option value="desc">Newest/Oldest First</option>
                    <option value="asc">Oldest/Newest First</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-500">Community Type</label>
                  <select
                    className="w-full h-10 rounded-md bg-zinc-900 border border-white/10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={advancedFilters.type || ''}
                    onChange={(e) => setAdvancedFilters(prev => ({
                      ...prev,
                      type: e.target.value as 'Public' | 'Private' || undefined
                    }))}
                  >
                    <option value="">All Types</option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-500">Activity Level</label>
                  <select
                    className="w-full h-10 rounded-md bg-zinc-900 border border-white/10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={advancedFilters.activityLevel || ''}
                    onChange={(e) => setAdvancedFilters(prev => ({
                      ...prev,
                      activityLevel: e.target.value as 'Low' | 'Medium' | 'High' || undefined
                    }))}
                  >
                    <option value="">All Activity Levels</option>
                    <option value="Low">Low Activity</option>
                    <option value="Medium">Medium Activity</option>
                    <option value="High">High Activity</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-500">Member Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-20 h-10 rounded-md bg-zinc-900 border border-white/10 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={advancedFilters.memberCountRange?.min || ''}
                      onChange={(e) => setAdvancedFilters(prev => ({
                        ...prev,
                        memberCountRange: {
                          ...prev.memberCountRange,
                          min: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      }))}
                      min="0"
                    />
                    <span className="text-zinc-500 self-center">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-20 h-10 rounded-md bg-zinc-900 border border-white/10 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={advancedFilters.memberCountRange?.max || ''}
                      onChange={(e) => setAdvancedFilters(prev => ({
                        ...prev,
                        memberCountRange: {
                          ...prev.memberCountRange,
                          max: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      }))}
                      min="0"
                    />
                  </div>
                  <p className="text-xs text-zinc-600">Coming soon - requires database update</p>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => {
                    setAdvancedFilters({})
                    setSearchTerm('')
                    setSelectedCategory('All')
                    setSortBy('created_at')
                    setSortOrder('desc')
                  }}
                  variant="outline"
                  className="border-white/10 hover:bg-white/5"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}

          {/* Filter Toggle */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="text-zinc-400 hover:text-teal-400 transition-colors"
            >
              {showFilters ? 'Hide Filters' : 'Show Advanced Filters'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 📜 Main List */}
            <div className="lg:col-span-9 space-y-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <CommunityCardSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <CommunityErrorState onRetry={loadCommunitiesWithRetry} />
              ) : communities.length === 0 ? (
                <CommunityEmptyState
                  title={debouncedSearchTerm || Object.keys(advancedFilters).length > 0 ? "No Matches Found" : "No Communities Initialized"}
                  description={
                    debouncedSearchTerm || Object.keys(advancedFilters).length > 0
                      ? `No communities match your search criteria. Try adjusting your filters.`
                      : "The network is quiet. Be the first to establish a tribe."
                  }
                  actionLabel={debouncedSearchTerm || Object.keys(advancedFilters).length > 0 ? "Clear Filters" : "Initialize Tribe"}
                  onAction={
                    debouncedSearchTerm || Object.keys(advancedFilters).length > 0
                      ? () => {
                          setSearchTerm("")
                          setSelectedCategory("All")
                          setAdvancedFilters({})
                        }
                      : () => setCreateDialogOpen(true)
                  }
                />
              ) : (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  role="grid"
                  aria-label="Community list"
                >
                  {communities.map((comm, index) => (
                    <Card
                      key={comm.id}
                      className="group holographic-card border-white/5 bg-black/40 hover:bg-white/5 focus-within:bg-white/5 focus-within:ring-2 focus-within:ring-teal-500/50 transition-all duration-500 cursor-pointer overflow-hidden relative"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('button')) return;
                        router.push(`/communities/${comm.id}`)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          router.push(`/communities/${comm.id}`)
                        }
                      }}
                      tabIndex={0}
                      role="gridcell"
                      aria-label={`Community: ${comm.name}, ${comm.members} members, category: ${comm.category}, ${comm.type}`}
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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 group-hover:to-white transition-all truncate pr-2 cursor-pointer">
                              {comm.name}
                            </CardTitle>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs break-words">{comm.name}</p>
                          </TooltipContent>
                        </Tooltip>
                        <p className="text-zinc-500 text-xs font-mono flex items-center gap-2 mt-1">
                          <Users className="h-3 w-3" /> {comm.members} Members
                          <span className="text-zinc-700">|</span>
                          <span>{comm.category}</span>
                        </p>
                      </CardHeader>

                      <CardContent className="relative z-10 space-y-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed min-h-[2.5rem] break-words cursor-pointer">
                              {sanitizeText(comm.desc)}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-sm break-words">{sanitizeText(comm.desc)}</p>
                          </TooltipContent>
                        </Tooltip>
                        <div className="flex flex-wrap gap-2">
                          {comm.tags?.slice(0, 3).map(tag => (
                            <Tooltip key={tag}>
                              <TooltipTrigger asChild>
                                <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-zinc-400 border border-white/5 truncate max-w-[80px] cursor-pointer">
                                  #{tag}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>#{tag}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                          {comm.tags && comm.tags.length > 3 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-zinc-500 border border-white/5 cursor-pointer">
                                  +{comm.tags.length - 3} more
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  {comm.tags.slice(3).map(tag => (
                                    <p key={tag}>#{tag}</p>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="relative z-10 pt-0 pb-6 flex gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 border border-white/10 hover:bg-white/5 hover:text-white focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-black"
                          onClick={() => showRules(comm)}
                          aria-label={`View community rules for ${comm.name}`}
                        >
                          <ScrollText className="h-4 w-4 mr-2" aria-hidden="true" /> Protocol
                        </Button>
                        <Button
                          size="sm"
                          className={`flex-1 ${comm.type === 'Private' ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-teal-600 hover:bg-teal-700'} text-white border-0 font-bold focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black`}
                          onClick={() => handleJoin(comm.id)}
                          disabled={joiningId === comm.id}
                          aria-label={comm.type === 'Private' ? `Request access to ${comm.name}` : `Join ${comm.name} community`}
                          aria-disabled={joiningId === comm.id}
                        >
                          {joiningId === comm.id && <Loader2 className="mr-2 h-3 w-3 animate-spin" aria-hidden="true" />}
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
          <DialogContent
            className="bg-zinc-950 border-white/10 text-white sm:max-w-xl"
            aria-labelledby="create-community-title"
            aria-describedby="create-community-description"
          >
            <DialogHeader>
              <DialogTitle id="create-community-title">Initialize New Tribe</DialogTitle>
              <DialogDescription id="create-community-description" className="text-zinc-400">
                Establish a new faction in the network.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="community-name" className="text-xs font-bold uppercase text-zinc-500">Tribe Name</label>
                <Input
                  id="community-name"
                  value={newCommunityData.name}
                  onChange={(e) => {
                    setNewCommunityData(prev => ({ ...prev, name: e.target.value }))
                    // Clear validation error when user starts typing
                    if (validationErrors.name) {
                      setValidationErrors(prev => ({ ...prev, name: undefined }))
                    }
                  }}
                  className={`bg-zinc-900 border-white/10 focus-visible:ring-teal-500 ${validationErrors.name ? 'border-red-500' : ''}`}
                  placeholder="e.g. The Rationalists"
                  aria-describedby={validationErrors.name ? "name-error" : undefined}
                  aria-invalid={!!validationErrors.name}
                />
                {validationErrors.name && (
                  <p id="name-error" className="text-xs text-red-400" role="alert">{validationErrors.name[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="community-description" className="text-xs font-bold uppercase text-zinc-500">Description</label>
                <Input
                  id="community-description"
                  value={newCommunityData.description}
                  onChange={(e) => {
                    setNewCommunityData(prev => ({ ...prev, description: e.target.value }))
                    if (validationErrors.description) {
                      setValidationErrors(prev => ({ ...prev, description: undefined }))
                    }
                  }}
                  className={`bg-zinc-900 border-white/10 focus-visible:ring-teal-500 ${validationErrors.description ? 'border-red-500' : ''}`}
                  placeholder="Manifesto..."
                  aria-describedby={validationErrors.description ? "description-error" : undefined}
                  aria-invalid={!!validationErrors.description}
                />
                {validationErrors.description && (
                  <p id="description-error" className="text-xs text-red-400" role="alert">{validationErrors.description[0]}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="community-type" className="text-xs font-bold uppercase text-zinc-500">Access</label>
                  <select
                    id="community-type"
                    className="w-full h-10 rounded-md bg-zinc-900 border border-white/10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={newCommunityData.type}
                    onChange={(e) => setNewCommunityData(prev => ({ ...prev, type: e.target.value as any }))}
                    aria-label="Community access type"
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="community-category" className="text-xs font-bold uppercase text-zinc-500">Category</label>
                  <select
                    id="community-category"
                    className="w-full h-10 rounded-md bg-zinc-900 border border-white/10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={newCommunityData.category}
                    onChange={(e) => setNewCommunityData(prev => ({ ...prev, category: e.target.value }))}
                    aria-label="Community category"
                  >
                    <option value="General">General</option>
                    <option value="Technology">Technology</option>
                    <option value="Philosophy">Philosophy</option>
                  </select>
                </div>
              </div>
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-zinc-950"
                onClick={handleCreateCommunity}
                disabled={creatingCommunity}
                aria-describedby={creatingCommunity ? "creating-status" : undefined}
              >
                {creatingCommunity && <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />}
                {creatingCommunity ? "Establishing Tribe..." : "Establish Tribe"}
                {creatingCommunity && <span id="creating-status" className="sr-only">Creating community, please wait</span>}
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
    </TooltipProvider>
  )
}
