import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Ottieni l'utente corrente
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utente non autenticato' },
        { status: 401 }
      );
    }

    const questionario = await request.json();

    // Prepara i dati per il salvataggio
    const datiDaSalvare = {
      ...questionario,
      user_id: user.id,
      created_at: new Date().toISOString(),
      stato: 'inviato'
    };

    // Salva nella tabella strutturanuova
    const { data, error } = await supabase
      .from('strutturanuova')
      .insert(datiDaSalvare)
      .select()
      .single();

    if (error) {
      console.error('Errore Supabase:', error);
      return NextResponse.json(
        { error: 'Errore durante il salvataggio nel database' },
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