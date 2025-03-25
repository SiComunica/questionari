import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: 'Ferro',
  description: 'Gestione questionari',
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
        <Toaster />
      </body>
    </html>
  )
} 