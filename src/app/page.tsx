'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { trackEvent, trackAppView, trackSearch, trackFilter, trackAppClick } from '@/lib/analytics'
import { mergeAppAssets } from '@/lib/assets'
import { App } from '@/lib/types'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Github, Eye, Star, Settings, Timer } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'
import { AdminModal } from '@/components/admin/AdminModal'
import { AdminAnalyticsPanel } from '@/components/admin/AdminAnalyticsPanel'
export default function HomePage() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showAdminModal, setShowAdminModal] = useState(false)

  const { isAdmin } = useAdmin()

  // Event handler functions to prevent hydration issues
  const handleAppView = useCallback((appName: string, category: string) => {
    if (typeof window !== 'undefined') {
      trackAppView(appName, category)
    }
  }, [])

  const handleAppClick = useCallback((appName: string, action: string) => {
    if (typeof window !== 'undefined') {
      trackAppClick(appName, action)
    }
  }, [])

  // Generate mock analytics data for demonstration
  const analyticsData = useMemo(() => {
    if (!apps.length) return null

    // Mock top apps by views - use deterministic calculation based on app name
    const topApps = apps.slice(0, 5).map(app => {
      // Create deterministic "random" values based on app name length and content
      const nameHash = app.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const views = 10 + (nameHash % 90) // 10-100 range, deterministic
      return {
        name: app.name,
        views,
        category: app.category
      }
    }).sort((a, b) => b.views - a.views)

    // Mock category stats - use deterministic calculation based on category
    const categoryStats = Array.from(new Set(apps.map(app => app.category))).map(category => {
      const categoryApps = apps.filter(app => app.category === category)
      const categoryHash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const views = categoryApps.length * (10 + (categoryHash % 40)) // 10-50 range, deterministic
      return {
        category,
        views,
        apps: categoryApps.length
      }
    }).sort((a, b) => b.views - a.views)

    // Use deterministic values for totals based on apps count
    const appsHash = apps.length * 7 + 42 // Fixed multiplier for consistency
    const totalUsers = 100 + (appsHash % 400) // 100-500 range
    const totalViews = 500 + (appsHash % 1500) // 500-2000 range

    return {
      topApps,
      totalUsers,
      totalViews,
      categoryStats
    }
  }, [apps])

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch('/api/apps')

        if (!response.ok) {
          throw new Error('Failed to fetch apps')
        }

        const data = await response.json()
        setApps(mergeAppAssets(data || []))

        // Track dashboard view
        trackEvent('dashboard_view')
      } catch (error) {
        console.error('Error fetching apps:', error)
        setApps([])
      }
      setLoading(false)
    }

    fetchApps()
  }, [])

  const filteredApps = useMemo(() => {
    if (!apps.length) return []

    return apps.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = statusFilter === 'all' || app.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [apps, searchQuery, statusFilter, categoryFilter])

  const categories = useMemo(() => {
    if (!apps.length) return []
    return Array.from(new Set(apps.map(app => app.category))).sort()
  }, [apps])

  useEffect(() => {
    if (searchQuery) {
      trackSearch(searchQuery, filteredApps.length)
    }
  }, [searchQuery, filteredApps.length])

  useEffect(() => {
    trackFilter('status', statusFilter)
  }, [statusFilter])

  useEffect(() => {
    trackFilter('category', categoryFilter)
  }, [categoryFilter])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading EmmanuelOS Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-sky-100/80 via-blue-100/60 to-indigo-100/80 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
        <div className="relative max-w-7xl mx-auto p-8 md:p-12">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.h1
                className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-sky-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4 tracking-tight drop-shadow-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                EmmanuelOS
              </motion.h1>
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <p className="text-lg md:text-xl text-slate-700 font-medium leading-relaxed">
                  System-Wide Analytics, Reporting & Tracking Dashboard
                </p>
                <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Centralized command center for monitoring and managing your complete application portfolio with real-time insights and comprehensive analytics.
                </p>

                {/* Portfolio Button - Moved under the text */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="pt-4"
                >
                  <Button
                    asChild
                    className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 hover:from-sky-600 hover:via-blue-700 hover:to-indigo-800 text-white font-semibold shadow-lg hover:shadow-[0_0_30px_rgba(14,165,233,0.8),0_0_60px_rgba(99,102,241,0.6)] transition-all duration-300 rounded-xl px-6 py-3 text-sm"
                  >
                    <a
                      href="https://ceodev.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                      onClick={(e) => {
                        e.preventDefault()
                        if (typeof window !== 'undefined') {
                          window.open('https://ceodev.vercel.app', '_blank', 'noopener,noreferrer')
                        }
                      }}
                    >
                      <span className="animate-pulse">🚀</span>
                      Explore Portfolio
                    </a>
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* Logo and Admin Section - Right side */}
            <div className="flex items-center gap-4 ml-8">
              {/* Admin Button - Moved to left of logo */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAdminModal(true)
                  }}
                  className="text-slate-600 hover:text-amber-600 hover:bg-amber-50/60 transition-all duration-300 rounded-full p-4 border-2 border-transparent hover:border-amber-300 hover:shadow-lg active:scale-95"
                  title="Admin Access - Click to access SuperExplorer"
                >
                  <Settings className="w-6 h-6" />
                </Button>
              </motion.div>

              {/* EmmanuelOS Logo - Moved to the end */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  src="/apps/emmanuelos/emmanuelos-logo.png"
                  alt="EmmanuelOS Logo"
                  width={200}
                  height={200}
                  className="w-48 h-48 object-contain drop-shadow-lg rounded-[2rem] bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-500 hover:bg-white/20 hover:shadow-[0_0_60px_rgba(251,191,36,0.6),0_0_120px_rgba(14,165,233,0.4),0_0_180px_rgba(251,191,36,0.3)] hover:scale-105"
                  priority={true}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-200/30 to-transparent rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full blur-3xl translate-y-32 -translate-x-32"></div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto p-6">
        {/* Analytics Dashboard */}
        {analyticsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <AnalyticsDashboard data={analyticsData} />
          </motion.div>
        )}

        {/* Admin Panel - Super Explorer */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-8 relative"
          >
            {/* Admin Panel Header */}
            <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-2xl border border-amber-200/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-full">
                  <Settings className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-amber-800">🎛️ Super Explorer Admin Panel</h2>
                  <p className="text-sm text-amber-600">Control analytics modes and switch between demo/live data</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Active</span>
              </div>
            </div>

            <AdminAnalyticsPanel />
          </motion.div>
        )}

        {/* Filters and Search */}
        <motion.div
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search applications by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                }}
                className="bg-white/70 backdrop-blur-sm border-sky-200/50 focus:border-sky-400 focus:ring-sky-400/20 text-slate-800 placeholder:text-slate-500 rounded-xl shadow-sm"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value)
              }}>
                <SelectTrigger className="w-40 bg-white/70 backdrop-blur-sm border-sky-200/50 focus:border-sky-400 text-slate-800 rounded-xl shadow-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-sm border-sky-200/50">
                  <SelectItem value="all" className="text-slate-800 hover:bg-sky-50">All Status</SelectItem>
                  <SelectItem value="Live" className="text-slate-800 hover:bg-sky-50">🟢 Live</SelectItem>
                  <SelectItem value="Finalizing" className="text-slate-800 hover:bg-sky-50">🟡 Finalizing</SelectItem>
                  <SelectItem value="In Development" className="text-slate-800 hover:bg-sky-50">🔴 In Development</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={(value) => {
                setCategoryFilter(value)
              }}>
                <SelectTrigger className="w-48 bg-white/70 backdrop-blur-sm border-sky-200/50 focus:border-sky-400 text-slate-800 rounded-xl shadow-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-sm border-sky-200/50">
                  <SelectItem value="all" className="text-slate-800 hover:bg-sky-50">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category} className="text-slate-800 hover:bg-sky-50">{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-slate-600 font-medium">
              {filteredApps.length} of {apps.length} applications
            </p>
            <Button variant="outline" className="bg-white/70 backdrop-blur-sm border-sky-200/50 hover:bg-sky-50 hover:border-sky-300 text-slate-700 rounded-xl shadow-sm transition-all duration-300">
              + Add New Application
            </Button>
          </div>
        </motion.div>

        {/* Apps Grid */}
        {filteredApps.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {filteredApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  boxShadow: "0 25px 50px -12px rgba(14, 165, 233, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8)"
                }}
                whileTap={{ scale: 0.98 }}
                className="group relative"
                onMouseEnter={() => handleAppView(app.name, app.category)}
              >
                <Card className={`relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 border-0 min-h-[450px] ${
                  app.cover ? 'bg-white' : 'bg-gradient-to-br from-sky-100/90 to-blue-100/90'
                }`}>
                  {/* Top section - Image only */}
                  {app.cover && (
                    <div className="relative h-48 overflow-hidden rounded-t-3xl">
                      <Image
                        src={app.cover}
                        alt={`${app.name} cover`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      {/* Subtle gradient overlay at bottom of image for smooth transition */}
                      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/20 to-transparent"></div>
                    </div>
                  )}

                  {/* Top section for cards without images - Header area */}
                  {!app.cover && (
                    <div className="h-48 rounded-t-3xl bg-gradient-to-br from-sky-200/50 via-blue-200/30 to-indigo-200/50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 bg-white/40 rounded-2xl backdrop-blur-sm border border-white/60 flex items-center justify-center">
                          <Star className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-sm text-slate-600 font-medium">No Preview</p>
                      </div>
                    </div>
                  )}

                  {/* Bottom section - Details with clean background */}
                  <div className={`p-6 ${app.cover ? 'bg-white/95 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        {/* App Logo */}
                        {app.logo && (
                          <div className="w-14 h-14 mb-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                            <Image
                              src={app.logo}
                              alt={`${app.name} logo`}
                              width={36}
                              height={36}
                              className="w-9 h-9 object-contain"
                              loading="lazy"
                              sizes="36px"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        )}

                        <h3 className="text-xl font-bold mb-3 line-clamp-1 text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
                          {app.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant={app.status === 'Live' ? 'default' : app.status === 'Finalizing' ? 'secondary' : 'destructive'}
                            className={`text-xs font-medium px-3 py-1 rounded-full shadow-sm transition-all duration-300 ${
                              app.status === 'Live'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : app.status === 'Finalizing'
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                          >
                            {app.status === 'Live' ? '🟢' : app.status === 'Finalizing' ? '🟡' : '🔴'} {app.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-300 rounded-full px-3 py-1 font-medium hover:bg-slate-100 transition-all duration-300">
                            {app.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Preview indicator */}
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-all duration-300 shadow-sm border border-slate-200 group-hover:scale-110">
                        <Eye className="w-6 h-6 text-slate-700" />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <p className="text-slate-700 text-sm mb-4 line-clamp-3 leading-relaxed group-hover:text-slate-800 transition-colors duration-300">
                        {app.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {app.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-300 rounded-full px-2 py-1 font-medium hover:bg-slate-100 transition-all duration-300">
                            {tag}
                          </Badge>
                        ))}
                        {app.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-300 rounded-full px-2 py-1 font-medium hover:bg-slate-100 transition-all duration-300">
                            +{app.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2 mt-auto">
                        {app.live_url && app.live_url.toLowerCase() !== 'coming soon' && app.live_url.toLowerCase() !== 'coming soon' && (
                          <Button
                            asChild
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                            onClick={() => handleAppClick(app.name, 'live_url')}
                          >
                            <a
                              href={app.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View Live
                            </a>
                          </Button>
                        )}
                        {app.live_url && (app.live_url.toLowerCase() === 'coming soon' || app.live_url.toLowerCase() === 'coming soon') && (
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl cursor-not-allowed opacity-75"
                            disabled
                          >
                            <Timer className="w-4 h-4 mr-2" />
                            Coming Soon
                          </Button>
                        )}
                        {app.github_url && (app.live_url?.toLowerCase() !== 'coming soon' && app.live_url?.toLowerCase() !== 'coming soon') && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="flex-1 border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                            onClick={() => handleAppClick(app.name, 'github_url')}
                          >
                            <a
                              href={app.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2"
                            >
                              <Github className="w-4 h-4" />
                              GitHub
                            </a>
                          </Button>
                        )}
                        {app.github_url && (app.live_url?.toLowerCase() === 'coming soon' || app.live_url?.toLowerCase() === 'coming soon') && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-slate-300 bg-slate-100 text-slate-500 rounded-xl shadow-sm cursor-not-allowed opacity-60"
                            disabled
                          >
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 hover:bg-slate-100 hover:text-slate-800 text-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                          asChild
                          onClick={() => handleAppClick(app.name, 'details')}
                        >
                          <a href={`/app/${app.id}`} className="flex items-center justify-center gap-2">
                            <Star className="w-4 h-4" />
                            Details
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/40 max-w-md mx-auto">
              <p className="text-slate-700 text-lg mb-3 font-medium">No applications found</p>
              <p className="text-sm text-slate-600 mb-6">
                Your database is ready! Populate it with your applications data.
              </p>
              <Button
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  fetch('/api/seed-database').catch(console.error)
                }}
              >
                Seed Database with Applications
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Admin Modal */}
      <AdminModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />

      {/* Footer with Portfolio Link */}
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
                  className="grid grid-cols-3 gap-8 max-w-lg mx-auto mb-8"
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
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 hover:from-sky-600 hover:via-blue-700 hover:to-indigo-800 text-white font-bold shadow-2xl hover:shadow-[0_0_50px_rgba(14,165,233,0.9),0_0_100px_rgba(99,102,241,0.7),0_0_150px_rgba(14,165,233,0.5)] transition-all duration-500 rounded-2xl px-12 py-6 text-xl group"
                >
                  <a
                    href="https://ceodev.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4"
                    onClick={(e) => {
                      e.preventDefault()
                      if (typeof window !== 'undefined') {
                        window.open('https://ceodev.vercel.app', '_blank', 'noopener,noreferrer')
                      }
                    }}
                  >
                    <span className="animate-bounce text-2xl group-hover:animate-pulse">🚀</span>
                    <span className="font-semibold">View Full Portfolio</span>
                    <span className="animate-pulse text-xl group-hover:animate-bounce">→</span>
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
            <div className="flex items-center gap-4 text-slate-200 text-base font-medium">
              <div className="w-3 h-3 bg-sky-400 rounded-full animate-pulse shadow-lg"></div>
              <span className="drop-shadow-md">© 2025 EmmanuelOS</span>
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse shadow-lg"></div>
            </div>
          </motion.div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-sky-500/15 to-transparent rounded-full blur-3xl -translate-y-48"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-indigo-500/15 to-transparent rounded-full blur-3xl translate-y-32"></div>
      </footer>
    </div>
  )
}
