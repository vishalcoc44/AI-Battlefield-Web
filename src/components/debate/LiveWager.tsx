"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, TrendingUp, AlertTriangle } from "lucide-react"
import { dataService } from "@/lib/data-service"
import { Wager } from "@/lib/types"

interface LiveWagerProps {
	debateId: string
	topic: string
	currentOdds?: { pro: number, con: number }
}

export function LiveWager({ debateId, topic, currentOdds = { pro: 1.5, con: 2.2 } }: LiveWagerProps) {
	const [amount, setAmount] = useState<string>("50")
	const [side, setSide] = useState<'PRO' | 'CON'>('PRO')
	const [placing, setPlacing] = useState(false)
	const [wager, setWager] = useState<Wager | null>(null)
	const [error, setError] = useState<string | null>(null)

	const handlePlaceWager = async () => {
		const val = parseInt(amount)
		if (isNaN(val) || val <= 0) {
			setError("Invalid amount")
			return
		}

		setPlacing(true)
		setError(null)

		try {
			const res = await dataService.placeWager(debateId, val, side)
			if (res) {
				setWager(res)
			} else {
				setError("Failed to place wager. Insufficient funds?")
			}
		} catch (e) {
			setError("Error contacting market server")
		} finally {
			setPlacing(false)
		}
	}

	if (wager) {
		return (
			<Card className="bg-slate-900 border-green-900/50 shadow-lg shadow-green-900/10">
				<CardContent className="p-6 text-center">
					<div className="mx-auto h-12 w-12 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
						<TrendingUp className="h-6 w-6 text-green-500" />
					</div>
					<h3 className="text-lg font-bold text-white mb-2">Wager Active!</h3>
					<p className="text-slate-400 text-sm mb-4">
						You bet <span className="text-white font-bold">{wager.amount} IP</span> on <span className={wager.predictionSide === 'PRO' ? "text-green-400" : "text-red-400"}>{wager.predictionSide}</span>.
					</p>
					<div className="bg-black/30 p-2 rounded text-xs text-muted-foreground">
						Potential Payout: <span className="text-yellow-500 font-bold">{Math.round(wager.amount * (wager.predictionSide === 'PRO' ? currentOdds.pro : currentOdds.con))} IP</span>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className="bg-slate-950 border-slate-800">
			<CardHeader className="pb-3">
				<CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
					<Coins className="h-4 w-4 text-yellow-500" /> Live Market
				</CardTitle>
				<CardDescription className="text-xs">Wager on the outcome of this debate.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<Tabs defaultValue="PRO" onValueChange={(v) => setSide(v as 'PRO' | 'CON')} className="w-full">
					<TabsList className="w-full grid grid-cols-2 bg-slate-900">
						<TabsTrigger value="PRO" className="data-[state=active]:bg-green-900/50 data-[state=active]:text-green-400 text-xs">
							PRO ({currentOdds.pro}x)
						</TabsTrigger>
						<TabsTrigger value="CON" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-red-400 text-xs">
							CON ({currentOdds.con}x)
						</TabsTrigger>
					</TabsList>
				</Tabs>

				<div className="space-y-2">
					<label className="text-xs text-muted-foreground">Amount (Intel Points)</label>
					<div className="relative">
						<Input
							type="number"
							className="bg-black/50 border-slate-800 text-white pl-8"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
						/>
						<Coins className="absolute left-2.5 top-2.5 h-4 w-4 text-yellow-500 opacity-50" />
					</div>
				</div>

				{error && (
					<div className="text-xs text-red-500 flex items-center gap-1">
						<AlertTriangle className="h-3 w-3" /> {error}
					</div>
				)}

				<Button
					className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold"
					onClick={handlePlaceWager}
					disabled={placing}
				>
					{placing ? "Placing..." : `Bet ${amount || 0} IP`}
				</Button>

				<p className="text-[10px] text-center text-muted-foreground">
					*Wins paid out upon consensus verification.
				</p>
			</CardContent>
		</Card>
	)
}
