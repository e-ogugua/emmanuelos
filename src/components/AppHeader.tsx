'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'

interface AppHeaderProps {
  onAdminClick?: () => void
}

export function AppHeader({ onAdminClick }: AppHeaderProps) {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-sky-100/80 via-blue-100/60 to-indigo-100/80 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
      <div className="relative max-w-7xl mx-auto p-6 md:p-8 lg:p-12">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <motion.h1
              className="text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-sky-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3 md:mb-4 tracking-tight drop-shadow-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              EmmanuelOS
            </motion.h1>
            <motion.div
              className="space-y-2 md:space-y-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            >
              <p className="text-base md:text-lg lg:text-xl text-slate-700 font-medium leading-relaxed">
                System-Wide Analytics, Reporting & Tracking Dashboard
              </p>
              <p className="text-xs md:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Centralized command center for monitoring and managing your complete application portfolio with real-time insights and comprehensive analytics.
              </p>

              {/* Portfolio Button - Moved under the text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                className="pt-3 md:pt-4"
              >
                <Button
                  asChild
                  className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 hover:from-sky-600 hover:via-blue-700 hover:to-indigo-800 text-white font-semibold shadow-sky-md hover:shadow-sky-md transition-all duration-normal ease-default rounded-2xl px-5 md:px-6 py-2.5 md:py-3 text-xs md:text-sm"
                >
                  <a
                    href="https://ceodev.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <span className="animate-pulse"></span>
                    Explore Portfolio
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Logo and Admin Section - Right side */}
          <div className="flex items-center gap-3 md:gap-4 ml-4 md:ml-8">
            {/* Admin Button - Moved to left of logo */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onAdminClick}
                className="text-slate-600 hover:text-amber-600 hover:bg-amber-50/60 transition-all duration-normal ease-default rounded-full p-3 md:p-4 border-2 border-transparent hover:border-amber-300 hover:shadow-md active:scale-95"
                title="Admin Access - Click to access SuperExplorer"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* EmmanuelOS Logo - Responsive sizing with curved edges */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            >
              <Image
                src="/emmanuelos/emmanuelos-logo.png"
                alt="EmmanuelOS Logo"
                width={200}
                height={200}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 object-contain drop-shadow-md rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-slow ease-default hover:bg-white/20 hover:shadow-sky-md hover:scale-105"
                priority={true}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-200/30 to-transparent rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full blur-3xl translate-y-32 -translate-x-32"></div>
    </header>
  )
}
