'use client'

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { App } from '@/lib/types'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github, Eye, Star, Timer } from '@/lib/icons'

interface AppGridProps {
  apps: App[]
  onAppView: (appName: string, category: string) => void
  onAppClick: (appName: string, action: string) => void
}

// Optimized app grid component with memoization to avoid re-rendering unchanged grid cells
export const AppGrid = memo<AppGridProps>(({ apps, onAppView, onAppClick }) => {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
    >
      {apps.map((app, index) => (
        <motion.div
          key={app.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          className="group relative"
          onMouseEnter={() => {
            // Only track if analytics are loaded to avoid unnecessary calls during initial load
            if (typeof window !== 'undefined' && onAppView) {
              onAppView(app.name, app.category)
            }
          }}
        >
          <Card className={`relative overflow-hidden rounded-2xl shadow-sky-md hover:shadow-[0_0_40px_rgba(14,165,233,0.3),0_0_80px_rgba(99,102,241,0.2),0_0_120px_rgba(79,70,229,0.1)] transition-all duration-normal ease-default border-0 min-h-[450px] group-hover:bg-gradient-to-br group-hover:from-sky-50/80 group-hover:via-blue-50/80 group-hover:to-indigo-50/80 ${
            app.cover ? 'bg-white' : 'bg-gradient-to-br from-sky-100/90 to-blue-100/90'
          }`}>
            {/* Top section - Image only */}
            {app.cover && (
              <div className="relative h-48 overflow-hidden rounded-t-2xl">
                <Image
                  src={app.cover}
                  alt={`${app.name} cover`}
                  fill
                  className="object-cover transition-transform duration-normal ease-default group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                {/* Subtle gradient overlay at bottom of image for smooth transition */}
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/20 to-transparent"></div>
              </div>
            )}

            {/* Top section for cards without images - Header area */}
            {!app.cover && (
              <div className="h-48 rounded-t-2xl bg-gradient-to-br from-sky-200/50 via-blue-200/30 to-indigo-200/50 flex items-center justify-center group-hover:from-sky-300/60 group-hover:via-blue-300/40 group-hover:to-indigo-300/60 transition-all duration-normal ease-default">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-white/40 rounded-2xl backdrop-blur-sm border border-white/60 flex items-center justify-center group-hover:bg-white/60 group-hover:scale-110 transition-all duration-normal ease-default">
                    <Star className="w-8 h-8 text-slate-600 group-hover:text-slate-700" />
                  </div>
                  <p className="text-sm text-slate-600 font-medium group-hover:text-slate-700 transition-colors duration-normal ease-default">No Preview</p>
                </div>
              </div>
            )}

            {/* Bottom section - Details with clean background */}
            <div className={`p-5 group-hover:shadow-[inset_0_0_20px_rgba(14,165,233,0.05)] transition-all duration-normal ease-default ${app.cover ? 'bg-white/95 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* App Logo */}
                  {app.logo && (
                    <div className="w-14 h-14 mb-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-normal ease-default">
                      <Image
                        src={app.logo}
                        alt={`${app.name} logo`}
                        width={36}
                        height={36}
                        className="w-9 h-9 object-contain"
                        loading="lazy"
                        sizes="36px"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}

                  <h3 className="text-xl font-medium text-slate-800 mb-3 line-clamp-1 group-hover:text-slate-900 transition-colors duration-normal ease-default">
                    {app.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge
                      variant={app.status === 'Live' ? 'default' : app.status === 'Finalizing' ? 'secondary' : 'destructive'}
                      className={`text-xs font-medium px-3 py-1 rounded-full shadow-sm transition-all duration-normal ease-default ${
                        app.status === 'Live'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : app.status === 'Finalizing'
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      {app.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-300 rounded-full px-3 py-1 font-medium hover:bg-slate-100 transition-all duration-normal ease-default">
                      {app.category}
                    </Badge>
                  </div>
                </div>

                {/* Preview indicator */}
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-all duration-normal ease-default shadow-sm border border-slate-200 group-hover:scale-110">
                  <Eye className="w-6 h-6 text-slate-700" />
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <p className="text-slate-600 text-sm mb-5 line-clamp-3 leading-relaxed group-hover:text-slate-700 transition-colors duration-normal ease-default">
                  {app.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {app.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-300 rounded-full px-2 py-1 font-medium hover:bg-slate-100 transition-all duration-normal ease-default">
                      {tag}
                    </Badge>
                  ))}
                  {app.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-300 rounded-full px-2 py-1 font-medium hover:bg-slate-100 transition-all duration-normal ease-default">
                      +{app.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-3 mt-auto">
                  {app.live_url && app.live_url.toLowerCase() !== 'coming soon' && app.live_url.toLowerCase() !== 'coming soon' && (
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 hover:shadow-[0_0_20px_rgba(14,165,233,0.4),0_0_40px_rgba(99,102,241,0.3)] text-white font-medium shadow-md hover:shadow-lg transition-all duration-normal ease-default rounded-xl"
                      onClick={() => onAppClick(app.name, 'live_url')}
                    >
                      <a
                        href={app.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Live
                      </a>
                    </Button>
                  )}
                  {app.live_url && (app.live_url.toLowerCase() === 'coming soon' || app.live_url.toLowerCase() === 'coming soon') && (
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 hover:shadow-[0_0_20px_rgba(245,158,11,0.4),0_0_40px_rgba(249,115,22,0.3)] text-white font-medium shadow-md hover:shadow-lg transition-all duration-normal ease-default rounded-xl cursor-not-allowed opacity-75"
                      disabled
                    >
                      <Timer className="w-4 h-4 mr-2" />
                      Coming Soon
                    </Button>
                  )}
                  {app.github_url && (app.live_url?.toLowerCase() !== 'coming soon' && app.live_url?.toLowerCase() !== 'coming soon') && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 hover:shadow-[0_0_15px_rgba(71,85,105,0.15)] text-slate-800 hover:text-slate-900 rounded-xl shadow-sm hover:shadow-md transition-all duration-normal ease-default"
                      onClick={() => onAppClick(app.name, 'github_url')}
                    >
                      <a
                        href={app.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {app.github_url && (app.live_url?.toLowerCase() === 'coming soon' || app.live_url?.toLowerCase() === 'coming soon') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-300 bg-slate-100 text-slate-500 hover:text-slate-600 rounded-xl shadow-sm cursor-not-allowed opacity-60"
                      disabled
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 hover:bg-slate-100 hover:text-slate-800 hover:shadow-[0_0_15px_rgba(71,85,105,0.15)] text-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-normal ease-default"
                    asChild
                    onClick={() => onAppClick(app.name, 'details')}
                  >
                    <a href={`/app/${app.id}`} className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4" />
                      Details
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
})

AppGrid.displayName = 'AppGrid'
