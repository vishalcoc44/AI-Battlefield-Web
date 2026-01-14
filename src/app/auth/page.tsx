"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Sword, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

import { CosmicBackground } from "@/components/ui/cosmic-background"

export default function AuthPage() {
  const [mode, setMode] = useState<"engage" | "initiate">("engage")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Login Form State
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Signup Form State
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [username, setUsername] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            username: username,
          },
        },
      })

      if (error) throw error

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-black text-white p-4 relative overflow-hidden selection:bg-orange-500/30">
      {/* 🌌 Cosmic Background - Intense Portal Variant */}
      <CosmicBackground theme="red" />

      <div className="w-full max-w-md relative z-10 holographic-card rounded-3xl p-8 md:p-10 shadow-[0_0_80px_-20px_rgba(234,88,12,0.3)] animate-in zoom-in-95 duration-700">

        {/* Header */}
        <div className="text-center mb-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl -z-10" />
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(234,88,12,0.4)] ring-1 ring-white/20 transform rotate-3">
            <Sword className="h-8 w-8 text-white drop-shadow-md" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-2">AI BATTLEFIELD</h1>
          <p className="text-zinc-400 font-medium tracking-wide">Enter the Cognitive Arena</p>
        </div>

        <Tabs defaultValue="engage" className="w-full" onValueChange={(v) => { setMode(v as any); setError(null); }}>
          <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-white/5 rounded-full p-1 mb-8 h-12">
            <TabsTrigger value="engage" className="rounded-full text-xs font-bold uppercase tracking-widest data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white">Engage</TabsTrigger>
            <TabsTrigger value="initiate" className="rounded-full text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white/10 data-[state=active]:text-white">Initiate</TabsTrigger>
          </TabsList>

          <TabsContent value="engage" className="animate-in fade-in duration-300">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-xs uppercase font-black tracking-wider text-zinc-500 group-focus-within:text-orange-500 transition-colors">Email Coordinates</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="strategist@example.com"
                    className="bg-black/40 border-white/10 focus:border-orange-500/50 rounded-xl h-12 pl-4 transition-all focus:bg-white/5 focus:shadow-[0_0_20px_rgba(249,115,22,0.1)] placeholder:text-zinc-700 font-medium text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2 group">
                <Label htmlFor="password" className="text-xs uppercase font-black tracking-wider text-zinc-500 group-focus-within:text-orange-500 transition-colors">Access Key</Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-black/40 border-white/10 focus:border-orange-500/50 rounded-xl h-12 pl-4 transition-all focus:bg-white/5 focus:shadow-[0_0_20px_rgba(249,115,22,0.1)] font-medium text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> {error}
                </div>
              )}
              <Button className="w-full h-14 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black tracking-widest uppercase shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:shadow-[0_0_50px_rgba(234,88,12,0.5)] border border-white/10 transition-all hover:scale-[1.02]" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Establish Link"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="initiate" className="animate-in fade-in duration-300">
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2 group">
                <Label htmlFor="username" className="text-xs uppercase font-black tracking-wider text-zinc-500 group-focus-within:text-white transition-colors">Callsign</Label>
                <Input
                  id="username"
                  placeholder="e.g. LogicSeeker"
                  className="bg-black/40 border-white/10 focus:border-white/30 rounded-xl h-11 pl-4 transition-all focus:bg-white/5 font-medium text-white placeholder:text-zinc-700"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 group">
                <Label htmlFor="signup-email" className="text-xs uppercase font-black tracking-wider text-zinc-500 group-focus-within:text-white transition-colors">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  className="bg-black/40 border-white/10 focus:border-white/30 rounded-xl h-11 pl-4 transition-all focus:bg-white/5 font-medium text-white"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 group">
                <Label htmlFor="signup-password" className="text-xs uppercase font-black tracking-wider text-zinc-500 group-focus-within:text-white transition-colors">Create Key</Label>
                <Input
                  id="signup-password"
                  type="password"
                  className="bg-black/40 border-white/10 focus:border-white/30 rounded-xl h-11 pl-4 transition-all focus:bg-white/5 font-medium text-white"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-400 font-medium text-center bg-red-500/10 p-2 rounded">{error}</p>
              )}
              <Button className="w-full h-14 rounded-xl bg-white text-black hover:bg-zinc-200 font-black tracking-widest uppercase shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] border-none transition-all hover:scale-[1.02]" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Initialize Profile"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>

      <div className="absolute bottom-6 text-center">
        <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-[0.2em] opacity-60">
          Secure Neural Uplink v4.2.0 • Encryption Enabled
        </p>
      </div>
    </div>
  )
}
