'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Database } from '@/lib/database.types'

export default function Navbar() {
  const { userType, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    signOut()
    router.push('/')
  }

  if (!userType) return null

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                Questionari
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {userType === 'admin' && (
                <Link
                  href="/dashboard/admin"
                  className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard Admin
                </Link>
              )}
              {userType === 'operatore' && (
                <Link
                  href="/dashboard/operatore"
                  className="border-green-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard Operatore
                </Link>
              )}
              {userType === 'anonimo' && (
                <Link
                  href="/dashboard/anonimo"
                  className="border-yellow-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard Anonimo
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 