import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, Eye, Activity } from 'lucide-react'

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
  )
}
