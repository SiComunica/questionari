'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/components/auth/LoginPage'

export default function Home() {
  const router = useRouter();
  const [codiceOperatore, setCodiceOperatore] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Salviamo il codice operatore nella localStorage
    localStorage.setItem('codiceOperatore', codiceOperatore);
    router.push('/operatori');
  };

  return <LoginPage />
}

