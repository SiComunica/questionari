'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import LoginPage from '@/components/auth/LoginPage'

export default function Home() {
  return <LoginPage />
}

