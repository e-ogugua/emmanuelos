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

// Generate deterministic fake analytics data (for SSR compatibility)
export function generateFakeAnalytics(baseMultiplier: number = 1, seed?: string): FakeAnalyticsData {
  // Use deterministic calculations instead of Math.random()
  const seedValue = seed || 'default-seed'
  const seedHash = seedValue.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const random = (min: number, max: number) => {
    const hash = (seedHash * 9301 + 49297) % 233280
    return min + (hash % (max - min))
  }

  const baseViews = Math.floor(random(100, 1100) * baseMultiplier)
  const baseVisitors = Math.floor(baseViews * 0.7)

  return {
    pageViews: baseViews,
    uniqueVisitors: baseVisitors,
    bounceRate: Math.floor(random(20, 50)),
    avgSessionDuration: Math.floor(random(60, 360)),
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

// Simulate real-time updates with deterministic values (for SSR compatibility)
export function simulateRealTimeUpdate(currentData: FakeAnalyticsData, intensity: 'low' | 'medium' | 'high' = 'low', timestamp?: number): FakeAnalyticsData {
  const multiplier = intensity === 'low' ? 1.02 : intensity === 'medium' ? 1.05 : 1.1
  const timeSeed = timestamp || (typeof window !== 'undefined' ? Date.now() : 1000000000000) // Use fallback for SSR

  // Use deterministic calculation based on timestamp
  const deterministicRandom = (min: number, max: number, seed: number) => {
    const hash = (seed * 9301 + 49297) % 233280
    return min + (hash % (max - min))
  }

  return {
    ...currentData,
    pageViews: Math.floor(currentData.pageViews * multiplier),
    uniqueVisitors: Math.floor(currentData.uniqueVisitors * multiplier),
    bounceRate: Math.max(10, Math.min(80, currentData.bounceRate + deterministicRandom(-2.5, 2.5, timeSeed))),
    avgSessionDuration: Math.max(30, Math.min(600, currentData.avgSessionDuration + deterministicRandom(-10, 10, timeSeed + 1))),
    topPages: currentData.topPages.map((page, index) => ({
      ...page,
      views: Math.floor(page.views * (0.95 + deterministicRandom(0, 0.1, timeSeed + index) * 0.1))
    })),
    referrerData: currentData.referrerData.map((ref, index) => ({
      ...ref,
      visits: Math.floor(ref.visits * (0.95 + deterministicRandom(0, 0.1, timeSeed + 10 + index) * 0.1))
    })),
    deviceData: currentData.deviceData.map((device, index) => ({
      ...device,
      visits: Math.floor(device.visits * (0.95 + deterministicRandom(0, 0.1, timeSeed + 20 + index) * 0.1))
    })),
    locationData: currentData.locationData.map((location, index) => ({
      ...location,
      visits: Math.floor(location.visits * (0.95 + deterministicRandom(0, 0.1, timeSeed + 30 + index) * 0.1))
    }))
  }
}
