"use client"

import { useState, useEffect, useRef, KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { TopNav } from "@/components/layout/TopNav"
import { Button } from "@/components/ui/button"
import { Ghost, VenetianMask, ScanFace, User, ArrowRight, Loader2 } from "lucide-react"
import { CosmicBackground } from "@/components/ui/cosmic-background"
import { useVoidSession } from "@/hooks/useVoidSession"
import { EnterVoidModal } from "@/components/void/EnterVoidModal"
import { VoidEmptyState } from "@/components/void/VoidEmptyState"
import { useUser } from "@/hooks/use-user"
import { VOID_CONSTANTS } from "@/lib/constants/void"
import { throttle } from "@/lib/utils"
import { showToast } from "@/lib/toast"
import { VoidMask } from "@/lib/types"

// Icon mapping
const ICON_MAP = {
	venetian_mask: VenetianMask,
	user: User,
	ghost: Ghost,
	scan_face: ScanFace,
}

export default function VoidPage() {
	const router = useRouter()
	const { user } = useUser()
	const { masks, stats, isLoading: statsLoading, createSession, isCreating } = useVoidSession()
	const [selectedMask, setSelectedMask] = useState<VoidMask | null>(null)
	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
	const maskRefs = useRef<(HTMLDivElement | null)[]>([])

	// Check authentication on mount
	useEffect(() => {
		if (user === null) {
			// Still loading
			return
		}
		if (!user) {
			router.push('/auth')
		}
	}, [user, router])

	// Load selected mask from localStorage on mount
	useEffect(() => {
		const savedMask = localStorage.getItem(VOID_CONSTANTS.STORAGE_KEYS.SELECTED_MASK)
		const expiry = localStorage.getItem(VOID_CONSTANTS.STORAGE_KEYS.SELECTED_MASK_EXPIRY)

		if (savedMask && expiry) {
			const expiryTime = parseInt(expiry, 10)
			if (Date.now() < expiryTime) {
				try {
					const mask = JSON.parse(savedMask)
					// Verify mask still exists in available masks
					const foundMask = masks.find((m) => m.id === mask.id)
					if (foundMask) {
						setSelectedMask(foundMask)
					}
				} catch (err) {
					console.error('Failed to parse saved mask:', err)
				}
			} else {
				// Expired, clear it
				localStorage.removeItem(VOID_CONSTANTS.STORAGE_KEYS.SELECTED_MASK)
				localStorage.removeItem(VOID_CONSTANTS.STORAGE_KEYS.SELECTED_MASK_EXPIRY)
			}
		}
	}, [masks])

	// Save selected mask to localStorage
	useEffect(() => {
		if (selectedMask) {
			const expiry = Date.now() + VOID_CONSTANTS.UI.MASK_SELECTION_EXPIRY_MS
			localStorage.setItem(VOID_CONSTANTS.STORAGE_KEYS.SELECTED_MASK, JSON.stringify(selectedMask))
			localStorage.setItem(VOID_CONSTANTS.STORAGE_KEYS.SELECTED_MASK_EXPIRY, expiry.toString())
		}
	}, [selectedMask])

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: globalThis.KeyboardEvent) => {
			if (showConfirmModal) return

			// Arrow keys to navigate masks
			if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
				e.preventDefault()
				const currentIndex = focusedIndex !== null ? focusedIndex : (selectedMask ? masks.findIndex((m) => m.id === selectedMask.id) : 0)
				let newIndex = currentIndex

				if (e.key === 'ArrowLeft') {
					newIndex = currentIndex > 0 ? currentIndex - 1 : masks.length - 1
				} else {
					newIndex = currentIndex < masks.length - 1 ? currentIndex + 1 : 0
				}

				setFocusedIndex(newIndex)
				setSelectedMask(masks[newIndex])
				maskRefs.current[newIndex]?.focus()
			}

			// Enter to confirm selection
			if (e.key === 'Enter' && selectedMask) {
				e.preventDefault()
				setShowConfirmModal(true)
			}

			// Escape to clear selection
			if (e.key === 'Escape') {
				setSelectedMask(null)
				setFocusedIndex(null)
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [masks, selectedMask, focusedIndex, showConfirmModal])

	// Throttled handle enter
	const handleEnterVoid = throttle(async () => {
		if (!selectedMask) return

		try {
			await createSession(selectedMask.id)
		} catch (err) {
			console.error('Failed to create session:', err)
		}
	}, 2000)

	const handleMaskSelect = (mask: VoidMask) => {
		setSelectedMask(mask)
		setFocusedIndex(masks.findIndex((m) => m.id === mask.id))
	}

	const handleConfirmEnter = () => {
		setShowConfirmModal(false)
		handleEnterVoid()
	}

	// Use masks from hook, fallback to defaults
	const availableMasks = masks.length > 0 ? masks : VOID_CONSTANTS.DEFAULT_MASKS.map((mask, index) => ({
		id: `default-${index}`,
		name: mask.name,
		iconType: mask.iconType,
		color: mask.color,
		isActive: true,
		createdAt: new Date().toISOString(),
	}))

	// Get icon component
	const getIcon = (iconType: string) => {
		const IconComponent = ICON_MAP[iconType as keyof typeof ICON_MAP] || Ghost
		return <IconComponent className="h-12 w-12" />
	}

	return (
		<div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
			{/* 🌌 Cosmic Background */}
			<CosmicBackground theme="monochrome" />

			<div className="relative z-10 flex flex-col min-h-screen">
				<TopNav />
				<main className="flex-1 p-4 md:p-12 max-w-7xl mx-auto w-full flex flex-col justify-center items-center space-y-16">
					<div className="text-center space-y-6 relative">
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/5 rounded-full blur-[100px] -z-10" />
						<Ghost className="h-24 w-24 mx-auto text-white/80 animate-float drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
						<h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 drop-shadow-2xl">
							THE VOID
						</h1>
						<p className="text-zinc-400 text-xl font-light max-w-2xl mx-auto leading-relaxed">
							Enter the anonymous realm. Ideas stand alone here. <br />
							<span className="text-white font-medium">No ego. No history. Pure signal.</span>
						</p>
					</div>

					<div className="w-full max-w-5xl space-y-8">
						<h3 className="text-center font-bold text-zinc-500 uppercase tracking-[0.2em] text-sm">
							Select Your Identity Protocol
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{availableMasks.map((mask, i) => {
								const isSelected = selectedMask?.id === mask.id
								const IconComponent = ICON_MAP[mask.iconType as keyof typeof ICON_MAP] || Ghost

								return (
									<div
										key={mask.id}
										ref={(el) => (maskRefs.current[i] = el)}
										tabIndex={0}
										role="button"
										aria-label={`Select identity mask: ${mask.name}`}
										aria-pressed={isSelected}
										className={`holographic-card rounded-2xl p-8 cursor-pointer transition-all duration-500 group relative overflow-hidden active:scale-95 ${
											isSelected
												? 'ring-2 ring-white/70 bg-white/10 scale-105 shadow-[0_0_50px_rgba(255,255,255,0.1)]'
												: 'hover:bg-white/5 hover:scale-105'
										}`}
										onClick={() => handleMaskSelect(mask)}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault()
												handleMaskSelect(mask)
											}
										}}
									>
										<div
											className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${
												i === 0
													? 'from-orange-500/20'
													: i === 1
														? 'from-blue-500/20'
														: i === 2
															? 'from-purple-500/20'
															: 'from-emerald-500/20'
											} to-transparent`}
										/>

										<div className="relative z-10 flex flex-col items-center gap-6">
											<div
												className={`transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ${
													isSelected ? 'animate-bounce' : ''
												}`}
												style={{ color: mask.color }}
											>
												<IconComponent className="h-12 w-12" />
											</div>
											<div className="text-center space-y-1">
												<span
													className={`block font-black text-lg tracking-wide uppercase truncate max-w-full ${
														isSelected ? 'text-white' : 'text-zinc-400'
													} group-hover:text-white transition-colors`}
													title={mask.name}
												>
													{mask.name}
												</span>
												<span className="block text-[10px] text-zinc-600 font-mono tracking-widest group-hover:text-zinc-400">
													ENCRYPTED
												</span>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>

					<div className="w-full max-w-md space-y-8 pt-8">
						<Button
							className={`w-full h-20 text-xl font-black uppercase tracking-[0.2em] transition-all duration-500 rounded-full border-0 relative overflow-hidden group ${
								selectedMask
									? 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:shadow-[0_0_80px_rgba(255,255,255,0.5)] scale-110'
									: 'bg-zinc-900 text-zinc-600 opacity-50 cursor-not-allowed border border-white/5'
							}`}
							disabled={!selectedMask || isCreating}
							onClick={() => setShowConfirmModal(true)}
							aria-label={selectedMask ? `Enter The Void as ${selectedMask.name}` : 'Select an identity mask first'}
						>
							{selectedMask && (
								<div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-300/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
							)}
							<span className="relative z-10 flex items-center gap-4">
								{isCreating ? (
									<>
										<Loader2 className="h-6 w-6 animate-spin" />
										Entering...
									</>
								) : selectedMask ? (
									<>
										Initialize Link <ArrowRight className="h-6 w-6 animate-pulse" />
									</>
								) : (
									<>
										Select Identity <ArrowRight className="h-6 w-6" />
									</>
								)}
							</span>
						</Button>

						<div className="flex items-center justify-center gap-3 text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
							{statsLoading ? (
								<Loader2 className="h-3 w-3 animate-spin" />
							) : (
								<>
									<span className="relative flex h-2 w-2">
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
										<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
									</span>
									{stats.activePhantoms > 0 ? (
										<span>{stats.activePhantoms} Phantoms Active</span>
									) : (
										<VoidEmptyState />
									)}
								</>
							)}
						</div>
					</div>
				</main>
			</div>

			<EnterVoidModal
				open={showConfirmModal}
				onOpenChange={setShowConfirmModal}
				mask={selectedMask}
				onConfirm={handleConfirmEnter}
				isLoading={isCreating}
			/>
		</div>
	)
}
