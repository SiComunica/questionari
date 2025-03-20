import { useRouter } from 'next/router';
import { useUser } from '../../context/UserContext';

export function OperatoreLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useUser();

  if (loading) {
    return <div>Caricamento...</div>;
  }

  if (!user || user.role !== 'operatore') {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Dashboard Operatore</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
} 