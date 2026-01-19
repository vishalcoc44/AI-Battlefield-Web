"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TopNav } from "@/components/layout/TopNav"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2, Plus, RefreshCw, Activity } from "lucide-react"
import { CosmicBackground } from "@/components/ui/cosmic-background"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { useBeliefs } from "@/hooks/useBeliefs"
import { BeliefCard } from "@/components/beliefs/BeliefCard"
import { BeliefMetrics, BeliefMetricsSkeleton } from "@/components/beliefs/BeliefMetrics"
import { EmptyBeliefState } from "@/components/beliefs/EmptyBeliefState"
import { BeliefFormModal } from "@/components/beliefs/BeliefFormModal"
import { BeliefFilters, BeliefFiltersSkeleton } from "@/components/beliefs/BeliefFilters"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import { BELIEF_CONSTANTS } from "@/lib/constants/belief"
import type { Belief, CreateBeliefRequest, UpdateBeliefRequest } from "@/types/belief"

export default function BeliefTrackerPage() {
  const router = useRouter()

  // State management
  const {
    beliefs,
    metrics,
    loading,
    error,
    hasMore,
    filters,
    setFilters,
    resetFilters,
    refresh,
    loadMore,
    createBelief,
    updateBelief,
    deleteBelief,
    syncWithDebates,
    isAuthenticated,
  } = useBeliefs()

  // Local state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingBelief, setEditingBelief] = useState<any>(null)
  const [deletingBeliefId, setDeletingBeliefId] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  // Redirect to auth if not authenticated
  if (!isAuthenticated && !loading) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white items-center justify-center">
        <CosmicBackground theme="purple" />
        <div className="relative z-10 text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold">Authentication Required</h2>
          <p className="text-zinc-400">Please sign in to view your belief tracker.</p>
          <Button onClick={() => router.push('/auth')}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  // Handle sync with debates
  const handleSyncWithDebates = async () => {
    setIsSyncing(true)
    try {
      await syncWithDebates()
    } finally {
      setIsSyncing(false)
    }
  }

  // Handle belief creation
  const handleCreateBelief = async (data: CreateBeliefRequest) => {
    await createBelief(data)
  }

  // Handle belief editing
  const handleEditBelief = (belief: Belief) => {
    setEditingBelief(belief)
  }

  // Handle belief update
  const handleUpdateBelief = async (beliefId: string, data: UpdateBeliefRequest) => {
    await updateBelief(beliefId, data)
    setEditingBelief(null)
  }

  // Handle belief deletion
  const handleDeleteBelief = async (beliefId: string) => {
    setDeletingBeliefId(beliefId)
  }

  // Confirm belief deletion
  const confirmDeleteBelief = async () => {
    if (!deletingBeliefId) return

    const success = await deleteBelief(deletingBeliefId)
    if (success) {
      // Success toast is already shown in the hook
    }
    setDeletingBeliefId(null)
  }

  return (
    <ErrorBoundary>
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

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                className="gap-2 bg-black/40 border-white/10 hover:bg-white/5 hover:text-white transition-all rounded-full h-10 px-6 font-bold uppercase tracking-widest text-[10px]"
              >
                {isRefreshing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
                Refresh
              </Button>

              <Button
                onClick={() => setShowCreateModal(true)}
                className="gap-2 bg-white text-black hover:bg-zinc-200 font-bold rounded-full h-10 px-6 uppercase tracking-widest text-[10px]"
              >
                <Plus className="h-3 w-3" />
                Add Belief
              </Button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-bold">Error:</span>
                {error}
              </div>
              <Button
                onClick={refresh}
                variant="outline"
                size="sm"
                className="mt-2 border-red-500/20 text-red-400 hover:bg-red-500/10"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Metrics Section */}
          {loading ? (
            <BeliefMetricsSkeleton />
          ) : (
            <BeliefMetrics
              metrics={metrics}
              onSync={handleSyncWithDebates}
              isSyncing={isSyncing}
            />
          )}

          {/* Filters Section */}
          {loading ? (
            <BeliefFiltersSkeleton />
          ) : (
            <BeliefFilters
              filters={filters}
              onFiltersChange={setFilters}
              onResetFilters={resetFilters}
              totalResults={beliefs.length}
            />
          )}

          {/* Beliefs Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
                <Activity className="h-6 w-6 text-zinc-500" />
                Cognitive Ledger
              </h3>

              {beliefs.length > 0 && (
                <div className="text-sm text-zinc-400">
                  {beliefs.length} belief{beliefs.length === 1 ? '' : 's'}
                  {filters.search && ' (filtered)'}
                </div>
              )}
            </div>

            {/* Empty State */}
            {!loading && beliefs.length === 0 && (
              <EmptyBeliefState onCreateBelief={() => setShowCreateModal(true)} />
            )}

            {/* Beliefs Grid */}
            {beliefs.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {beliefs.map((belief) => (
                    <BeliefCard
                      key={belief.id}
                      belief={belief}
                      onEdit={handleEditBelief}
                      onDelete={handleDeleteBelief}
                      showActions={true}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center pt-8">
                    <Button
                      onClick={loadMore}
                      disabled={loading}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/5"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Load More Beliefs'
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Loading State */}
            {loading && beliefs.length === 0 && (
              <div className="flex justify-center py-12">
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto" />
                  <p className="text-zinc-400">Loading your beliefs...</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Belief Modal */}
      <BeliefFormModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        belief={null}
        onSubmit={handleCreateBelief}
      />

      {/* Edit Belief Modal */}
      <BeliefFormModal
        open={!!editingBelief}
        onOpenChange={(open) => !open && setEditingBelief(null)}
        belief={editingBelief}
        onSubmit={handleUpdateBelief}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingBeliefId}
        onClose={() => setDeletingBeliefId(null)}
        title="Delete Belief"
        description={BELIEF_CONSTANTS.CONFIRMATION_MESSAGES.DELETE_BELIEF}
        onConfirm={confirmDeleteBelief}
        confirmText="Delete"
        variant="danger"
      />
      </div>
    </ErrorBoundary>
  )
}
