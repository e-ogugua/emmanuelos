'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Settings, Eye, EyeOff, Lock, Unlock, TrendingUp, Activity } from '@/lib/icons'
import { useAnalytics } from '../../contexts/AnalyticsContext'
import { useAdmin } from '../../contexts/AdminContext'

export function AdminAnalyticsPanel() {
  const { isAdmin, loginAsAdmin, logoutAdmin } = useAdmin()
  const {
    appAnalytics,
    setAppMode,
    setAllAppsMode,
    getAnalyticsSummary
  } = useAnalytics()

  const [password, setPassword] = useState('')

  const summary = getAnalyticsSummary()

  const handleLogin = () => {
    if (loginAsAdmin(password)) {
      setPassword('')
    } else {
      alert('Invalid admin password')
    }
  }

  const handleLogout = () => {
    logoutAdmin()
  }

  if (!isAdmin) {
    return (
      <Card className="glass-card max-w-lg mx-auto border-2 border-amber-200 bg-gradient-to-br from-amber-50/10 to-orange-50/10">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-xl">
            <div className="p-2 bg-amber-100 rounded-full">
              <Lock className="w-6 h-6 text-amber-600" />
            </div>
            Admin Access Required
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Enter the admin password to access analytics controls and switch between demo and live modes
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Admin Password</label>
            <div className="flex gap-3">
              <Input
                type="password"
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="flex-1 bg-white/50 border-gray-200 focus:border-amber-400 focus:ring-amber-400"
              />
              <Button
                onClick={handleLogin}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6"
              >
                Access
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-blue-100 rounded">
                <Settings className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 mb-1">Admin Controls</h4>
                <p className="text-sm text-blue-700">
                  As an admin, you can control analytics modes for each application, switch between demo and live data, and monitor real-time performance across EmmanuelOS entire portfolio.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Secure admin access • Full analytics control • Mode switching
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Analytics Admin Panel
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <Unlock className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold gold-text">{summary.totalApps}</div>
              <div className="text-sm text-muted-foreground">Total Apps</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">{summary.fakeModeCount}</div>
              <div className="text-sm text-muted-foreground">Demo Mode</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">{summary.realModeCount}</div>
              <div className="text-sm text-muted-foreground">Live Mode</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Control</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Current Analytics Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(appAnalytics).map(([appName, appData]) => (
                  <div key={appName} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm truncate">{appName}</span>
                      <Badge variant={appData.mode === 'real' ? 'default' : 'secondary'}>
                        {appData.mode === 'real' ? 'Live' : 'Demo'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last updated: {typeof window !== 'undefined' ? new Date(appData.lastUpdated).toLocaleTimeString() : 'Loading...'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Individual App Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(appAnalytics).map(([appName, appData]) => (
                  <div key={appName} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{appName}</h4>
                      <Badge variant={appData.mode === 'real' ? 'default' : 'secondary'}>
                        {appData.mode === 'real' ? 'Live' : 'Demo'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Switch
                        checked={appData.mode === 'real'}
                        onCheckedChange={(checked: boolean) => setAppMode(appName, checked ? 'real' : 'fake')}
                      />
                      <span className="text-sm">
                        {appData.mode === 'real' ? 'Live Analytics' : 'Demo Mode'}
                      </span>
                    </div>

                    {/* Show current data */}
                    <div className="text-xs space-y-1">
                      <div>Views: {appData.data.pageViews.toLocaleString()}</div>
                      <div>Users: {appData.data.uniqueVisitors.toLocaleString()}</div>
                      <div>Bounce: {appData.data.bounceRate}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Bulk Analytics Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={() => setAllAppsMode('fake')}
                  variant="outline"
                  className="flex-1"
                >
                  <EyeOff className="w-4 h-4 mr-2" />
                  Set All to Demo Mode
                </Button>
                <Button
                  onClick={() => setAllAppsMode('real')}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Set All to Live Mode
                </Button>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Current Status:</h4>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    Demo Mode: {summary.fakeModeCount}
                  </Badge>
                  <Badge variant="outline">
                    Live Mode: {summary.realModeCount}
                  </Badge>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p><strong>Demo Mode:</strong> Shows fake/demo analytics data (users see this as real)</p>
                <p><strong>Live Mode:</strong> Shows real Umami analytics data when available</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
