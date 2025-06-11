import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://xsgxcyxcmariewpnsgnr.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZ3hjeXhjbWFyaWV3cG5zZ25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzY4MjksImV4cCI6MjA2NTE1MjgyOX0.k-yBiLqZ_5nirVzSDeHF6okSYkvm_pPuQASn3kawezE"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: number
          created_at: string
          video_url: string
          caption: string
        }
        Insert: {
          id?: number
          created_at?: string
          video_url: string
          caption: string
        }
        Update: {
          id?: number
          created_at?: string
          video_url?: string
          caption?: string
        }
      }
      threads: {
        Row: {
          id: number
          created_at: string
          user_id: string
          username: string
          content: string
        }
        Insert: {
          id?: number
          created_at?: string
          user_id: string
          username: string
          content: string
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string
          username?: string
          content?: string
        }
      }
      vdm_videos: {
        Row: {
          id: number
          created_at: string
          video_id: string
          caption: string
          published_at: string
          title?: string
          url?: string
        }
        Insert: {
          id?: number
          created_at?: string
          video_id: string
          caption: string
          published_at?: string
          title?: string
          url?: string
        }
        Update: {
          id?: number
          created_at?: string
          video_id?: string
          caption?: string
          published_at?: string
          title?: string
          url?: string
        }
      }
    }
  }
}
