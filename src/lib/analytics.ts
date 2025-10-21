// Mock GitHub API integration
export async function fetchGithubData() {
  // In a real app, you would make actual API calls to GitHub
  // For demo purposes, returning mock data

  const mockData = {
    stars: Math.floor(Math.random() * 100) + 10,
    forks: Math.floor(Math.random() * 20) + 1,
    lastCommit: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    contributors: Math.floor(Math.random() * 10) + 1,
    issues: Math.floor(Math.random() * 50),
    language: 'TypeScript'
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return mockData
}

// Mock Umami Analytics integration
export async function fetchAnalyticsData() {
  // In a real app, you would fetch from Umami API
  // For demo purposes, returning mock data

  const mockData = {
    visitors: Math.floor(Math.random() * 1000) + 100,
    pageViews: Math.floor(Math.random() * 3000) + 500,
    bounceRate: Math.floor(Math.random() * 30) + 20,
    avgSessionDuration: Math.floor(Math.random() * 300) + 60,
    topPages: [
      { path: '/', views: Math.floor(Math.random() * 500) + 100 },
      { path: '/about', views: Math.floor(Math.random() * 200) + 50 },
      { path: '/contact', views: Math.floor(Math.random() * 100) + 20 }
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

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))

    const visitors = baseVisitors + Math.floor(Math.random() * 40) - 20
    const pageViews = visitors * 2 + Math.floor(Math.random() * 100)

    data.push({
      date: date.toISOString().split('T')[0],
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
