import CronDashboard from "@/components/cron-dashboard"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CronPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-ratels-red" />
                <h1 className="text-xl font-bold text-foreground">Cron Management</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-8 space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground">Automated Sync</h1>
          <p className="text-muted-foreground">Monitor and manage YouTube video synchronization</p>
          <div className="w-16 h-1 bg-ratels-red mx-auto rounded-full"></div>
        </div>
        <CronDashboard />
      </div>
    </div>
  )
}
