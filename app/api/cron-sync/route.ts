import { NextResponse } from "next/server"

const VDM_HANDLE = "@Verydarkblackman"

async function fetchJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  return res.json()
}

export async function GET() {
  try {
    console.log("🚀 Starting YouTube sync for VDM channel...")

    // Step 1: Get VDM's channel information
    console.log("📡 Fetching channel info for:", VDM_HANDLE)
    const channelResponse = await fetchJson(`https://yt.lemnoslife.com/channels?handle=${VDM_HANDLE}`)

    if (!channelResponse.items || channelResponse.items.length === 0) {
      throw new Error("Channel not found")
    }

    const uploadsPlaylistId = channelResponse.items[0].contentDetails.relatedPlaylists.uploads
    console.log("📋 Uploads playlist ID:", uploadsPlaylistId)

    // Step 2: Get latest videos from uploads playlist
    console.log("🎬 Fetching latest 5 videos...")
    const playlistResponse = await fetchJson(
      `https://yt.lemnoslife.com/playlistItems?playlistId=${uploadsPlaylistId}&part=snippet&maxResults=5`,
    )

    if (!playlistResponse.items || playlistResponse.items.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No videos found in playlist",
        synced: 0,
      })
    }

    console.log(`📊 Found ${playlistResponse.items.length} videos to sync`)

    // Step 3: Sync each video to our database
    const syncResults = []
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"

    for (const item of playlistResponse.items) {
      const videoId = item.snippet.resourceId.videoId
      const title = item.snippet.title
      const publishedAt = item.snippet.publishedAt
      const description = item.snippet.description

      console.log(`🔄 Syncing video: ${title} (${videoId})`)

      try {
        const syncResponse = await fetch(`${baseUrl}/api/sync-youtube`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "RATELS-Hub-Cron/1.0",
          },
          body: JSON.stringify({
            video_id: videoId,
            title,
            published_at: publishedAt,
            caption: description || title,
          }),
        })

        const syncResult = await syncResponse.json()

        if (syncResponse.ok) {
          console.log(`✅ Successfully synced: ${title}`)
          syncResults.push({ videoId, title, status: "success" })
        } else {
          console.log(`⚠️ Sync failed for ${title}:`, syncResult.error)
          syncResults.push({ videoId, title, status: "failed", error: syncResult.error })
        }
      } catch (syncError: any) {
        console.error(`❌ Error syncing ${title}:`, syncError.message)
        syncResults.push({ videoId, title, status: "error", error: syncError.message })
      }
    }

    const successCount = syncResults.filter((r) => r.status === "success").length
    const failedCount = syncResults.length - successCount

    console.log(`🎉 Sync completed: ${successCount} successful, ${failedCount} failed`)

    return NextResponse.json({
      success: true,
      message: `Sync completed: ${successCount}/${syncResults.length} videos synced successfully`,
      synced: successCount,
      failed: failedCount,
      results: syncResults,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("💥 Cron sync failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// Optional: Add POST handler for manual triggers
export async function POST() {
  console.log("🔧 Manual sync triggered via POST")
  return GET() // Reuse the GET logic
}
