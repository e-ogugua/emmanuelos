import { useState, useEffect } from 'react'

/**
 * Custom hook for debounced search functionality
 * Delays search execution to improve performance
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for managing search state with debouncing
 */
export function useSearch(initialQuery = '') {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(searchQuery, 300) // 300ms delay

  return {
    searchQuery,
    setSearchQuery,
    debouncedQuery
  }
}
