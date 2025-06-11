"use client"

import type React from "react"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Loader2, Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [isSignup, setIsSignup] = useState(false)

  const handleAuth = async () => {
    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const { error } = isSignup
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        if (error.message.includes("security purposes") || error.message.includes("rate")) {
          setErrorMsg("Too many attempts. Please wait a minute and try again.")
        } else if (error.message.includes("Invalid login credentials")) {
          setErrorMsg("Invalid email or password. Please check your credentials.")
        } else if (error.message.includes("Email not confirmed")) {
          setErrorMsg("Please check your email and click the confirmation link.")
        } else if (error.message.includes("Password should be at least")) {
          setErrorMsg("Password should be at least 6 characters long.")
        } else {
          setErrorMsg(error.message)
        }
      } else {
        if (isSignup) {
          setSuccessMsg("Check your email to confirm your account and complete signup!")
        } else {
          setSuccessMsg("Successfully signed in!")
        }
      }
    } catch (err) {
      setErrorMsg("Something went wrong. Please try again.")
      console.error("Auth error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleAuth()
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md bg-background border-border shadow-xl animate-fade-in">
        <CardContent className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-ratels-red rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">RATELS</h1>
                <div className="w-full h-1 bg-ratels-red rounded-full"></div>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">{isSignup ? "Join the Movement" : "Welcome Back"}</h2>
              <p className="text-muted-foreground text-sm">
                {isSignup ? "Create your RATELS account" : "Sign in to access VDM content"}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ratels-red focus:border-ratels-red"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ratels-red focus:border-ratels-red"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-start space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-fade-in">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-destructive text-sm">{errorMsg}</p>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="flex items-start space-x-2 p-3 bg-ratels-red/10 border border-ratels-red/20 rounded-lg animate-fade-in">
                <div className="w-5 h-5 bg-ratels-red rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-ratels-red text-sm">{successMsg}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleAuth}
              disabled={loading || !email || !password}
              className="w-full bg-ratels-red text-white hover:bg-ratels-red/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Please wait...</span>
                </div>
              ) : isSignup ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Toggle Sign Up / Sign In */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-muted-foreground text-sm">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsSignup(!isSignup)
                    setErrorMsg("")
                    setSuccessMsg("")
                  }}
                  className="text-ratels-red hover:text-ratels-red/80 font-medium underline transition-colors duration-200"
                  disabled={loading}
                >
                  {isSignup ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
