import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let role: string | null = null;
      
      // Determina il ruolo dal codice
      if (code === 'admin2025') {
        role = 'admin';
      } else if (code.startsWith('operatore') && /^operatore\d+$/.test(code)) {
        const operatorNumber = parseInt(code.replace('operatore', ''));
        if (operatorNumber >= 1 && operatorNumber <= 300) {
          role = 'operatore';
        }
      } else if (code === 'anonimo9999') {
        role = 'anonimo';
      }

      if (!role) {
        setError('Codice non valido');
        return;
      }

      // Effettua il login
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: `${code}@ferro.com`,
        password: code
      });

      if (signInError) {
        console.error('Errore login:', signInError);
        throw signInError;
      }

      // Reindirizza in base al ruolo
      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'operatore') {
        router.push('/operatori');
      }

    } catch (err: any) {
      console.error('Errore di login:', err);
      setError('Errore durante il login. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Form submission logic */}
    </div>
  );
};

export default LoginForm; 