"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Sword, Loader2, ShieldCheck, Cpu, Network, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"

import { TextScramble } from "@/components/ui/text-scramble"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { CosmicBackground } from "@/components/ui/cosmic-background"
import { HeroHologram } from "@/components/ui/hero-hologram"

type AuthMode = "engage" | "initiate" | "recovery"

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("engage")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()

  // Login Form State
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Signup Form State
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("")
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Recovery Form State
  const [recoveryEmail, setRecoveryEmail] = useState("")

  // Lifecycle: Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace("/dashboard")
      }
    }
    checkSession()
  }, [router])

  const ERROR_MAP: Record<string, string> = {
    "invalid_login_credentials": "Invalid email or password. Please try again.",
    "User already registered": "This email is already registered. Try logging in.",
    "Password should be at least 6 characters": "Password must be at least 6 characters long.",
  }

  const getFriendlyErrorMessage = (rawError: string) => {
    return ERROR_MAP[rawError] || rawError
  }

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

      // Check if there's a redirect destination stored
      const redirectTo = sessionStorage.getItem('redirectAfterAuth') || '/dashboard'
      sessionStorage.removeItem('redirectAfterAuth')
      router.push(redirectTo)
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters.")
      setLoading(false)
      return
    }

    // Basic username validation
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores.")
      setLoading(false)
      return
    }

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

      console.log('Signup successful')
      // Check if there's a redirect destination stored
      const redirectTo = sessionStorage.getItem('redirectAfterAuth') || '/dashboard'
      sessionStorage.removeItem('redirectAfterAuth')
      console.log('Redirecting to:', redirectTo)
      router.push(redirectTo)
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail, {
        redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
      })
      if (error) throw error
      setSuccessMessage("Password reset link sent to your email.")
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-black text-white p-4 relative overflow-hidden selection:bg-cyan-500/30">
      {/* 🌌 Cosmic Background - Landing Variant (Orbs + Parallax) */}
      <CosmicBackground theme="landing" />

      {/* Main Container - Landscape Command Center */}
      <div className="w-full max-w-5xl relative z-10 animate-in zoom-in-95 duration-700">
        <div className="holographic-card rounded-[2rem] overflow-hidden shadow-[0_0_100px_-20px_rgba(6,182,212,0.2)] backdrop-blur-3xl border border-white/10 group flex flex-col md:flex-row min-h-[600px]">

          {/* 👈 Left Panel: Visuals & Branding */}
          <div className="relative w-full md:w-5/12 bg-black/40 border-b md:border-b-0 md:border-r border-white/10 p-8 md:p-12 flex flex-col justify-between overflow-hidden">

            {/* Background Hologram for Left Panel */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <HeroHologram className="scale-150" />
            </div>

            {/* Top Brand */}
            <div className="relative z-10">
              <div className="h-14 w-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.1)] border border-white/10">
                <Sword className="h-6 w-6 text-cyan-400" />
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 mb-2">
                <TextScramble text="AI BATTLEFIELD" />
              </h1>
              <p className="text-cyan-500/60 font-mono text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                Secure Neural Uplink
              </p>
            </div>

            {/* Middle Stats / Decor */}
            <div className="relative z-10 hidden md:flex flex-col gap-6 my-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Encryption Protocol: <span className="text-emerald-400">AES-256-GCM</span></span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                  <Cpu className="h-4 w-4 text-blue-500" />
                  <span>Neural Co-Processor: <span className="text-blue-400">ONLINE</span></span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                  <Network className="h-4 w-4 text-purple-500" />
                  <span>Global Nodes: <span className="text-purple-400">8,492</span></span>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="relative z-10 hidden md:block">
              <p className="text-[10px] text-zinc-600 font-mono leading-relaxed">
                By accessing this terminal, you agree to the <span className="text-zinc-400 hover:text-white cursor-pointer transition-colors">Neural Data Pact</span> and <span className="text-zinc-400 hover:text-white cursor-pointer transition-colors">Cognitive Safety Protocols</span>.
              </p>
            </div>
          </div>

          {/* 👉 Right Panel: Interactive Form */}
          <div className="w-full md:w-7/12 p-8 md:p-12 md:pl-16 bg-gradient-to-b from-transparent to-black/20 flex flex-col justify-center relative">

            {mode === 'recovery' ? (
              //  RECOVERY MODE
              <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-8">
                  <Button variant="ghost" onClick={() => { setMode("engage"); setError(null); setSuccessMessage(null); }} className="text-zinc-400 hover:text-white p-0 h-auto gap-2 mb-4">
                    <ArrowLeft className="h-4 w-4" /> Back to Login
                  </Button>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Recover Access</h2>
                  <p className="text-zinc-500 text-sm mt-2">Enter your email coordinates to receive a neural reset link.</p>
                </div>

                <form onSubmit={handleRecovery} className="space-y-6">
                  <fieldset disabled={loading} className="space-y-6">
                    <div className="space-y-2 group/input">
                      <Label htmlFor="recovery-email" className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 group-focus-within/input:text-cyan-400 transition-colors pl-1">Email Coordinates</Label>
                      <Input
                        id="recovery-email"
                        type="email"
                        placeholder="strategist@example.com"
                        className="glass-capsule h-12 pl-4 rounded-xl text-white placeholder:text-zinc-700 border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-300 bg-black/20"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        required
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-mono text-red-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="h-4 w-4" /> {error}
                      </div>
                    )}

                    {successMessage && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle className="h-4 w-4" /> {successMessage}
                      </div>
                    )}

                    <MagneticButton className="w-full">
                      <Button className="w-full h-14 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-black tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] border-none transition-all relative overflow-hidden group/btn" disabled={loading}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Link"}
                      </Button>
                    </MagneticButton>
                  </fieldset>
                </form>
              </div>
            ) : (
              // ENGAGE / INITIATE MODES
              <Tabs defaultValue="engage" value={mode} className="w-full max-w-md mx-auto" onValueChange={(v) => { setMode(v as any); setError(null); }}>
                <div className="flex justify-between items-end mb-8">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {mode === 'engage' ? "Access Terminal" : "Initialize Identity"}
                  </h2>
                  <TabsList className="bg-white/5 border border-white/10 rounded-full h-9 p-1">
                    <TabsTrigger value="engage" className="rounded-full text-[10px] font-bold uppercase tracking-widest px-4 h-7 data-[state=active]:bg-cyan-500 data-[state=active]:text-black transition-all">Login</TabsTrigger>
                    <TabsTrigger value="initiate" className="rounded-full text-[10px] font-bold uppercase tracking-widest px-4 h-7 data-[state=active]:bg-white data-[state=active]:text-black transition-all">Register</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="engage" className="animate-in fade-in slide-in-from-right-4 duration-500 mt-0">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <fieldset disabled={loading} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2 group/input">
                          <Label htmlFor="email" className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 group-focus-within/input:text-cyan-400 transition-colors pl-1">Email Coordinates</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="strategist@example.com"
                            className="glass-capsule h-12 pl-4 rounded-xl text-white placeholder:text-zinc-700 border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-300 bg-black/20"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2 group/input">
                          <div className="flex justify-between items-center">
                            <Label htmlFor="password" className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 group-focus-within/input:text-cyan-400 transition-colors pl-1">Access Key</Label>
                            <button type="button" onClick={() => setMode('recovery')} className="text-[10px] text-zinc-500 hover:text-cyan-400 font-mono tracking-wide transition-colors uppercase">Forgot Key?</button>
                          </div>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              className="glass-capsule h-12 pl-4 pr-10 rounded-xl text-white placeholder:text-zinc-700 border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-300 bg-black/20"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-mono text-red-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                          <AlertCircle className="h-4 w-4" /> {error}
                        </div>
                      )}

                      <div className="pt-2">
                        <MagneticButton className="w-full">
                          <Button className="w-full h-14 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-black tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] border-none transition-all relative overflow-hidden group/btn" disabled={loading}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Establish Link"}
                          </Button>
                        </MagneticButton>
                      </div>
                    </fieldset>
                  </form>
                </TabsContent>

                <TabsContent value="initiate" className="animate-in fade-in slide-in-from-right-4 duration-500 mt-0">
                  <form onSubmit={handleSignup} className="space-y-5">
                    <fieldset disabled={loading} className="space-y-5">
                      <div className="space-y-2 group/input">
                        <Label htmlFor="username" className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 group-focus-within/input:text-cyan-400 transition-colors pl-1">Callsign</Label>
                        <Input
                          id="username"
                          placeholder="e.g. LogicSeeker"
                          className="glass-capsule h-11 pl-4 rounded-xl text-white placeholder:text-zinc-700 border-white/10 focus:border-cyan-500/50 bg-black/20 transition-all"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          maxLength={20}
                        />
                      </div>
                      <div className="space-y-2 group/input">
                        <Label htmlFor="signup-email" className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 group-focus-within/input:text-cyan-400 transition-colors pl-1">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          className="glass-capsule h-11 pl-4 rounded-xl text-white placeholder:text-zinc-700 border-white/10 focus:border-cyan-500/50 bg-black/20 transition-all"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2 group/input">
                        <Label htmlFor="signup-password" className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 group-focus-within/input:text-cyan-400 transition-colors pl-1">Create Key</Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={showSignupPassword ? "text" : "password"}
                            className="glass-capsule h-11 pl-4 pr-10 rounded-xl text-white placeholder:text-zinc-700 border-white/10 focus:border-cyan-500/50 bg-black/20 transition-all"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            required
                            minLength={6}
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1"
                          >
                            {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 group/input">
                        <Label htmlFor="confirm-password" className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 group-focus-within/input:text-cyan-400 transition-colors pl-1">Confirm Key</Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            className="glass-capsule h-11 pl-4 pr-10 rounded-xl text-white placeholder:text-zinc-700 border-white/10 focus:border-cyan-500/50 bg-black/20 transition-all"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-mono text-red-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                          <AlertCircle className="h-4 w-4" /> {error}
                        </div>
                      )}

                      <div className="pt-2">
                        <MagneticButton className="w-full" strength={0.2}>
                          <Button className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Initialize Profile"}
                          </Button>
                        </MagneticButton>
                      </div>
                    </fieldset>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </div>

        </div>
      </div>

      {/* Footer System text */}
      <div className="absolute bottom-6 text-center z-0 opacity-40">
        <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-[0.3em] flex items-center gap-3">
          <span>US-EAST-1</span>
          <span className="w-1 h-1 bg-zinc-600 rounded-full" />
          <span>LATENCY: 12ms</span>
          <span className="w-1 h-1 bg-zinc-600 rounded-full" />
          <span>ENCRYPTION: ACTIVE</span>
        </p>
      </div>

    </div>
  )
}
