"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugQuery() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testQuery = async () => {
    setLoading(true)
    console.log("🧪 Testing direct query to vdm_videos table...")

    try {
      // Test the exact query
      const { data, error } = await supabase.from("vdm_videos").select("*").order("published_at", { ascending: false })

      console.log("📊 Raw query result:")
      console.log("Data:", data)
      console.log("Error:", error)
      console.log("Data type:", typeof data)
      console.log("Data length:", data?.length)

      setResult({ data, error, timestamp: new Date().toISOString() })
    } catch (err) {
      console.error("💥 Query failed:", err)
      setResult({ data: null, error: err, timestamp: new Date().toISOString() })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto m-6">
      <CardHeader>
        <CardTitle>🔍 Debug Query Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm space-y-2">
          <p>
            <strong>Table:</strong> "vdm_videos" ✅
          </p>
          <p>
            <strong>Query:</strong> SELECT * FROM vdm_videos ORDER BY published_at DESC ✅
          </p>
          <p>
            <strong>No filters:</strong> No .eq() or .filter() applied ✅
          </p>
        </div>

        <Button onClick={testQuery} disabled={loading} className="w-full">
          {loading ? "Testing Query..." : "Test Query Now"}
        </Button>

        {result && (
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Query Result:</h4>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Timestamp:</strong> {result.timestamp}
                </p>
                <p>
                  <strong>Data Length:</strong> {result.data?.length || 0}
                </p>
                <p>
                  <strong>Has Error:</strong> {result.error ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {result.error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Error Details:</h4>
                <pre className="text-xs text-red-700 overflow-x-auto">{JSON.stringify(result.error, null, 2)}</pre>
              </div>
            )}

            {result.data && result.data.length > 0 && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Sample Data (First Video):</h4>
                <pre className="text-xs text-green-700 overflow-x-auto">{JSON.stringify(result.data[0], null, 2)}</pre>
              </div>
            )}

            {result.data && result.data.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Empty Result:</h4>
                <p className="text-sm text-yellow-700">
                  Query succeeded but returned no rows. The table might be empty.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
