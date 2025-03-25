"use client"

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function QuestionariTable() {
  const [questionari, setQuestionari] = useState<{
    giovani: any[];
    strutture: any[];
    operatori: any[];
  }>({
    giovani: [],
    strutture: [],
    operatori: []
  });

  useEffect(() => {
    const fetchQuestionari = async () => {
      const supabase = createClient();

      // Fetch questionari giovani
      const { data: giovani } = await supabase
        .from('questionariogiovaninew')
        .select('*')
        .order('creato_a', { ascending: false });

      // Fetch questionari strutture
      const { data: strutture } = await supabase
        .from('strutturenew')
        .select('*')
        .order('creato_a', { ascending: false });

      // Fetch questionari operatori
      const { data: operatori } = await supabase
        .from('operatorinew')
        .select('*')
        .order('creato_a', { ascending: false });

      setQuestionari({
        giovani: giovani || [],
        strutture: strutture || [],
        operatori: operatori || []
      });
    };

    fetchQuestionari();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">Questionari Giovani</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead>Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questionari.giovani.map((q) => (
                <TableRow key={q.id}>
                  <TableCell>{new Date(q.creato_a).toLocaleDateString()}</TableCell>
                  <TableCell>{q.fonte}</TableCell>
                  <TableCell>{q.stato}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">Questionari Strutture</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead>Struttura</TableHead>
                <TableHead>Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questionari.strutture.map((q) => (
                <TableRow key={q.id}>
                  <TableCell>{new Date(q.creato_a).toLocaleDateString()}</TableCell>
                  <TableCell>{q.fonte}</TableCell>
                  <TableCell>{q.id_struttura}</TableCell>
                  <TableCell>{q.stato}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">Questionari Operatori</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead>Struttura</TableHead>
                <TableHead>Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questionari.operatori.map((q) => (
                <TableRow key={q.id}>
                  <TableCell>{new Date(q.creato_a).toLocaleDateString()}</TableCell>
                  <TableCell>{q.fonte}</TableCell>
                  <TableCell>{q.id_struttura}</TableCell>
                  <TableCell>{q.stato}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 