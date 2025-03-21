'use client'

import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { signOut } = useAuth()

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold">
              Gestione Questionari
            </span>
          </div>
          <div className="flex items-center">
            <button
              onClick={signOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 