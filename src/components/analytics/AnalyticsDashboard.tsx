import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, Eye, Activity, EyeOff, Eye as EyeIcon, Settings } from 'lucide-react'
import { useAnalytics } from '../../contexts/AnalyticsContext'
import { useAdmin } from '../../contexts/AdminContext'
import { AdminAnalyticsPanel } from '../admin/AdminAnalyticsPanel'

interface AnalyticsData {
  topApps: Array<{
    name: string
    views: number
    category: string
  }>
  totalUsers: number
  totalViews: number
  categoryStats: Array<{
    category: string
    views: number
    apps: number
  }>
}

export function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
  const { appAnalytics } = useAnalytics()
  const { isAdmin } = useAdmin()

  // Check if using fake or real data (for admin view)
  const fakeAppsCount = Object.values(appAnalytics).filter(app => app.mode === 'fake').length
  const realAppsCount = Object.values(appAnalytics).filter(app => app.mode === 'real').length

  return (
    <div className="space-y-6">
      {/* Admin Panel - Always visible, content changes based on auth status */}
      <div className="mb-8">
        <AdminAnalyticsPanel />
      </div>

      {/* Public Analytics Display - Always shows fake data as real */}
      <div className="space-y-6">
        {/* Analytics Status - Only for admin */}
        {isAdmin && (
          <div className="flex items-center justify-between p-4 glass-card rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  🟢 Real: {realAppsCount}
                </Badge>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  🟡 Demo: {fakeAppsCount}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                Analytics modes (Admin View)
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {realAppsCount > 0 ? (
                <>
                  <EyeIcon className="w-4 h-4" />
                  Mixed modes active
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  Demo mode for all apps
                </>
              )}
            </div>
          </div>
        )}

        {/* Public Analytics Cards - Always shows fake data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <Card className="glass-card hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Users (7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold gold-text">{data.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last week</p>
            </CardContent>
          </Card>

          {/* Total Views */}
          <Card className="glass-card hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold gold-text">{data.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Page views across all apps</p>
            </CardContent>
          </Card>

          {/* Top Apps Today */}
          <Card className="glass-card hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Top Apps Today
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {data.topApps.slice(0, 3).map((app, index) => (
                  <div key={app.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="text-sm truncate">{app.name}</span>
                    </div>
                    <span className="text-sm font-medium">{app.views}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traffic by Category */}
          <Card className="glass-card hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Traffic by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {data.categoryStats.slice(0, 3).map((category) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {category.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        ({category.apps} apps)
                      </span>
                    </div>
                    <span className="text-sm font-medium">{category.views}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Controls Notice (only for admin) */}
        {isAdmin && (
          <Card className="glass-card border-amber-200 bg-amber-50/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-amber-700">
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Admin Mode Active</span>
              </div>
              <p className="text-sm text-amber-600 mt-1">
                You can control analytics modes for each application above. Regular users see demo data as real analytics.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
