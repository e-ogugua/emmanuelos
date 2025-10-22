// Icon Management - Centralized Icon Exports
// Only imports icons that are actually used across the application
// Tree-shaking eliminates unused icon code from the final bundle
// Icons are loaded once and shared across components for consistency

// Core UI icons used throughout the app
export { Activity, BarChart3, ExternalLink, Eye, EyeOff, Github, Lock, Settings, Star, Timer, TrendingUp, Unlock, Users, Zap } from 'lucide-react'

// Icon usage mapping for reference:
// - Activity: Analytics dashboard category performance
// - BarChart3: Analytics dashboard header
// - ExternalLink: App grid external links
// - Eye: App grid preview indicator and analytics
// - Github: App grid GitHub links
// - Settings: Admin modal and admin panel
// - Star: App grid details button and no-preview fallback
// - Timer: App grid coming soon badges
// - TrendingUp: Analytics dashboard top apps
// - Users: Analytics dashboard user metrics
// - Zap: Analytics dashboard performance metrics
