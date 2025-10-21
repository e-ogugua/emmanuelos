'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ExternalLink, Github, Eye, Star, Settings } from 'lucide-react'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'
import { AdminModal } from '@/components/admin/AdminModal'
import { trackEvent, trackAppView, trackSearch, trackFilter, trackAppClick } from '@/lib/analytics'
import { mergeAppAssets } from '@/lib/assets'
import { App } from '@/lib/types'
export default function HomePage() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showAdminModal, setShowAdminModal] = useState(false)

  // Generate mock analytics data for demonstration
  const analyticsData = useMemo(() => {
    if (!apps.length) return null

    // Mock top apps by views
    const topApps = apps.slice(0, 5).map(app => ({
      name: app.name,
      views: Math.floor(Math.random() * 100) + 10,
      category: app.category
    })).sort((a, b) => b.views - a.views)

    // Mock category stats
    const categoryStats = Array.from(new Set(apps.map(app => app.category))).map(category => {
      const categoryApps = apps.filter(app => app.category === category)
      return {
        category,
        views: categoryApps.length * (Math.floor(Math.random() * 50) + 10),
        apps: categoryApps.length
      }
    }).sort((a, b) => b.views - a.views)

    return {
      topApps,
      totalUsers: Math.floor(Math.random() * 500) + 100,
      totalViews: Math.floor(Math.random() * 2000) + 500,
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-header p-8 md:p-12">
        <div className="max-w-7xl mx-auto flex items-start justify-between">
          <div className="flex-1">
            <motion.h1
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-3 tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              EmmanuelOS
            </motion.h1>
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                System-Wide Analytics, Reporting & Tracking Dashboard
              </p>
              <p className="text-sm text-slate-500 max-w-2xl">
                Centralized command center for monitoring and managing your complete application portfolio with real-time insights and comprehensive analytics.
              </p>
            </motion.div>
          </div>

          {/* Admin Button - Subtle placement in top right */}
          <div className="ml-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdminModal(true)}
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
              title="SuperExplorer Admin Access"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Analytics Dashboard */}
        {analyticsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <AnalyticsDashboard data={analyticsData} />
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
                placeholder="Search apps by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (e.target.value) {
                    trackSearch(e.target.value, filteredApps.length)
                  }
                }}
                className="glass-button"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value)
                trackFilter('status', value)
              }}>
                <SelectTrigger className="w-40 glass-button">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Live">🟢 Live</SelectItem>
                  <SelectItem value="Finalizing">🟡 Finalizing</SelectItem>
                  <SelectItem value="In Development">🔴 In Development</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={(value) => {
                setCategoryFilter(value)
                trackFilter('category', value)
              }}>
                <SelectTrigger className="w-48 glass-button">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {filteredApps.length} of {apps.length} applications
            </p>
            <Button variant="outline" className="glass-button">
              + Add New App
            </Button>
          </div>
        </motion.div>

        {/* Apps Grid */}
        {filteredApps.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                  scale: 1.02,
                  y: -8,
                  rotateX: 2,
                  rotateY: 2,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                }}
                whileTap={{ scale: 0.98 }}
                className="group relative"
                onMouseEnter={() => trackAppView(app.name, app.category)}
              >
                <Card className={`glass-card h-full hover:shadow-2xl transition-all duration-500 backdrop-blur-md border-white/20 overflow-hidden ${
                  app.cover ? 'bg-cover bg-center bg-no-repeat' : 'bg-white/10'
                }`} style={app.cover ? { backgroundImage: `url(${app.cover})` } : {}}>
                  {/* Frosted glass overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-sm" />

                  {/* Content overlay */}
                  <div className="relative z-10 h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* App Logo */}
                          {app.logo && (
                            <div className="w-12 h-12 mb-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
                              <Image
                                src={app.logo}
                                alt={`${app.name} logo`}
                                width={32}
                                height={32}
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            </div>
                          )}

                          <h3 className="text-xl font-semibold mb-2 line-clamp-1 font-poppins text-gray-900 drop-shadow-sm">
                            {app.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={app.status === 'Live' ? 'default' : app.status === 'Finalizing' ? 'secondary' : 'destructive'}
                              className="text-xs shadow-sm backdrop-blur-sm bg-white/80 text-gray-800"
                            >
                              {app.status === 'Live' ? '🟢' : app.status === 'Finalizing' ? '🟡' : '🔴'} {app.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-white/60 text-gray-700 border-gray-300/50 backdrop-blur-sm">
                              {app.category}
                            </Badge>
                          </div>
                        </div>

                        {/* Preview indicator */}
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 shadow-lg border border-white/20">
                          <Eye className="w-6 h-6 text-gray-600 drop-shadow-sm" />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 flex-1 flex flex-col">
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3 font-inter leading-relaxed drop-shadow-sm">
                        {app.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {app.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs bg-white/50 text-gray-600 border-gray-300/50 backdrop-blur-sm">
                            {tag}
                          </Badge>
                        ))}
                        {app.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-white/50 text-gray-600 border-gray-300/50 backdrop-blur-sm">
                            +{app.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2 mt-auto">
                        {app.live_url && (
                          <Button
                            asChild
                            size="sm"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg backdrop-blur-sm"
                            onClick={() => trackAppClick(app.name, 'live_url')}
                          >
                            <a
                              href={app.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View App
                            </a>
                          </Button>
                        )}
                        {app.github_url && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="flex-1 border-gray-300 hover:bg-gray-50 shadow-lg backdrop-blur-sm"
                            onClick={() => trackAppClick(app.name, 'github_url')}
                          >
                            <a
                              href={app.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <Github className="w-3 h-3" />
                              GitHub
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 hover:bg-white/80 shadow-lg backdrop-blur-sm"
                          asChild
                          onClick={() => trackAppClick(app.name, 'details')}
                        >
                          <a href={`/app/${app.id}`} className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Details
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-muted-foreground text-lg mb-4">No applications found</p>
            <p className="text-sm text-muted-foreground mb-4">
              Your database is ready! Run the seed script to populate with your apps data.
            </p>
            <Button className="glass-button" onClick={() => {
              // Trigger seed script
              fetch('/api/seed-database').catch(console.error)
            }}>
              Seed Database with Apps Data
            </Button>
          </motion.div>
        )}
      </main>

      {/* Admin Modal */}
      <AdminModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />
    </div>
  )
}
