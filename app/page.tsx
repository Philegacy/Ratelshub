"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"
import VdmVideosSupabase from "@/components/vdm-videos-supabase"
import AuthForm from "@/components/auth-form"

type Post = Database["public"]["Tables"]["posts"]["Row"]
type Thread = Database["public"]["Tables"]["threads"]["Row"]

export default function App() {
  const { user, loading } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [threads, setThreads] = useState<Thread[]>([])
  const [newThread, setNewThread] = useState("")
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [loadingThreads, setLoadingThreads] = useState(true)
  const [databaseReady, setDatabaseReady] = useState(true)

  // Fetch data on component mount
  useEffect(() => {
    if (user) {
      checkDatabaseSetup()
      fetchPosts()
      fetchThreads()
    }
  }, [user])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching posts:", error)
        if (error.message.includes("does not exist")) {
          setPosts([])
          return
        }
        throw error
      }
      setPosts(data || [])
    } catch (error) {
      console.error("Error fetching posts:", error)
      setPosts([])
    } finally {
      setLoadingPosts(false)
    }
  }

  const fetchThreads = async () => {
    try {
      const { data, error } = await supabase.from("threads").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching threads:", error)
        if (error.message.includes("does not exist")) {
          setThreads([])
          return
        }
        throw error
      }
      setThreads(data || [])
    } catch (error) {
      console.error("Error fetching threads:", error)
      setThreads([])
    } finally {
      setLoadingThreads(false)
    }
  }

  const handleNewThread = async () => {
    if (!newThread.trim() || !user) return

    try {
      const { error } = await supabase.from("threads").insert([
        {
          user_id: user.id,
          username: user.email?.split("@")[0] || "user",
          content: newThread,
        },
      ])

      if (error) throw error

      setNewThread("")
      fetchThreads()
    } catch (error) {
      console.error("Error posting thread:", error)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const checkDatabaseSetup = async () => {
    try {
      const { error: postsError } = await supabase.from("posts").select("id").limit(1)
      const { error: threadsError } = await supabase.from("threads").select("id").limit(1)
      const { error: vdmError } = await supabase.from("vdm_videos").select("id").limit(1)

      if (
        postsError?.message.includes("does not exist") ||
        threadsError?.message.includes("does not exist") ||
        vdmError?.message.includes("does not exist")
      ) {
        setDatabaseReady(false)
      }
    } catch (error) {
      console.error("Database check error:", error)
      setDatabaseReady(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!databaseReady && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white border border-gray-200">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">RATEL Movement</h1>
            <div className="space-y-4">
              <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
              <h2 className="text-lg font-semibold text-gray-900">Database Setup Required</h2>
              <p className="text-sm text-gray-600">Please set up your database tables first:</p>
              <div className="text-left bg-gray-50 p-3 rounded text-xs">
                <p className="text-gray-700 mb-2">1. Go to your Supabase Dashboard</p>
                <p className="text-gray-700 mb-2">2. Open SQL Editor</p>
                <p className="text-gray-700 mb-2">3. Run the table creation scripts</p>
                <p className="text-gray-700">4. Run the sample data scripts</p>
              </div>
              <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                Refresh After Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-system">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">RATEL Movement</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <Tabs defaultValue="home" className="w-full">
          <TabsContent value="home">
            <VdmVideosSupabase />
          </TabsContent>

          <TabsContent value="community">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Community Threads</h2>
              {loadingThreads ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading threads...</p>
                </div>
              ) : (
                threads.map((thread) => (
                  <Card key={thread.id} className="bg-white border-gray-200">
                    <CardContent className="flex items-start gap-3 py-4">
                      <Avatar className="bg-blue-600 text-white">
                        <AvatarFallback>{thread.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">@{thread.username}</p>
                        <p className="text-sm text-gray-700">{thread.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

              <div className="mt-6">
                <Textarea
                  placeholder="Start a new thread..."
                  value={newThread}
                  onChange={(e) => setNewThread(e.target.value)}
                  className="bg-white border-gray-200 text-gray-900"
                />
                <Button
                  className="mt-2 bg-blue-600 hover:bg-blue-700"
                  onClick={handleNewThread}
                  disabled={!newThread.trim()}
                >
                  Post Thread
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="text-center p-8">
              <Avatar className="mx-auto mb-4 h-20 w-20 bg-blue-600 text-white">
                <AvatarFallback className="text-2xl">{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <p className="font-bold text-xl text-gray-900">@{user.email?.split("@")[0] || "user"}</p>
              <p className="text-sm text-gray-600 mb-6">RATEL warrior</p>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Logout
              </Button>
            </div>
          </TabsContent>

          <TabsList className="grid grid-cols-3 fixed bottom-4 left-4 right-4 max-w-xl mx-auto bg-white/90 backdrop-blur-md border border-gray-200">
            <TabsTrigger
              value="home"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-600"
            >
              🏠 Home
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-600"
            >
              👥 Community
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-600"
            >
              👤 Profile
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-16 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-center text-sm text-gray-600">Built for the RATEL Family by the Community</p>
        </div>
      </footer>
    </div>
  )
}
