'use client'

import { useEffect } from 'react'

export default function AdminDashboard() {
  useEffect(() => {
    const userType = localStorage.getItem('userType')
    if (userType !== 'admin') {
      window.location.href = '/'
    }
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <p>Benvenuto nella dashboard admin</p>
    </div>
  )
} 