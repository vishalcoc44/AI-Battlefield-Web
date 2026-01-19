"use client"

import { useState, useEffect } from 'react'
import { dataService, IntelAnnotation } from '@/lib/data-service'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquarePlus } from "lucide-react"
import { sanitizeHtml, classifyError } from '@/lib/utils'
import { toast } from "sonner"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"

interface DossierAnnotationsProps {
	dossierId: string
	contentRef: React.RefObject<HTMLDivElement | null> // Reference to text content container
}

export function DossierAnnotations({ dossierId, contentRef }: DossierAnnotationsProps) {
	const [annotations, setAnnotations] = useState<IntelAnnotation[]>([])
	const [annotationsLoading, setAnnotationsLoading] = useState(true)
	const [annotationsError, setAnnotationsError] = useState<string | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalAnnotations, setTotalAnnotations] = useState(0)
	const [hasMoreAnnotations, setHasMoreAnnotations] = useState(false)

	const ANNOTATIONS_PER_PAGE = 20
	const [showMenu, setShowMenu] = useState(false)
	const [showAnnotationModal, setShowAnnotationModal] = useState(false)
	const [showConfirmationModal, setShowConfirmationModal] = useState(false)
	const [annotationText, setAnnotationText] = useState("")
	const [pendingAnnotation, setPendingAnnotation] = useState<{ text: string, selectedText: string } | null>(null)
	const [selection, setSelection] = useState<{ text: string, x: number, y: number, position?: 'above' | 'below' } | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Fetch annotations with pagination
	const fetchAnnotations = async (page: number = 1) => {
		setAnnotationsLoading(true)
		setAnnotationsError(null)

		try {
			const result = await dataService.getIntelAnnotations(dossierId, page, ANNOTATIONS_PER_PAGE)
			if (page === 1) {
				setAnnotations(result.data)
			} else {
				setAnnotations(prev => [...prev, ...result.data])
			}
			setTotalAnnotations(result.count)
			setHasMoreAnnotations(result.data.length === ANNOTATIONS_PER_PAGE && page * ANNOTATIONS_PER_PAGE < result.count)
			setCurrentPage(page)
		} catch (error) {
			console.error("Failed to load annotations:", error)
			const errorInfo = classifyError(error)
			setAnnotationsError(errorInfo.message)
			toast.error("Failed to load annotations", {
				description: "Annotation features may be limited."
			})
		} finally {
			setAnnotationsLoading(false)
		}
	}

	// Initial load and dossier changes
	useEffect(() => {
		setCurrentPage(1)
		fetchAnnotations(1)
	}, [dossierId])

	// Load more annotations
	const loadMoreAnnotations = () => {
		if (hasMoreAnnotations && !annotationsLoading) {
			fetchAnnotations(currentPage + 1)
		}
	}

	// Handle Selection
	useEffect(() => {
		const container = contentRef.current
		if (!container) return

		const handleMouseUp = () => {
			const sel = window.getSelection()
			if (!sel || sel.isCollapsed || !sel.toString().trim()) {
				setShowMenu(false)
				return
			}

			// Check if selection is inside our container
			if (!container.contains(sel.anchorNode)) return

			const range = sel.getRangeAt(0)
			const rect = range.getBoundingClientRect()

			// Calculate initial position (centered above selection)
			let x = rect.left + (rect.width / 2)
			let y = rect.top - 10
			let position = 'above' // Track if menu is above or below

			// Bound to viewport to prevent off-screen placement
			const menuWidth = 120 // Approximate menu width
			const menuHeight = 40 // Approximate menu height

			// Horizontal bounds
			if (x - menuWidth / 2 < 10) {
				x = 10 + menuWidth / 2 // Left edge margin
			} else if (x + menuWidth / 2 > window.innerWidth - 10) {
				x = window.innerWidth - 10 - menuWidth / 2 // Right edge margin
			}

			// Vertical bounds - check if there's space above
			if (y - menuHeight < 10) {
				// Not enough space above, position below
				y = rect.bottom + 10
				position = 'below'
			}

			setSelection({
				text: sel.toString(),
				x: x,
				y: y,
				position: position
			})
			setShowMenu(true)
		}

		document.addEventListener('mouseup', handleMouseUp)
		return () => document.removeEventListener('mouseup', handleMouseUp)
	}, [contentRef])

	const handleAddAnnotation = () => {
		if (!selection) return
		setAnnotationText("")
		setShowAnnotationModal(true)
		setShowMenu(false)
	}

	const handleSubmitAnnotation = () => {
		if (!selection || !annotationText.trim()) return

		// Show confirmation modal instead of directly submitting
		setPendingAnnotation({ text: annotationText.trim(), selectedText: selection.text })
		setShowAnnotationModal(false)
		setShowConfirmationModal(true)
	}

	const handleConfirmAnnotation = async () => {
		if (!pendingAnnotation || !selection) return

		setIsSubmitting(true)
		try {
			const newAnnotation = await dataService.createIntelAnnotation({
				dossierId,
				selectedText: selection.text,
				comment: pendingAnnotation.text,
				color: 'emerald'
			})

			if (newAnnotation) {
				setAnnotations(prev => [...prev, newAnnotation])
				setShowConfirmationModal(false)
				setPendingAnnotation(null)
				setAnnotationText("")
				window.getSelection()?.removeAllRanges()
				setSelection(null)
				toast.success("Annotation added", {
					description: "Your analysis has been recorded."
				})
			} else {
				toast.error("Failed to add annotation")
			}
		} catch (error) {
			console.error("Error adding annotation:", error)
			toast.error("Failed to add annotation. Please try again.")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<>
			{/* Context Menu for Selection */}
			{showMenu && selection && (
				<div
					className="fixed z-50 animate-in fade-in zoom-in duration-200"
					style={{
						left: selection.x,
						top: selection.y,
						transform: selection.position === 'below' ? 'translate(-50%, 0%)' : 'translate(-50%, -100%)',
						transformOrigin: selection.position === 'below' ? 'center bottom' : 'center top'
					}}
				>
					<Button
						size="sm"
						onClick={handleAddAnnotation}
						className="bg-black border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black shadow-xl"
					>
						<MessageSquarePlus className="h-4 w-4 mr-2" /> Annotate
					</Button>
				</div>
			)}

			{/* Sidebar List of Annotations (Could also be inline highlights) */}
			<div className="fixed right-4 top-24 w-64 space-y-4 pointer-events-none">
				{annotationsLoading ? (
					// Loading skeleton for annotations
					<div className="glass p-3 rounded-lg border-l-2 border-zinc-600 bg-black/80 pointer-events-auto backdrop-blur text-sm">
						<div className="animate-pulse space-y-2">
							<div className="flex justify-between items-start">
								<div className="h-3 bg-zinc-700 rounded w-16"></div>
								<div className="h-3 bg-zinc-700 rounded w-12"></div>
							</div>
							<div className="h-8 bg-zinc-700 rounded"></div>
							<div className="h-4 bg-zinc-700 rounded"></div>
						</div>
					</div>
				) : annotationsError ? (
					// Error state for annotations
					<div className="glass p-3 rounded-lg border-l-2 border-red-500 bg-black/80 pointer-events-auto backdrop-blur text-sm">
						<div className="text-red-400 text-xs">
							Failed to load annotations
						</div>
						<div className="text-zinc-500 text-xs mt-1">
							Annotation features unavailable
						</div>
					</div>
				) : annotations.length === 0 ? (
					// Empty state for annotations
					<div className="glass p-4 rounded-lg border-l-2 border-emerald-500/30 bg-black/80 pointer-events-auto backdrop-blur text-sm">
						<div className="text-center space-y-3">
							<div className="w-8 h-8 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center">
								<MessageSquarePlus className="w-4 h-4 text-emerald-500" />
							</div>
							<div className="space-y-1">
								<div className="text-emerald-400 text-xs font-medium">
									Intelligence Analysis
								</div>
								<div className="text-zinc-400 text-xs">
									No annotations yet
								</div>
								<div className="text-zinc-500 text-xs">
									Highlight text above to add insights
								</div>
							</div>
						</div>
					</div>
				) : (
					<>
						{/* Render annotations */}
						{annotations.map(a => (
							<div key={a.id} className="glass p-3 rounded-lg border-l-2 border-emerald-500 bg-black/80 pointer-events-auto backdrop-blur text-sm animate-in slide-in-from-right-4">
								<div className="flex justify-between items-start mb-1">
									<span className="font-bold text-emerald-500 text-xs">{a.user?.username}</span>
									<span className="text-[10px] text-zinc-500">{new Date(a.createdAt).toLocaleTimeString()}</span>
								</div>
								<p className="text-zinc-400 italic mb-2 border-l-2 border-zinc-700 pl-2 text-xs line-clamp-2">
									"{sanitizeHtml(a.selectedText)}"
								</p>
								<p className="text-white">
									{sanitizeHtml(a.comment)}
								</p>
							</div>
						))}

						{/* Load More Button */}
						{hasMoreAnnotations && (
							<div className="glass p-2 rounded-lg border-l-2 border-zinc-600 bg-black/80 pointer-events-auto backdrop-blur text-sm">
								<button
									onClick={loadMoreAnnotations}
									disabled={annotationsLoading}
									className="w-full text-center text-zinc-400 hover:text-emerald-400 text-xs font-medium transition-colors disabled:opacity-50"
								>
									{annotationsLoading ? 'Loading...' : `Load ${Math.min(ANNOTATIONS_PER_PAGE, totalAnnotations - annotations.length)} more annotations`}
								</button>
								<div className="text-center text-[10px] text-zinc-600 mt-1">
									{annotations.length} of {totalAnnotations} loaded
								</div>
							</div>
						)}
					</>
				)}
			</div>

			{/* Annotation Modal */}
			<Dialog open={showAnnotationModal} onOpenChange={setShowAnnotationModal}>
				<DialogContent className="bg-black/90 border-emerald-500/30 text-white backdrop-blur-xl max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-lg font-black tracking-tighter text-emerald-500">
							<MessageSquarePlus className="h-5 w-5" />
							Add Annotation
						</DialogTitle>
					</DialogHeader>

					{selection && (
						<div className="space-y-4">
							<div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-700">
								<p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Selected Text</p>
								<p className="text-zinc-300 text-sm italic line-clamp-3">
									"{selection.text}"
								</p>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-mono uppercase text-zinc-500">Your Annotation</label>
								<Textarea
									value={annotationText}
									onChange={(e) => setAnnotationText(e.target.value)}
									placeholder="Add your analysis or insight..."
									className="bg-zinc-900/50 border-white/10 focus-visible:ring-emerald-500/50 min-h-[100px]"
									autoFocus
								/>
							</div>

							<div className="flex gap-2 pt-2">
								<Button
									onClick={() => setShowAnnotationModal(false)}
									variant="ghost"
									className="flex-1"
								>
									Cancel
								</Button>
								<Button
									onClick={handleSubmitAnnotation}
									disabled={!annotationText.trim()}
									className="flex-1 bg-emerald-500 text-black hover:bg-emerald-400 font-bold"
								>
									Add Annotation
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Confirmation Modal for Annotation Creation */}
			<ConfirmationModal
				isOpen={showConfirmationModal}
				onClose={() => {
					setShowConfirmationModal(false)
					setPendingAnnotation(null)
					setShowAnnotationModal(true) // Re-open the annotation modal
				}}
				onConfirm={handleConfirmAnnotation}
				title="Add Annotation"
				description={`Are you sure you want to add this annotation to the selected text? This will make your analysis visible to other intelligence officers.`}
				confirmText="Add Annotation"
				cancelText="Review Again"
				variant="info"
				isLoading={isSubmitting}
			/>
		</>
	)
}
