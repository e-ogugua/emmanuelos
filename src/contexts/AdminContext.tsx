'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface AdminContextType {
  isAdmin: boolean
  adminPassword: string
  loginAsAdmin: (password: string) => boolean
  logoutAdmin: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Simple admin password (in production, use proper authentication)
const ADMIN_PASSWORD = 'emmanuelos2025'

export function AdminProvider({ children }: { children: React.ReactNode }) {
  // Initialize state based on localStorage availability (SSR-safe)
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('emmanuelos-admin')
      return stored === 'true'
    }
    return false
  })

  const [adminPassword, setAdminPassword] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('emmanuelos-admin')
      return stored === 'true' ? ADMIN_PASSWORD : ''
    }
    return ''
  })

  useEffect(() => {
    // Only run on client side and only if not already initialized
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('emmanuelos-admin')
      if (stored === 'true') {
        setIsAdmin(true)
        setAdminPassword(ADMIN_PASSWORD)
      }
    }
  }, [])

  const loginAsAdmin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setAdminPassword(password)
      if (typeof window !== 'undefined') {
        localStorage.setItem('emmanuelos-admin', 'true')
      }
      return true
    }
    return false
  }

  const logoutAdmin = () => {
    setIsAdmin(false)
    setAdminPassword('')
    if (typeof window !== 'undefined') {
      localStorage.removeItem('emmanuelos-admin')
    }
  }

  return (
    <AdminContext.Provider value={{
      isAdmin,
      adminPassword,
      loginAsAdmin,
      logoutAdmin
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
