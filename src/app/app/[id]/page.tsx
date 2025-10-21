'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { Github, ExternalLink, Share2, MessageCircle, TrendingUp, Star, GitCommit, Users, Clock, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchGithubData, fetchAnalyticsData, generateTrafficData } from '@/lib/analytics'
import { mergeAppAssets } from '@/lib/assets'
import { App } from '@/lib/types'

export default function AppDetailPage() {
  const params = useParams()
  const [app, setApp] = useState<App | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<{
    visitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    topPages: Array<{ path: string; views: number }>;
  } | null>(null)
  const [githubData, setGithubData] = useState<{
    stars: number;
    forks: number;
    lastCommit: string;
    contributors: number;
    issues: number;
    language: string;
  } | null>(null)
  const [trafficData, setTrafficData] = useState<Array<{
    date: string;
    visitors: number;
    pageViews: number;
  }>>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0)

  const nextScreenshot = () => {
    if (app?.screenshots && app.screenshots.length > 0) {
      setCurrentScreenshotIndex((prev) =>
        prev === app.screenshots!.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevScreenshot = () => {
    if (app?.screenshots && app.screenshots.length > 0) {
      setCurrentScreenshotIndex((prev) =>
        prev === 0 ? app.screenshots!.length - 1 : prev - 1
      )
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch all apps and find the specific one
        const response = await fetch('/api/apps')

        if (!response.ok) {
          throw new Error('Failed to fetch apps')
        }

        const apps = await response.json()
        const appData = apps.find((app: App) => app.id === params.id)

        if (!appData) {
          console.error('App not found:', params.id)
          setLoading(false)
          return
        }

        // Merge with visual assets
        const appWithAssets = mergeAppAssets([appData])[0]
        setApp(appWithAssets)

        // Load analytics data
        const analytics = await fetchAnalyticsData()
        setAnalyticsData(analytics)

        // Load GitHub data if available
        if (appData.github_url) {
          const github = await fetchGithubData()
          setGithubData(github)
        }

        // Generate traffic data
        const traffic = generateTrafficData(14) // 14 days of data
        setTrafficData(traffic)

      } catch (error) {
        console.error('Error loading data:', error)
      }

      setLoading(false)
    }

    if (params.id) {
      loadData()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">App Not Found</h1>
          <p className="text-muted-foreground">The requested application could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Cover Background */}
      <header className={`relative h-96 flex items-center justify-center overflow-hidden ${
        app.cover ? 'bg-cover bg-center bg-no-repeat' : 'glass'
      }`} style={app.cover ? { backgroundImage: `url(${app.cover})` } : {}}>
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />

        {/* Animated gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-yellow-500/20 to-yellow-400/20 animate-pulse opacity-50" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* App Logo */}
            {app.logo && (
              <motion.div
                className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  src={app.logo}
                  alt={`${app.name} logo`}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain"
                  priority={true}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo="
                  sizes="64px"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </motion.div>
            )}

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {app.name}
            </h1>

            <div className="flex items-center justify-center gap-3 mb-4">
              <Badge
                variant={app.status === 'Live' ? 'default' : app.status === 'Finalizing' ? 'secondary' : 'destructive'}
                className="text-sm px-4 py-2 bg-white/20 backdrop-blur-sm text-white border-white/30"
              >
                {app.status === 'Live' ? '🟢' : app.status === 'Finalizing' ? '🟡' : '🔴'} {app.status}
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2 bg-white/20 backdrop-blur-sm text-white border-white/30">
                {app.category}
              </Badge>
            </div>

            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
              {app.description}
            </p>

            {/* Action Buttons */}
            <motion.div
              className="flex gap-4 justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {app.live_url && (
                <Button asChild size="lg" className="glass-button bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                  <a href={app.live_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Live Demo
                  </a>
                </Button>
              )}
              {app.github_url && (
                <Button asChild variant="outline" size="lg" className="glass-button bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                  <a href={app.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5 mr-2" />
                    Source Code
                  </a>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Back button */}
        <motion.div
          className="absolute top-6 left-6 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button variant="ghost" onClick={() => window.history.back()} className="glass-button bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
            ← Back to Dashboard
          </Button>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <motion.div
          className="flex gap-1 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {['overview', 'analytics', 'github', 'feedback'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab)}
              className={`capitalize ${activeTab === tab ? '' : 'glass-button'}`}
            >
              {tab}
            </Button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Screenshots Gallery */}
              {app.screenshots && app.screenshots.length > 0 && (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="gold-text">Screenshots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                        <Image
                          src={app.screenshots[currentScreenshotIndex]}
                          alt={`${app.name} screenshot ${currentScreenshotIndex + 1}`}
                          width={800}
                          height={450}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMkEyQTNBIi8+Cjwvc3ZnPgo="
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>

                      {app.screenshots.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                            onClick={prevScreenshot}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                            onClick={nextScreenshot}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>

                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {app.screenshots.map((_, index) => (
                              <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  index === currentScreenshotIndex ? 'bg-white' : 'bg-white/50'
                                }`}
                                onClick={() => setCurrentScreenshotIndex(index)}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tech Stack */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="gold-text">Technology Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {/* For demo, showing sample tech stack - in real app this would come from the app data */}
                    {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase'].map((tech) => (
                      <Badge key={tech} variant="outline" className="justify-center py-2">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Key Features */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="gold-text">Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span className="text-sm">Complete e-commerce platform with product catalog</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span className="text-sm">Persistent cart system with real-time updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span className="text-sm">Secure checkout process with customer information collection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span className="text-sm">Order management system with complete lifecycle tracking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="gold-text">Tags & Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {app.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Analytics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Users className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Total Visitors</p>
                        <p className="text-2xl font-bold gold-text">
                          {analyticsData?.visitors || app.traffic || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <Eye className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Page Views</p>
                        <p className="text-2xl font-bold gold-text">
                          {analyticsData?.pageViews || Math.floor((app.traffic || 0) * 2.3)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Bounce Rate</p>
                        <p className="text-2xl font-bold gold-text">
                          {analyticsData?.bounceRate || 24}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-500/20 rounded-lg">
                        <Clock className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Avg. Session</p>
                        <p className="text-2xl font-bold gold-text">
                          {Math.floor((analyticsData?.avgSessionDuration || 120) / 60)}m {((analyticsData?.avgSessionDuration || 120) % 60)}s
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Traffic Chart */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="gold-text">Traffic Trends (Last 14 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trafficData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis
                        dataKey="date"
                        stroke="rgba(255,255,255,0.7)"
                        tickFormatter={(value: string) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(10,10,10,0.9)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px'
                        }}
                        labelFormatter={(value: string) => new Date(value).toLocaleDateString()}
                      />
                      <Area
                        type="monotone"
                        dataKey="visitors"
                        stroke="#FFD700"
                        fill="rgba(255,215,0,0.2)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="pageViews"
                        stroke="#4F46E5"
                        fill="rgba(79,70,229,0.2)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Pages */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="gold-text">Top Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analyticsData?.topPages || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="path" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(10,10,10,0.9)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="views" fill="#FFD700" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-6">
              {/* GitHub Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="glass-card">
                  <CardContent className="p-4 text-center">
                    <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                    <p className="text-2xl font-bold gold-text">{githubData?.stars || 0}</p>
                    <p className="text-sm text-muted-foreground">Stars</p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-4 text-center">
                    <GitCommit className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <p className="text-sm font-bold gold-text">
                      {githubData?.lastCommit ? new Date(githubData.lastCommit).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">Last Commit</p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <p className="text-2xl font-bold gold-text">{githubData?.contributors || 0}</p>
                    <p className="text-sm text-muted-foreground">Contributors</p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-4 text-center">
                    <div className="w-8 h-8 mx-auto mb-2 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-purple-400 font-bold">TS</span>
                    </div>
                    <p className="text-sm font-bold gold-text">{githubData?.language || 'TypeScript'}</p>
                    <p className="text-sm text-muted-foreground">Primary Language</p>
                  </CardContent>
                </Card>
              </div>

              {/* Repository Info */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="gold-text">Repository Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Repository:</span>
                      <a href={app.github_url} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                        {app.github_url}
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="gold-text">
                        {githubData?.lastCommit ? new Date(githubData.lastCommit).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Open Issues:</span>
                      <span className="gold-text">{githubData?.issues || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="gold-text">Share & Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="flex-1 glass-button" onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: app.name,
                          text: app.description,
                          url: window.location.href,
                        })
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(window.location.href)
                        alert('Link copied to clipboard!')
                      }
                    }}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share App
                    </Button>

                    <Button variant="outline" className="flex-1 glass-button">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Leave Feedback
                    </Button>
                  </div>

                  <div className="mt-6 p-4 bg-white/5 rounded-lg">
                    <h4 className="font-semibold mb-2">Quick Feedback</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Help improve this application by sharing your thoughts and suggestions.
                    </p>
                    <textarea
                      className="w-full p-3 bg-background border border-white/10 rounded-md text-sm resize-none"
                      rows={4}
                      placeholder="Your feedback..."
                    />
                    <Button className="mt-2 glass-button">Submit Feedback</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer Story */}
      <footer className="glass border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">EO</span>
            </div>
            <span className="text-white font-medium">Built by EmmanuelOS</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
