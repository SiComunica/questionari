'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const role = session.user.user_metadata.role
        switch(role) {
          case 'admin':
            router.push('/admin/dashboard')
            break
          case 'operatore':
            router.push('/operatore/dashboard')
            break
          case 'anonimo':
            router.push('/dashboard/anonimo')
            break
          default:
            router.push('/login')
        }
      } else {
        router.push('/login')
      }
    }

    checkUser()
  }, [router])

  return null
} 