'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type UserType = 'admin' | 'anonimo' | 'operatore' | null
type AuthContextType = {
  userType: UserType
  login: (code: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  userType: null,
  login: async () => false,
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null)

  const login = async (code: string) => {
    if (code === 'admin2025') {
      setUserType('admin')
      return true
    } else if (code === 'utente9999') {
      setUserType('anonimo') 
      return true
    } else if (code.startsWith('operatore') && /^operatore\d+$/.test(code)) {
      setUserType('operatore')
      return true
    }
    return false
  }

  const logout = () => {
    setUserType(null)
  }

  return (
    <AuthContext.Provider value={{ userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 