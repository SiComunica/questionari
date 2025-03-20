import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
        router.push('/admin/dashboard');
      } else if (role === 'operatore') {
        router.push('/operatore/dashboard');
      } else {
        router.push('/dashboard/anonimo');
      }

    } catch (err: any) {
      console.error('Errore di login:', err);
      setError('Errore durante il login. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6">
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          Codice di accesso
        </label>
        <input
          type="text"
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Inserisci il tuo codice"
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Accesso in corso...' : 'Accedi'}
      </button>
    </form>
  );
};

export default LoginForm; 