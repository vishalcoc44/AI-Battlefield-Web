"use client"

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Activity } from 'lucide-react'
import { cn } from "@/lib/utils"

interface WiretapPlayerProps {
	src?: string
	title?: string
	autoPlay?: boolean
}

export function WiretapPlayer({ src, title, autoPlay = false }: WiretapPlayerProps) {
	const [theme, setTheme] = useState<'emerald' | 'amber' | 'red'>('emerald')
	const [isPlaying, setIsPlaying] = useState(false)
	const [progress, setProgress] = useState(0)
	const [volume, setVolume] = useState(1)
	const [duration, setDuration] = useState(0)
	const [currentTime, setCurrentTime] = useState(0)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const audioRef = useRef<HTMLAudioElement>(null)

	// Fake waveform bars for visual effect
	const [bars, setBars] = useState<number[]>(Array(40).fill(10))

	// Helper function to format time
	const formatTime = (seconds: number): string => {
		if (isNaN(seconds)) return "0:00"
		const mins = Math.floor(seconds / 60)
		const secs = Math.floor(seconds % 60)
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

	// Initialize audio element
	useEffect(() => {
		const audio = audioRef.current
		if (!audio || !src) return

		const handleLoadedMetadata = () => {
			setDuration(audio.duration)
			setIsLoading(false)
		}

		const handleTimeUpdate = () => {
			setCurrentTime(audio.currentTime)
			setProgress((audio.currentTime / audio.duration) * 100)
		}

		const handleEnded = () => {
			setIsPlaying(false)
			setProgress(100)
		}

		const handleError = () => {
			setError('Failed to load audio file')
			setIsLoading(false)
		}

		const handleLoadStart = () => {
			setIsLoading(true)
			setError(null)
		}

		audio.addEventListener('loadedmetadata', handleLoadedMetadata)
		audio.addEventListener('timeupdate', handleTimeUpdate)
		audio.addEventListener('ended', handleEnded)
		audio.addEventListener('error', handleError)
		audio.addEventListener('loadstart', handleLoadStart)

		return () => {
			audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
			audio.removeEventListener('timeupdate', handleTimeUpdate)
			audio.removeEventListener('ended', handleEnded)
			audio.removeEventListener('error', handleError)
			audio.removeEventListener('loadstart', handleLoadStart)
		}
	}, [src])

	// Handle play/pause
	const togglePlayback = async () => {
		const audio = audioRef.current
		if (!audio) return

		try {
			if (isPlaying) {
				audio.pause()
				setIsPlaying(false)
			} else {
				await audio.play()
				setIsPlaying(true)
			}
		} catch (err) {
			setError('Failed to play audio')
			console.error('Audio playback error:', err)
		}
	}

	// Handle seeking
	const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
		const audio = audioRef.current
		if (!audio || !duration) return

		const rect = event.currentTarget.getBoundingClientRect()
		const clickX = event.clientX - rect.left
		const percentage = clickX / rect.width
		const newTime = percentage * duration

		audio.currentTime = newTime
		setCurrentTime(newTime)
		setProgress(percentage * 100)
	}

	// Handle volume change
	const handleVolumeChange = (event: React.MouseEvent<HTMLDivElement>) => {
		const audio = audioRef.current
		if (!audio) return

		const rect = event.currentTarget.getBoundingClientRect()
		const clickX = event.clientX - rect.left
		const percentage = Math.max(0, Math.min(1, clickX / rect.width))

		audio.volume = percentage
		setVolume(percentage)
	}

	// Fake waveform animation when playing
	useEffect(() => {
		if (!isPlaying) return

		const interval = setInterval(() => {
			setBars(prev => prev.map(() => Math.random() * 80 + 10))
		}, 100)

		return () => clearInterval(interval)
	}, [isPlaying])

	return (
		<div className={cn(
			"rounded-xl border p-4 bg-black/50 backdrop-blur-sm relative overflow-hidden group transition-all",
			theme === 'emerald' ? "border-emerald-500/30" : "border-red-500/30"
		)}>
			{/* Hidden HTML5 Audio Element */}
			{src && (
				<audio
					ref={audioRef}
					src={src}
					preload="metadata"
					autoPlay={autoPlay}
					onPlay={() => setIsPlaying(true)}
					onPause={() => setIsPlaying(false)}
					onLoadedData={() => setIsLoading(false)}
				/>
			)}

			{/* Scanned Grid Background */}
			<div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

			<div className="flex items-center gap-4 relative z-10">
				<button
					onClick={togglePlayback}
					disabled={!src || isLoading || !!error}
					className={cn(
						"h-12 w-12 rounded-full flex items-center justify-center border transition-all",
						isPlaying
							? "bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
							: "bg-black/50 text-emerald-500 border-emerald-500/30 hover:border-emerald-500",
						(!src || isLoading || !!error) && "opacity-50 cursor-not-allowed"
					)}
				>
					{isLoading ? (
						<div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
					) : error ? (
						<VolumeX className="h-5 w-5" />
					) : isPlaying ? (
						<Pause className="h-5 w-5" />
					) : (
						<Play className="h-5 w-5 ml-1" />
					)}
				</button>

				<div className="flex-1 space-y-2">
					<div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest text-zinc-500">
						<span className="flex items-center gap-2">
							<Activity className={cn("h-3 w-3", isPlaying && "animate-pulse text-emerald-500", error && "text-red-500")} />
							{error ? "AUDIO_ERROR" : title || "INTERCEPTED_AUDIO_FILE_099.wav"}
						</span>
						<span>
							{error ? "ERROR" : isLoading ? "LOADING" : isPlaying ? "PLAYING" : "PAUSED"}
						</span>
					</div>

					{/* Progress Bar */}
					{src && !error && (
						<div
							className="h-2 bg-zinc-800 rounded-full cursor-pointer hover:bg-zinc-700 transition-colors"
							onClick={handleSeek}
						>
							<div
								className="h-full bg-emerald-500 rounded-full transition-all duration-100"
								style={{ width: `${progress}%` }}
							/>
						</div>
					)}

					{/* Waveform Visualizer */}
					<div className="h-8 flex items-end gap-0.5 opacity-80">
						{bars.map((height, i) => (
							<div
								key={i}
								className={cn(
									"w-1 rounded-t-sm transition-all duration-75",
									error ? "bg-red-500" : isPlaying ? "bg-emerald-500" : "bg-zinc-800"
								)}
								style={{
									height: error ? "40%" : `${isPlaying ? height : 10}%`,
									opacity: src ? 1 : 0.5
								}}
							/>
						))}
					</div>

					{/* Time Display */}
					{src && !error && (
						<div className="flex justify-between text-xs font-mono text-zinc-600">
							<span>{formatTime(currentTime)}</span>
							<span>{formatTime(duration)}</span>
						</div>
					)}
				</div>
			</div>

			{/* Volume Control */}
			{src && !error && (
				<div className="flex items-center gap-2">
					<button
						onClick={() => {
							const audio = audioRef.current
							if (audio) {
								audio.muted = !audio.muted
							}
						}}
						className="text-zinc-500 hover:text-emerald-500 transition-colors"
					>
						<Volume2 className="h-4 w-4" />
					</button>
					<div
						className="w-16 h-1 bg-zinc-800 rounded-full cursor-pointer hover:bg-zinc-700 transition-colors"
						onClick={handleVolumeChange}
					>
						<div
							className="h-full bg-emerald-500 rounded-full transition-all"
							style={{ width: `${volume * 100}%` }}
						/>
					</div>
				</div>
			)}

			{/* Spinning Tape Animation (Cosmetic) */}
			<div className="absolute right-4 top-4 opacity-10">
				<div className={cn(
					"w-16 h-16 border-2 border-dashed border-white rounded-full flex items-center justify-center",
					isPlaying && "animate-spin duration-[3000ms]"
				)}>
					<div className="w-4 h-4 bg-white/20 rounded-full" />
				</div>
			</div>
		</div>
	)
}
