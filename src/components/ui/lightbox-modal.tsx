import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LightboxModalProps {
	images: string[]
	currentIndex: number
	isOpen: boolean
	onClose: () => void
	onNavigate: (index: number) => void
}

export function LightboxModal({
	images,
	currentIndex,
	isOpen,
	onClose,
	onNavigate
}: LightboxModalProps) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		return () => setMounted(false)
	}, [])

	// Handle keyboard navigation
	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'Escape':
					onClose()
					break
				case 'ArrowLeft':
					onNavigate((currentIndex - 1 + images.length) % images.length)
					break
				case 'ArrowRight':
					onNavigate((currentIndex + 1) % images.length)
					break
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		// Prevent body scroll when open
		document.body.style.overflow = 'hidden'

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = 'unset'
		}
	}, [isOpen, currentIndex, images.length, onClose, onNavigate])

	if (!isOpen || images.length === 0) return null
	if (!mounted) return null

	const activeImage = images[currentIndex]

	// Spring animations for navigation
	const slideVariants = {
		fixed: { opacity: 1, scale: 1, x: 0 },
		initial: (direction: number) => ({
			opacity: 0,
			scale: 0.95,
			x: direction > 0 ? 100 : -100
		})
	}

	return createPortal(
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
			>
				{/* Ambient Depth Background - blurred version of the active image */}
				<div
					className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-3xl opacity-30 scale-110 transition-all duration-700 ease-in-out"
					style={{ backgroundImage: `url(${activeImage})` }}
				/>

				{/* Click to close area */}
				<div className="absolute inset-0 z-0" onClick={onClose} />

				{/* Modal Content - Full Screen Flex Container */}
				<div className="relative z-10 flex h-full w-full items-center justify-center p-4 sm:p-12 pointer-events-none overflow-hidden">
					{/* Left Arrow */}
					<div className="absolute left-4 sm:left-12 z-20 pointer-events-auto">
						<Button
							variant="ghost"
							size="icon"
							onClick={(e) => { e.stopPropagation(); onNavigate((currentIndex - 1 + images.length) % images.length) }}
							className="h-12 w-12 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all hover:scale-110"
						>
							<ChevronLeft className="h-6 w-6" />
						</Button>
					</div>

					{/* Image Container - Let it take exactly the available space minus padding */}
					<div className="relative flex h-full w-full items-center justify-center pointer-events-none">
						<motion.img
							key={currentIndex}
							src={activeImage}
							alt={`Preview preview ${currentIndex + 1}`}
							className="h-auto w-auto max-h-full max-w-full rounded-2xl object-contain shadow-2xl border border-white/10 pointer-events-auto"
							initial="initial"
							animate="fixed"
							exit={{ opacity: 0, scale: 0.95 }}
							variants={slideVariants}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
						/>
					</div>

					{/* Right Arrow */}
					<div className="absolute right-4 sm:right-12 z-20 pointer-events-auto">
						<Button
							variant="ghost"
							size="icon"
							onClick={(e) => { e.stopPropagation(); onNavigate((currentIndex + 1) % images.length) }}
							className="h-12 w-12 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all hover:scale-110"
						>
							<ChevronRight className="h-6 w-6" />
						</Button>
					</div>
				</div>

				{/* Top Controls: Indicator & Close */}
				<div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none w-full px-6">
					<div className="flex items-center gap-4">
						{/* Glass Pill Indicator */}
						<div className="rounded-full bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 text-sm font-medium tracking-widest text-white shadow-xl tabular-nums">
							{String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
						</div>
					</div>
				</div>

				{/* Close Button Top Right */}
				<div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 pointer-events-auto">
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 hover:bg-red-500/80 hover:border-red-500 transition-all hover:scale-110 hover:rotate-90"
					>
						<X className="h-5 w-5" />
					</Button>
				</div>
			</motion.div>
		</AnimatePresence>
	, document.body)
}
