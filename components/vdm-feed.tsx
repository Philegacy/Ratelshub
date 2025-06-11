"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Calendar, Play } from "lucide-react"

interface VdmVideo {
  id: number
  title?: string
  url?: string
  published_at: string
  caption: string
  video_id: string
  created_at: string
}

export default function VdmFeed() {
  const [videos, setVideos] = useState<VdmVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadVideos() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(
          "https://xsgxcyxcmariewpnsgnr.supabase.co/rest/v1/vdm_videos?select=*&order=published_at.desc",
          {
            headers: {
              apikey:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZ3hjeXhjbWFyaWV3cG5zZ25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzY4MjksImV4cCI6MjA2NTE1MjgyOX0.k-yBiLqZ_5nirVzSDeHF6okSYkvm_pPuQASn3kawezE",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZ3hjeXhjbWFyaWV3cG5zZ25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzY4MjksImV4cCI6MjA2NTE1MjgyOX0.k-yBiLqZ_5nirVzSDeHF6okSYkvm_pPuQASn3kawezE",
              "Content-Type": "application/json",
            },
          },
        )

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const videos = await res.json()
        console.log("Videos:", videos)
        setVideos(videos)
      } catch (err: any) {
        setError(err.message)
        console.error("Error loading videos:", err)
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [])

  const extractVideoId = (url: string) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const getThumbnailUrl = (video: VdmVideo) => {
    // First try to get video ID from the video_id field
    let videoId = video.video_id

    // If no video_id, try to extract from URL
    if (!videoId && video.url) {
      videoId = extractVideoId(video.url)
    }

    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  }

  const getVideoUrl = (video: VdmVideo) => {
    // Return the URL if it exists, otherwise construct from video_id
    if (video.url) return video.url
    if (video.video_id) return `https://www.youtube.com/watch?v=${video.video_id}`
    return "#"
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "Date unavailable"
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VDM Video Feed</h1>
          <p className="text-gray-600">Loading latest videos...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="w-full h-48 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
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
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Videos</h2>
          <p className="text-red-600 mb-6">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Empty State
  if (videos.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📹</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Videos Found</h2>
          <p className="text-gray-600">No VDM videos are available at the moment.</p>
        </div>
      </div>
    )
  }

  // Main Content
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">VDM Video Feed</h1>
        <p className="text-gray-600">Latest videos from VeryDarkMan ({videos.length} videos)</p>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => {
          const thumbnailUrl = getThumbnailUrl(video)
          const videoUrl = getVideoUrl(video)

          return (
            <Card
              key={video.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200"
            >
              <CardContent className="p-0">
                {/* Thumbnail */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl || "/placeholder.svg"}
                      alt={video.title || video.caption || "Video thumbnail"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=192&width=320"
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="bg-red-600 rounded-full p-3 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                      <Play className="w-6 h-6 text-white fill-current" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {video.title || video.caption || "Untitled Video"}
                  </h2>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Published: {formatDate(video.published_at)}</span>
                  </div>

                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm w-full justify-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Watch on YouTube
                  </a>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Load More Button (placeholder for future pagination) */}
      <div className="text-center mt-12">
        <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
          Load More Videos
        </button>
      </div>
    </div>
  )
}
