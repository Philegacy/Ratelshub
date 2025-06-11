"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, Calendar, Play } from "lucide-react"
import { format } from "date-fns"

interface VdmVideo {
  id: number
  title: string
  url: string
  published_at: string
  video_id?: string
  caption?: string
}

export default function VdmVideoFeed() {
  const [videos, setVideos] = useState<VdmVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(
          "https://xsgxcyxcmariewpnsgnr.supabase.co/rest/v1/vdm_videos?select=*&order=published_at.desc",
          {
            headers: {
              apikey:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZ3hjeXhjbWFyaWV3cG5zZ25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzY4MjksImV4cCI6MjA2NTE1MjgyOX0.k-yBiLqZ_5nirVzSDeHF6okSYkvm_pPuQASn3kawezE",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZ3hjeXhjbWFyaWV3cG5zZ25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzY4MjksImV4cCI6MjA2NTE1MjgyOX0.k-yBiLqZ_5nirVzSDeHF6okSYkvm_pPuQASn3kawezE",
            },
          },
        )

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        setVideos(data)
      } catch (err: any) {
        setError(err.message)
        console.error("Error fetching VDM videos:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const getThumbnailUrl = (url: string) => {
    const videoId = extractVideoId(url)
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  }

  const LoadingSkeleton = () => (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Skeleton className="w-full h-48" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </CardContent>
    </Card>
  )

  const ErrorState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Videos</h3>
      <p className="text-red-600 text-center mb-4">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  )

  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
      <div className="text-gray-400 text-6xl mb-4">📹</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Videos Found</h3>
      <p className="text-gray-600 text-center">No VDM videos are available at the moment.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">VDM Video Feed</h1>
          <p className="text-gray-600 mt-2">Latest videos from VeryDarkMan</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </>
          )}

          {!loading && error && <ErrorState />}

          {!loading && !error && videos.length === 0 && <EmptyState />}

          {!loading &&
            !error &&
            videos.map((video) => {
              const thumbnailUrl = getThumbnailUrl(video.url)
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
                          alt={video.title}
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {video.title || video.caption || "Untitled Video"}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(video.published_at), "MMM d, yyyy • h:mm a")}</span>
                      </div>

                      <a
                        href={video.url}
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

        {/* Load more button (placeholder for future pagination) */}
        {!loading && !error && videos.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
              Load More Videos
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">Built for the RATEL Family by the Community</p>
        </div>
      </footer>
    </div>
  )
}
