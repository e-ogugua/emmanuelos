import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function AppHeader() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-sky-100/80 via-blue-100/60 to-indigo-100/80 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
      <div className="relative max-w-7xl mx-auto p-8 md:p-12">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <motion.h1
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-sky-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4 tracking-tight drop-shadow-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              EmmanuelOS
            </motion.h1>
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-lg md:text-xl text-slate-700 font-medium leading-relaxed">
                System-Wide Analytics, Reporting & Tracking Dashboard
              </p>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Centralized command center for monitoring and managing your complete application portfolio with real-time insights and comprehensive analytics.
              </p>

              {/* Portfolio Button - Moved under the text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pt-4"
              >
                <Button
                  asChild
                  className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 hover:from-sky-600 hover:via-blue-700 hover:to-indigo-800 text-white font-semibold shadow-lg hover:shadow-[0_0_30px_rgba(14,165,233,0.8),0_0_60px_rgba(99,102,241,0.6)] transition-all duration-300 rounded-xl px-6 py-3 text-sm"
                >
                  <a
                    href="https://ceodev.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                    onClick={(e) => {
                      e.preventDefault()
                      if (typeof window !== 'undefined') {
                        window.open('https://ceodev.vercel.app', '_blank', 'noopener,noreferrer')
                      }
                    }}
                  >
                    <span className="animate-pulse">🚀</span>
                    Explore Portfolio
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Logo and Admin Section - Right side */}
          <div className="flex items-center gap-4 ml-8">
            {/* Admin Button - Moved to left of logo */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // This will be handled by parent component
                }}
                className="text-slate-600 hover:text-amber-600 hover:bg-amber-50/60 transition-all duration-300 rounded-full p-4 border-2 border-transparent hover:border-amber-300 hover:shadow-lg active:scale-95"
                title="Admin Access - Click to access SuperExplorer"
              >
                {/* Settings icon will be passed from parent */}
              </Button>
            </motion.div>

            {/* EmmanuelOS Logo - Moved to the end */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src="/apps/emmanuelos/emmanuelos-logo.png"
                alt="EmmanuelOS Logo"
                width={200}
                height={200}
                className="w-48 h-48 object-contain drop-shadow-lg rounded-[2rem] bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-500 hover:bg-white/20 hover:shadow-[0_0_60px_rgba(251,191,36,0.6),0_0_120px_rgba(14,165,233,0.4),0_0_180px_rgba(251,191,36,0.3)] hover:scale-105"
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
