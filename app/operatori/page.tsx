"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import QuestionarioGiovaniNew from '@/components/questionari/QuestionarioGiovaniNew';
import QuestionarioOperatoriNuovo from '@/components/questionari/QuestionarioOperatoriNuovo';
import QuestionarioStruttureNew from '@/components/questionari/QuestionarioStruttureNew';
import type { QuestionarioStruttureNew as QuestionarioStruttureNewType } from "@/types/questionari";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Operatori() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [selectedQuestionario, setSelectedQuestionario] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [operatore, setOperatore] = useState<string>('');

  useEffect(() => {
    const codiceOperatore = localStorage.getItem('codiceOperatore');
    if (!codiceOperatore) {
      router.push('/');
    } else {
      setOperatore(codiceOperatore);
    }
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem('codiceOperatore');
    router.push('/');
  };

  const handleSelectQuestionario = (tipo: string) => {
    const codiceOperatore = localStorage.getItem('codiceOperatore');
    if (!codiceOperatore) {
      alert('Sessione scaduta. Effettua nuovamente l\'accesso.');
      router.push('/');
      return;
    }
    setSelectedQuestionario(tipo);
  };

  const renderQuestionario = () => {
    switch (selectedQuestionario) {
      case 'questionariogiovaninew':
        return <QuestionarioGiovaniNew fonte="operatore" />;
      case 'questionariooperatorinuovo':
        return <QuestionarioOperatoriNuovo initialData={formData} setFormData={setFormData} />;
      case 'questionariostruttureNew':
        return <QuestionarioStruttureNew initialData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Operatore</h1>
        <div className="flex items-center gap-4">
          <p className="text-gray-600">
            Operatore: {operatore}
          </p>
          <Button 
            variant="outline" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Seleziona il questionario da compilare</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={() => handleSelectQuestionario('questionariogiovaninew')}>
              Questionario Giovani
            </Button>
            <Button onClick={() => handleSelectQuestionario('questionariooperatorinuovo')}>
              Questionario Operatori
            </Button>
            <Button onClick={() => handleSelectQuestionario('questionariostruttureNew')}>
              Questionario Strutture
            </Button>
          </div>
          {renderQuestionario()}
        </CardContent>
      </Card>
    </div>
  );
} 