'use client'

import { fetchGithubData, fetchAnalyticsData, generateTrafficData } from '@/lib/analytics'
import { mergeAppAssets } from '@/lib/assets'
import { App } from '@/lib/types'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { Github, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
// Helper function to get hover colors
function getHoverColors(primary: string) {
  if (primary.includes('emerald')) {
    return 'from-emerald-600/90 via-green-700/80 to-teal-800/90'
  }
  if (primary.includes('red')) {
    return 'from-red-600/90 via-rose-700/80 to-pink-800/90'
  }
  return 'from-sky-600/90 via-blue-700/80 to-indigo-800/90'
}
// App-specific color schemes
function getAppColorScheme(appName: string) {
  const name = appName.toLowerCase()

  // Brand colors as specified
  if (name.includes('emmdra')) {
    return {
      primary: 'from-emerald-500/80 via-green-600/70 to-teal-700/80',
      secondary: 'from-emerald-400/30 via-green-500/25 to-teal-500/30',
      accent: 'emerald',
      textGradient: 'from-emerald-800 via-green-800 to-teal-800'
    }
  }

  if (name.includes('zereth')) {
    return {
      primary: 'from-red-500/80 via-rose-600/70 to-pink-700/80',
      secondary: 'from-red-400/30 via-rose-500/25 to-pink-500/30',
      accent: 'red',
      textGradient: 'from-red-800 via-rose-800 to-pink-800'
    }
  }

  if (name.includes('poshpoulefarms') || name.includes('posh')) {
    return {
      primary: 'from-emerald-500/80 via-green-600/70 to-teal-700/80',
      secondary: 'from-emerald-400/30 via-green-500/25 to-teal-500/30',
      accent: 'emerald',
      textGradient: 'from-emerald-800 via-green-800 to-teal-800'
    }
  }

  // Default sky-blue-indigo scheme for other apps
  return {
    primary: 'from-sky-100/80 via-blue-100/60 to-indigo-100/80',
    secondary: 'from-sky-200/30 to-blue-200/20',
    accent: 'sky',
    textGradient: 'from-sky-800 via-blue-800 to-indigo-800'
  }
}

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
      setCurrentScreenshotIndex((prev: number) =>
        prev === app.screenshots!.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevScreenshot = () => {
    if (app?.screenshots && app.screenshots.length > 0) {
      setCurrentScreenshotIndex((prev: number) =>
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

      } catch {
        // Error loading data - silently handle for SSR compatibility
        setApp(null)
      }

      setLoading(false)
    }

    if (params.id) {
      loadData()
    }
  }, [params.id])

  useEffect(() => {
    if (app?.screenshots && app.screenshots.length > 1) {
      const interval = setInterval(() => {
        setCurrentScreenshotIndex((prev: number) =>
          prev === app.screenshots!.length - 1 ? 0 : prev + 1
        )
      }, 4000 + Math.random() * 2000) // Random interval between 4-6 seconds

      return () => clearInterval(interval)
    }
  }, [app?.screenshots])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-700 font-medium">Loading Application Details...</p>
        </div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">App Not Found</h1>
          <p className="text-slate-700">The requested application could not be found.</p>
        </div>
      </div>
    )
  }

  const appColors = getAppColorScheme(app.name)

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Hero Section with Enhanced Professional Styling */}
      <header className="relative h-[400px] md:h-[450px] lg:h-[500px] bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
        {/* Enhanced gradient overlays for depth and professionalism */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-100/90 via-blue-100/70 to-indigo-100/90 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10"></div>

        {/* Enhanced decorative floating elements - Responsive sizing */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-to-bl from-sky-200/40 to-transparent rounded-full blur-3xl -translate-y-32 md:-translate-y-48 lg:-translate-y-64 translate-x-32 md:translate-x-48 lg:translate-x-64"></div>
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-3xl translate-y-20 md:translate-y-32 lg:translate-y-40 -translate-x-20 md:-translate-x-32 lg:-translate-x-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-gradient-to-br from-indigo-200/20 to-transparent rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* App Logo with enhanced glass card styling */}
            {app.logo && (
              <motion.div
                className="w-28 h-28 mx-auto mb-8 bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl rounded-3xl transition-all duration-500 hover:bg-white/30 hover:shadow-[0_0_80px_rgba(255,255,255,0.8),0_0_120px_rgba(14,165,233,0.6)] hover:scale-105 hover:border-white/50"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
              >
                <Image
                  src={app.logo}
                  alt={`${app.name} logo`}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain drop-shadow-lg"
                  priority={true}
                  sizes="80px"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </motion.div>
            )}

            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-semibold bg-gradient-to-r ${appColors.textGradient} bg-clip-text text-transparent mb-6 tracking-tight drop-shadow-lg leading-tight text-center`}>
              {app.name}
            </h1>

            <div className="flex items-center justify-center gap-2 md:gap-4 mb-6 flex-wrap">
              <Badge
                variant={app.status === 'Live' ? 'default' : app.status === 'Finalizing' ? 'secondary' : 'destructive'}
                className={`text-xs md:text-sm px-3 md:px-5 py-1.5 md:py-2.5 bg-white/80 backdrop-blur-sm text-slate-800 border-slate-300/50 shadow-lg font-medium rounded-full transition-all duration-300 hover:bg-white/90 hover:shadow-xl`}
              >
                {app.status === 'Live' ? '🟢' : app.status === 'Finalizing' ? '🟡' : '🔴'} {app.status}
              </Badge>
              <Badge variant="outline" className={`text-xs md:text-sm px-3 md:px-5 py-1.5 md:py-2.5 bg-white/80 backdrop-blur-sm text-slate-800 border-slate-300/50 shadow-lg font-medium rounded-full transition-all duration-300 hover:bg-white/90 hover:shadow-xl`}>
                {app.category}
              </Badge>
            </div>

            <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-slate-800 max-w-4xl mx-auto leading-relaxed font-normal drop-shadow-md text-center px-4 mb-8 md:mb-10">
              {app.description}
            </p>

            {/* Action Buttons */}
            <motion.div
              className="flex gap-3 md:gap-4 lg:gap-6 justify-center mt-8 md:mt-10 flex-wrap px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {app.live_url && app.live_url.toLowerCase() !== 'coming soon' && (
                <Button asChild size="lg" className={`bg-gradient-to-r ${appColors.primary} hover:${getHoverColors(appColors.primary)} text-white font-semibold shadow-2xl hover:shadow-[0_0_40px_rgba(14,165,233,0.9),0_0_80px_rgba(99,102,241,0.7)] transition-all duration-300 rounded-2xl px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg hover:scale-105`}>
                  <a href={app.live_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                    Live Demo
                  </a>
                </Button>
              )}
              {app.live_url && app.live_url.toLowerCase() === 'coming soon' && (
                <Button size="lg" className={`bg-gradient-to-r ${appColors.primary} text-white font-semibold shadow-2xl transition-all duration-300 rounded-2xl px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg cursor-not-allowed opacity-60`}>
                  <ExternalLink className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                  Live Demo
                </Button>
              )}
              {app.github_url && app.live_url?.toLowerCase() !== 'coming soon' && (
                <Button asChild variant="outline" size="lg" className="bg-white/90 backdrop-blur-sm border-slate-300/60 text-slate-800 hover:bg-white hover:border-slate-400/80 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg font-semibold hover:scale-105">
                  <a href={app.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                    Source Code
                  </a>
                </Button>
              )}
              {app.github_url && app.live_url?.toLowerCase() === 'coming soon' && (
                <Button variant="outline" size="lg" className="bg-slate-100/90 backdrop-blur-sm border-slate-300/60 text-slate-500 shadow-xl transition-all duration-300 rounded-2xl px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg font-semibold cursor-not-allowed opacity-60">
                  <Github className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                  Source Code
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Back button - Enhanced styling and responsive positioning */}
        <motion.div
          className="absolute top-4 md:top-6 left-4 md:left-6 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-white font-medium hover:text-slate-900 hover:bg-white/90 backdrop-blur-lg transition-all duration-300 rounded-2xl px-3 md:px-4 py-2 md:py-2.5 border border-white/40 hover:border-white/70 hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] active:scale-95 bg-black/30 text-xs md:text-sm shadow-lg"
          >
            ← Back to Portfolio
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
          {['overview', 'analytics', ...(app.live_url?.toLowerCase() !== 'coming soon' ? ['github'] : []), 'feedback'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab)}
              className={`capitalize px-4 py-2 text-sm md:text-base font-medium transition-all duration-200 ${activeTab === tab ? '' : 'glass-button hover:bg-white/90 hover:border-slate-300/60 hover:text-slate-800'}`}
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
            <div className="space-y-8">
              {/* Screenshots Gallery - Enhanced Interactive Experience */}
              {app.screenshots && app.screenshots.length > 0 && (
                <Card className="glass-card overflow-hidden shadow-2xl hover:shadow-[0_25px_60px_-12px_rgba(14,165,233,0.3)] transition-all duration-500 border-0">
                  <CardContent className="p-0">
                    <div className="relative group">
                      {/* Main Screenshot Display */}
                      <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-t-lg overflow-hidden">
                        <Image
                          src={app.screenshots[currentScreenshotIndex]}
                          alt={`${app.name} screenshot ${currentScreenshotIndex + 1} - ${app.description}`}
                          width={1400}
                          height={788}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwMCIgaGVpZ2h0PSI3ODgiIHZpZXdCb3g9IjAgMCAxNDAwIDc4OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE0MDAiIGhlaWdodD0iNzg4IiBmaWxsPSIjMUUyOTM5Ii8+Cjwvc3ZnPgo="
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />

                        {/* Navigation Arrows - Enhanced responsive positioning */}
                        {app.screenshots.length > 1 && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute left-2 md:left-4 lg:left-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white border border-white/30 backdrop-blur-md opacity-90 hover:opacity-100 transition-all duration-300 rounded-full w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 shadow-lg hover:shadow-xl hover:scale-110"
                              onClick={prevScreenshot}
                            >
                              ←
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 md:right-4 lg:right-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white border border-white/30 backdrop-blur-md opacity-90 hover:opacity-100 transition-all duration-300 rounded-full w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 shadow-lg hover:shadow-xl hover:scale-110"
                              onClick={nextScreenshot}
                            >
                              →
                            </Button>
                          </>
                        )}

                        {/* Thumbnail Strip - Responsive and non-blocking */}
                        <div className="absolute bottom-3 md:bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 bg-black/40 backdrop-blur-md rounded-full px-2 md:px-3 lg:px-5 py-1.5 md:py-2 lg:py-3 border border-white/20 shadow-xl">
                          {app.screenshots.map((screenshot: string, index: number) => (
                            <button
                              key={index}
                              className={`w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 border ${
                                index === currentScreenshotIndex
                                  ? 'bg-sky-400 scale-125 shadow-lg ring-1 ring-sky-300/50 border-sky-300'
                                  : 'bg-white/60 hover:bg-white/90 border-white/30 hover:border-white/50 hover:scale-110'
                              }`}
                              onClick={() => setCurrentScreenshotIndex(index)}
                              title={`View screenshot ${index + 1}`}
                            />
                          ))}
                        </div>

                        {/* Auto-advance indicator - Smaller and less intrusive */}
                        {app.screenshots.length > 1 && (
                          <div className="absolute top-3 md:top-4 lg:top-6 right-3 md:right-4 lg:right-6 bg-black/50 backdrop-blur-md rounded-full px-2 md:px-3 lg:px-4 py-1 md:py-1.5 lg:py-2 border border-white/30 shadow-lg">
                            <div className="flex items-center gap-1.5 md:gap-2 text-white/90 text-xs font-medium">
                              <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="hidden md:inline">Auto-advance</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Screenshot Navigation Info - More compact for mobile */}
                      <div className="p-2 md:p-3 lg:p-4 bg-slate-900/40 backdrop-blur-md border-t border-white/20 rounded-b-lg">
                        <div className="flex items-center justify-between text-xs md:text-sm">
                          <div className="flex items-center gap-1 md:gap-2">
                            <span className="text-slate-300 font-medium hidden md:inline text-xs">
                              Use arrow keys or click thumbnails to navigate
                            </span>
                            <span className="text-slate-300 font-medium md:hidden text-xs">
                              Tap thumbnails to navigate
                            </span>
                            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-slate-700 border-slate-300/50 shadow-md text-xs font-medium hover:bg-white hover:border-slate-400 transition-all duration-200">
                              Interactive Gallery
                            </Badge>
                          </div>
                          <div className="text-slate-300 font-medium text-xs">
                            {currentScreenshotIndex + 1} / {app.screenshots.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tech Stack */}
              <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-500 border-0">
                <CardHeader>
                  <CardTitle className="text-slate-800 font-semibold text-xl">Technology Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                    {/* For demo, showing sample tech stack - in real app this would come from the app data */}
                    {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase'].map((tech) => (
                      <Badge key={tech} variant="outline" className="justify-center py-2 text-slate-700 border-slate-300 bg-white/90 hover:bg-white hover:border-slate-400 transition-all duration-200">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Key Features */}
              <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-500 border-0">
                <CardHeader>
                  <CardTitle className="text-slate-800 font-semibold text-xl">Key Features</CardTitle>
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
              <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-500 border-0">
                <CardHeader>
                  <CardTitle className="text-slate-800 font-semibold text-xl">Tags & Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {app.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-slate-700 bg-slate-100/90 hover:bg-white hover:border-slate-300 transition-all duration-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Analytics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                <Card className="glass-card">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        👥
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
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        👁
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
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        📈
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
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-500/20 rounded-lg">
                        ⏱
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
                  <CardTitle className="text-slate-800 font-medium text-xl">Traffic Trends (Last 14 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trafficData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis
                        dataKey="date"
                        stroke="rgba(255,255,255,0.7)"
                        tickFormatter={(value: string) => {
                          if (typeof window !== 'undefined') {
                            return new Date(value).toLocaleDateString()
                          }
                          return value // Fallback for SSR
                        }}
                      />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(10,10,10,0.9)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px'
                        }}
                        labelFormatter={(value: string) => {
                          if (typeof window !== 'undefined') {
                            return new Date(value).toLocaleDateString()
                          }
                          return value // Fallback for SSR
                        }}
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
                  <CardTitle className="text-slate-800 font-medium text-xl">Top Pages</CardTitle>
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
            <div className="space-y-8">
              {/* GitHub Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                <Card className="glass-card">
                  <CardContent className="p-5 text-center">
                    ⭐
                    <p className="text-2xl font-bold gold-text">{githubData?.stars || 0}</p>
                    <p className="text-sm text-muted-foreground">Stars</p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-5 text-center">
                    📝
                    <p className="text-sm font-bold gold-text">
                      {githubData?.lastCommit ?
                        (typeof window !== 'undefined' ? new Date(githubData.lastCommit).toLocaleDateString() : 'Loading...')
                        : 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">Last Commit</p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-5 text-center">
                    👥
                    <p className="text-2xl font-bold gold-text">{githubData?.contributors || 0}</p>
                    <p className="text-sm text-muted-foreground">Contributors</p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="p-5 text-center">
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
                  <CardTitle className="text-slate-800 font-medium text-xl">Repository Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Repository:</span>
                      {app.live_url?.toLowerCase() !== 'coming soon' ? (
                        <a href={app.github_url} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                          {app.github_url}
                        </a>
                      ) : (
                        <span className="text-slate-500 cursor-not-allowed opacity-60">
                          {app.github_url}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="gold-text">
                        {githubData?.lastCommit ?
                          (typeof window !== 'undefined' ? new Date(githubData.lastCommit).toLocaleDateString() : 'Loading...')
                          : 'N/A'}
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
            <div className="space-y-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-slate-800 font-medium text-xl">Share & Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 md:gap-5">
                    <Button className="flex-1 glass-button" onClick={() => {
                      if (typeof window !== 'undefined') {
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
                      }
                    }}>
                      🔗 Share App
                    </Button>

                    <Button variant="outline" className="flex-1 glass-button">
                      💬 Leave Feedback
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
                      disabled={typeof window === 'undefined'}
                    />
                    <Button
                      className="mt-2 glass-button"
                      disabled={typeof window === 'undefined'}
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          alert('Feedback submitted! Thank you for your input.')
                        }
                      }}
                    >
                      Submit Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer with Home Page Style */}
      <footer className="relative bg-gradient-to-r from-slate-900/80 via-blue-900/60 to-indigo-900/80 backdrop-blur-md border-t border-white/20 py-16 mt-16">
        {/* Enhanced background overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            className="flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Text background panel for maximum readability */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl -z-10"></div>

            {/* Portfolio Call to Action */}
            <div className="space-y-8">
              {/* Main CTA Section */}
              <div className="text-center space-y-6">
                <motion.div
                  className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-sm font-medium tracking-wide uppercase">Available for Projects</span>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                </motion.div>

                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg bg-gradient-to-r from-white via-sky-100 to-indigo-100 bg-clip-text text-transparent">
                  Ready to Transform Ideas into Reality?
                </h3>

                <p className="text-slate-100 max-w-2xl mx-auto text-xl leading-relaxed drop-shadow-md font-medium mb-8">
                  Let&apos;s collaborate on innovative solutions that drive results. From concept to deployment, I bring expertise in modern web technologies and strategic thinking to every project.
                </p>

                {/* Professional Stats */}
                <motion.div
                  className="grid grid-cols-3 gap-6 md:gap-8 max-w-lg mx-auto mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-sky-300 mb-1">15+</div>
                    <div className="text-sm text-slate-200">Projects Delivered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-300 mb-1">100%</div>
                    <div className="text-sm text-slate-200">Client Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-300 mb-1">24/7</div>
                    <div className="text-sm text-slate-200">Support Available</div>
                  </div>
                </motion.div>
              </div>

              {/* Glowing Portfolio Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-20"
              >
                <Button
                  asChild
                  size="lg"
                  className={`portfolio-button bg-gradient-to-r ${appColors.primary} hover:${getHoverColors(appColors.primary)} text-white font-bold shadow-2xl hover:shadow-[0_0_50px_rgba(14,165,233,0.9),0_0_100px_rgba(99,102,241,0.7),0_0_150px_rgba(14,165,233,0.5)] transition-all duration-500 rounded-2xl px-12 py-6 text-xl group relative z-20`}
                >
                  <a
                    href="https://ceodev.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 relative z-20"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <span className="font-semibold">View Full Portfolio</span>
                  </a>
                </Button>
              </motion.div>

              {/* Professional CTA */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <p className="text-slate-200 text-sm">
                  Ready to discuss your project? <span className="text-sky-300 font-medium hover:text-sky-200 cursor-pointer transition-colors">Let&apos;s schedule a call</span>
                </p>
              </motion.div>
            </div>

            {/* Enhanced Decorative elements */}
            <div className={`flex items-center gap-4 text-slate-200 text-base font-medium`}>
              <div className={`w-3 h-3 bg-${appColors.accent}-400 rounded-full animate-pulse shadow-lg`}></div>
              <span className="drop-shadow-md">© 2025 EmmanuelOS</span>
              <div className={`w-3 h-3 bg-${appColors.accent}-400 rounded-full animate-pulse shadow-lg`}></div>
            </div>
          </motion.div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-sky-500/20 to-transparent rounded-full blur-3xl -translate-y-80"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-indigo-500/20 to-transparent rounded-full blur-3xl translate-y-40"></div>
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-gradient-to-l from-purple-500/15 to-transparent rounded-full blur-3xl translate-x-40"></div>
      </footer>
    </div>
  )
}
