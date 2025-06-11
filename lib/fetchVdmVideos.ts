export interface VdmVideo {
  id: number
  title?: string
  url?: string
  published_at: string
  caption: string
  video_id: string
  created_at: string
}

export async function fetchVdmVideos(): Promise<VdmVideo[]> {
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
  return videos as VdmVideo[]
}
