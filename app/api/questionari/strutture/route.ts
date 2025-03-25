import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const questionario = await request.json();

    // Aggiungi timestamp e stato
    const questionarioToSave = {
      ...questionario,
      creato_a: new Date().toISOString(),
      stato: 'inviato'
    };

    // Salva nel database
    const savedQuestionario = await db.questionarioStrutture.create({
      data: questionarioToSave
    });

    return NextResponse.json(savedQuestionario, { status: 201 });
    
  } catch (error) {
    console.error('Errore durante il salvataggio del questionario:', error);
    return NextResponse.json(
      { error: 'Errore durante il salvataggio del questionario' },
      { status: 500 }
    );
  }
} 