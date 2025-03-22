'use client'

import { useEffect } from 'react'

export default function Operatore() {
  useEffect(() => {
    const userType = localStorage.getItem('userType')
    if (userType !== 'operatore') {
      window.location.href = '/'
    }
  }, [])

  return (
    <div>
      <h1>Area Operatore</h1>
    </div>
  )
} 