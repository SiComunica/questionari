"use client"

import { useState } from 'react';
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

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  const handleInviaQuestionario = async (questionario: QuestionarioStruttureNewType) => {
    try {
      const response = await fetch('/api/questionari/strutture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionario)
      });

      if (!response.ok) {
        throw new Error('Errore durante l\'invio del questionario');
      }

      showNotification('Questionario inviato con successo', 'success');
    } catch (error) {
      console.error('Errore:', error);
      showNotification('Errore durante l\'invio del questionario', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
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
    <div className="relative">
      <div className="absolute top-4 right-4">
        <Button 
          variant="outline" 
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>

      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Seleziona il questionario da compilare</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={() => setSelectedQuestionario('questionariogiovaninew')}>
                Questionario Giovani
              </Button>
              <Button onClick={() => setSelectedQuestionario('questionariooperatorinuovo')}>
                Questionario Operatori
              </Button>
              <Button onClick={() => setSelectedQuestionario('questionariostruttureNew')}>
                Questionario Strutture
              </Button>
            </div>
            {renderQuestionario()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 