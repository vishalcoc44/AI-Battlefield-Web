"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Brain, Shield, Zap, Users, Trophy, Globe, Sword, Sparkles, ChevronRight, Play } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden relative selection:bg-orange-500/50 selection:text-white font-sans">

      {/* 🌌 Cosmic Background System */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Deep Space Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050510] to-[#0a0a20]" />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-grid-white/[0.03] opacity-50 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />

        {/* Nebulas */}
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-violet-900/20 rounded-full blur-[150px] animate-slow-spin mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-orange-600/10 rounded-full blur-[150px] animate-slow-spin animation-delay-2000 mix-blend-screen" />

        {/* Noise Overlay */}
        <div className="bg-noise md:opacity-[0.15]" />
      </div>

      {/* 🛸 Navbar (Floating Glass) */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl h-16 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl z-50 flex items-center justify-between px-6 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
        <Link className="flex items-center gap-3 group" href="#">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 blur-lg opacity-40 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg border border-white/20">
              <Sword className="h-5 w-5 text-white" />
            </div>
          </div>
          <span className="font-bold text-lg tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">AI Battlefield</span>
        </Link>
        <nav className="hidden md:flex gap-8 items-center">
          {['Features', 'Manifesto', 'Pricing'].map((item) => (
            <Link key={item} className="text-sm font-medium text-white/60 hover:text-white transition-colors uppercase tracking-widest text-[10px]" href={`#${item.toLowerCase()}`}>
              {item}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/auth">
            <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5 rounded-full px-6">Login</Button>
          </Link>
          <Link href="/auth">
            <Button size="sm" className="bg-white text-black hover:bg-zinc-200 font-bold rounded-full px-6 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] border border-white/50 transition-all hover:scale-105">
              Enter Arena
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 relative z-10 pt-32">

        {/* 💥 Hero Section: Visceral Impact */}
        <section className="w-full min-h-[90vh] flex flex-col items-center justify-center relative perspective-1000">
          <div className="container px-4 md:px-6 relative text-center">

            {/* Text Explosion */}
            <div className="space-y-6 max-w-5xl mx-auto transform-style-3d">
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-orange-500/10 px-4 py-1.5 backdrop-blur-md rounded-full uppercase tracking-widest text-[10px] font-bold shadow-[0_0_15px_-3px_rgba(249,115,22,0.4)]">
                  <Sparkles className="w-3 h-3 mr-2 animate-pulse" /> Neural Warfare v1.0
                </Badge>
              </div>

              <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white animate-in zoom-in-50 duration-1000 delay-100 drop-shadow-2xl">
                SHARPEN<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-700 stroke-text">YOUR</span><br />
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-orange-400 via-orange-500 to-red-600 filter drop-shadow-[0_0_30px_rgba(249,115,22,0.4)] relative">
                  MIND
                </span>
              </h1>

              <p className="mx-auto max-w-[600px] text-zinc-400 md:text-xl font-light leading-relaxed tracking-wide animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                Debate AI gods. Dismantle your biases. Calibrate your worldview in a high-stakes cognitive arena.
              </p>

              {/* Magnetic Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                <Link href="/auth">
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
                    <Button size="lg" className="relative h-16 px-10 rounded-full bg-black border border-white/10 text-white font-bold text-lg overflow-hidden transition-transform hover:scale-105 hover:border-orange-500/50">
                      <span className="relative z-10 flex items-center">
                        Start Training <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </div>
                </Link>

                <Link href="#demo">
                  <Button size="lg" variant="outline" className="h-16 px-10 rounded-full border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 text-lg font-medium transition-all hover:scale-105">
                    <Play className="mr-2 h-5 w-5 fill-current" /> Watch Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Floating UI Elements (Decorative) */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-12 hidden lg:block animate-float opacity-30">
              <div className="glass p-4 rounded-xl border-l-4 border-l-blue-500 w-64 rotate-[-6deg]">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-bold text-blue-300 uppercase">Analysis Complete</span>
                </div>
                <div className="h-2 w-full bg-blue-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[85%]" />
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-12 hidden lg:block animate-float animation-delay-1000 opacity-30">
              <div className="glass p-4 rounded-xl border-l-4 border-l-orange-500 w-64 rotate-[6deg]">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-orange-400" />
                  <span className="text-xs font-bold text-orange-300 uppercase">Fallacy Detected</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-mono">"Ad Hominem" pattern recognized in sector 7.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 💠 Holographic Features Grid */}
        <section id="features" className="w-full py-32 relative z-20">
          <div className="container px-4 md:px-6 mx-auto">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
                  Tools for <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">Cognitive Warfare.</span>
                </h2>
                <p className="text-xl text-zinc-400 font-light">
                  We don't just host debates. We provide a full military-grade suite to analyze, dismantle, and reconstruct your beliefs.
                </p>
              </div>
              <Button variant="link" className="text-white hover:text-orange-400 p-0 h-auto font-bold uppercase tracking-widest text-xs group">
                View Full Arsenal <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Brain, color: "blue", title: "AI Opponents", desc: "Battle against specialized personas like 'The Stoic', 'The Empiricist', or the dreaded 'Devil's Advocate'." },
                { icon: Shield, color: "green", title: "Steel-man Scoring", desc: "Our AI analyzes your arguments in real-time. Can you accurately represent the opposing view?" },
                { icon: Users, color: "purple", title: "Debate Gym", desc: "Join multiplayer lobbies to debate hot topics with humans, moderated by an impartial AI judge." },
                { icon: Zap, color: "red", title: "Zen Dojo", desc: "Test your emotional control. Can you stay calm while an AI troll tries to trigger you?" },
                { icon: Trophy, color: "yellow", title: "Prediction Lab", desc: "Put your money where your mouth is. Bet virtual currency on future events and track your Brier score." },
                { icon: Globe, color: "indigo", title: "Belief Mapping", desc: "Visualize how your worldview shifts over time. Identify blind spots and cognitive biases." },
              ].map((feature, i) => (
                <div key={i} className="group relative perspective-1000">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative h-full holographic-card rounded-2xl p-8 hover:transform hover:scale-[1.02] transition-all duration-300 flex flex-col items-start border border-white/5 group-hover:border-white/20">
                    <div className={`p-3 rounded-xl bg-${feature.color}-500/10 text-${feature.color}-400 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-500 leading-relaxed font-light group-hover:text-zinc-300 transition-colors">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🔢 Evolution Steps */}
        <section className="w-full py-32 bg-zinc-950/50 relative border-y border-white/5">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Line */}
              <div className="hidden md:block absolute top-[20px] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {[
                { step: "01", title: "Choose Opponent", desc: "Select an AI persona matched to your skill level. From 'Easy Stoic' to 'Expert Scientist'." },
                { step: "02", title: "Engage in Debate", desc: "Argue your case. The AI will challenge your fallacies, demand evidence, and force you to clarify." },
                { step: "03", title: "Review & Evolve", desc: "Get a detailed breakdown of your logic score, biases detected, and earn XP to unlock new arenas." },
              ].map((item, i) => (
                <div key={i} className="relative z-10 flex flex-col items-start pt-8 group">
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-zinc-700 to-zinc-900 mb-6 group-hover:from-orange-500 group-hover:to-red-600 transition-all duration-500">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">{item.title}</h3>
                  <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🚀 Final CTA */}
        <section className="w-full py-48 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 via-transparent to-transparent opacity-50" />
          <div className="container px-4 text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-white">
              Ready to Enter the Arena?
            </h2>
            <Link href="/auth">
              <Button className="h-20 px-16 text-2xl font-bold rounded-full bg-white text-black hover:bg-zinc-200 hover:scale-105 transition-all shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)]">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>

      </main>

      <footer className="py-12 border-t border-white/10 bg-black text-center relative z-10">
        <p className="text-zinc-600 text-sm">© 2026 AI Battlefield. All systems nominal.</p>
      </footer>
    </div>
  )
}
