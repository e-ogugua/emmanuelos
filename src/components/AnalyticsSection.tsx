'use client'

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'

interface AnalyticsSectionProps {
  analyticsData: {
    topApps: Array<{ name: string; views: number; category: string }>
    totalUsers: number
    totalViews: number
    categoryStats: Array<{ category: string; views: number; apps: number }>
  } | null
}

// Memoized analytics section to prevent unnecessary re-renders when data hasn't changed
export const AnalyticsSection = memo<AnalyticsSectionProps>(({ analyticsData }) => {
  if (!analyticsData) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
      className="mb-8"
    >
      <AnalyticsDashboard data={analyticsData} />
    </motion.div>
  )
})

AnalyticsSection.displayName = 'AnalyticsSection'
