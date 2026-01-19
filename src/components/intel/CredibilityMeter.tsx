import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle, HelpCircle } from "lucide-react"

interface CredibilityMeterProps {
	score: number // 0 to 100
	size?: 'sm' | 'md' | 'lg'
}

export function CredibilityMeter({ score, size = 'md' }: CredibilityMeterProps) {
	const getLevel = (s: number) => {
		if (s >= 90) return { label: 'VERIFIED', color: 'text-emerald-500', bg: 'bg-emerald-500', icon: CheckCircle }
		if (s >= 70) return { label: 'HIGH CONFIDENCE', color: 'text-emerald-400', bg: 'bg-emerald-400', icon: CheckCircle }
		if (s >= 40) return { label: 'UNCERTAIN', color: 'text-amber-400', bg: 'bg-amber-400', icon: HelpCircle }
		return { label: 'UNVERIFIED', color: 'text-red-500', bg: 'bg-red-500', icon: AlertTriangle }
	}

	const { label, color, bg, icon: Icon } = getLevel(score)

	return (
		<div className="flex flex-col gap-1">
			<div className="flex justify-between items-end text-xs font-mono mb-1">
				<span className={cn("font-bold tracking-wider flex items-center gap-1.5", color)}>
					<Icon className="h-3 w-3" />
					{label}
				</span>
				<span className="text-zinc-500">{score}%</span>
			</div>
			<div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
				<div
					className={cn("h-full transition-all duration-1000 ease-out", bg)}
					style={{ width: `${score}%` }}
				/>
			</div>
		</div>
	)
}
