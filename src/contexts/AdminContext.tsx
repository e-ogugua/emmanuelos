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
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')

  useEffect(() => {
    // Check localStorage for admin status
    const stored = localStorage.getItem('emmanuelos-admin')
    if (stored === 'true') {
      setIsAdmin(true)
      setAdminPassword(ADMIN_PASSWORD)
    }
  }, [])

  const loginAsAdmin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setAdminPassword(password)
      localStorage.setItem('emmanuelos-admin', 'true')
      return true
    }
    return false
  }

  const logoutAdmin = () => {
    setIsAdmin(false)
    setAdminPassword('')
    localStorage.removeItem('emmanuelos-admin')
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
