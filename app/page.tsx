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
import { ThemeToggle } from "@/components/theme-toggle"
import { Home, Users, User, LogOut } from "lucide-react"

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground font-medium">Loading RATELS Hub...</p>
        </div>
      </div>
    )
  }

  if (!databaseReady && user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-background border-border shadow-lg animate-fade-in">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">RATELS Hub</h1>
              <div className="w-12 h-1 bg-ratels-red mx-auto rounded-full"></div>
            </div>

            <div className="space-y-4">
              <div className="text-6xl">⚠️</div>
              <h2 className="text-xl font-bold text-foreground">Database Setup Required</h2>
              <p className="text-muted-foreground">Please set up your database tables first:</p>

              <div className="text-left bg-muted p-4 rounded-lg space-y-2 text-sm">
                <p className="text-foreground font-medium">Setup Steps:</p>
                <ol className="text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Go to your Supabase Dashboard</li>
                  <li>Open SQL Editor</li>
                  <li>Run the table creation scripts</li>
                  <li>Run the sample data scripts</li>
                </ol>
              </div>

              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
              >
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
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-ratels-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">RATELS Hub</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <Tabs defaultValue="home" className="w-full">
          <TabsContent value="home" className="animate-fade-in">
            <VdmVideosSupabase />
          </TabsContent>

          <TabsContent value="community" className="animate-fade-in">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-foreground">Community Threads</h2>
                <p className="text-muted-foreground">Join the conversation with fellow RATELS</p>
                <div className="w-16 h-1 bg-ratels-red mx-auto rounded-full"></div>
              </div>

              {/* New Thread Form */}
              <Card className="bg-background border-border shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-foreground">Start a New Thread</h3>
                  <Textarea
                    placeholder="Share your thoughts with the RATELS community..."
                    value={newThread}
                    onChange={(e) => setNewThread(e.target.value)}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
                    rows={3}
                  />
                  <Button
                    onClick={handleNewThread}
                    disabled={!newThread.trim()}
                    className="bg-ratels-red text-white hover:bg-ratels-red/90 transition-all duration-200 disabled:opacity-50"
                  >
                    Post Thread
                  </Button>
                </CardContent>
              </Card>

              {/* Threads List */}
              <div className="space-y-4">
                {loadingThreads ? (
                  <div className="text-center py-12">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading threads...</p>
                  </div>
                ) : threads.length === 0 ? (
                  <Card className="bg-background border-border">
                    <CardContent className="p-12 text-center space-y-4">
                      <div className="text-4xl">💬</div>
                      <h3 className="text-xl font-bold text-foreground">No Threads Yet</h3>
                      <p className="text-muted-foreground">Be the first to start a conversation!</p>
                    </CardContent>
                  </Card>
                ) : (
                  threads.map((thread, index) => (
                    <Card
                      key={thread.id}
                      className="bg-background border-border hover:shadow-md transition-all duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-10 h-10 bg-ratels-red text-white">
                            <AvatarFallback className="bg-ratels-red text-white font-bold">
                              {thread.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <p className="font-bold text-foreground">@{thread.username}</p>
                              <span className="text-muted-foreground text-sm">•</span>
                              <span className="text-muted-foreground text-sm">
                                {new Date(thread.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-foreground leading-relaxed">{thread.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-background border-border shadow-sm">
                <CardContent className="p-8 text-center space-y-6">
                  <Avatar className="w-24 h-24 mx-auto bg-ratels-red text-white">
                    <AvatarFallback className="bg-ratels-red text-white text-3xl font-bold">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">@{user.email?.split("@")[0] || "user"}</h2>
                    <p className="text-muted-foreground">RATELS Warrior</p>
                    <div className="w-12 h-1 bg-ratels-red mx-auto rounded-full"></div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Member since {new Date(user.created_at || "").toLocaleDateString()}
                    </p>
                  </div>

                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="border-border text-foreground hover:bg-muted transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bottom Navigation */}
          <TabsList className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-background/90 backdrop-blur-md border border-border shadow-lg animate-slide-up">
            <TabsTrigger
              value="home"
              className="flex-1 data-[state=active]:bg-ratels-red data-[state=active]:text-white text-muted-foreground transition-all duration-200"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="flex-1 data-[state=active]:bg-ratels-red data-[state=active]:text-white text-muted-foreground transition-all duration-200"
            >
              <Users className="w-4 h-4 mr-2" />
              Community
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="flex-1 data-[state=active]:bg-ratels-red data-[state=active]:text-white text-muted-foreground transition-all duration-200"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </main>
    </div>
  )
}
