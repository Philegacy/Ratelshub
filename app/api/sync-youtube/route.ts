import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { video_id, title, published_at, caption } = body

    if (!video_id || !title || !published_at) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const videoUrl = `https://www.youtube.com/watch?v=${video_id}`

    // Use the existing supabase client instead of creating a new connection
    const { data, error } = await supabase
      .from("vdm_videos")
      .insert([
        {
          video_id,
          title,
          url: videoUrl,
          published_at,
          caption: caption || title, // Use caption if provided, otherwise use title
        },
      ])
      .select()

    if (error) {
      console.error("Error inserting video:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data,
      message: `Successfully added video: ${title}`,
    })
  } catch (error: any) {
    console.error("Unexpected error in sync-youtube API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Optional: Add a GET handler to check if the API is working
export async function GET() {
  return NextResponse.json({
    status: "online",
    message: "YouTube sync API is ready. Send POST requests with video_id, title, and published_at.",
    example: {
      video_id: "dQw4w9WgXcQ",
      title: "Never Gonna Give You Up",
      published_at: new Date().toISOString(),
      caption: "Optional caption text",
    },
  })
}
