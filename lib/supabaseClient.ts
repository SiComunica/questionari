import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Questionario = {
  id: number
  created_at: string
  [key: string]: any
}

export type QuestionarioWithType = Questionario & {
  tipo: 'giovani' | 'operatori' | 'strutture'
} 