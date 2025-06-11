"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Clock, Play, RefreshCw } from "lucide-react"

interface SyncResult {
  success: boolean
  message?: string
  synced?: number
  failed?: number
  results?: Array<{
    videoId: string
    title: string
    status: string
    error?: string
  }>
  timestamp?: string
  error?: string
}

export default function CronDashboard() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SyncResult | null>(null)

  const triggerSync = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/cron-sync", {
        method: "POST",
      })
      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "failed":
        return <Badge className="bg-yellow-100 text-yellow-800">Failed</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            YouTube Sync Cron Job
          </CardTitle>
          <CardDescription>
            Automatically syncs VDM's latest YouTube videos every 6 hours. You can also trigger a manual sync below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Schedule</p>
                <p className="text-sm text-gray-600">Every 6 hours (0 */6 * * *)</p>
              </div>
              <Button onClick={triggerSync} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Manual Sync
                  </>
                )}
              </Button>
            </div>

            {result && (
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-4">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <h3 className="font-medium">{result.success ? "Sync Completed" : "Sync Failed"}</h3>
                  {result.timestamp && (
                    <span className="text-sm text-gray-500">{new Date(result.timestamp).toLocaleString()}</span>
                  )}
                </div>

                {result.success && result.message && <p className="text-sm text-gray-700 mb-4">{result.message}</p>}

                {result.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-red-700">{result.error}</p>
                  </div>
                )}

                {result.results && result.results.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Sync Results:</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {result.results.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.title}</p>
                            <p className="text-gray-500 text-xs">{item.videoId}</p>
                            {item.error && <p className="text-red-600 text-xs mt-1">{item.error}</p>}
                          </div>
                          <div className="ml-2">{getStatusBadge(item.status)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            <strong>1. Channel Lookup:</strong> Fetches VDM's channel using handle @Verydarkblackman
          </p>
          <p>
            <strong>2. Video Discovery:</strong> Gets the latest 5 videos from the uploads playlist
          </p>
          <p>
            <strong>3. Database Sync:</strong> Adds new videos to the vdm_videos table via /api/sync-youtube
          </p>
          <p>
            <strong>4. Automatic Schedule:</strong> Runs every 6 hours via Vercel Cron Jobs
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
