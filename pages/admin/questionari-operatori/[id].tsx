"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { PDFDocument, rgb } from 'pdf-lib';
import { FormData } from '@/types/questionario-operatori';

interface QuestionarioOperatoreDettaglio extends Required<FormData> {
  id: string;
  created_at: string;
  fonte: string;
  stato: string;
  // Sezione A
  id_struttura: string;
  tipo_struttura: string;
  professione: string;
  professione_altro: string;
  // Sezione B
  persone_seguite: {
    uomini: number;
    donne: number;
    totale: number;
  };
  persone_maggiorenni: {
    uomini: number;
    donne: number;
    totale: number;
  };
  caratteristiche_persone: string[];
  caratteristiche_altro: string;
  tipo_intervento: string[];
  intervento_altro: string;
  // Sezione C
  difficolta_uscita: {
    problemi_economici: number;
    trovare_lavoro: number;
    lavori_qualita: number;
    trovare_casa: number;
    discriminazioni: number;
    salute_fisica: number;
    problemi_psicologici: number;
    difficolta_linguistiche: number;
    altro: number;
  };
  difficolta_altro_spec: string;
}

interface Caratteristica {
  nome: string;
  valore: boolean;
}

const QuestionarioOperatoreDettaglio: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [questionario, setQuestionario] = useState<QuestionarioOperatoreDettaglio | null>(null);
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
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    if (!questionario) return;

    const worksheet = XLSX.utils.json_to_sheet([{
      'Data Compilazione': new Date(questionario.created_at).toLocaleString('it-IT'),
      'Fonte': questionario.fonte,
      'ID Struttura': questionario.id_struttura,
      'Tipo Struttura': questionario.tipo_struttura,
      'Professione': questionario.professione,
      'Professione (Altro)': questionario.professione_altro,
      'Uomini Seguiti': questionario.persone_seguite.uomini,
      'Donne Seguite': questionario.persone_seguite.donne,
      'Totale Persone Seguite': questionario.persone_seguite.totale,
      'Uomini Maggiorenni': questionario.persone_maggiorenni.uomini,
      'Donne Maggiorenni': questionario.persone_maggiorenni.donne,
      'Totale Maggiorenni': questionario.persone_maggiorenni.totale,
      'Caratteristiche Persone': questionario.caratteristiche_persone.join(', '),
      'Caratteristiche (Altro)': questionario.caratteristiche_altro,
      'Tipo Intervento': questionario.tipo_intervento.join(', '),
      'Intervento (Altro)': questionario.intervento_altro,
      'Difficoltà - Problemi Economici': questionario.difficolta_uscita.problemi_economici,
      'Difficoltà - Trovare Lavoro': questionario.difficolta_uscita.trovare_lavoro,
      'Difficoltà - Lavori Qualità': questionario.difficolta_uscita.lavori_qualita,
      'Difficoltà - Trovare Casa': questionario.difficolta_uscita.trovare_casa,
      'Difficoltà - Discriminazioni': questionario.difficolta_uscita.discriminazioni,
      'Difficoltà - Salute Fisica': questionario.difficolta_uscita.salute_fisica,
      'Difficoltà - Problemi Psicologici': questionario.difficolta_uscita.problemi_psicologici,
      'Difficoltà - Linguistiche': questionario.difficolta_uscita.difficolta_linguistiche,
      'Difficoltà - Altro': questionario.difficolta_uscita.altro,
      'Difficoltà (Altro) Specifiche': questionario.difficolta_altro_spec
    }]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Questionario');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(data, `questionario-operatore-${questionario.id}.xlsx`);
  };

  const downloadPDF = async () => {
    if (!questionario) return;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { height, width } = page.getSize();
    
    let yOffset = height - 50;
    const fontSize = 12;
    const lineHeight = 20;

    // Funzione helper per aggiungere testo
    const addText = (text: string) => {
      page.drawText(text, {
        x: 50,
        y: yOffset,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yOffset -= lineHeight;
    };

    // Aggiungi i dati al PDF
    addText(`Questionario Operatore - ${new Date(questionario.created_at).toLocaleString('it-IT')}`);
    addText(`Fonte: ${questionario.fonte}`);
    addText(`ID Struttura: ${questionario.id_struttura}`);
    addText(`Tipo Struttura: ${questionario.tipo_struttura}`);
    // ... aggiungi altri campi ...

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, `questionario-operatore-${questionario.id}.pdf`);
  };

  const renderCaratteristiche = (caratteristiche: { nome: string; valore: boolean }[], index: number) => {
    return caratteristiche.map((car: { nome: string; valore: boolean }, idx: number) => (
      <span key={idx} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
        {car.nome}
      </span>
    ))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (!questionario) return;

    if (type === 'checkbox') {
      const isChecked = (e.target as HTMLInputElement).checked;
      const arrayField = (questionario[name as keyof QuestionarioOperatoreDettaglio] as string[]) || [];
      
      setQuestionario(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [name]: isChecked ? [...arrayField, value] : arrayField.filter(item => item !== value)
        } as QuestionarioOperatoreDettaglio;
      });
    } else {
      setQuestionario(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [name]: value
        } as QuestionarioOperatoreDettaglio;
      });
    }
  };

  if (loading) return <div>Caricamento...</div>;
  if (!questionario) return <div>Questionario non trovato</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dettaglio Questionario Operatore</h1>
        <div className="space-x-4">
          <button
            onClick={downloadExcel}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Scarica Excel
          </button>
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Scarica PDF
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Sezione A: Descrizione dell'operatore</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-semibold">ID Struttura</label>
            <p>{questionario.id_struttura}</p>
          </div>
          <div>
            <label className="font-semibold">Tipo Struttura</label>
            <p>{questionario.tipo_struttura}</p>
          </div>
          <div>
            <label className="font-semibold">Professione</label>
            <p>{questionario.professione}</p>
          </div>
          {questionario.professione_altro && (
            <div>
              <label className="font-semibold">Altra Professione</label>
              <p>{questionario.professione_altro}</p>
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4">Sezione B: Informazioni sulle persone seguite</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-semibold">Persone Seguite</label>
            <p>Uomini: {questionario.persone_seguite.uomini}</p>
            <p>Donne: {questionario.persone_seguite.donne}</p>
            <p>Totale: {questionario.persone_seguite.totale}</p>
          </div>
          <div>
            <label className="font-semibold">Persone Maggiorenni</label>
            <p>Uomini: {questionario.persone_maggiorenni.uomini}</p>
            <p>Donne: {questionario.persone_maggiorenni.donne}</p>
            <p>Totale: {questionario.persone_maggiorenni.totale}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="font-semibold">Caratteristiche delle persone</label>
          <ul className="list-disc list-inside mt-2">
            {renderCaratteristiche(questionario.caratteristiche_persone.map(car => ({ nome: car, valore: true })), 0)}
          </ul>
        </div>

        <h2 className="text-xl font-semibold mb-4">Sezione C: Difficoltà riscontrate</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(questionario.difficolta_uscita).map(([key, value]) => (
            <div key={key}>
              <label className="font-semibold">
                {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <p>{String(value)}/10</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionarioOperatoreDettaglio; 