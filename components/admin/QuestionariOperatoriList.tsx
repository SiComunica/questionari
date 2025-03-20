"use client"

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from "next/navigation";

interface QuestionarioOperatore {
  id: string;
  created_at: string;
  fonte: string;
  stato: string;
  id_struttura: string;
  tipo_struttura: string;
  professione: string;
  persone_seguite: {
    uomini: number;
    donne: number;
    totale: number;
  };
}

const QuestionariOperatoriList: React.FC = () => {
  const [questionari, setQuestionari] = useState<QuestionarioOperatore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchQuestionari = async () => {
    try {
      const { data, error } = await supabase
        .from('operatori')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setQuestionari(data || []);
    } catch (err) {
      console.error('Errore nel caricamento dei questionari:', err);
      setError('Errore nel caricamento dei questionari');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionari();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('it-IT');
  };

  if (loading) return <div>Caricamento...</div>;
  if (error) return <div>Errore: {error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Data</th>
            <th className="px-4 py-2">Fonte</th>
            <th className="px-4 py-2">Struttura</th>
            <th className="px-4 py-2">Tipo Struttura</th>
            <th className="px-4 py-2">Professione</th>
            <th className="px-4 py-2">Persone Seguite</th>
            <th className="px-4 py-2">Stato</th>
            <th className="px-4 py-2">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {questionari.map((questionario) => (
            <tr key={questionario.id} className="border-t">
              <td className="px-4 py-2">{formatDate(questionario.created_at)}</td>
              <td className="px-4 py-2">{questionario.fonte}</td>
              <td className="px-4 py-2">{questionario.id_struttura}</td>
              <td className="px-4 py-2">{questionario.tipo_struttura}</td>
              <td className="px-4 py-2">{questionario.professione}</td>
              <td className="px-4 py-2">
                {`Totale: ${questionario.persone_seguite.totale} (U: ${questionario.persone_seguite.uomini}, D: ${questionario.persone_seguite.donne})`}
              </td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded ${
                  questionario.stato === 'nuovo' ? 'bg-yellow-200' : 'bg-green-200'
                }`}>
                  {questionario.stato}
                </span>
              </td>
              <td className="px-4 py-2">
                <button 
                  onClick={() => router.push(`/admin/questionari-operatori/${questionario.id}`)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Dettagli
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionariOperatoriList; 