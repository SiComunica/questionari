'use client'

import { useEffect } from 'react'

export default function Anonimo() {
  useEffect(() => {
    const userType = localStorage.getItem('userType')
    if (userType !== 'anonimo') {
      window.location.href = '/'
    }
  }, [])

  return (
    <div>
      <h1>Area Anonimo</h1>
    </div>
  )
} 