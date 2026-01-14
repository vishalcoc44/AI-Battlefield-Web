"use client"

import { useState } from "react"
import { TopNav } from "@/components/layout/TopNav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Ghost, VenetianMask, ScanFace, User, ArrowRight } from "lucide-react"

const MASKS = [
   { name: "Neon Fox", icon: <VenetianMask className="h-12 w-12 text-orange-500" /> },
   { name: "Cyber Monk", icon: <User className="h-12 w-12 text-blue-500" /> },
   { name: "Null Pointer", icon: <Ghost className="h-12 w-12 text-purple-500" /> },
   { name: "Glitch Face", icon: <ScanFace className="h-12 w-12 text-emerald-500" /> },
]

export default function VoidPage() {
   const [selectedMask, setSelectedMask] = useState<string | null>(null)

   return (
      <div className="dark flex flex-col min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-purple-500/30">

         {/* 🌌 Cosmic Background */}
         <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050510] to-[#0a0a15]" />
            <div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
            <div className="bg-noise opacity-[0.15]" />
            {/* Orbs */}
            <div className="absolute top-[-20%] left-[20%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[150px] animate-slow-spin mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[10%] w-[40vw] h-[40vw] bg-indigo-900/10 rounded-full blur-[150px] animate-slow-spin animation-delay-2000 mix-blend-screen" />
         </div>

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
                  <h3 className="text-center font-bold text-zinc-500 uppercase tracking-[0.2em] text-sm">Select Your Identity Protocol</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {MASKS.map((mask, i) => (
                        <div
                           key={i}
                           className={`holographic-card rounded-2xl p-8 cursor-pointer transition-all duration-500 group relative overflow-hidden active:scale-95 ${selectedMask === mask.name ? 'ring-2 ring-white/70 bg-white/10 scale-105 shadow-[0_0_50px_rgba(255,255,255,0.1)]' : 'hover:bg-white/5 hover:scale-105'}`}
                           onClick={() => setSelectedMask(mask.name)}
                        >
                           <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${i === 0 ? 'from-orange-500/20' : i === 1 ? 'from-blue-500/20' : i === 2 ? 'from-purple-500/20' : 'from-emerald-500/20'} to-transparent`} />

                           <div className="relative z-10 flex flex-col items-center gap-6">
                              <div className={`transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ${selectedMask === mask.name ? 'animate-bounce' : ''}`}>
                                 {mask.icon}
                              </div>
                              <div className="text-center space-y-1">
                                 <span className={`block font-black text-lg tracking-wide uppercase ${selectedMask === mask.name ? 'text-white' : 'text-zinc-400'} group-hover:text-white transition-colors`}>
                                    {mask.name}
                                 </span>
                                 <span className="block text-[10px] text-zinc-600 font-mono tracking-widest group-hover:text-zinc-400">ENCRYPTED</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="w-full max-w-md space-y-8 pt-8">
                  <Button
                     className={`w-full h-20 text-xl font-black uppercase tracking-[0.2em] transition-all duration-500 rounded-full border-0 relative overflow-hidden group ${selectedMask
                        ? 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:shadow-[0_0_80px_rgba(255,255,255,0.5)] scale-110'
                        : 'bg-zinc-900 text-zinc-600 opacity-50 cursor-not-allowed border border-white/5'
                        }`}
                     disabled={!selectedMask}
                     onClick={() => alert(`Entering The Void as ${selectedMask}...`)}
                  >
                     {selectedMask && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-300/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />}
                     <span className="relative z-10 flex items-center gap-4">
                        {selectedMask ? 'Initialize Link' : 'Select Identity'} <ArrowRight className={`h-6 w-6 ${selectedMask ? 'animate-pulse' : ''}`} />
                     </span>
                  </Button>
                  <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                     <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                     </span>
                     142 Phantoms Active
                  </div>
               </div>
            </main>
         </div>
      </div>
   )
}
