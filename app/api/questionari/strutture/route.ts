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
    
    const { data, error } = await supabase
      .from('strutturanuova')
      .insert([questionario])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Errore:', error);
    return NextResponse.json(
      { error: 'Errore durante il salvataggio' },
      { status: 500 }
    );
  }
} 