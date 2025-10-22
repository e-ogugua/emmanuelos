import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, Eye, Activity, BarChart3, Zap } from '@/lib/icons'

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
    <div className="space-y-6">
      {/* Professional Analytics Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-100/90 via-blue-100/70 to-indigo-100/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/40">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Portfolio Analytics</h2>
              <p className="text-sm text-slate-600">Real-time insights across all applications</p>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total Users</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{data.totalUsers.toLocaleString()}</div>
              <div className="text-xs text-emerald-600 font-medium">↗ +12% this week</div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total Views</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{data.totalViews.toLocaleString()}</div>
              <div className="text-xs text-emerald-600 font-medium">↗ +18% this week</div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">Active Apps</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{data.topApps.length}</div>
              <div className="text-xs text-blue-600 font-medium">↗ Growing portfolio</div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">Performance</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">98.5%</div>
              <div className="text-xs text-emerald-600 font-medium">↗ Excellent uptime</div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sky-200/40 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Top Performing Apps */}
        <Card className="bg-white/70 backdrop-blur-sm border-sky-200/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-sky-50/80 to-blue-50/80 border-b border-sky-100/50">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-600" />
              Top Performing Applications
            </CardTitle>
            <p className="text-sm text-slate-600">Most viewed applications this week</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 md:space-y-5">
              {data.topApps.slice(0, 5).map((app, index) => (
                <div key={app.name} className="flex items-center justify-between p-3 bg-gradient-to-r from-white/60 to-sky-50/60 rounded-xl border border-sky-100/50 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${
                      index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                      index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-600' :
                      index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                      'bg-gradient-to-br from-sky-400 to-sky-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{app.name}</div>
                      <Badge variant="outline" className="text-xs bg-sky-50 text-sky-700 border-sky-200 mt-1">
                        {app.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800">{app.views.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">views</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="bg-white/70 backdrop-blur-sm border-sky-200/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-b border-blue-100/50">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Performance by Category
            </CardTitle>
            <p className="text-sm text-slate-600">Application categories and their impact</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 md:space-y-5">
              {data.categoryStats.slice(0, 5).map((category, index) => (
                <div key={category.category} className="flex items-center justify-between p-3 bg-gradient-to-r from-white/60 to-blue-50/60 rounded-xl border border-blue-100/50 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${
                      index === 0 ? 'bg-gradient-to-br from-indigo-500 to-indigo-700' :
                      index === 1 ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
                      index === 2 ? 'bg-gradient-to-br from-cyan-500 to-cyan-700' :
                      'bg-gradient-to-br from-teal-500 to-teal-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{category.category}</div>
                      <div className="text-xs text-slate-500">{category.apps} applications</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800">{category.views.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">total views</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-sky-50/80 via-blue-50/60 to-indigo-50/80 backdrop-blur-sm border-sky-200/50 shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Portfolio Overview</h3>
              <p className="text-slate-600">Comprehensive analytics across all applications</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-sky-700">{data.topApps.length}</div>
                <div className="text-xs text-slate-600 uppercase tracking-wide">Total Apps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">{data.categoryStats.length}</div>
                <div className="text-xs text-slate-600 uppercase tracking-wide">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-700">{Math.round(data.totalViews / data.topApps.length)}</div>
                <div className="text-xs text-slate-600 uppercase tracking-wide">Avg Views/App</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
