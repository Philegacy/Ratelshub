import YouTubeSyncTester from "@/components/youtube-sync-tester"

export default function SyncPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Admin: YouTube Sync</h1>
      <YouTubeSyncTester />
    </div>
  )
}
