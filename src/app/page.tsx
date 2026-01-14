"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CosmicBackground } from "@/components/ui/cosmic-background"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TiltCard } from "@/components/ui/tilt-card"
import { TextScramble } from "@/components/ui/text-scramble"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { ArrowRight, Brain, Shield, Zap, Users, Trophy, Globe, Sword, Play, Terminal, Cpu, Network, Activity } from "lucide-react"

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden relative selection:bg-cyan-500/30 selection:text-cyan-100 font-sans">

      {/* 🌌 Cosmic Background System */}
      <CosmicBackground theme="landing" />

      {/* 🛸 Navbar (Dynamic Floating Capsule v3) */}
      <header
        className={`fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-4 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${scrolled
          ? "top-4 w-[90%] max-w-3xl h-12 bg-black/60 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-xl rounded-full"
          : "top-8 w-[95%] max-w-5xl h-20 bg-black/20 border border-white/5 shadow-none backdrop-blur-md rounded-[2rem]"
          } group/header hover:bg-black/80 hover:border-white/20`}
      >
        <Link className="flex items-center gap-4 group pl-2" href="#">
          {/* Logo Mark with Pulse */}
          <div className={`relative flex items-center justify-center rounded-xl bg-black/50 border border-white/10 overflow-hidden group-hover:border-cyan-500/50 transition-all duration-500 shadow-inner ${scrolled ? "w-8 h-8" : "w-10 h-10"}`}>
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <Sword className={`text-zinc-400 group-hover:text-cyan-200 group-hover:rotate-12 transition-all duration-500 ${scrolled ? "h-4 w-4" : "h-5 w-5"}`} />
          </div>
          <div className="flex flex-col space-y-0.5">
            <span className={`font-black tracking-[0.15em] uppercase text-zinc-200 group-hover:text-white transition-all leading-none ${scrolled ? "text-xs" : "text-sm"}`}>AI Battlefield</span>
            <span className={`font-mono text-cyan-500/80 tracking-widest uppercase transition-all ${scrolled ? "text-[0px] opacity-0" : "text-[9px] opacity-100"}`}>System v2.4.0</span>
          </div>
        </Link>

        {/* Dynamic Navigation */}
        <nav className={`hidden md:flex items-center p-1 rounded-full transition-all duration-500 ${scrolled ? "bg-transparent border-0" : "bg-white/5 border border-white/5 backdrop-blur-sm"}`}>
          {['Features', 'Manifesto', 'Pricing'].map((item) => (
            <Link key={item} className="relative px-5 py-2 rounded-full text-[10px] font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-widest overflow-hidden group/nav-item" href={`#${item.toLowerCase()}`}>
              <span className="relative z-10">{item}</span>
              <div className="absolute inset-0 bg-white/10 scale-0 group-hover/nav-item:scale-100 transition-transform duration-300 rounded-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 pr-1">
          <Link href="/auth" className={`transition-all duration-500 ${scrolled ? "opacity-0 w-0 pointer-events-none" : "opacity-100 w-auto"}`}>
            <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-white hover:bg-transparent text-xs font-mono font-medium tracking-wide">
              [ LOGIN ]
            </Button>
          </Link>
          <Link href="/auth">
            <Button size="sm" className={`relative bg-zinc-100 text-black hover:bg-white rounded-full font-black uppercase tracking-widest overflow-hidden group transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] ${scrolled ? "h-8 px-6 text-[9px]" : "h-10 px-8 text-[10px]"}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="relative z-10 flex items-center gap-2">
                Enter <ArrowRight className={`group-hover:translate-x-1 transition-transform ${scrolled ? "h-2 w-2" : "h-3 w-3"}`} />
              </span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 relative z-10 pt-32">


        {/* 💥 Hero Section: Liquid Metal Typography */}
        <section className="w-full min-h-[90vh] flex flex-col items-center justify-center relative perspective-1000 px-4 mt-4">

          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-blue-900/10 rounded-full blur-[150px] -z-10 opacity-60 animate-pulse mix-blend-screen" />

          <div className="flex flex-col items-center text-center space-y-10 max-w-6xl mx-auto relative z-10">

            {/* Badge */}
            <div className="mb-8 relative z-10 animate-in fade-in slide-in-from-top-4 duration-1000">
              <Badge variant="secondary" className="bg-white/5 border-white/10 text-cyan-300 hover:bg-white/10 px-4 py-2 uppercase tracking-[0.3em] text-[10px] font-bold backdrop-blur-md shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)] group hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)] transition-all">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mr-3 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                Neural Uplink Established :: Secure
              </Badge>
            </div>

            {/* Main Headline with Scramble Effect */}
            <div className="relative group perspective-1000">
              <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 animate-in zoom-in-95 duration-1000 delay-100 drop-shadow-2xl select-none z-10 relative mix-blend-overlay">
                <TextScramble text="DIALECTIC" /> <br />
                <TextScramble text="WARFARE" delay={500} />
              </h1>
              {/* Ghost text for glow */}
              <h1 className="absolute inset-0 text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-cyan-500/20 via-blue-500/10 to-transparent blur-3xl z-0 pointer-events-none select-none">
                DIALECTIC<br />WARFARE
              </h1>
            </div>

            {/* Subheadline: Terminal Style */}
            <div className="max-w-2xl bg-black/40 backdrop-blur-sm border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 mx-4">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-zinc-400 md:text-lg font-mono leading-relaxed text-left">
                <span className="text-cyan-500 mr-2">$</span>
                <span className="text-zinc-200">calibrating_worldview...</span>
                <span className="inline-block w-2.5 h-4 bg-cyan-500 animate-pulse ml-2 align-middle" />
                <br />
                <span className="text-zinc-500 text-sm mt-2 block pl-5 opacity-80">
                  &gt; Targets acquired: Cognitive Biases, Logical Fallacies. <br />
                  &gt; Protocol: High-stakes cognitive arena engaged.
                </span>
              </p>
            </div>

            {/* Advanced CTAs with Magnetic Effect */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
              <MagneticButton>
                <Link href="/auth">
                  <Button className="h-16 px-12 rounded-full bg-white text-black hover:bg-zinc-100 font-extrabold text-sm uppercase tracking-[0.2em] shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-all hover:scale-105 hover:-translate-y-1 active:scale-95 border-2 border-transparent hover:border-cyan-200/50 group relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">Initialize Sequence</span>
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-200/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.2}>
                <Link href="#demo">
                  <Button variant="outline" className="h-16 px-10 rounded-full border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 font-bold text-sm uppercase tracking-[0.2em] backdrop-blur-xl transition-all hover:scale-105 active:scale-95 group relative overflow-hidden">
                    <Play className="mr-3 h-4 w-4 fill-white/20 group-hover:fill-white transition-colors" /> Demo Mode
                  </Button>
                </Link>
              </MagneticButton>
            </div>

            {/* 🛑 Live Intel Stream (New) */}
            <div className="w-full max-w-4xl mt-16 border-y border-white/5 bg-black/20 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black to-transparent z-10" />

              <div className="flex items-center gap-8 py-3 animate-shimmer whitespace-nowrap opacity-70 hover:opacity-100 transition-opacity">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-cyan-500 font-mono text-xs">● LIVE</span>
                    <span className="text-zinc-400 text-xs tracking-widest uppercase">
                      USER_{4092 + i} vs. AI_MODEL_0{i} [WIN_RATE: {80 + i}%]
                    </span>
                    <div className="h-3 w-[1px] bg-white/10" />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Hero Decorative Data Streams (Left) */}
          <div className="absolute bottom-12 left-12 hidden lg:flex flex-col gap-2 opacity-40 animate-in fade-in delay-1000">
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-cyan-500" />
              <span className="text-[10px] font-mono text-cyan-500 tracking-widest uppercase">Live Metrics</span>
            </div>
            <div className="h-16 w-[1px] bg-gradient-to-b from-cyan-500/50 to-transparent ml-2" />
          </div>

          {/* Hero Decorative Data Streams (Right) */}
          <div className="absolute bottom-12 right-12 hidden lg:flex flex-col gap-2 opacity-40 animate-in fade-in delay-1000 items-end text-right">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-emerald-500 tracking-widest uppercase">System Secure</span>
              <Shield className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="h-16 w-[1px] bg-gradient-to-b from-emerald-500/50 to-transparent mr-2" />
          </div>

        </section>

        {/* 🌍 Global Network Visualization (New) */}
        <section className="w-full py-20 relative z-20 border-b border-white/5 bg-black/40 overflow-hidden">
          {/* Decorative Side Elements */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden xl:block space-y-2 opacity-20">
            <div className="w-[1px] h-24 bg-blue-500/50 mx-auto" />
            <div className="text-[10px] font-mono text-blue-500 tracking-widest vertical-text" style={{ writingMode: 'vertical-rl' }}>COORDINATES</div>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden xl:block space-y-2 opacity-20">
            <div className="text-[10px] font-mono text-blue-500 tracking-widest vertical-text" style={{ writingMode: 'vertical-rl' }}>DATA UPLINK</div>
            <div className="w-[1px] h-24 bg-blue-500/50 mx-auto" />
          </div>

          <div className="container px-4 mx-auto max-w-7xl relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">

              {/* Text Side */}
              <div className="max-w-xl space-y-6">
                <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5 font-mono text-[10px] tracking-widest uppercase px-3 py-1">
                  Global Operations
                </Badge>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                  The Battlefield is <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 animate-pulse">
                    <TextScramble text="Everywhere." delay={200} />
                  </span>
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  From corporate boardrooms to political arenas, cognitive warfare is happening now. Join the network of 10,000+ operatives sharpening their minds daily.
                </p>

                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5">
                  {[
                    { label: "Operatives", value: "10.4k", color: "text-cyan-400" },
                    { label: "Debates", value: "842k", color: "text-blue-400" },
                    { label: "Data Points", value: "12M+", color: "text-teal-400" },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                      <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Visual Side */}
              <div className="relative w-full max-w-lg aspect-video bg-black/50 rounded-2xl border border-white/10 overflow-hidden group">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e520_1px,transparent_1px),linear-gradient(to_bottom,#4f46e520_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

                {/* Radar Sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent w-[200%] animate-[shimmer_3s_infinite_linear] -translate-x-full" />

                {/* Active Nodes */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-500 rounded-full animate-ping opacity-75" />
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-500 rounded-full" />

                <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-blue-500 rounded-full animate-ping delay-700 opacity-75" />
                <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-blue-500 rounded-full" />

                <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-teal-500 rounded-full animate-ping delay-1000 opacity-75" />
                <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-teal-500 rounded-full" />

                <div className="absolute bottom-4 left-4 font-mono text-[10px] text-zinc-500">
                  SECTOR: NORTH_AMERICA // STATUS: ACTIVE
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ⚡ Live Debate Simulation (New) */}
        <section className="w-full py-24 relative z-20 overflow-hidden">
          <div className="absolute inset-0 bg-blue-900/5 -skew-y-3 transform origin-left scale-110" />
          <div className="container px-4 mx-auto max-w-6xl relative">
            <div className="text-center mb-16">
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/5 font-mono text-[10px] tracking-widest uppercase px-3 py-1 mb-4">
                Neural Engine v9.4
              </Badge>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
                Speed of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  <TextScramble text="Thought." delay={200} />
                </span>
              </h2>
              <p className="text-zinc-500 max-w-xl mx-auto">
                Our AI deconstructs arguments in milliseconds. Watch a live rigorous steel-manning session.
              </p>
            </div>

            {/* Terminal Window */}
            <div className="w-full max-w-3xl mx-auto bg-[#0a0a0a] rounded-xl border border-white/10 shadow-2xl overflow-hidden font-mono text-sm relative group">

              {/* Floating Tech Specs */}
              <div className="absolute top-1/2 -right-32 hidden xl:block space-y-4 opacity-30">
                <div className="space-y-1">
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest">CPU Load</div>
                  <div className="h-1 w-24 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 w-[84%] animate-pulse" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest">Memory</div>
                  <div className="h-1 w-24 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[62%] animate-pulse" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest">Network</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-1 w-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />)}
                  </div>
                </div>
              </div>

              {/* Terminal Header */}
              <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-2 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="text-zinc-500 text-xs ml-4">admin@ai-battlefield:~</div>
              </div>

              {/* Terminal Body */}
              <div className="p-6 space-y-4 h-[400px] overflow-hidden relative">
                {/* Scanline */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[10%] w-full animate-scanline pointer-events-none z-10" />

                <div className="space-y-2 opacity-50 blur-[0.5px]">
                  <div className="text-zinc-500">$ init_protocol --debate --topic="AI_Consciousness"</div>
                  <div className="text-blue-400">Analysis verified. Starting sequence...</div>
                </div>

                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex gap-4">
                    <div className="text-teal-500 font-bold shrink-0">[USER]</div>
                    <div className="text-zinc-300">"AI is just a stochastic parrot. It cannot truly understand meaning."</div>
                  </div>

                  <div className="flex gap-4 bg-white/5 p-3 rounded-lg border-l-2 border-cyan-500">
                    <div className="text-cyan-500 font-bold shrink-0">[AI_CORE]</div>
                    <div className="text-cyan-100">
                      Analysis: <span className="text-orange-400">Reductionist Fallacy detected.</span>
                      <br /><br />
                      Counter-proposition: If understanding is defined by functional output indistinguishable from intent, does the substrate (biological vs. silicon) matter?
                      <span className="block text-xs text-cyan-500/50 mt-2">Confidence: 98.4% | Latency: 12ms</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="text-teal-500 font-bold shrink-0">[USER]</div>
                    <div className="text-zinc-300">"But it lacks subjective experience. Qualia."</div>
                  </div>

                  <div className="flex gap-4 bg-white/5 p-3 rounded-lg border-l-2 border-cyan-500">
                    <div className="text-cyan-500 font-bold shrink-0">[AI_CORE]</div>
                    <div className="text-cyan-100">
                      Query: Can you prove *you* have subjective experience to me? This is the <span className="text-orange-400">Solipsism Problem.</span>
                      <br />
                      Constructing Steel-man argument...
                      <span className="block animate-pulse w-2 h-4 bg-cyan-500 mt-2"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 💠 Scanner Feature Grid */}
        <section id="features" className="w-full py-32 relative z-20">
          <div className="container px-4 md:px-6 mx-auto max-w-[1400px]">

            {/* Section Header */}
            <div className="flex flex-col items-start mb-24 relative pl-8 border-l border-cyan-900/50">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase mb-2">
                Cognitive <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 animate-shimmer bg-[size:200%_auto]">
                  <TextScramble text="Arsenal" delay={200} />
                </span>
              </h2>
              <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">
                Military-Grade Logic Dismantling Suite v9.0
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(320px,auto)]">

              {/* Feature 1: The Adaptive Core */}
              <TiltCard className="md:col-span-2 p-10 group" spotlightColor="rgba(6,182,212,0.2)">

                {/* Background Meteor Effect */}
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent rotate-45 -translate-x-full animate-meteor" />
                </div>

                <div className="relative z-10 flex flex-col justify-between h-full space-y-16">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-950/30 flex items-center justify-center border border-cyan-500/20 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">
                      <Brain className="w-8 h-8" />
                    </div>
                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/5 font-mono text-[10px] tracking-widest uppercase px-3 py-1">
                      Module 01
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-white mb-4 group-hover:text-cyan-100 transition-colors">Adaptive Opponents</h3>
                    <p className="text-zinc-400 max-w-lg text-lg leading-relaxed">
                      Engage with procedural personas like <span className="text-cyan-400 font-medium">'The Stoic'</span> or <span className="text-red-400 font-medium">'Devil's Advocate'</span>.
                      Our neural networks analyze your rhetorical weaknesses in real-time.
                    </p>
                  </div>
                </div>
              </TiltCard>

              {/* Feature 2: Debate Gym (Multiplayer) */}
              <TiltCard className="md:row-span-2 p-10 flex flex-col justify-between group" spotlightColor="rgba(59,130,246,0.2)">
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-blue-900/20 via-blue-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="flex justify-between items-start relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-blue-950/30 flex items-center justify-center border border-blue-500/20 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-black transition-all duration-500">
                    <Users className="w-8 h-8" />
                  </div>
                </div>

                <div className="mt-12 relative z-10">
                  <h3 className="text-4xl font-black text-white mb-3">Live Arena</h3>
                  <p className="text-zinc-400 mb-8 text-lg">Multiplayer lobbies. Real humans. AI Arbitrated.</p>

                  {/* Dynamic Live Feed Simulation */}
                  <div className="space-y-3 relative">
                    <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-zinc-800" />
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-300 backdrop-blur-sm -translate-x-2 group-hover:translate-x-0 transition-transform duration-500" style={{ transitionDelay: `${i * 100}ms` }}>
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse box-content border-4 border-blue-500/20" />
                        <span className="font-mono tracking-wide">
                          <span className="text-blue-400 font-bold">USER_8{i}4</span> joined <span className="text-zinc-500">'UBI_DEBATE'</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>

              {/* Feature 3: Belief Mapping */}
              <TiltCard className="p-10 group" spotlightColor="rgba(20,184,166,0.2)">
                {/* Animated Grid BG */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent)]" />

                <div className="w-16 h-16 rounded-2xl bg-teal-950/30 flex items-center justify-center border border-teal-500/20 text-teal-400 group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-black transition-all duration-500 mb-12 relative z-10">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-white mb-3 relative z-10">Belief Mapping</h3>
                <p className="text-zinc-400 text-lg relative z-10">Visualize how your worldview shifts over time. Identify cognitive blind spots.</p>
              </TiltCard>

              {/* Feature 4: Steel-man Scoring */}
              <TiltCard className="p-10 group" spotlightColor="rgba(249,115,22,0.2)">
                <div className="w-16 h-16 rounded-2xl bg-orange-950/30 flex items-center justify-center border border-orange-500/20 text-orange-400 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-black transition-all duration-500 mb-12">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-white mb-3">Steel-man Scoring</h3>
                <p className="text-zinc-400 text-lg">Real-time analysis of your ability to represent opposing views accurately.</p>
              </TiltCard>

            </div>
          </div>
        </section>

        {/* 🔢 Evolution Steps (Connected Nodes) */}
        <section className="w-full py-40 bg-zinc-950/50 relative border-y border-white/5 overflow-hidden">
          {/* Animated Background Line */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent" />

          <div className="container px-4 md:px-6 mx-auto relative z-10 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">

              {[
                { step: "01", icon: Cpu, title: "Select Protocol", desc: "Choose an AI persona matched to your skill level. From 'Easy Stoic' to 'Expert Scientist'." },
                { step: "02", icon: Network, title: "Engage Hostiles", desc: "Argue your case. The AI will challenge your fallacies, demand evidence, and force clarity." },
                { step: "03", icon: Trophy, title: "Evolution", desc: "Get a detailed breakdown of your logic score, biases detected, and earn XP to unlock new arenas." },
              ].map((item, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                  {/* Node Point */}
                  <div className="w-20 h-20 rounded-full bg-black border border-zinc-800 flex items-center justify-center text-zinc-500 mb-8 group-hover:border-cyan-500 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-500 shadow-2xl relative z-10">
                    <item.icon className="h-8 w-8" />
                    {/* Pulse Effect */}
                    <div className="absolute inset-0 rounded-full border border-cyan-500/50 scale-125 opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
                  </div>

                  <div className="bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                    <span className="block text-cyan-500 font-mono text-xs font-bold tracking-widest mb-2 uppercase">Step {item.step}</span>
                    <h3 className="text-2xl font-black text-white mb-3 group-hover:text-cyan-200 transition-colors uppercase tracking-tight">{item.title}</h3>
                    <p className="text-zinc-500 leading-relaxed text-sm max-w-xs mx-auto">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🚀 Final CTA (Portal Effect) */}
        <section className="w-full py-48 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/20 to-black" />

          {/* Scanlines Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] bg-[length:100%_4px,6px_100%] pointer-events-none" />

          <div className="container px-4 text-center relative z-10">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-12 text-white">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 animate-pulse">Ascend?</span>
            </h2>
            <Link href="/auth">
              <Button className="h-20 px-16 text-xl font-black rounded-full bg-white text-black hover:bg-cyan-50 hover:text-cyan-950 hover:scale-105 transition-all shadow-[0_0_80px_-20px_rgba(255,255,255,0.6)] uppercase tracking-[0.2em] relative overflow-hidden group border-4 border-transparent hover:border-cyan-200">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                Initialize Sequence
              </Button>
            </Link>
          </div>
        </section>

      </main>

      <footer className="py-12 border-t border-white/5 bg-black text-center relative z-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-1 opacity-50">
            <div className="h-1 w-1 bg-zinc-500 rounded-full" />
            <div className="h-1 w-12 bg-zinc-800 rounded-full" />
            <div className="h-1 w-1 bg-zinc-500 rounded-full" />
          </div>
          <p className="text-zinc-700 text-[10px] uppercase tracking-[0.3em] font-mono">
            © 2026 AI Battlefield. All systems nominal.
          </p>
        </div>
      </footer>
    </div>
  )
}
