'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { App } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    const fetchApps = async () => {
      try {
        // Check if Supabase environment variables are available
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
          console.warn('Supabase environment variables not available - using fallback data')
          setApps([])
          setLoading(false)
          return
        }

        // Dynamically import supabase to avoid build-time issues
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        const { data, error } = await supabase
          .from('apps')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching apps:', error)
          // Fallback to empty array if Supabase fails
          setApps([])
        } else {
          setApps(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading EmmanuelOS Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-3xl font-bold gold-text mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            EmmanuelOS v2.0
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            SWART Dashboard - System-Wide Analytics, Reporting & Tracking
          </motion.p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-button"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
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

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="glass-card h-full hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-1">{app.name}</h3>
                        <Badge
                          variant={app.status === 'Live' ? 'default' : app.status === 'Finalizing' ? 'secondary' : 'destructive'}
                          className="mb-2"
                        >
                          {app.status === 'Live' ? '🟢' : app.status === 'Finalizing' ? '🟡' : '🔴'} {app.status}
                        </Badge>
                      </div>
                      {app.image_url && (
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📱</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {app.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {app.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {app.live_url && (
                        <Button
                          asChild
                          size="sm"
                          className="flex-1"
                        >
                          <a
                            href={app.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Live
                          </a>
                        </Button>
                      )}
                      {app.github_url && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <a
                            href={app.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            GitHub
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="flex-1" asChild>
                        <a href={`/app/${app.id}`}>
                          Details
                        </a>
                      </Button>
                    </div>
                  </CardContent>
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
    </div>
  )
}
