export interface FakeAnalyticsData {
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  avgSessionDuration: number
  topPages: Array<{
    path: string
    views: number
    percentage: number
  }>
  referrerData: Array<{
    source: string
    visits: number
    percentage: number
  }>
  deviceData: Array<{
    device: string
    visits: number
    percentage: number
  }>
  locationData: Array<{
    country: string
    visits: number
    percentage: number
  }>
}

// Generate realistic fake analytics data
export function generateFakeAnalytics(baseMultiplier: number = 1): FakeAnalyticsData {
  const baseViews = Math.floor(Math.random() * 1000 * baseMultiplier) + 100
  const baseVisitors = Math.floor(baseViews * 0.7)

  return {
    pageViews: baseViews,
    uniqueVisitors: baseVisitors,
    bounceRate: Math.floor(Math.random() * 30) + 20,
    avgSessionDuration: Math.floor(Math.random() * 300) + 60,
    topPages: [
      { path: '/', views: Math.floor(baseViews * 0.4), percentage: 40 },
      { path: '/about', views: Math.floor(baseViews * 0.25), percentage: 25 },
      { path: '/services', views: Math.floor(baseViews * 0.15), percentage: 15 },
      { path: '/contact', views: Math.floor(baseViews * 0.1), percentage: 10 },
      { path: '/blog', views: Math.floor(baseViews * 0.1), percentage: 10 }
    ],
    referrerData: [
      { source: 'Direct', visits: Math.floor(baseVisitors * 0.45), percentage: 45 },
      { source: 'Google', visits: Math.floor(baseVisitors * 0.35), percentage: 35 },
      { source: 'GitHub', visits: Math.floor(baseVisitors * 0.1), percentage: 10 },
      { source: 'LinkedIn', visits: Math.floor(baseVisitors * 0.05), percentage: 5 },
      { source: 'Other', visits: Math.floor(baseVisitors * 0.05), percentage: 5 }
    ],
    deviceData: [
      { device: 'Desktop', visits: Math.floor(baseVisitors * 0.6), percentage: 60 },
      { device: 'Mobile', visits: Math.floor(baseVisitors * 0.35), percentage: 35 },
      { device: 'Tablet', visits: Math.floor(baseVisitors * 0.05), percentage: 5 }
    ],
    locationData: [
      { country: 'Nigeria', visits: Math.floor(baseVisitors * 0.7), percentage: 70 },
      { country: 'United States', visits: Math.floor(baseVisitors * 0.15), percentage: 15 },
      { country: 'United Kingdom', visits: Math.floor(baseVisitors * 0.05), percentage: 5 },
      { country: 'Canada', visits: Math.floor(baseVisitors * 0.05), percentage: 5 },
      { country: 'Other', visits: Math.floor(baseVisitors * 0.05), percentage: 5 }
    ]
  }
}

// Simulate real-time updates
export function simulateRealTimeUpdate(currentData: FakeAnalyticsData, intensity: 'low' | 'medium' | 'high' = 'low'): FakeAnalyticsData {
  const multiplier = intensity === 'low' ? 1.02 : intensity === 'medium' ? 1.05 : 1.1

  return {
    ...currentData,
    pageViews: Math.floor(currentData.pageViews * multiplier),
    uniqueVisitors: Math.floor(currentData.uniqueVisitors * multiplier),
    bounceRate: Math.max(10, Math.min(80, currentData.bounceRate + (Math.random() - 0.5) * 5)),
    avgSessionDuration: Math.max(30, Math.min(600, currentData.avgSessionDuration + (Math.random() - 0.5) * 20)),
    topPages: currentData.topPages.map(page => ({
      ...page,
      views: Math.floor(page.views * (0.95 + Math.random() * 0.1))
    })),
    referrerData: currentData.referrerData.map(ref => ({
      ...ref,
      visits: Math.floor(ref.visits * (0.95 + Math.random() * 0.1))
    })),
    deviceData: currentData.deviceData.map(device => ({
      ...device,
      visits: Math.floor(device.visits * (0.95 + Math.random() * 0.1))
    })),
    locationData: currentData.locationData.map(location => ({
      ...location,
      visits: Math.floor(location.visits * (0.95 + Math.random() * 0.1))
    }))
  }
}
