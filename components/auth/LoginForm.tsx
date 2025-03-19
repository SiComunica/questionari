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
      // Prima verifica il codice e il ruolo
      const { data: userData, error: userError } = await supabase
        .from('auth.users')
        .select('id, role, codice')
        .eq('codice', code)
        .single();

      if (userError || !userData) {
        console.error('Errore verifica codice:', userError);
        setError('Codice non valido');
        return;
      }

      // Effettua il login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: `${userData.id}@ferro.com`,  // Usa l'ID come email
        password: code
      });

      if (authError) {
        console.error('Errore autenticazione:', authError);
        throw authError;
      }

      // Imposta il ruolo nella sessione
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          role: userData.role,
          userId: userData.id 
        }
      });

      if (updateError) {
        console.error('Errore aggiornamento utente:', updateError);
        throw updateError;
      }

      // Reindirizza in base al ruolo
      if (userData.role === 'admin') {
        router.push('/admin');
      } else if (userData.role === 'operatore') {
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