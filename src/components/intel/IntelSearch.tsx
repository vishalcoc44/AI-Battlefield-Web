"use client"

import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface IntelSearchProps {
	onSearch: (query: string) => void
	onFilterChange: (filter: string | null) => void
	disabled?: boolean
}

export function IntelSearch({ onSearch, onFilterChange, disabled }: IntelSearchProps) {
	const [activeFilter, setActiveFilter] = useState<string | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const [searchValue, setSearchValue] = useState("")
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	// Debounced search function
	const debouncedSearch = useCallback((value: string) => {
		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current)
		}
		debounceTimeoutRef.current = setTimeout(() => {
			onSearch(value)
		}, 300) // 300ms delay
	}, [onSearch])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key === "k") {
				e.preventDefault()
				inputRef.current?.focus()
			}
		}
		window.addEventListener("keydown", handleKeyDown)
		return () => {
			window.removeEventListener("keydown", handleKeyDown)
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current)
			}
		}
	}, [])

	const filters = [
		{ id: 'Active', label: 'Active Reports' },
		{ id: 'Project', label: 'Projects' },
		{ id: 'Op', label: 'Ops' },
		{ id: 'Classified', label: 'Classified' }
	]

	const handleFilterClick = (id: string) => {
		// Preserve focus on search input when filter changes
		const wasFocused = inputRef.current === document.activeElement

		if (activeFilter === id) {
			setActiveFilter(null)
			onFilterChange(null)
		} else {
			setActiveFilter(id)
			onFilterChange(id)
		}

		// Restore focus to search input after filter change
		if (wasFocused) {
			setTimeout(() => {
				inputRef.current?.focus()
			}, 0)
		}
	}

	const handleFilterKeyDown = (e: React.KeyboardEvent, filterId: string) => {
		const currentIndex = filters.findIndex(f => f.id === filterId)

		switch (e.key) {
			case 'Enter':
			case ' ':
				e.preventDefault()
				handleFilterClick(filterId)
				break
			case 'ArrowRight':
			case 'ArrowDown':
				e.preventDefault()
				const nextIndex = (currentIndex + 1) % filters.length
				document.querySelector(`[data-filter-id="${filters[nextIndex].id}"]`)?.focus()
				break
			case 'ArrowLeft':
			case 'ArrowUp':
				e.preventDefault()
				const prevIndex = currentIndex === 0 ? filters.length - 1 : currentIndex - 1
				document.querySelector(`[data-filter-id="${filters[prevIndex].id}"]`)?.focus()
				break
		}
	}

	return (
		<div className="w-full max-w-4xl mx-auto mb-12 space-y-6">
			<div className="relative">
				<div className="absolute inset-0 bg-emerald-500/10 blur-xl opacity-20" />
				<div className="relative flex items-center bg-black/80 backdrop-blur-xl border border-white/10 rounded-full p-2 h-16 shadow-2xl transition-all focus-within:border-emerald-500/50">
					<Search className="ml-4 h-5 w-5 text-zinc-500" />
					<Input
						ref={inputRef}
						placeholder="Search archives..."
						aria-label="Search intelligence archives"
						className="bg-transparent border-0 focus-visible:ring-0 text-lg px-4 text-white placeholder:text-zinc-600 h-full w-full"
						value={searchValue}
						onChange={(e) => {
							const value = e.target.value
							setSearchValue(value)
							debouncedSearch(value)
						}}
						disabled={disabled}
					/>
					<div className="hidden md:flex items-center gap-2 pr-4 text-xs text-zinc-600 font-mono">
						<span className="border border-white/10 px-2 py-1 rounded">CTRL+K</span>
					</div>
				</div>
			</div>

			<div className="flex flex-wrap justify-center gap-2">
				<div className="flex items-center gap-2 mr-4 text-xs font-mono text-emerald-500/70 uppercase tracking-widest">
					<Filter className="h-3 w-3" /> Filters
				</div>

				{filters.map((filter) => (
					<button
						key={filter.id}
						data-filter-id={filter.id}
						onClick={() => handleFilterClick(filter.id)}
						onKeyDown={(e) => handleFilterKeyDown(e, filter.id)}
						role="button"
						aria-pressed={activeFilter === filter.id}
						aria-label={`Filter by ${filter.label}${activeFilter === filter.id ? ' (active)' : ''}`}
						tabIndex={0}
						className={cn(
							"px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ease-in-out border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transform hover:scale-105 active:scale-95",
							activeFilter === filter.id
								? "bg-emerald-500 text-black border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] shadow-emerald-500/25"
								: "bg-white/5 text-zinc-400 border-white/10 hover:border-emerald-500/50 hover:text-emerald-400 hover:shadow-[0_0_8px_rgba(16,185,129,0.3)]"
						)}
					>
						{filter.label}
					</button>
				))}
			</div>
		</div>
	)
}
