import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface QuestionarioOperatore {
  id: string;
  created_at: string;
  nome: string;
  cognome: string;
  tipo_struttura: string;
  professione: string;
  stato: string;
}

const QuestionariOperatoriList = () => {
  const router = useRouter();
  const [questionari, setQuestionari] = useState<QuestionarioOperatore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroStato, setFiltroStato] = useState<string>('tutti');

  useEffect(() => {
    fetchQuestionari();
  }, [filtroStato]);

  const fetchQuestionari = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('operatori')
        .select('*')
        .order('created_at', { ascending: false });

      if (filtroStato !== 'tutti') {
        query = query.eq('stato', filtroStato);
      }

      const { data, error } = await query;

      if (error) throw error;
      setQuestionari(data || []);
    } catch (err) {
      console.error('Errore nel caricamento dei questionari:', err);
      setError('Errore nel caricamento dei questionari');
    } finally {
      setLoading(false);
    }
  };

  const updateStato = async (id: string, nuovoStato: string) => {
    try {
      const { error } = await supabase
        .from('operatori')
        .update({ stato: nuovoStato })
        .eq('id', id);

      if (error) throw error;
      
      // Aggiorna la lista
      fetchQuestionari();
    } catch (err) {
      console.error('Errore nell\'aggiornamento dello stato:', err);
      alert('Errore nell\'aggiornamento dello stato');
    }
  };

  const getStatoBadgeColor = (stato: string) => {
    switch (stato) {
      case 'nuovo':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_revisione':
        return 'bg-blue-100 text-blue-800';
      case 'completato':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Questionari Operatori</h2>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm">Filtra per stato:</label>
          <select
            value={filtroStato}
            onChange={(e) => setFiltroStato(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="tutti">Tutti</option>
            <option value="nuovo">Nuovi</option>
            <option value="in_revisione">In revisione</option>
            <option value="completato">Completati</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operatore
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Struttura
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Professione
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questionari.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(q.created_at), 'dd/MM/yyyy HH:mm', { locale: it })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {q.nome} {q.cognome}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {q.tipo_struttura}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {q.professione}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatoBadgeColor(q.stato)}`}>
                    {q.stato.replace('_', ' ').charAt(0).toUpperCase() + q.stato.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => router.push(`/admin/questionari/operatori/${q.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Visualizza
                    </button>
                    <select
                      value={q.stato}
                      onChange={(e) => updateStato(q.id, e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="nuovo">Nuovo</option>
                      <option value="in_revisione">In revisione</option>
                      <option value="completato">Completato</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {questionari.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nessun questionario trovato
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionariOperatoriList; 