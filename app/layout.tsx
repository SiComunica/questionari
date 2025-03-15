import React from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Questionari App',
  description: 'Sistema di gestione questionari',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 