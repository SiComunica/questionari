import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClientComponentClient();

  try {
    const questionario = await request.json();

    // Prepara i dati per il salvataggio
    const datiDaSalvare = {
      ...questionario,
      creato_a: new Date().toISOString(),
      stato: 'inviato'
    };

    // Salva nella tabella strutturanuova
    const { data, error } = await supabase
      .from('strutturanuova')
      .insert(datiDaSalvare)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error('Errore durante il salvataggio:', error);
    return NextResponse.json(
      { error: 'Errore durante il salvataggio del questionario' },
      { status: 500 }
    );
  }
} 