"use client"

import { TopNav } from "@/components/layout/TopNav"
import { CosmicBackground } from "@/components/ui/cosmic-background"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Calendar, Lock, Shield, Eye, Database, FileCode, FileAudio, AlertTriangle, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, use, useRef } from "react"
import { dataService, IntelDossier, IntelRecord } from "@/lib/data-service"
import { cn, sanitizeHtml, classifyError, useNetworkStatus, withRetry } from "@/lib/utils"
import { useDecryption } from "@/hooks/intel/useDecryption"
import { toast } from "sonner"
import { WiretapPlayer } from "@/components/intel/WiretapPlayer"
import { CredibilityMeter } from "@/components/intel/CredibilityMeter"
import { DossierAnnotations } from "@/components/intel/DossierAnnotations"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts"

export default function IntelDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const router = useRouter()
	const { isOnline } = useNetworkStatus()
	const resolvedParams = use(params)
	const [dossier, setDossier] = useState<IntelDossier | null>(null)
	const [records, setRecords] = useState<IntelRecord[]>([])
	const [loading, setLoading] = useState(true)
	const [recordsLoading, setRecordsLoading] = useState(true)
	const [error, setError] = useState<{ message: string; type: string; retryable: boolean } | null>(null)
	const [isRetrying, setIsRetrying] = useState(false)
	const contentRef = useRef<HTMLDivElement>(null)

	// Decryption hook for title and description
	const { displayText: title } = useDecryption(dossier?.title, { speed: 50, enabled: !loading })
	const { displayText: description } = useDecryption(dossier?.description, { speed: 10, enabled: !loading })

	useEffect(() => {
		const loadData = async () => {
			// Check network status before making requests
			if (!isOnline) {
				const errorInfo = classifyError(new Error('Offline'))
				setError(errorInfo)
				toast.error(errorInfo.message, {
					description: "Check your internet connection and try again."
				})
				setLoading(false)
				setRecordsLoading(false)
				return
			}

			setLoading(true)
			setRecordsLoading(true)
			try {
				const [dossierData, recordsData] = await Promise.all([
					dataService.getIntelDossierById(resolvedParams.id),
					dataService.getIntelRecords(resolvedParams.id)
				])
				setDossier(dossierData)
				setRecords(recordsData)
			} catch (error) {
				console.error("Failed to load dossier details", error)
				const errorInfo = classifyError(error)
				setError(errorInfo)
				toast.error(errorInfo.message, {
					description: "Failed to load dossier details"
				})
			} finally {
				setLoading(false)
				setRecordsLoading(false)
			}
		}
		loadData()
	}, [resolvedParams.id, isOnline])

	// Error recovery with exponential backoff
	const handleRetry = async () => {
		if (isRetrying) return // Prevent multiple concurrent retries

		setIsRetrying(true)
		setError(null) // Clear error state before retry

		const loadData = async () => {
			setLoading(true)
			setRecordsLoading(true)
			const [dossierData, recordsData] = await Promise.all([
				dataService.getIntelDossierById(resolvedParams.id),
				dataService.getIntelRecords(resolvedParams.id)
			])
			setDossier(dossierData)
			setRecords(recordsData)
			setLoading(false)
			setRecordsLoading(false)
		}

		try {
			await withRetry(
				loadData,
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
			setLoading(false)
			setRecordsLoading(false)
			toast.error(errorInfo.message, {
				description: "Failed to load dossier details after multiple attempts"
			})
		} finally {
			setIsRetrying(false)
		}
	}

	if (loading) {
		return (
			<div className="dark min-h-screen bg-black text-white p-12 flex items-center justify-center">
				<div className="text-emerald-500 animate-pulse flex flex-col items-center gap-4">
					<Database className="h-12 w-12 animate-spin duration-[3000ms]" />
					<p className="font-mono text-sm uppercase tracking-widest">Decrypting Dossier...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="dark min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4">
				<AlertTriangle className="h-16 w-16 text-red-500" />
				<h1 className="text-2xl font-bold">
					{error.type === 'auth' ? 'Authentication Required' :
					 error.type === 'permission' ? 'Access Denied' :
					 error.type === 'network' ? 'Connection Failed' :
					 'Error Loading Dossier'}
				</h1>
				<p className="text-zinc-400 text-center max-w-md">{error.message}</p>
				<div className="flex gap-2">
					{error.retryable && (
						<Button
							onClick={handleRetry}
							disabled={isRetrying}
							variant="outline"
							className="disabled:opacity-50"
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
					<Button onClick={() => router.back()} variant="outline">Return to Ops</Button>
				</div>
			</div>
		)
	}

	if (!dossier) {
		return (
			<div className="dark min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4">
				<Lock className="h-16 w-16 text-red-500" />
				<h1 className="text-2xl font-bold">Dossier Not Found</h1>
				<Button onClick={() => router.back()} variant="outline">Return to Ops</Button>
			</div>
		)
	}

	return (
		<ErrorBoundary>
			<div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-emerald-500/30">
				<CosmicBackground theme="emerald" />

				<div className="relative z-10 flex flex-col min-h-screen">
				<TopNav />

				{/* Network Status Banner */}
				{!isOnline && (
					<div className="bg-red-600/90 text-white px-4 py-2 text-center text-sm font-medium border-b border-red-500/50">
						<div className="flex items-center justify-center gap-2">
							<div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
							You're offline. Some features may not work properly.
						</div>
					</div>
				)}

				<main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full">

					{/* Breadcrumb Navigation */}
					<nav className="mb-8" aria-label="Breadcrumb">
						<ol className="flex items-center space-x-2 text-sm text-zinc-400">
							<li>
								<button
									onClick={() => router.push('/intel')}
									className="hover:text-emerald-400 transition-colors"
								>
									Intel Ops
								</button>
							</li>
							<li className="flex items-center">
								<span className="mx-2 text-zinc-600">/</span>
								<span className="text-zinc-500">{dossier?.category || 'Unknown'}</span>
							</li>
							<li className="flex items-center">
								<span className="mx-2 text-zinc-600">/</span>
								<span className="text-zinc-300 truncate max-w-xs">{dossier?.title || 'Loading...'}</span>
							</li>
						</ol>
					</nav>

					<header className="mb-12 border-l-4 border-emerald-500 pl-6 py-2">
						<div className="flex items-center gap-3 mb-2">
							<span className={cn(
								"text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border",
								dossier.status === 'Classified' ? "border-red-500/30 text-red-500" : "border-emerald-500/30 text-emerald-500"
							)}>
								{dossier.status} {/* {dossier.category} */}
							</span>
							<span className="text-zinc-500 text-xs font-mono flex items-center gap-1">
								<Calendar className="h-3 w-3" />
								{new Date(dossier.createdAt).toLocaleDateString()}
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 font-mono min-h-[3rem] break-words overflow-wrap-anywhere">
							{sanitizeHtml(title)}
						</h1>
						<p ref={contentRef} className="text-xl text-zinc-400 max-w-2xl leading-relaxed font-mono min-h-[6rem] selection:bg-emerald-500/50 selection:text-white break-words overflow-wrap-anywhere">
							{sanitizeHtml(description)}
						</p>

						{dossier && (
							<DossierAnnotations dossierId={dossier.id} contentRef={contentRef} />
						)}
					</header>

					<div className="grid gap-6">
						<h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-2">
							<Shield className="h-4 w-4" /> Attached Records
						</h2>

						{recordsLoading ? (
							// Records loading skeleton
							<div className="space-y-4">
								{[1, 2, 3].map((i) => (
									<div key={i} className="glass p-6 rounded-xl border-l-4 border-l-zinc-800 animate-pulse">
										<div className="flex items-start gap-4">
											<div className="w-12 h-12 bg-zinc-800 rounded-lg" />
											<div className="flex-1 space-y-3">
												<div className="h-5 bg-zinc-800 rounded w-1/3" />
												<div className="h-4 bg-zinc-800 rounded w-2/3" />
												<div className="h-4 bg-zinc-800 rounded w-1/2" />
												<div className="flex gap-4 mt-4">
													<div className="h-8 bg-zinc-800 rounded w-24" />
													<div className="h-4 bg-zinc-800 rounded w-16" />
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						) : records.length === 0 ? (
							<div className="glass p-8 rounded-xl text-center border-l-4 border-l-zinc-700">
								<p className="text-zinc-500">No records found for this dossier.</p>
							</div>
						) : (
							records.map((record) => (
								<div key={record.id} className="glass p-6 rounded-xl border-l-4 border-l-emerald-500/50 hover:bg-white/5 transition-all group group-hover:border-l-emerald-400">
									<div className="flex justify-between items-start">
										<div className="flex items-start gap-4">
											<div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500 mt-1">
												{record.contentType === 'pdf' ? <FileText className="h-5 w-5" /> :
													record.contentType === 'image' ? <Eye className="h-5 w-5" /> :
														record.contentType === 'audio' ? <FileAudio className="h-5 w-5" /> :
															<FileCode className="h-5 w-5" />}
											</div>
											<div>
												<h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
													{record.title}
												</h3>
												<p className="text-zinc-400 text-sm mt-1 mb-3 max-w-2xl">
													{record.summary || "No summary provided."}
												</p>

												<div className="mb-4 w-full max-w-xs">
													<CredibilityMeter score={record.confidenceScore || 85} size="sm" />
												</div>

												{record.contentType === 'audio' && (
													<div className="mb-4 w-full max-w-md">
														<WiretapPlayer title={record.title} src={record.contentUrl} />
													</div>
												)}
												<div className="flex items-center gap-4">
													{record.contentUrl && (
														<a
															href={record.contentUrl}
															target="_blank"
															rel="noopener noreferrer"
															className="text-xs bg-emerald-500 text-black font-bold px-3 py-1.5 rounded-full hover:bg-emerald-400 transition-colors"
														>
															ACCESS FILE
														</a>
													)}
													<span className="text-[10px] text-zinc-600 font-mono">
														ID: {record.id.slice(0, 8)}...
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</main>
			</div>

			{/* Keyboard Shortcuts Help */}
			<KeyboardShortcuts />
		</div>
	</ErrorBoundary>
	)
}
