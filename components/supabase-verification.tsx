"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface VerificationResult {
  connectionStatus: "success" | "error" | "loading"
  tableExists: boolean
  videoCount: number
  sampleData: any[]
  error: string | null
  queryTime: number
}

export default function SupabaseVerification() {
  const [result, setResult] = useState<VerificationResult>({
    connectionStatus: "loading",
    tableExists: false,
    videoCount: 0,
    sampleData: [],
    error: null,
    queryTime: 0,
  })

  const runVerification = async () => {
    const startTime = Date.now()

    try {
      setResult((prev) => ({ ...prev, connectionStatus: "loading", error: null }))

      console.log("🔍 Starting Supabase verification...")
      console.log("📡 Supabase URL:", "https://xsgxcyxcmariewpnsgnr.supabase.co")

      // Test 1: Check if table exists and get count
      console.log("📊 Testing table access...")
      const { count, error: countError } = await supabase.from("vdm_videos").select("*", { count: "exact", head: true })

      if (countError) {
        console.error("❌ Table access error:", countError)
        throw new Error(`Table access failed: ${countError.message}`)
      }

      console.log("✅ Table exists! Video count:", count)

      // Test 2: Fetch sample data with proper ordering
      console.log("📥 Fetching sample data...")
      const { data, error: dataError } = await supabase
        .from("vdm_videos")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(3)

      if (dataError) {
        console.error("❌ Data fetch error:", dataError)
        throw new Error(`Data fetch failed: ${dataError.message}`)
      }

      console.log("✅ Sample data fetched:", data)

      // Test 3: Verify data structure
      if (data && data.length > 0) {
        console.log("🔍 Data structure verification:")
        const firstVideo = data[0]
        console.log("- ID:", firstVideo.id)
        console.log("- Title:", firstVideo.title)
        console.log("- URL:", firstVideo.url)
        console.log("- Video ID:", firstVideo.video_id)
        console.log("- Published At:", firstVideo.published_at)
        console.log("- Caption:", firstVideo.caption)
      }

      const endTime = Date.now()
      const queryTime = endTime - startTime

      setResult({
        connectionStatus: "success",
        tableExists: true,
        videoCount: count || 0,
        sampleData: data || [],
        error: null,
        queryTime,
      })

      console.log("🎉 Verification completed successfully!")
      console.log(`⏱️ Total time: ${queryTime}ms`)
    } catch (error: any) {
      console.error("💥 Verification failed:", error)

      const endTime = Date.now()
      const queryTime = endTime - startTime

      setResult({
        connectionStatus: "error",
        tableExists: false,
        videoCount: 0,
        sampleData: [],
        error: error.message,
        queryTime,
      })
    }
  }

  useEffect(() => {
    runVerification()
  }, [])

  const getStatusIcon = () => {
    switch (result.connectionStatus) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case "error":
        return <XCircle className="w-6 h-6 text-red-500" />
      case "loading":
        return <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
    }
  }

  const getStatusText = () => {
    switch (result.connectionStatus) {
      case "success":
        return "Connection Successful"
      case "error":
        return "Connection Failed"
      case "loading":
        return "Testing Connection..."
    }
  }

  const getStatusColor = () => {
    switch (result.connectionStatus) {
      case "success":
        return "text-green-700 bg-green-50 border-green-200"
      case "error":
        return "text-red-700 bg-red-50 border-red-200"
      case "loading":
        return "text-blue-700 bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Supabase Connection Verification</h1>
        <p className="text-gray-600">Testing connection to vdm_videos table</p>
      </div>

      {/* Status Card */}
      <Card className={`border-2 ${getStatusColor()}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {getStatusIcon()}
            {getStatusText()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Table Status:</span>
              <span className={`ml-2 ${result.tableExists ? "text-green-600" : "text-red-600"}`}>
                {result.tableExists ? "✅ Exists" : "❌ Not Found"}
              </span>
            </div>
            <div>
              <span className="font-medium">Video Count:</span>
              <span className="ml-2 font-mono">{result.videoCount}</span>
            </div>
            <div>
              <span className="font-medium">Query Time:</span>
              <span className="ml-2 font-mono">{result.queryTime}ms</span>
            </div>
          </div>

          {result.error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">Error Details:</p>
                  <p className="text-red-700 text-sm mt-1">{result.error}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample Data */}
      {result.sampleData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sample Data (Latest 3 Videos)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.sampleData.map((video, index) => (
                <div key={video.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <span className="font-medium">ID:</span> {video.id}
                      </p>
                      <p>
                        <span className="font-medium">Title:</span> {video.title || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Video ID:</span> {video.video_id || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">Published:</span> {video.published_at}
                      </p>
                      <p>
                        <span className="font-medium">URL:</span>
                        {video.url ? (
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline ml-1"
                          >
                            View Video
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    </div>
                  </div>
                  {video.caption && (
                    <p className="mt-2 text-gray-600 text-sm">
                      <span className="font-medium">Caption:</span> {video.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Raw Data (for debugging) */}
      {result.sampleData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Raw JSON Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
              {JSON.stringify(result.sampleData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="text-center">
        <Button onClick={runVerification} className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="w-4 h-4 mr-2" />
          Run Verification Again
        </Button>
      </div>

      {/* Instructions */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">What This Test Checks:</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            ✅ <strong>Connection:</strong> Can we connect to your Supabase instance?
          </p>
          <p>
            ✅ <strong>Table Access:</strong> Does the vdm_videos table exist and is it accessible?
          </p>
          <p>
            ✅ <strong>Data Retrieval:</strong> Can we fetch data with proper ordering?
          </p>
          <p>
            ✅ <strong>Data Structure:</strong> Are all expected fields present?
          </p>
          <p>
            ✅ <strong>Performance:</strong> How fast are the queries?
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
