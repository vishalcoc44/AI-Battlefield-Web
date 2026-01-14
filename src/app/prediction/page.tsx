"use client"

import { useState, useEffect } from "react"
import { TopNav } from "@/components/layout/TopNav"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Clock, Loader2, AlertCircle, TrendingUp, DollarSign, BarChart3, ArrowRight, Activity, Zap } from "lucide-react"
import { dataService, type Market } from "@/lib/data-service"
import { supabase } from "@/lib/supabase"

export default function PredictionPage() {
   const [markets, setMarkets] = useState<Market[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)

   // Local state for sliders (mapped by market ID)
   const [predictions, setPredictions] = useState<Record<string, number[]>>({})

   useEffect(() => {
      fetchMarkets()
   }, [])

   const fetchMarkets = async () => {
      try {
         setLoading(true)
         const data = await dataService.getMarkets()
         setMarkets(data)

         // Initialize sliders with 50% default
         const initialPreds: Record<string, number[]> = {}
         data.forEach(m => {
            initialPreds[m.id] = [50]
         })
         setPredictions(initialPreds)

      } catch (err: any) {
         setError(err.message)
      } finally {
         setLoading(false)
      }
   }

   const handlePredictionChange = (id: string, val: number[]) => {
      setPredictions(prev => ({ ...prev, [id]: val }))
   }

   const submitPrediction = async (id: string) => {
      const val = predictions[id][0]
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id || 'mock-user-id'

      try {
         await dataService.submitPrediction(id, val, userId)
         alert(`Prediction submitted for Market ${id}: ${val}%`)
      } catch (e) {
         alert("Failed to submit prediction")
      }
   }

   return (
      <div className="dark flex flex-col min-h-screen bg-black text-white selection:bg-yellow-500/30 font-sans overflow-hidden">
         {/* 🌌 Cosmic Background: Timeline Streams */}
         <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a05] to-black" />
            <div className="absolute inset-0 bg-grid-white/[0.03]" />
            {/* Ambient Gold/Orange Glows */}
            <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-yellow-600/5 rounded-full blur-[150px] animate-pulse duration-[8000ms]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-orange-600/5 rounded-full blur-[150px] animate-pulse delay-1000 duration-[10000ms]" />
         </div>

         <div className="relative z-10">
            <TopNav />

            {/* 🔮 Header Section: Oracle HUD */}
            <div className="w-full bg-black/40 border-b border-white/5 backdrop-blur-xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 opacity-50" />
               <div className="max-w-7xl mx-auto p-6 md:p-8 relative z-10">
                  <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className="border-yellow-500/30 text-yellow-500 bg-yellow-500/5 uppercase tracking-widest text-[10px] font-black animate-pulse">
                              Live Feeds Active
                           </Badge>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-yellow-100 via-yellow-400 to-orange-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                           Prediction Lab
                        </h1>
                        <p className="text-lg text-zinc-400 font-medium max-w-2xl leading-relaxed">
                           Calibrate your worldview. Stake your reputation on the <span className="text-white font-bold">future timelines</span>.
                        </p>
                     </div>

                     <div className="flex gap-4">
                        <div className="glass-card px-8 py-5 rounded-2xl flex flex-col items-end border-l-4 border-l-blue-500 bg-black/60 shadow-2xl relative overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                           <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-1">Brier Score</span>
                           <span className="text-4xl font-black tabular-nums tracking-tighter text-white group-hover:text-blue-400 transition-colors">0.24</span>
                           <span className="text-xs text-blue-500 font-bold mt-1">Excellent Accuracy</span>
                        </div>
                        <div className="glass-card px-8 py-5 rounded-2xl flex flex-col items-end border-l-4 border-l-green-500 bg-black/60 shadow-2xl relative overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                           <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-1">Global Rank</span>
                           <div className="flex items-center gap-2">
                              <TrendingUp className="h-5 w-5 text-green-500" />
                              <span className="text-4xl font-black tracking-tighter text-white group-hover:text-green-400 transition-colors">Top 5%</span>
                           </div>
                           <span className="text-xs text-green-500 font-bold mt-1">Elite Forecaster</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <main className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
               <Tabs defaultValue="markets" className="w-full">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                     <TabsList className="bg-black/40 p-1 rounded-full border border-white/10 backdrop-blur-md h-12">
                        <TabsTrigger value="markets" className="rounded-full px-8 h-10 data-[state=active]:bg-yellow-500 text-xs uppercase tracking-widest font-bold data-[state=active]:text-black text-zinc-500 transition-all hover:text-white">Open Markets</TabsTrigger>
                        <TabsTrigger value="portfolio" className="rounded-full px-8 h-10 data-[state=active]:bg-yellow-500 text-xs uppercase tracking-widest font-bold data-[state=active]:text-black text-zinc-500 transition-all hover:text-white">My Portfolio</TabsTrigger>
                        <TabsTrigger value="create" className="rounded-full px-8 h-10 data-[state=active]:bg-yellow-500 text-xs uppercase tracking-widest font-bold data-[state=active]:text-black text-zinc-500 transition-all hover:text-white">Create Market</TabsTrigger>
                     </TabsList>

                     <Button variant="outline" className="glass-card border-white/10 hover:bg-white/5 h-12 px-6 rounded-full group transition-all hover:border-green-500/50">
                        <DollarSign className="mr-2 h-4 w-4 text-green-500 group-hover:text-green-400" />
                        <span className="text-zinc-400 text-xs uppercase font-bold tracking-wider mr-2">Balance:</span>
                        <span className="font-black text-lg text-white group-hover:text-green-400 tabular-nums">1,250 ◈</span>
                     </Button>
                  </div>

                  <TabsContent value="markets" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6">
                           <div className="relative">
                              <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-20 animate-pulse" />
                              <Loader2 className="h-16 w-16 animate-spin text-yellow-500 relative z-10" />
                           </div>
                           <p className="text-zinc-500 animate-pulse font-mono text-xs uppercase tracking-widest">Scanning future probabilities...</p>
                        </div>
                     ) : error ? (
                        <div className="flex items-center justify-center gap-3 text-red-400 bg-red-950/20 p-8 rounded-2xl border border-red-500/20 backdrop-blur-md">
                           <AlertCircle className="h-6 w-6" /> <span className="font-bold">{error}</span>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {markets.map((market, index) => (
                              <Card key={market.id} className="glass-card bg-black/40 hover:bg-white/5 transition-all duration-500 group border-white/5 overflow-hidden hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] hover:border-yellow-500/30">
                                 {/* Cyber Line Decoration */}
                                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-yellow-500/50 transition-colors" />

                                 <CardHeader className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-start">
                                       <Badge variant="outline" className="bg-yellow-500/5 text-yellow-500 border-yellow-500/20 font-black text-[10px] uppercase tracking-widest backdrop-blur-md px-3 py-1">
                                          {market.category}
                                       </Badge>
                                       <div className="flex items-center text-[10px] uppercase tracking-wider font-bold text-zinc-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                          <Clock className="h-3 w-3 mr-1.5" />
                                          {market.deadline}
                                       </div>
                                    </div>
                                    <CardTitle className="text-xl font-bold leading-snug min-h-[3.5rem] group-hover:text-yellow-400 transition-colors text-white">
                                       {market.question}
                                    </CardTitle>
                                 </CardHeader>

                                 <CardContent className="space-y-6 pt-2 relative z-10">
                                    <div className="bg-white/5 p-5 rounded-xl space-y-4 border border-white/5 group-hover:border-white/10 transition-colors">
                                       <div className="flex justify-between items-end">
                                          <span className="text-xs uppercase tracking-wider font-bold text-zinc-500">Your Probability</span>
                                          <span className="text-3xl font-black tabular-nums text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">{predictions[market.id]?.[0]}%</span>
                                       </div>
                                       <Slider
                                          value={predictions[market.id]}
                                          onValueChange={(val) => handlePredictionChange(market.id, val)}
                                          max={100}
                                          step={1}
                                          className="py-2 cursor-pointer [&>.relative>.absolute]:bg-gradient-to-r [&>.relative>.absolute]:from-yellow-600 [&>.relative>.absolute]:to-yellow-400"
                                       />
                                       <div className="flex justify-between text-[9px] text-zinc-600 uppercase font-black tracking-widest">
                                          <span>Impossible (0%)</span>
                                          <span>Certain (100%)</span>
                                       </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs px-1 py-2 border-t border-white/5">
                                       <div className="flex items-center gap-2 text-zinc-400">
                                          <Activity className="h-4 w-4 text-zinc-500" />
                                          <span className="font-mono text-[10px] uppercase">Consensus: <span className="text-white font-bold text-sm ml-1">{market.consensus}%</span></span>
                                       </div>
                                       <div className="text-zinc-400 flex items-center gap-2">
                                          <BarChart3 className="h-4 w-4 text-zinc-500" />
                                          <span className="font-mono text-[10px] uppercase">Vol: <span className="text-white font-bold text-sm ml-1">{market.volume.toLocaleString()}</span></span>
                                       </div>
                                    </div>
                                 </CardContent>

                                 <CardFooter className="pt-0 pb-6 relative z-10">
                                    <Button
                                       className="w-full h-12 bg-white/5 hover:bg-yellow-500/10 text-white hover:text-yellow-400 font-bold uppercase tracking-widest text-xs border border-white/10 hover:border-yellow-500/50 transition-all group/btn"
                                       onClick={() => submitPrediction(market.id)}
                                    >
                                       Submit Forecast <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                 </CardFooter>
                              </Card>
                           ))}
                        </div>
                     )}
                  </TabsContent>

                  <TabsContent value="portfolio">
                     <div className="flex flex-col items-center justify-center py-32 glass-card rounded-3xl border-dashed border-2 border-white/10 bg-black/20">
                        <div className="p-8 bg-white/5 rounded-full mb-6 relative group">
                           <div className="absolute inset-0 bg-yellow-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                           <Target className="h-16 w-16 text-zinc-600 group-hover:text-yellow-500 transition-colors relative z-10" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-white">No Active Positions</h3>
                        <p className="text-zinc-500 mb-8 max-w-md text-center">Start staking your reputation on open markets to build your forecasting portfolio.</p>
                        <Button
                           className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold h-12 px-8 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-all"
                           onClick={() => document.querySelector('[value="markets"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}>
                           Browse Markets
                        </Button>
                     </div>
                  </TabsContent>
               </Tabs>
            </main>
         </div>
      </div>
   )
}
