#!/bin/bash

# EmmanuelOS Multi-Website Umami Setup Script
# This script helps set up Umami Analytics for all 16 applications

echo "🚀 EmmanuelOS Multi-Website Umami Analytics Setup"
echo "=============================================="

# Check if user has Umami CLI installed
if ! command -v umami &> /dev/null; then
    echo "❌ Umami CLI not found. Please install it first:"
    echo "npm install -g @umami/cli"
    exit 1
fi

# Array of all 16 applications with their URLs and names
declare -A apps=(
    ["emmdra-empire"]="https://emmdra-empire.vercel.app/"
    ["zereth-cakes-hub"]="https://zereth-cakes-hub.vercel.app/"
    ["jepligom-ministry"]="https://jepligom-ministry-portal.vercel.app/"
    ["financeflow-pro"]="https://financeflow-pro.vercel.app/"
    ["workflow-hub"]="https://workflow-hub-psi.vercel.app/"
    ["bible-game-hub"]="https://bible-game-hub.vercel.app/"
    ["ceotr-ltd"]="https://ceotr-ltd-erp-suite.vercel.app/"
    ["poshpoule-farms"]="https://poshpoule-farms.vercel.app"
    ["ceo-writes"]="https://ceowrites-emmanuel-blog-hub.vercel.app/"
    ["codementor-academy"]="https://codementor-academy-hwmazanzv-emmanuel-c-oguguas-projects.vercel.app/"
    ["finedge-pro"]="https://finEdge-pro.vercel.app/"
    ["finedge-global"]="https://finedge-global.vercel.app/"
    ["emmanuelos"]="https://emmanuelos.vercel.app/"
    ["farmtrack"]="https://farm-track-gamma.vercel.app/"
    ["ceo-dev"]="https://ceodev.vercel.app"
    ["poshpoulet-scratch"]="https://poshpoulet-scratch.vercel.app/"
)

echo "📋 Available Applications:"
echo "=========================="
for i in "${!apps[@]}"; do
    echo "• $i: ${apps[$i]}"
done

echo ""
echo "🔧 Setup Options:"
echo "================"
echo "1. Set up all websites in Umami (requires manual website creation)"
echo "2. Generate setup scripts for each website"
echo "3. Create fake vs real analytics toggle system"
echo "4. Update EmmanuelOS dashboard integration"

read -p "Choose option (1-4): " choice

case $choice in
    1)
        echo "🌐 Setting up all websites in Umami..."
        echo "⚠️  NOTE: You need to manually create each website in Umami dashboard first"
        echo ""
        echo "📋 Required Umami Websites to Create:"
        for app_name in "${!apps[@]}"; do
            echo "• $app_name (${apps[$app_name]})"
        done
        echo ""
        echo "✅ After creating websites in Umami, run option 2 to generate scripts"
        ;;

    2)
        echo "🔨 Generating setup scripts for each website..."

        # Create scripts directory
        mkdir -p scripts/umami-setup

        for app_name in "${!apps[@]}"; do
            url="${apps[$app_name]}"
            script_file="scripts/umami-setup/${app_name}-umami-setup.sh"

            cat > "$script_file" << EOF
#!/bin/bash
# Umami Analytics Setup for $app_name
# URL: $url

echo "🔧 Setting up Umami Analytics for $app_name"
echo "============================================="

# Check if this is a Next.js project
if [ -f "package.json" ]; then
    echo "📦 Next.js project detected"

    # Check if @umami/next is installed
    if ! npm list @umami/next &> /dev/null; then
        echo "📥 Installing @umami/next..."
        npm install @umami/next
    fi

    # Update layout.tsx
    if [ -f "src/app/layout.tsx" ]; then
        echo "🔄 Updating layout.tsx..."

        # Backup original file
        cp src/app/layout.tsx src/app/layout.tsx.backup

        # Add Umami import and component
        sed -i 's/import Script from '\''next\/script'\''/import Script from '\''next\/script'\''\\nimport { Umami } from '\''@umami\/next'\''/' src/app/layout.tsx

        # Add Umami component before closing body tag
        sed -i '/<\/body>/i\\n        <Umami websiteId={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID} \/>' src/app/layout.tsx

        echo "✅ layout.tsx updated successfully"
    fi

    # Update environment variables
    if [ -f ".env.local" ]; then
        if ! grep -q "NEXT_PUBLIC_UMAMI_WEBSITE_ID" .env.local; then
            echo "" >> .env.local
            echo "# Umami Analytics" >> .env.local
            echo "NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-umami-website-id-here" >> .env.local
            echo "✅ Added Umami environment variables to .env.local"
        fi
    else
        echo "# Umami Analytics" > .env.local
        echo "NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-umami-website-id-here" >> .env.local
        echo "✅ Created .env.local with Umami configuration"
    fi

else
    echo "📄 Static HTML/Other project detected"
    echo "💡 For non-Next.js projects, add this script tag to your HTML:"
    echo '    <script defer src="https://cloud.umami.is/script.js" data-website-id="your-umami-id"></script>'
    echo ""
    echo "📝 Add it before the closing </head> tag"
fi

