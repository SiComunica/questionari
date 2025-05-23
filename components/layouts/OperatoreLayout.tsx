'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'

interface OperatoreLayoutProps {
  children: React.ReactNode
}

export default function OperatoreLayout({ children }: OperatoreLayoutProps) {
  return (
    <ProtectedRoute allowedTypes={['operatore']}>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Area Operatore</h1>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
} 