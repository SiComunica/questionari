'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { Database } from '@/types/database'

type Struttura = Database['public']['Tables']['strutture']['Row']
type Operatore = Database['public']['Tables']['operatori']['Row']
type Giovane = Database['public']['Tables']['giovani']['Row']

interface DettaglioQuestionarioProps {
  data: Struttura | Operatore | Giovane
  tipo: 'struttura' | 'operatore' | 'giovane'
  onClose: () => void
}

export default function DettaglioQuestionario({
  data,
  tipo,
  onClose,
}: DettaglioQuestionarioProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Dettaglio {tipo}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">{key}</dt>
              <dd className="text-sm text-gray-900 col-span-2">
                {Array.isArray(value) 
                  ? value.join(', ')
                  : typeof value === 'boolean'
                    ? value ? 'Sì' : 'No'
                    : value?.toString() || '-'}
              </dd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 