'use client'

import { useEffect } from 'react'

export default function ListaQuestionari() {
  useEffect(() => {
    const userType = localStorage.getItem('userType')
    if (userType !== 'admin') {
      window.location.href = '/'
    }
  }, [])

  return (
    <div>
      <h1>Dashboard Admin</h1>
    </div>
  )
} 