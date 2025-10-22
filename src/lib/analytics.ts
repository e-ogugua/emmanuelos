// Mock GitHub API integration
export async function fetchGithubData() {
  // In a real app, you would make actual API calls to GitHub
  // For demo purposes, returning deterministic mock data

  const mockData = {
    stars: 42,
    forks: 8,
    lastCommit: '2024-01-15T10:30:00Z', // Fixed string for SSR compatibility
    contributors: 3,
    issues: 12,
    language: 'TypeScript'
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return mockData
}

// Mock Umami Analytics integration
export async function fetchAnalyticsData() {
  // In a real app, you would fetch from Umami API
  // For demo purposes, returning deterministic mock data

  const mockData = {
    visitors: 247,
    pageViews: 892,
    bounceRate: 28,
    avgSessionDuration: 145,
    topPages: [
      { path: '/', views: 247 },
      { path: '/about', views: 89 },
      { path: '/contact', views: 43 }
    ]
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))

  return mockData
}

// Generate mock traffic data for charts
export function generateTrafficData(days: number = 7) {
  const data = []
  const baseVisitors = 50

  // Use fixed seed for deterministic results
  for (let i = 0; i < days; i++) {
    // Use deterministic date calculation instead of new Date()
    const baseDate = new Date('2024-01-15T00:00:00Z')
    const targetDate = new Date(baseDate.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000)

    // Use deterministic calculation instead of Math.random()
    const daySeed = i * 7 + 42 // Fixed seed based on day
    const visitors = baseVisitors + (daySeed % 40) - 20
    const pageViews = visitors * 2 + (daySeed % 100)

    data.push({
      date: targetDate.toISOString().split('T')[0],
      visitors: Math.max(0, visitors),
      pageViews: Math.max(0, pageViews)
    })
  }

  return data
}

// Umami Analytics Hook for custom event tracking
declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number | boolean>) => void
    }
  }
}

export const trackEvent = (event: string, data?: Record<string, string | number | boolean>) => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(event, data)
  }
}

export const trackAppView = (appName: string, category: string) => {
  trackEvent('app_view', { app_name: appName, category })
}

export const trackAppClick = (appName: string, action: string) => {
  trackEvent('app_interaction', { app_name: appName, action })
}

export const trackSearch = (query: string, results: number) => {
  trackEvent('search', { query, results })
}

export const trackFilter = (filterType: string, value: string) => {
  trackEvent('filter', { filter_type: filterType, value })
}
