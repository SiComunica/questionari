import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AdminLayout } from '../../../../components/layouts/AdminLayout';
import { supabase } from '../../../../lib/supabase';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { exportToExcel, exportToPDF } from '../../../../utils/exportQuestionario';

const QuestionarioDettaglio = () => {
  const router = useRouter();
  const { id } = router.query;
  const [questionario, setQuestionario] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchQuestionario();
    }
  }, [id]);

  const fetchQuestionario = async () => {
    try {
      const { data, error } = await supabase
        .from('operatori')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setQuestionario(data);
    } catch (err) {
      console.error('Errore nel caricamento del questionario:', err);
      alert('Errore nel caricamento del questionario');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!questionario) {
    return (
      <AdminLayout>
        <div className="text-center py-8 text-gray-500">
          Questionario non trovato
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Questionario di {questionario.nome} {questionario.cognome}
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={() => exportToExcel(questionario)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Excel
            </button>
            <button
              onClick={() => exportToPDF(questionario)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF
            </button>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Torna indietro
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-8">
          {/* Metadati */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
            <div>
              <p className="text-sm text-gray-500">Data compilazione</p>
              <p className="font-medium">
                {format(new Date(questionario.created_at), 'dd/MM/yyyy HH:mm', { locale: it })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Stato</p>
              <p className="font-medium capitalize">{questionario.stato.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Sezioni del questionario */}
          <div className="space-y-6">
            {/* Sezione A */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Dati anagrafici e professionali</h2>
              <div className="grid grid-cols-2 gap-4">
                {/* ... visualizza i campi della sezione A ... */}
              </div>
            </section>

            {/* Altre sezioni... */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default QuestionarioDettaglio; 