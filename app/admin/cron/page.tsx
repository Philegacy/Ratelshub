import CronDashboard from "@/components/cron-dashboard"

export default function CronPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Cron Job Management</h1>
        <p className="text-gray-600">Monitor and manage automated YouTube syncing</p>
      </div>
      <CronDashboard />
    </div>
  )
}
