"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function YouTubeSyncTester() {
  const [videoId, setVideoId] = useState("")
  const [title, setTitle] = useState("")
  const [caption, setCaption] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/sync-youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_id: videoId,
          title,
          caption,
          published_at: new Date().toISOString(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to sync video")
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const extractVideoId = (input: string) => {
    // Handle YouTube URLs
    if (input.includes("youtube.com") || input.includes("youtu.be")) {
      const match = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
      if (match && match[1]) {
        setVideoId(match[1])
        return
      }
    }
    // Otherwise treat as direct video ID
    setVideoId(input)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>YouTube Sync Tool</CardTitle>
        <CardDescription>Add YouTube videos to the vdm_videos table</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="videoId" className="block text-sm font-medium text-gray-700 mb-1">
              YouTube Video ID or URL
            </label>
            <Input
              id="videoId"
              placeholder="dQw4w9WgXcQ or https://youtube.com/watch?v=dQw4w9WgXcQ"
              value={videoId}
              onChange={(e) => extractVideoId(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Video Title
            </label>
            <Input
              id="title"
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
              Caption (Optional)
            </label>
            <Textarea
              id="caption"
              placeholder="Enter caption or description"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing...
              </>
            ) : (
              "Sync Video"
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Success!</h3>
                <p className="text-sm text-green-700 mt-1">{result.message}</p>
              </div>
            </div>
            <details className="mt-2">
              <summary className="text-xs text-green-600 cursor-pointer">View details</summary>
              <pre className="mt-2 text-xs bg-green-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        Videos will be immediately available in the video feed after syncing.
      </CardFooter>
    </Card>
  )
}
