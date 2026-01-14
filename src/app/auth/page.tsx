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

      // Auto login or show success message
      // For now, we redirect to dashboard if session is created immediately (no email confirm)
      // or show a message to check email
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-black text-white p-4 relative overflow-hidden">
      {/* 🌌 Cosmic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050510] to-[#1a0b2e]" />
        <div className="absolute inset-0 bg-grid-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
        <div className="bg-noise opacity-[0.15]" />
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[120px] animate-pulse mix-blend-screen" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-white/10">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-900/20">
            <Sword className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">AI Battlefield</CardTitle>
          <CardDescription className="text-slate-400">
            Sharpen your mind. Challenge the machine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="engage" className="w-full" onValueChange={(v) => { setMode(v as any); setError(null); }}>
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 mb-6">
              <TabsTrigger value="engage">Engage (Login)</TabsTrigger>
              <TabsTrigger value="initiate">Initiate (Sign Up)</TabsTrigger>
            </TabsList>

            <TabsContent value="engage">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="strategist@example.com"
                    className="bg-slate-950/50 border-slate-700 focus:border-orange-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    className="bg-slate-950/50 border-slate-700 focus:border-orange-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enter the Arena"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="initiate">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Display Name (Persona)</Label>
                  <Input
                    id="username"
                    placeholder="e.g. LogicSeeker"
                    className="bg-slate-950/50 border-slate-700 focus:border-orange-500"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="strategist@example.com"
                    className="bg-slate-950/50 border-slate-700 focus:border-orange-500"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    className="bg-slate-950/50 border-slate-700 focus:border-orange-500"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Profile"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-500">
            By entering, you agree to the <span className="underline cursor-pointer hover:text-orange-400">Rules of Engagement</span>.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
