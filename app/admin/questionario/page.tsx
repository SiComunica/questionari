'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import QuestionarioGiovaniNew from '@/components/questionari/QuestionarioGiovaniNew'
import QuestionarioOperatoriNew from '@/components/questionari/QuestionarioOperatoriNew'
import QuestionarioStruttureNew from '@/components/questionari/QuestionarioStruttureNew'

export default function QuestionarioPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipo = searchParams?.get('tipo')
  const id = searchParams?.get('id')
  // ... resto del codice del dettaglio questionario ...
} 