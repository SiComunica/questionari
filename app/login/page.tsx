import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

const Login = () => {
  const router = useRouter();
  const [codice, setCodice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let role = '';
      let email = '';
      let password = '';

      if (codice === 'admin2025') {
        role = 'admin';
        email = 'admin@example.com';
        password = 'admin2025';
      } else if (codice === 'anonimo9999') {
        role = 'anonimo';
        email = 'anonimo@example.com';
        password = 'anonimo9999';
      } else if (/^operatore[1-3][0-9]{2}$/.test(codice)) {
        role = 'operatore';
        email = `${codice}@example.com`;
        password = codice;
      } else {
        throw new Error('Codice non valido');
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Reindirizza in base al ruolo
      switch (role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'operatore':
          router.push('/operatore/dashboard');
          break;
        case 'anonimo':
          router.push('/anonimo/dashboard');
          break;
      }
    } catch (err) {
      setError('Codice non valido o errore di accesso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Accedi
        </h2>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="codice" className="sr-only">
              Codice di accesso
            </label>
            <input
              id="codice"
              type="text"
              required
              value={codice}
              onChange={(e) => setCodice(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Inserisci il codice di accesso"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 