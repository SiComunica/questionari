import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inizializza il client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const questionario = await request.json();

    // Aggiungi timestamp e stato
    const questionarioToSave = {
      ...questionario,
      creato_a: new Date().toISOString(),
      stato: 'inviato'
    };

    // Salva nella tabella strutturanuova di Supabase
    const { data, error } = await supabase
      .from('strutturanuova')
      .insert(questionarioToSave)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error('Errore durante il salvataggio del questionario:', error);
    return NextResponse.json(
      { error: 'Errore durante il salvataggio del questionario' },
      { status: 500 }
    );
  }
} 