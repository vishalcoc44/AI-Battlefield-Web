"use client"

import { useRef, useEffect, useState } from 'react'
import { IntelDossier } from "@/lib/data-service"
import { cn } from "@/lib/utils"

interface EvidenceBoardProps {
	dossiers: IntelDossier[]
}

export function EvidenceBoard({ dossiers }: EvidenceBoardProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [selectedNode, setSelectedNode] = useState<string | null>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// Set dpi
		const dpr = window.devicePixelRatio || 1
		const rect = canvas.getBoundingClientRect()
		canvas.width = rect.width * dpr
		canvas.height = rect.height * dpr
		ctx.scale(dpr, dpr)

		// Nodes
		const nodes = dossiers.map((d, i) => ({
			id: d.id,
			x: Math.random() * rect.width,
			y: Math.random() * rect.height,
			title: d.title,
			category: d.category,
			color: d.status === 'Classified' ? '#ef4444' : d.status === 'Locked' ? '#f59e0b' : '#10b981',
			radius: 5 + (d.tags.length * 2)
		}))

		// Edges (Connect by matching tags)
		const edges: { source: typeof nodes[0], target: typeof nodes[0] }[] = []
		for (let i = 0; i < nodes.length; i++) {
			for (let j = i + 1; j < nodes.length; j++) {
				const d1 = dossiers[i]
				const d2 = dossiers[j]
				// Connect if they share at least one tag
				const shared = d1.tags.filter(t => d2.tags.includes(t))
				if (shared.length > 0) {
					edges.push({ source: nodes[i], target: nodes[j] })
				}
			}
		}

		// Animation Loop
		let animationFrameId: number

		const render = () => {
			ctx.clearRect(0, 0, rect.width, rect.height)

			// Draw Edges
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
			ctx.lineWidth = 1
			edges.forEach(edge => {
				ctx.beginPath()
				ctx.moveTo(edge.source.x, edge.source.y)
				ctx.lineTo(edge.target.x, edge.target.y)
				ctx.stroke()
			})

			// Draw Nodes
			nodes.forEach(node => {
				ctx.beginPath()
				ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
				ctx.fillStyle = node.color
				ctx.fill()

				// Glow
				ctx.shadowBlur = 10
				ctx.shadowColor = node.color
				ctx.stroke()
				ctx.shadowBlur = 0

				// Text
				ctx.fillStyle = '#fff'
				ctx.font = '10px monospace'
				ctx.fillText(node.title.substring(0, 10), node.x + 12, node.y + 4)
			})

			// Simple physics simulation (keep nodes centered but moving slowly)
			// ... omitting complex physics for brevity, just static for now or slow drift

			animationFrameId = requestAnimationFrame(render)
		}

		render()

		return () => cancelAnimationFrame(animationFrameId)

	}, [dossiers])

	return (
		<div className="w-full h-[400px] border border-white/10 rounded-xl bg-black relative overflow-hidden">
			<div className="absolute top-4 left-4 z-10 p-2 bg-black/50 backdrop-blur rounded">
				<h3 className="text-xs font-mono uppercase text-zinc-400">Evidence Board // Graph View</h3>
			</div>
			<canvas
				ref={canvasRef}
				className="w-full h-full cursor-crosshair"
				style={{ width: '100%', height: '100%' }}
			/>
		</div>
	)
}