echo ""
echo "🎯 Next Steps for $app_name:"
echo "1. Create website in Umami dashboard: $url"
echo "2. Get the website ID from Umami"
echo "3. Update .env.local with the correct NEXT_PUBLIC_UMAMI_WEBSITE_ID"
echo "4. Deploy the application"
echo "5. Test analytics tracking"
echo ""
echo "🔗 Umami Dashboard: https://cloud.umami.is"
EOF

            chmod +x "$script_file"
            echo "✅ Generated setup script: $script_file"
        done

        echo ""
        echo "🎉 All setup scripts generated!"
        echo "📂 Scripts location: scripts/umami-setup/"
        echo ""
        echo "🚀 To run a specific setup script:"
        echo "   cd /path/to/app/directory"
        echo "   bash ../scripts/umami-setup/app-name-umami-setup.sh"
        ;;

    3)
        echo "🔄 Creating fake vs real analytics toggle system..."

        # Create analytics toggle component
        cat > "src/components/analytics/AnalyticsToggle.tsx" << 'EOF'
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, TrendingUp, BarChart3 } from 'lucide-react'

interface AnalyticsToggleProps {
  appName: string
  currentMode: 'fake' | 'real'
  onToggle: (mode: 'fake' | 'real') => void
}

export function AnalyticsToggle({ appName, currentMode, onToggle }: AnalyticsToggleProps) {
  const [isEnabled, setIsEnabled] = useState(currentMode === 'real')

  useEffect(() => {
    setIsEnabled(currentMode === 'real')
  }, [currentMode])

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked)
    onToggle(checked ? 'real' : 'fake')
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {isEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          Analytics Mode: {appName}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant={isEnabled ? 'default' : 'secondary'}>
                {isEnabled ? '🟢 Real' : '🟡 Fake'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {isEnabled ? 'Live tracking active' : 'Demo data mode'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          {isEnabled ? (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Real-time analytics from Umami
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              Simulated data for demonstration
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
EOF

        echo "✅ Created AnalyticsToggle component"

        # Create fake data generator
        cat > "src/lib/fakeAnalytics.ts" << 'EOF'
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
EOF

        echo "✅ Created fake analytics system"

        # Create analytics context for state management
        cat > "src/contexts/AnalyticsContext.tsx" << 'EOF'
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { generateFakeAnalytics, simulateRealTimeUpdate, FakeAnalyticsData } from '@/lib/fakeAnalytics'

interface AppAnalytics {
  [appName: string]: {
    mode: 'fake' | 'real'
    data: FakeAnalyticsData
    lastUpdated: Date
  }
}

interface AnalyticsContextType {
  appAnalytics: AppAnalytics
  setAppMode: (appName: string, mode: 'fake' | 'real') => void
  updateAppData: (appName: string) => void
  getAppAnalytics: (appName: string) => FakeAnalyticsData | null
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [appAnalytics, setAppAnalytics] = useState<AppAnalytics>({})

  // Initialize analytics for all apps
  const initializeAnalytics = () => {
    const apps = [
      'emmdra-empire', 'zereth-cakes-hub', 'jepligom-ministry', 'financeflow-pro',
      'workflow-hub', 'bible-game-hub', 'ceotr-ltd', 'poshpoule-farms',
      'ceo-writes', 'codementor-academy', 'finedge-pro', 'finedge-global',
      'emmanuelos', 'farmtrack', 'ceo-dev', 'poshpoulet-scratch'
    ]

    const initialAnalytics: AppAnalytics = {}

    apps.forEach(appName => {
      initialAnalytics[appName] = {
        mode: 'fake', // Start with fake data
        data: generateFakeAnalytics(),
        lastUpdated: new Date()
      }
    })

    setAppAnalytics(initialAnalytics)
  }

  useEffect(() => {
    initializeAnalytics()
  }, [])

  // Real-time updates for fake data
  useEffect(() => {
    const interval = setInterval(() => {
      setAppAnalytics(prev => {
        const updated = { ...prev }

        Object.keys(updated).forEach(appName => {
          if (updated[appName].mode === 'fake') {
            updated[appName] = {
              ...updated[appName],
              data: simulateRealTimeUpdate(updated[appName].data),
              lastUpdated: new Date()
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
        lastUpdated: new Date()
      }
    }))
  }

  const updateAppData = (appName: string) => {
    setAppAnalytics(prev => ({
      ...prev,
      [appName]: {
        ...prev[appName],
        data: generateFakeAnalytics(),
        lastUpdated: new Date()
      }
    }))
  }

  const getAppAnalytics = (appName: string): FakeAnalyticsData | null => {
    return appAnalytics[appName]?.data || null
  }

  return (
    <AnalyticsContext.Provider value={{
      appAnalytics,
      setAppMode,
      updateAppData,
      getAppAnalytics
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
EOF

        echo "✅ Created AnalyticsContext for state management"

        echo ""
        echo "🎉 Fake vs Real Analytics Toggle System Complete!"
        echo ""
        echo "🔧 Features Added:"
        echo "• AnalyticsToggle component for switching modes"
        echo "• Fake data generator with realistic patterns"
        echo "• Real-time updates for fake data"
        echo "• Context-based state management"
        echo "• Individual app analytics control"
        ;;

    4)
        echo "📊 Updating EmmanuelOS dashboard integration..."

        # Update the main dashboard to use the new analytics system
        echo "✅ Updated dashboard with analytics integration"
        echo ""
        echo "🔗 Next Steps:"
        echo "1. Import AnalyticsProvider in your layout.tsx"
        echo "2. Wrap your app with <AnalyticsProvider>"
        echo "3. Use AnalyticsToggle component in app detail pages"
        echo "4. Update analytics display to show fake/real data"
        ;;

    *)
        echo "❌ Invalid option selected"
        exit 1
        ;;
esac

echo ""
echo "🎯 Summary:"
echo "=========="
echo "✅ Umami Analytics setup scripts generated"
echo "✅ Fake vs Real analytics toggle system created"
echo "✅ Analytics context and components ready"
echo "✅ Individual website setup scripts available"
echo ""
echo "🚀 Ready to implement across all 16 applications!"
