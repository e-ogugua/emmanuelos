'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { generateFakeAnalytics, simulateRealTimeUpdate, FakeAnalyticsData } from '../lib/fakeAnalytics'

interface AppAnalytics {
  [appName: string]: {
    mode: 'fake' | 'real'
    data: FakeAnalyticsData
    lastUpdated: string // Use string instead of Date for SSR compatibility
  }
}

interface AnalyticsContextType {
  appAnalytics: AppAnalytics
  setAppMode: (appName: string, mode: 'fake' | 'real') => void
  updateAppData: (appName: string) => void
  getAppAnalytics: (appName: string) => FakeAnalyticsData | null
  // Admin functions
  getRealAppAnalytics: (appName: string) => FakeAnalyticsData | null
  setAllAppsMode: (mode: 'fake' | 'real') => void
  getAnalyticsSummary: () => {
    totalApps: number
    fakeModeCount: number
    realModeCount: number
  }
}

export type { AppAnalytics }

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // Initialize analytics data immediately (SSR-safe)
  const [appAnalytics, setAppAnalytics] = useState<AppAnalytics>(() => {
    const apps = [
      'emmdra-empire', 'zereth-cakes-hub', 'jepligom-ministry', 'financeflow-pro',
      'workflow-hub', 'bible-game-hub', 'ceotr-ltd', 'poshpoule-farms',
      'ceo-writes', 'codementor-academy', 'finedge-pro', 'finedge-global',
      'emmanuelos', 'farmtrack', 'ceo-dev', 'poshpoulet-scratch'
    ]

    const initialAnalytics: AppAnalytics = {}

    apps.forEach(appName => {
      initialAnalytics[appName] = {
        mode: 'fake', // START WITH FAKE MODE FOR ALL USERS
        data: generateFakeAnalytics(1, appName), // Use app name as seed for consistency
        lastUpdated: new Date().toISOString() // Use ISO string for SSR compatibility
      }
    })

    return initialAnalytics
  })

  // Real-time updates for fake data (only for fake mode)
  useEffect(() => {
    const interval = setInterval(() => {
      setAppAnalytics(prev => {
        const updated = { ...prev }

        // Use deterministic timestamp (round to 30-second intervals for consistency)
        const now = new Date()
        const deterministicTimestamp = now.getTime() - (now.getTime() % 30000)

        Object.keys(updated).forEach(appName => {
          if (updated[appName].mode === 'fake') {
            updated[appName] = {
              ...updated[appName],
              data: simulateRealTimeUpdate(updated[appName].data, 'low', deterministicTimestamp),
              lastUpdated: new Date(deterministicTimestamp).toISOString()
            }
          }
        })

        return updated
      })
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const setAppMode = (appName: string, mode: 'fake' | 'real') => {
    setAppAnalytics(prev => ({
      ...prev,
      [appName]: {
        ...prev[appName],
        mode,
        lastUpdated: new Date().toISOString() // Use ISO string for SSR compatibility
      }
    }))
  }

  const updateAppData = (appName: string) => {
    setAppAnalytics(prev => ({
      ...prev,
      [appName]: {
        ...prev[appName],
        data: generateFakeAnalytics(1, appName + '-updated'), // Use app name + suffix as seed
        lastUpdated: new Date().toISOString() // Use ISO string for SSR compatibility
      }
    }))
  }

  // For regular users, always return fake data (they see fake as real)
  const getAppAnalytics = (appName: string): FakeAnalyticsData | null => {
    return appAnalytics[appName]?.data || null
  }

  // Admin function to see real data (if available)
  const getRealAppAnalytics = (appName: string): FakeAnalyticsData | null => {
    return appAnalytics[appName]?.data || null
  }

  // Admin function to set all apps to same mode
  const setAllAppsMode = (mode: 'fake' | 'real') => {
    setAppAnalytics(prev => {
      const updated = { ...prev }
      Object.keys(updated).forEach(appName => {
        updated[appName] = {
          ...updated[appName],
          mode,
          lastUpdated: new Date().toISOString() // Use ISO string for SSR compatibility
        }
      })
      return updated
    })
  }

  // Get analytics summary for admin
  const getAnalyticsSummary = () => {
    const totalApps = Object.keys(appAnalytics).length
    const fakeModeCount = Object.values(appAnalytics).filter(app => app.mode === 'fake').length
    const realModeCount = Object.values(appAnalytics).filter(app => app.mode === 'real').length

    return {
      totalApps,
      fakeModeCount,
      realModeCount
    }
  }

  return (
    <AnalyticsContext.Provider value={{
      appAnalytics,
      setAppMode,
      updateAppData,
      getAppAnalytics,
      getRealAppAnalytics,
      setAllAppsMode,
      getAnalyticsSummary
    }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}
