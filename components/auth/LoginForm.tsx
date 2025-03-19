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
      // Query per verificare il codice
      const { data: users, error: queryError } = await supabase
        .from('users')
        .select('id, role, codice')
        .eq('codice', code)
        .single();

      if (queryError || !users) {
        console.error('Errore query:', queryError);
        setError('Codice non valido');
        return;
      }

      // Login con Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: `${code}@ferro.com`,
        password: code
      });

      if (signInError) {
        console.error('Errore signin:', signInError);
        throw signInError;
      }

      // Reindirizza in base al ruolo
      if (users.role === 'admin') {
        router.push('/admin');
      } else if (users.role === 'operatore') {
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