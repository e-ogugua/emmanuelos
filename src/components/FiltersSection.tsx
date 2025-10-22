'use client'

import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FiltersSectionProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  categoryFilter: string
  setCategoryFilter: (category: string) => void
  filteredAppsCount: number
  totalAppsCount: number
  categories: string[]
}

export function FiltersSection({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  filteredAppsCount,
  totalAppsCount,
  categories
}: FiltersSectionProps) {
  return (
    <motion.div
      className="mb-8 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search applications by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
            }}
            className="bg-white/70 backdrop-blur-sm border-sky-200/50 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 focus:ring-offset-0 text-slate-800 placeholder:text-slate-500 rounded-xl shadow-sm transition-all duration-normal ease-default"
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={(value) => {
            setStatusFilter(value)
          }}>
            <SelectTrigger className="w-40 bg-white/70 backdrop-blur-sm border-sky-200/50 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 focus:ring-offset-0 text-slate-800 rounded-xl shadow-sm transition-all duration-normal ease-default">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white/90 backdrop-blur-sm border-sky-200/50">
              <SelectItem value="all" className="text-slate-800 hover:bg-sky-50 focus:bg-sky-50 transition-colors duration-fast ease-default">All Status</SelectItem>
              <SelectItem value="Live" className="text-slate-800 hover:bg-sky-50 focus:bg-sky-50 transition-colors duration-fast ease-default">🟢 Live</SelectItem>
              <SelectItem value="Finalizing" className="text-slate-800 hover:bg-sky-50 focus:bg-sky-50 transition-colors duration-fast ease-default">🟡 Finalizing</SelectItem>
              <SelectItem value="In Development" className="text-slate-800 hover:bg-sky-50 focus:bg-sky-50 transition-colors duration-fast ease-default">🔴 In Development</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={(value) => {
            setCategoryFilter(value)
          }}>
            <SelectTrigger className="w-48 bg-white/70 backdrop-blur-sm border-sky-200/50 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 focus:ring-offset-0 text-slate-800 rounded-xl shadow-sm transition-all duration-normal ease-default">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-white/90 backdrop-blur-sm border-sky-200/50">
              <SelectItem value="all" className="text-slate-800 hover:bg-sky-50 focus:bg-sky-50 transition-colors duration-fast ease-default">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category} className="text-slate-800 hover:bg-sky-50 focus:bg-sky-50 transition-colors duration-fast ease-default">{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-slate-600 font-medium">
          {filteredAppsCount} of {totalAppsCount} applications
        </p>
        <Button variant="outline" className="bg-white/70 backdrop-blur-sm border-sky-200/50 hover:bg-sky-50 hover:border-sky-300 text-slate-700 rounded-xl shadow-sm transition-all duration-normal ease-default focus:ring-2 focus:ring-sky-400/20 focus:ring-offset-0">
          + Add New Application
        </Button>
      </div>
    </motion.div>
  )
}
