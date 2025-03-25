import { QuestionarioStruttureNew } from "@/types/questionari";

const handleInviaQuestionario = async (questionario: QuestionarioStruttureNew) => {
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

    // Aggiorna lo stato o mostra un messaggio di successo
    toast({
      title: "Questionario inviato con successo",
      description: "Il questionario è stato salvato e sarà visibile nella dashboard amministratori",
      duration: 5000,
    });

  } catch (error) {
    console.error('Errore:', error);
    toast({
      title: "Errore durante l'invio",
      description: "Si è verificato un errore durante l'invio del questionario. Riprova più tardi.",
      variant: "destructive",
      duration: 5000,
    });
  }
}; 