import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Verifica autenticazione
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Sessione non valida. Effettua nuovamente il login.' },
        { status: 401 }
      );
    }

    const questionario = await request.json();

    // Verifica che i dati necessari siano presenti
    if (!questionario) {
      return NextResponse.json(
        { error: 'Dati del questionario mancanti' },
        { status: 400 }
      );
    }

    // Prepara i dati per il salvataggio
    const datiDaSalvare = {
      ...questionario,
      user_id: session.user.id,
      created_at: new Date().toISOString(),
      stato: 'inviato'
    };

    // Salva nella tabella strutturanuova
    const { data, error } = await supabase
      .from('strutturanuova')
      .insert([datiDaSalvare])
      .select()
      .single();

    if (error) {
      console.error('Errore Supabase:', error);
      return NextResponse.json(
        { error: 'Errore durante il salvataggio nel database: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error('Errore durante il salvataggio:', error);
    return NextResponse.json(
      { error: 'Errore interno del server: ' + (error instanceof Error ? error.message : 'Errore sconosciuto') },
      { status: 500 }
    );
  }
} 