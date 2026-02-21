"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, AnimatePresence } from "framer-motion"
import { Eye, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LightboxModal } from "./lightbox-modal"
import { cn } from "@/lib/utils"

export function PreviewMarquee() {
	const [images, setImages] = useState<string[]>([])
	const [isOpen, setIsOpen] = useState(false)
	const [isManuallyClosed, setIsManuallyClosed] = useState(false)

	// Lightbox State
	const [lightboxOpen, setLightboxOpen] = useState(false)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)

	// Scroll detection
	const { scrollY } = useScroll()
	const [scrolledPastHero, setScrolledPastHero] = useState(false)

	// Fetch images on mount
	useEffect(() => {
		const fetchImages = async () => {
			try {
				const res = await fetch('/api/images')
				const data = await fetchImagesSafe(res)
				if (data && data.length > 0) {
					setImages(data)
				}
			} catch (err) {
				console.error("Failed to fetch images", err)
			}
		}
		fetchImages()
	}, [])

	// Helper to safely parse
	const fetchImagesSafe = async (res: Response) => {
		if (!res.ok) return []
		return await res.json()
	}

	// Monitor Scroll for intelligent closing/opening
	useEffect(() => {
		const unsubscribe = scrollY.onChange((latest) => {
			const pastHero = latest > 500
			setScrolledPastHero(pastHero)

			// Auto close when scrolling past hero
			if (pastHero && isOpen) {
				setIsOpen(false)
				// Reset manual close state so it can auto-open when scrolling back up
				if (!isManuallyClosed) {
					// We keep tracking if they closed it manually originally
				}
			}
			// Auto open when back to top, IF they didn't manually close it previously
			else if (!pastHero && !isOpen && !isManuallyClosed) {
				setIsOpen(true)
			}
		})
		return () => unsubscribe()
	}, [scrollY, isOpen, isManuallyClosed])

	// Initial Open state if images exist
	useEffect(() => {
		if (images.length > 0 && scrollY.get() <= 500 && !isManuallyClosed) {
			setIsOpen(true)
		}
	}, [images, scrollY, isManuallyClosed])

	const togglePreview = () => {
		const newState = !isOpen
		setIsOpen(newState)
		if (!newState) {
			setIsManuallyClosed(true) // Remember they closed it manually
		} else {
			setIsManuallyClosed(false) // Reset if they open it manually
		}
	}

	const openLightbox = (index: number) => {
		setCurrentImageIndex(index % images.length) // modulo just in case it's from the duplicated set
		setLightboxOpen(true)
	}

	if (images.length === 0) return null

	// Duplicate images for infinite scroll without gaps
	const doubledImages = [...images, ...images, ...images] // Tripled for extra safety on wide screens

	return (
		<div className="relative flex flex-col items-center z-50">

			{/* 1. Preview Button in Header */}
			<Button
				onClick={togglePreview}
				className={cn(
					"relative h-10 px-6 rounded-full font-bold uppercase tracking-widest text-[10px] transition-all duration-300 overflow-hidden group border border-transparent",
					isOpen
						? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)]"
						: "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
				)}
			>
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
				<span className="relative z-10 flex items-center gap-2">
					<Eye className={cn("h-4 w-4 transition-colors", isOpen ? "text-cyan-400" : "")} />
					Preview
				</span>
			</Button>

			{/* 2. Marquee Panel & Pipe */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10, height: 0 }}
						animate={{ opacity: 1, y: 0, height: "auto" }}
						exit={{ opacity: 0, y: -10, height: 0 }}
						transition={{ type: "spring", stiffness: 300, damping: 25 }}
						className="absolute top-full flex flex-col items-center mt-2 pointer-events-auto origin-top"
					>
						{/* The Pipe (Translucent Connection) */}
						<div className="w-1 h-6 bg-gradient-to-b from-cyan-500/50 to-transparent backdrop-blur-sm rounded-full mb-1" />

						{/* Glassmorphism Panel */}
						<div className="relative w-[360px] max-w-[90vw] overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] p-4 group/panel">

							{/* Fade Edges */}
							<div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none" />
							<div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/80 to-transparent z-10 pointer-events-none" />
							{/* Marquee Track */}
							<div className="flex gap-4 overflow-hidden mask-gradient-x w-full">
								<motion.div
									className="flex gap-4 w-max"
									animate={{ x: [0, -((160 + 16) * images.length)] }} // 160px width + 16px gap
									transition={{
										repeat: Infinity,
										repeatType: "loop",
										duration: images.length * 3, // Speed based on image count
										ease: "linear",
									}}
								>
									{doubledImages.map((src, idx) => (
										<div
											key={`${src}-${idx}`}
											onClick={() => openLightbox(idx)}
											className="relative w-40 h-24 rounded-lg overflow-hidden cursor-pointer group shrink-0 border border-white/5 group-hover/panel:border-white/10 transition-colors"
										>
											<img
												src={src}
												alt="Preview"
												className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out"
												loading="lazy"
											/>
											<div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay" />
										</div>
									))}
								</motion.div>
							</div>

						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* 3. Lightbox Modal */}
			<LightboxModal
				images={images}
				currentIndex={currentImageIndex}
				isOpen={lightboxOpen}
				onClose={() => setLightboxOpen(false)}
				onNavigate={setCurrentImageIndex}
			/>

		</div>
	)
}
