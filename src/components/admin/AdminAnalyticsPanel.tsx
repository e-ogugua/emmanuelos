'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Settings, Eye, EyeOff, Lock, Unlock, TrendingUp, Activity } from 'lucide-react'
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
      <Card className="glass-card max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Admin Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin}>Login</Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Admin access required for analytics control
          </p>
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
                        {appData.mode === 'real' ? '🟢 Live' : '🟡 Demo'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last updated: {appData.lastUpdated.toLocaleTimeString()}
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
                    🟡 Demo Mode: {summary.fakeModeCount}
                  </Badge>
                  <Badge variant="outline">
                    🟢 Live Mode: {summary.realModeCount}
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
