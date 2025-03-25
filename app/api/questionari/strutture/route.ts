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
      id: questionario.id || crypto.randomUUID(), // Assicuriamoci che ci sia un ID
      creato_a: new Date().toISOString(),
      stato: 'inviato',
      // Convertiamo gli array vuoti in null per evitare errori di tipo
      figure_professionali: questionario.figure_professionali?.length ? questionario.figure_professionali : null,
      nuove_attivita: questionario.nuove_attivita?.length ? questionario.nuove_attivita : null,
      collaborazioni: questionario.collaborazioni?.length ? questionario.collaborazioni : null,
      attivita_inserimento: questionario.attivita_inserimento?.length ? questionario.attivita_inserimento : null
    };

    // Log per debug
    console.log('Dati da salvare:', datiDaSalvare);

    // Salviamo nella tabella strutturanuova
    const { data, error } = await supabase
      .from('strutturanuova')
      .insert([datiDaSalvare])
      .select()
      .single();

    if (error) {
      console.error('Errore Supabase dettagliato:', error);
      return NextResponse.json(
        { error: `Errore durante il salvataggio: ${error.message}`, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Errore durante il salvataggio:', error);
    return NextResponse.json(
      { error: 'Errore durante il salvataggio del questionario', details: error },
      { status: 500 }
    );
  }
} 