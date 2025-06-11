"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Play } from "lucide-react"

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

        console.log("🔍 Starting to fetch videos from vdm_videos table...")
        console.log("📡 Supabase URL:", "https://xsgxcyxcmariewpnsgnr.supabase.co")

        // ✅ Confirmed: Using correct table name "vdm_videos"
        // ✅ Confirmed: No .eq() or .filter() that could filter everything out
        const { data, error: supabaseError } = await supabase
          .from("vdm_videos")
          .select("*")
          .order("published_at", { ascending: false })

        // 🔍 Console log the results for debugging
        console.log("📊 Video data:", data)
        console.log("❌ Error:", supabaseError)
        console.log("📈 Data length:", data?.length || 0)

        if (supabaseError) {
          console.error("💥 Supabase error details:", supabaseError)
          throw supabaseError
        }

        if (data) {
          console.log("✅ Successfully fetched videos!")
          console.log("🎬 First video sample:", data[0])
          console.log(
            "📋 All video IDs:",
            data.map((v) => v.id),
          )
          setVideos(data)
        } else {
          console.warn("⚠️ No data returned from query")
          setVideos([])
        }
      } catch (err: any) {
        console.error("💥 Fetch error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
        console.log("🏁 Fetch operation completed")
      }
    }

    fetchVideos()
  }, [])

  const extractVideoId = (url: string) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  // Loading State
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VDM Videos</h1>
          <p className="text-gray-600">Loading videos...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <CardContent className="p-0">
                <div className="w-full h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded" />
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
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Videos</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="text-left bg-red-50 p-4 rounded-lg mb-6 max-w-md mx-auto">
            <p className="text-sm text-red-700 mb-2">
              <strong>Debug Info:</strong>
            </p>
            <p className="text-xs text-red-600">Check the browser console for detailed error logs</p>
          </div>
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
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📹</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Videos Found</h2>
          <p className="text-gray-600 mb-4">No videos are available at the moment.</p>
          <div className="text-left bg-yellow-50 p-4 rounded-lg mb-6 max-w-md mx-auto">
            <p className="text-sm text-yellow-700 mb-2">
              <strong>Possible reasons:</strong>
            </p>
            <ul className="text-xs text-yellow-600 space-y-1">
              <li>• The vdm_videos table is empty</li>
              <li>• Database connection issues</li>
              <li>• Row Level Security blocking access</li>
            </ul>
            <p className="text-xs text-yellow-600 mt-2">Check the browser console for more details</p>
          </div>
        </div>
      </div>
    )
  }

  // Main Content
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">VDM Videos</h1>
        <p className="text-gray-600">Latest videos from VeryDarkMan ({videos.length} videos)</p>
      </div>

      {/* Debug Section - Only show in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">🔍 Debug Info:</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>✅ Table name: "vdm_videos"</p>
            <p>✅ Query: SELECT * FROM vdm_videos ORDER BY published_at DESC</p>
            <p>📊 Videos loaded: {videos.length}</p>
            <p>🔄 Loading state: {loading ? "true" : "false"}</p>
            <p>❌ Error state: {error || "none"}</p>
            {videos.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer font-medium">View first video data</summary>
                <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-x-auto">
                  {JSON.stringify(videos[0], null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}

      {/* Video Grid - UPDATED WITH NEW LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => {
          const youtubeId = video.video_id || extractVideoId(video.url || "")
          return (
            <Card key={video.id} className="w-full overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-video bg-gray-100">
                <img
                  src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                  alt={video.title || "Video thumbnail"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=192&width=320"
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-3 opacity-0 hover:opacity-100 transform scale-75 hover:scale-100 transition-all duration-300">
                    <Play className="w-6 h-6 text-white fill-current" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold line-clamp-2 mb-2 min-h-[3.5rem]">
                  {video.title || video.caption || "Untitled Video"}
                </h3>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">{timeAgo(video.published_at)}</p>
                  <a
                    href={video.url || `https://www.youtube.com/watch?v=${youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Watch
                  </a>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Footer */}
      <div className="text-center mt-12 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Showing {videos.length} video{videos.length !== 1 ? "s" : ""} • Sorted by newest first
        </p>
      </div>
    </div>
  )
}
