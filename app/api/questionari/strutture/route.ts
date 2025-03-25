import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const questionario = await request.json();
    
    // Verifichiamo che ci sia il codice operatore
    if (!questionario.creato_da) {
      return NextResponse.json(
        { error: 'Codice operatore mancante' },
        { status: 400 }
      );
    }
    
    // Prepariamo i dati per il salvataggio
    const datiDaSalvare = {
      ...questionario,
      creato_a: new Date().toISOString(),
      stato: 'inviato'
    };

    // Salviamo nella tabella strutturanuova
    const { data, error } = await supabase
      .from('strutturanuova')
      .insert([datiDaSalvare])
      .select()
      .single();

    if (error) {
      console.error('Errore Supabase:', error);
      return NextResponse.json(
        { error: `Errore durante il salvataggio: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Errore durante il salvataggio:', error);
    return NextResponse.json(
      { error: 'Errore durante il salvataggio del questionario' },
      { status: 500 }
    );
  }
} 