import React from 'react';

type Theme = 'emerald' | 'purple' | 'cyan' | 'blue' | 'red' | 'orange' | 'monochrome' | 'indigo' | 'landing';

interface CosmicBackgroundProps {
	theme?: Theme;
}

export function CosmicBackground({ theme = 'emerald' }: CosmicBackgroundProps) {
	const colors = {
		emerald: {
			gradientFrom: 'from-black',
			gradientVia: 'via-[#051005]',
			gradientTo: 'to-[#000]',
			grid: 'bg-[linear-gradient(to_right,#00ff0012_1px,transparent_1px),linear-gradient(to_bottom,#00ff0012_1px,transparent_1px)]',
			orb: 'bg-emerald-600/10'
		},
		purple: {
			gradientFrom: 'from-black',
			gradientVia: 'via-[#0b0510]',
			gradientTo: 'to-[#1a0b2e]',
			grid: 'bg-[linear-gradient(to_right,#a855f712_1px,transparent_1px),linear-gradient(to_bottom,#a855f712_1px,transparent_1px)]',
			orb: 'bg-purple-600/10'
		},
		cyan: {
			gradientFrom: 'from-black',
			gradientVia: 'via-[#051010]',
			gradientTo: 'to-[#0b1a2e]',
			grid: 'bg-[linear-gradient(to_right,#06b6d412_1px,transparent_1px),linear-gradient(to_bottom,#06b6d412_1px,transparent_1px)]',
			orb: 'bg-cyan-600/10'
		},
		blue: {
			gradientFrom: 'from-black',
			gradientVia: 'via-[#050510]',
			gradientTo: 'to-[#0b0b2e]',
			grid: 'bg-[linear-gradient(to_right,#3b82f612_1px,transparent_1px),linear-gradient(to_bottom,#3b82f612_1px,transparent_1px)]',
			orb: 'bg-blue-600/10'
		},
		indigo: {
			gradientFrom: 'from-black',
			gradientVia: 'via-[#050510]',
			gradientTo: 'to-[#0f0b2e]',
			grid: 'bg-[linear-gradient(to_right,#6366f112_1px,transparent_1px),linear-gradient(to_bottom,#6366f112_1px,transparent_1px)]',
			orb: 'bg-indigo-600/10'
		},
		red: {
			gradientFrom: 'from-black',
			gradientVia: 'via-[#100505]',
			gradientTo: 'to-[#2e0b0b]',
			grid: 'bg-[linear-gradient(to_right,#ef444412_1px,transparent_1px),linear-gradient(to_bottom,#ef444412_1px,transparent_1px)]',
			orb: 'bg-red-600/10'
		},
		orange: {
			gradientFrom: 'from-black',
			gradientVia: 'via-[#100a05]',
			gradientTo: 'to-[#2e1a0b]',
			grid: 'bg-[linear-gradient(to_right,#f9731612_1px,transparent_1px),linear-gradient(to_bottom,#f9731612_1px,transparent_1px)]',
			orb: 'bg-orange-600/10'
		},
		monochrome: {
			gradientFrom: 'from-black',
			gradientVia: 'via-[#0a0a0a]',
			gradientTo: 'to-[#000]',
			grid: 'bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)]',
			orb: 'bg-white/5'
		},
		landing: {
			gradientFrom: 'from-black',
			gradientVia: 'via-[#050510]',
			gradientTo: 'to-[#0a0a20]',
			grid: 'bg-grid-white/[0.03] opacity-50 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]',
			orb: 'bg-blue-900/20'
		}
	};

	const current = colors[theme];

	// Special rendering for landing page to support multiple orbs + parallax
	if (theme === 'landing') {
		const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

		React.useEffect(() => {
			const handleMouseMove = (event: MouseEvent) => {
				setMousePosition({
					x: (event.clientX / window.innerWidth) * 2 - 1,
					y: (event.clientY / window.innerHeight) * 2 - 1
				});
			};

			window.addEventListener('mousemove', handleMouseMove);
			return () => window.removeEventListener('mousemove', handleMouseMove);
		}, []);

		return (
			<div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
				<div className={`absolute inset-0 bg-gradient-to-b ${current.gradientFrom} ${current.gradientVia} ${current.gradientTo}`} />

				{/* Grid - Slight movement */}
				<div
					className={`absolute inset-0 ${current.grid}`}
					style={{ transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)` }}
				/>

				{/* Blue Orb - Medium movement */}
				<div
					className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-900/20 rounded-full blur-[150px] animate-slow-spin mix-blend-screen transition-transform duration-100 ease-out"
					style={{ transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)` }}
				/>

				{/* Orange Orb - Fast reverse movement for depth */}
				<div
					className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-orange-600/10 rounded-full blur-[150px] animate-slow-spin animation-delay-2000 mix-blend-screen transition-transform duration-100 ease-out"
					style={{ transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * 40}px)` }}
				/>

				{/* Noise Overlay */}
				<div className="bg-noise md:opacity-[0.15]" />
			</div>
		);
	}

	return (
		<div className="fixed inset-0 z-0 pointer-events-none">
			<div className={`absolute inset-0 bg-gradient-to-br ${current.gradientFrom} ${current.gradientVia} ${current.gradientTo}`} />
			<div className={`absolute inset-0 ${current.grid} bg-[size:24px_24px] opacity-20`} />
			<div className={`absolute top-[-20%] right-[20%] w-[60vw] h-[60vw] ${current.orb} rounded-full blur-[150px] animate-pulse mix-blend-screen`} />
		</div>
	);
}
