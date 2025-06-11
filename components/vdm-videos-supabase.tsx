"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Play, Calendar, Eye } from "lucide-react"

type VdmVideo = Database["public"]["Tables"]["vdm_videos"]["Row"]

// Time ago utility function
function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function VdmVideosSupabase() {
  const [videos, setVideos] = useState<VdmVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true)
        setError(null)

        const { data, error: supabaseError } = await supabase
          .from("vdm_videos")
          .select("*")
          .order("published_at", { ascending: false })

        if (supabaseError) {
          throw supabaseError
        }

        if (data) {
          setVideos(data)
        } else {
          setVideos([])
        }
      } catch (err: any) {
        console.error("💥 Fetch error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  // Remove this function entirely:
  // const extractVideoId = (url: string) => {
  //   if (!url) return null
  //   const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
  //   return match ? match[1] : null
  // }

  // Loading State
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground">VDM Videos</h1>
          <p className="text-muted-foreground">Loading latest content from VeryDarkMan...</p>
          <div className="w-16 h-1 bg-ratels-red mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-background border-border animate-pulse">
              <CardContent className="p-0">
                <div className="w-full h-48 bg-muted rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-10 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-16 space-y-6 animate-fade-in">
        <div className="text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold text-foreground">Error Loading Videos</h2>
        <p className="text-destructive max-w-md mx-auto">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-ratels-red text-white hover:bg-ratels-red/90 transition-all duration-200"
        >
          Try Again
        </Button>
      </div>
    )
  }

  // Empty State
  if (videos.length === 0) {
    return (
      <div className="text-center py-16 space-y-6 animate-fade-in">
        <div className="text-6xl">📹</div>
        <h2 className="text-2xl font-bold text-foreground">No Videos Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          No videos are available at the moment. Check back soon for the latest VDM content!
        </p>
      </div>
    )
  }

  // Main Content
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-4xl font-bold text-foreground">VDM Videos</h1>
        <p className="text-muted-foreground">
          Latest content from VeryDarkMan • {videos.length} video{videos.length !== 1 ? "s" : ""}
        </p>
        <div className="w-16 h-1 bg-ratels-red mx-auto rounded-full"></div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => {
          return (
            <Card
              key={video.id}
              className="group bg-background border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted overflow-hidden rounded-t-lg">
                  <img
                    src={`https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`}
                    alt={video.title || "Video thumbnail"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`
                    }}
                  />

                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="bg-ratels-red rounded-full p-3 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
                      <Play className="w-6 h-6 text-white fill-current" />
                    </div>
                  </div>

                  {/* Duration badge (placeholder) */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    <Eye className="w-3 h-3 inline mr-1" />
                    New
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-ratels-red transition-colors duration-200">
                    {video.title || video.caption || "Untitled Video"}
                  </h3>

                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{timeAgo(video.published_at)}</span>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-ratels-red text-white hover:bg-ratels-red/90 transition-all duration-200 group"
                  >
                    <a
                      href={video.url || `https://www.youtube.com/watch?v=${video.video_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      Watch on YouTube
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Load More Button */}
      <div className="text-center pt-8">
        <Button variant="outline" className="border-border text-foreground hover:bg-muted transition-all duration-200">
          Load More Videos
        </Button>
      </div>
    </div>
  )
}
