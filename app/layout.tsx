import './globals.css'

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
        {children}
      </body>
    </html>
  )
} 