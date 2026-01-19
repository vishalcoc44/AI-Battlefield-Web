"use client"

import { TopNav } from "@/components/layout/TopNav"
import { Database, FolderLock, AlertTriangle, RefreshCw, ChevronDown } from "lucide-react"
import { CosmicBackground } from "@/components/ui/cosmic-background"
import { IntelDossierCard, IntelDossierSkeleton } from "@/components/intel/IntelDossierCard"
import { IntelSearch } from "@/components/intel/IntelSearch"
import { SecureDropModal } from "@/components/intel/SecureDropModal"
import { GlobalHeatmap } from "@/components/intel/GlobalHeatmap"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts"
import { useState, useEffect, useCallback } from "react"
import { dataService, IntelDossier, IntelSubmission } from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"
import { classifyError, useNetworkStatus, withRetry } from "@/lib/utils"
import { toast } from "sonner"

export default function IntelPage() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const { isOnline } = useNetworkStatus()
	const [mounted, setMounted] = useState(false)

	const [dossiers, setDossiers] = useState<IntelDossier[]>([])
	const [initialLoading, setInitialLoading] = useState(true)
	const [loadMoreLoading, setLoadMoreLoading] = useState(false)
	const [error, setError] = useState<{ message: string; type: string; retryable: boolean } | null>(null)
	const [isRetrying, setIsRetrying] = useState(false)
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(false)
	const [totalCount, setTotalCount] = useState(0)
	const [submissions, setSubmissions] = useState<IntelSubmission[]>([])
	const [submissionsLoading, setSubmissionsLoading] = useState(false)

	// Prevent hydration mismatch by only showing network banner after mount
	useEffect(() => {
		setMounted(true)
	}, [])

	// Constants
	const MAX_PAGES = 100

	// derived state from URL
	const searchQuery = searchParams.get("q") || ""
	const categoryFilter = searchParams.get("category")

	const fetchDossiers = useCallback(async (isLoadMore = false) => {
		// Check network status before making requests
		if (!isOnline) {
			const errorInfo = classifyError(new Error('Offline'))
			setError(errorInfo)
			toast.error(errorInfo.message, {
				description: "Check your internet connection and try again."
			})
			return
		}

		if (isLoadMore) {
			setLoadMoreLoading(true)
		} else {
			setInitialLoading(true)
		}
		setError(null)
		try {
			const currentPage = isLoadMore ? page + 1 : 1

			const { data, count } = await dataService.getIntelDossiers({
				page: currentPage,
				limit: 9, // Grid 3x3
				search: searchQuery,
				filters: categoryFilter ? { category: categoryFilter } : undefined
			})

			setTotalCount(count)

			if (isLoadMore) {
				setDossiers(prev => {
					const newDossiers = [...prev, ...data]
					setHasMore(newDossiers.length < count)
					return newDossiers
				})
				setPage(currentPage)
			} else {
				setDossiers(data)
				setHasMore(data.length < count)
				setPage(1)
			}


		} catch (err) {
			console.error("Failed to fetch dossiers", err)
			const errorInfo = classifyError(err)
			setError(errorInfo)
			toast.error(errorInfo.message, {
				description: "Failed to load intelligence archives"
			})
		} finally {
			if (isLoadMore) {
				setLoadMoreLoading(false)
			} else {
				setInitialLoading(false)
			}
		}
	}, [searchQuery, categoryFilter, page])

	// Error recovery with exponential backoff
	const handleRetry = async () => {
		if (isRetrying) return // Prevent multiple concurrent retries

		setIsRetrying(true)
		setError(null) // Clear error state before retry

		try {
			await withRetry(
				() => fetchDossiers(false),
				3, // max attempts
				1000, // base delay
				(error) => {
					// Only retry network and timeout errors
					const errorInfo = classifyError(error)
					return errorInfo.retryable && (errorInfo.type === 'network' || errorInfo.type === 'timeout' || errorInfo.type === 'server')
				}
			)
		} catch (retryError) {
			// If all retries fail, show the final error
			console.error("All retry attempts failed:", retryError)
			const errorInfo = classifyError(retryError)
			setError(errorInfo)
			toast.error(errorInfo.message, {
				description: "Failed to load intelligence archives after multiple attempts"
			})
		} finally {
			setIsRetrying(false)
		}
	}

	// Initial load & URL changes
	useEffect(() => {
		// Reset and fetch when URL params change
		// We avoid adding 'page' to dep array to avoid infinite loop with load more
		// Instead we manually reset logic in fetchDossiers(false)
		fetchDossiers(false)

		// Fetch user submissions
		const fetchSubmissions = async () => {
			setSubmissionsLoading(true)
			try {
				const userSubmissions = await dataService.getUserIntelSubmissions()
				setSubmissions(userSubmissions)
			} catch (error) {
				console.error("Failed to fetch user submissions:", error)
				// Silently fail for now as submissions are not displayed
			} finally {
				setSubmissionsLoading(false)
			}
		}
		fetchSubmissions()
	}, [searchQuery, categoryFilter])


	const handleSearch = (query: string) => {
		const params = new URLSearchParams(searchParams.toString())
		if (query) params.set("q", query)
		else params.delete("q")
		router.replace(`/intel?${params.toString()}`)
	}

	const handleFilterChange = (filter: string | null) => {
		const params = new URLSearchParams(searchParams.toString())
		if (filter) params.set("category", filter)
		else params.delete("category")
		router.replace(`/intel?${params.toString()}`)
	}

	const handleLoadMore = () => {
		if (page >= MAX_PAGES) return
		fetchDossiers(true)
	}

	return (
		<ErrorBoundary>
			<div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-emerald-500/30">
				{/* 🌌 Cosmic Background - Matrix Theme */}
				<CosmicBackground theme="emerald" />

				<div className="relative z-10 flex flex-col min-h-screen">
				<TopNav />

				{/* Network Status Banner - Only show after mount to prevent hydration mismatch */}
				{mounted && !isOnline && (
					<div className="bg-red-600/90 text-white px-4 py-2 text-center text-sm font-medium border-b border-red-500/50">
						<div className="flex items-center justify-center gap-2">
							<div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
							You're offline. Some features may not work properly.
						</div>
					</div>
				)}

				<main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full flex flex-col items-center">

					<div className="text-center space-y-4 mb-12">
						<div className="inline-flex p-3 bg-emerald-500/10 rounded-xl text-emerald-500 mb-2 border border-emerald-500/20">
							<Database className="h-8 w-8" />
						</div>
						<h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
							INTEL OPS
						</h1>
						<p className="text-lg text-zinc-400 max-w-xl mx-auto">
							Classified dossiers. Steel-manned arguments. The source of truth.
						</p>
						<div className="mt-6 flex gap-4 w-full max-w-2xl justify-center">
							<SecureDropModal onSuccess={() => fetchDossiers(false)} />
						</div>
					</div>

					{/* Phase 5 Batch 3: Global Heatmap */}
					{!initialLoading && dossiers.length > 0 && (
						<div className="w-full max-w-5xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
							<GlobalHeatmap dossiers={dossiers} />
						</div>
					)}


					<IntelSearch
						onSearch={handleSearch}
						onFilterChange={handleFilterChange}
						disabled={initialLoading}
					/>

					{error ? (
						<div className="text-center space-y-4 p-8 border border-red-500/20 bg-red-500/5 rounded-xl max-w-md">
							<AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
							<h3 className="text-xl font-bold text-red-500">
								{error.type === 'auth' ? 'Authentication Required' :
								 error.type === 'permission' ? 'Access Denied' :
								 error.type === 'network' ? 'Connection Failed' :
								 error.type === 'timeout' ? 'Request Timeout' :
								 error.type === 'server' ? 'Server Error' :
								 'Error'}
							</h3>
							<p className="text-zinc-400">{error.message}</p>
							{error.retryable && (
								<Button
									onClick={handleRetry}
									disabled={isRetrying}
									variant="outline"
									className="border-red-500/50 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
								>
									{isRetrying ? (
										<>
											<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
											Retrying with exponential backoff...
										</>
									) : (
										<>
											<RefreshCw className="mr-2 h-4 w-4" />
											Retry with Smart Backoff
										</>
									)}
								</Button>
							)}
						</div>
					) : (
						<div className="w-full">
							{initialLoading && !dossiers.length ? (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
									{[1, 2, 3, 4, 5, 6].map((i) => (
										<IntelDossierSkeleton key={i} />
									))}
								</div>
							) : dossiers.length === 0 ? (
								<div className="text-center py-20 space-y-6">
									<div className="inline-flex p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 mb-2">
										<FolderLock className="h-12 w-12" />
									</div>
									<div className="space-y-3">
										<h3 className="text-2xl font-bold text-white">Intelligence Archive Empty</h3>
										<p className="text-zinc-400 max-w-md mx-auto">
											No dossiers have been created yet. Be the first to contribute classified intelligence to the archive.
										</p>
									</div>
									<div className="pt-4">
										<SecureDropModal onSuccess={() => fetchDossiers(false)} />
									</div>
									<div className="text-xs text-zinc-500 pt-4 border-t border-zinc-800/50">
										<p>Intelligence dossiers help agents make informed decisions and track global threats.</p>
									</div>
								</div>
							) : (
								<div className="flex flex-col items-center w-full gap-8">
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-in fade-in duration-500 slide-in-from-bottom-4">
										{dossiers.map((dossier) => (
											<IntelDossierCard
												key={dossier.id}
												dossier={dossier}
												userXp={150} // Mock XP for demo: Unlocks <150, Locks >150
											/>
										))}
									</div>

									{hasMore && page < MAX_PAGES && (
										<Button
											onClick={handleLoadMore}
											disabled={loadMoreLoading}
											variant="outline"
											className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 w-full max-w-xs"
										>
											{loadMoreLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <ChevronDown className="mr-2 h-4 w-4" />}
											{loadMoreLoading ? "Decrypting..." : "Load More Archives"}
										</Button>
									)}
									{hasMore && page >= MAX_PAGES && (
										<div className="text-center text-xs text-zinc-500 mt-4">
											Maximum page limit reached (100 pages)
										</div>
									)}
								</div>
							)}
						</div>
					)}

				</main>
			</div>

			{/* Keyboard Shortcuts Help */}
			<KeyboardShortcuts />
		</div>
	</ErrorBoundary>
	)
}
