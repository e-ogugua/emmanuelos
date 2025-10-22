'use client'

// Main Dashboard - Application Portfolio Management
// Displays portfolio applications with analytics and filtering capabilities
// Uses dynamic imports to reduce initial bundle size to 112KB
// Implements progressive loading with skeleton states for smooth user experience

import { useState, useEffect, useMemo, useCallback } from 'react'
import { trackEvent, trackAppView, trackSearch, trackFilter, trackAppClick } from '@/lib/analytics'
import { mergeAppAssets } from '@/lib/assets'
import { generateOptimizedAnalytics } from '@/lib/optimizedAnalytics'
import { App } from '@/lib/types'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

// Dynamically import heavy components to reduce initial bundle size
const AnalyticsSection = dynamic(() => import('@/components/AnalyticsSection').then(mod => ({ default: mod.AnalyticsSection })), {
  loading: () => (
    <div className="mb-8 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-white/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-slate-200 rounded-lg shimmer"></div>
          <div className="h-6 bg-slate-200 rounded-lg w-48 shimmer"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-slate-100 rounded-xl p-4">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2 shimmer"></div>
              <div className="h-6 bg-slate-200 rounded w-1/2 shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: false
})

const FiltersSection = dynamic(() => import('@/components/FiltersSection').then(mod => ({ default: mod.FiltersSection })), {
  loading: () => (
    <div className="mb-8 animate-fade-in">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/30">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 h-10 bg-slate-200 rounded-xl shimmer"></div>
          <div className="flex gap-3">
            <div className="w-32 h-10 bg-slate-200 rounded-xl shimmer"></div>
            <div className="w-36 h-10 bg-slate-200 rounded-xl shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  ),
  ssr: false
})

const AppGrid = dynamic(() => import('@/components/AppGrid').then(mod => ({ default: mod.AppGrid })), {
  loading: () => (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/40 overflow-hidden min-h-[450px]">
            <div className="h-48 bg-slate-200 shimmer"></div>
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-6 bg-slate-200 rounded-lg w-3/4 shimmer"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-slate-200 rounded-full w-16 shimmer"></div>
                    <div className="h-6 bg-slate-200 rounded-full w-20 shimmer"></div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-slate-200 rounded-xl shimmer"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-full shimmer"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6 shimmer"></div>
                <div className="h-4 bg-slate-200 rounded w-4/5 shimmer"></div>
              </div>
              <div className="flex gap-2 pt-2">
                <div className="h-8 bg-slate-200 rounded-xl flex-1 shimmer"></div>
                <div className="h-8 bg-slate-200 rounded-xl flex-1 shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  ssr: false
})

const AppHeader = dynamic(() => import('@/components/AppHeader').then(mod => ({ default: mod.AppHeader })), {
  loading: () => (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-sky-100/80 via-blue-100/60 to-indigo-100/80 backdrop-blur-sm p-8 md:p-12">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-4">
            <div className="h-12 bg-slate-200 rounded w-64 shimmer"></div>
            <div className="h-6 bg-slate-200 rounded w-96 shimmer"></div>
            <div className="h-5 bg-slate-200 rounded w-80 shimmer"></div>
            <div className="h-10 bg-slate-200 rounded-xl w-40 shimmer"></div>
          </div>
          <div className="ml-8">
            <div className="w-48 h-48 bg-slate-200 rounded-[2rem] shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  ),
  ssr: false
})

// Set display names for dynamic imports
AnalyticsSection.displayName = 'AnalyticsSection'
FiltersSection.displayName = 'FiltersSection'
AppGrid.displayName = 'AppGrid'
AppHeader.displayName = 'AppHeader'

// Dynamically import admin components to reduce initial bundle size
const AdminModal = dynamic(() => import('@/components/admin/AdminModal').then(mod => ({ default: mod.AdminModal })), {
  loading: () => null,
  ssr: false
})

const AdminAnalyticsPanel = dynamic(() => import('@/components/admin/AdminAnalyticsPanel').then(mod => ({ default: mod.AdminAnalyticsPanel })), {
  loading: () => null,
  ssr: false
})

// Set display names for admin dynamic imports
AdminModal.displayName = 'AdminModal'
AdminAnalyticsPanel.displayName = 'AdminAnalyticsPanel'

import { Settings } from '@/lib/icons'
import { Button } from '@/components/ui/button'
import { useAdmin } from '@/contexts/AdminContext'

export default function HomePage() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showAdminModal, setShowAdminModal] = useState(false)

  const { isAdmin } = useAdmin()

  const [analyticsLoaded, setAnalyticsLoaded] = useState(false)

  // Event handler functions to prevent hydration issues
  const handleAppView = useCallback((appName: string, category: string) => {
    if (typeof window !== 'undefined' && analyticsLoaded) {
      trackAppView(appName, category)
    }
  }, [analyticsLoaded])

  const handleAppClick = useCallback((appName: string, action: string) => {
    if (typeof window !== 'undefined' && analyticsLoaded) {
      trackAppClick(appName, action)
    }
  }, [analyticsLoaded])

  // Optimized analytics data generation
  const analyticsData = useMemo(() => generateOptimizedAnalytics(apps), [apps])

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch('/api/apps')

        if (!response.ok) {
          throw new Error('Failed to fetch apps')
        }

        const data = await response.json()
        setApps(mergeAppAssets(data || []))

        // Track dashboard view after analytics are loaded
        if (analyticsLoaded) {
          trackEvent('dashboard_view')
        }
      } catch (error) {
        console.error('Error fetching apps:', error)
        setApps([])
      }
      setLoading(false)
    }

    fetchApps()
  }, [analyticsLoaded])

  // Load analytics only after first user interaction for better performance
  useEffect(() => {
    const loadAnalytics = () => {
      if (!analyticsLoaded) {
        setAnalyticsLoaded(true)
        // Track initial page view after analytics load
        trackEvent('page_view')
      }
    }

    // Load analytics on first user interaction
    const handleFirstInteraction = () => {
      loadAnalytics()
      // Remove listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('scroll', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }

    // Add listeners for first interaction
    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('scroll', handleFirstInteraction)
    document.addEventListener('keydown', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('scroll', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [analyticsLoaded])

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
    if (searchQuery && analyticsLoaded) {
      trackSearch(searchQuery, filteredApps.length)
    }
  }, [searchQuery, filteredApps.length, analyticsLoaded])

  useEffect(() => {
    if (analyticsLoaded) {
      trackFilter('status', statusFilter)
    }
  }, [statusFilter, analyticsLoaded])

  useEffect(() => {
    if (analyticsLoaded) {
      trackFilter('category', categoryFilter)
    }
  }, [categoryFilter, analyticsLoaded])

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
      <AppHeader onAdminClick={() => setShowAdminModal(true)} />

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Analytics Dashboard */}
        <AnalyticsSection analyticsData={analyticsData} />

        {/* Admin Panel - Super Explorer */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="mb-8 relative"
          >
            {/* Admin Panel Header */}
            <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-2xl border border-amber-200/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Settings className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-amber-800">Super Explorer Admin Panel</h2>
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
        <FiltersSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          filteredAppsCount={filteredApps.length}
          totalAppsCount={apps.length}
          categories={categories}
        />

        {/* Apps Grid */}
        {filteredApps.length > 0 ? (
          <div id="applications-section">
            <AppGrid
              apps={filteredApps}
              onAppView={handleAppView}
              onAppClick={handleAppClick}
            />
          </div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-md border border-white/40 max-w-md mx-auto">
              <p className="text-slate-700 text-lg mb-3 font-medium">No applications found</p>
              <p className="text-sm text-slate-600 mb-6">
                Your database is ready! Populate it with your applications data.
              </p>
              <Button
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-normal ease-default"
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
      <footer className="relative bg-gradient-to-r from-slate-900/90 via-blue-900/70 to-indigo-900/90 backdrop-blur-md border-t border-white/20 py-16 mt-16">
        {/* Enhanced background overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-black/30"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            className="flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
          >
            {/* Text background panel for maximum readability */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl -z-10"></div>

            {/* Portfolio Call to Action */}
            <div className="space-y-8">
              {/* Main CTA Section */}
              <div className="text-center space-y-6">
                <motion.div
                  className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
                >
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-sm font-medium tracking-wide uppercase">Available for Projects</span>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                </motion.div>

                <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-6 drop-shadow-lg bg-gradient-to-r from-white via-sky-100 to-indigo-100 bg-clip-text text-transparent">
                  Ready to Transform Ideas into Reality?
                </h3>

                <p className="text-slate-100 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed drop-shadow-md font-normal mb-8">
                  Let&apos;s collaborate on innovative solutions that drive results. From concept to deployment, I bring expertise in modern web technologies and strategic thinking to every project.
                </p>

                {/* Professional Stats */}
                <motion.div
                  className="grid grid-cols-3 gap-6 md:gap-8 max-w-lg mx-auto mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
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
                  className="portfolio-button bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 hover:from-sky-600 hover:via-blue-700 hover:to-indigo-800 text-white font-bold shadow-sky-lg hover:shadow-sky-lg transition-all duration-normal ease-default rounded-2xl px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl group relative z-20"
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById('applications-section')
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      })
                    }
                  }}
                >
                  <span className="flex items-center gap-4 relative z-20">
                    <span className="animate-bounce text-2xl group-hover:animate-pulse"></span>
                    <span className="font-semibold">View Full Portfolio</span>
                    <span className="animate-pulse text-xl group-hover:animate-bounce"></span>
                  </span>
                </Button>
              </motion.div>

              {/* Professional CTA */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
              >
                <p className="text-slate-200 text-sm">
                  Ready to discuss your project? <span className="text-sky-300 font-medium hover:text-sky-200 cursor-pointer transition-colors duration-normal ease-default">Let&apos;s schedule a call</span>
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
