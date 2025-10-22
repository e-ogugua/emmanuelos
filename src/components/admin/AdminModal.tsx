'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'

interface AdminModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const { loginAsAdmin } = useAdmin()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (loginAsAdmin(password)) {
      setPassword('')
      setError('')
      onClose()
    } else {
      setError('Invalid password')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md" onClick={onClose}>
      <Card
        className="w-full max-w-md mx-4 glass-card border-slate-200 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 h-8 w-8"
            >
              ×
            </Button>
            <div className="p-3 bg-slate-100 rounded-full">
              <Settings className="w-6 h-6 text-slate-600" />
            </div>
            <div className="w-8"></div> {/* Spacer for centering */}
          </div>
          <CardTitle className="text-xl text-slate-800">SuperExplorer Access</CardTitle>
          <p className="text-sm text-slate-600 mt-1">
            Enter admin password to access advanced controls
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              onKeyPress={handleKeyPress}
              className="text-center bg-slate-50 border-slate-200 focus:border-slate-400"
            />
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogin}
              className="flex-1 bg-slate-700 hover:bg-slate-800 text-white"
            >
              Access
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Secure • Advanced Controls • Analytics Management
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
