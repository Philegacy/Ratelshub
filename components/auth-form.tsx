"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Loader2 } from "lucide-react"

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
        // Handle specific error types
        if (error.message.includes("security purposes") || error.message.includes("rate")) {
          setErrorMsg("You're trying too fast. Please wait a minute and try again.")
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border border-gray-200 shadow-lg">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">RATEL Movement</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{isSignup ? "Create Account" : "Welcome Back"}</h2>
            <p className="text-gray-600 text-sm">{isSignup ? "Join the RATEL community" : "Sign in to your account"}</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{errorMsg}</p>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-green-700 text-sm">{successMsg}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleAuth}
              disabled={loading || !email || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Please wait...
                </div>
              ) : isSignup ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Toggle Sign Up / Sign In */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsSignup(!isSignup)
                    setErrorMsg("")
                    setSuccessMsg("")
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
                  disabled={loading}
                >
                  {isSignup ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
