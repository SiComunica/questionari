'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

export default function Navbar() {
  const { userType, signOut } = useAuth()

  return (
    <Card className="rounded-none border-b">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold">
              Questionari
            </Link>
            {userType && (
              <nav className="hidden md:flex space-x-4">
                <Link href={`/dashboard/${userType}`}>
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                {userType === 'operatore' && (
                  <>
                    <Link href="/questionari/strutture">
                      <Button variant="ghost">Strutture</Button>
                    </Link>
                    <Link href="/questionari/operatori">
                      <Button variant="ghost">Operatori</Button>
                    </Link>
                    <Link href="/questionari/giovani">
                      <Button variant="ghost">Giovani</Button>
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {userType ? (
              <Button 
                variant="outline" 
                onClick={signOut}
              >
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 