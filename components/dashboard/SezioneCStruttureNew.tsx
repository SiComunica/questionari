// Aggiungo tutte le opzioni per le persone trattate (adolescenti)
const opzioniPersoneTrattateAdolescenti = [
  { id: 'C2.1A', label: 'Stranieri con problemi legati alla condizione migratoria' },
  { id: 'C2.2A', label: 'Vittime di tratta' },
  { id: 'C2.3A', label: 'Vittime di violenza domestica' },
  { id: 'C2.4A', label: 'Persone allontanate dalla famiglia' },
  { id: 'C2.5A', label: 'Detenuti' },
  { id: 'C2.6A', label: 'Ex detenuti' },
  { id: 'C2.7A', label: 'Persone in esecuzione penale esterna /misura alternativa alla detenzione' },
  { id: 'C2.8A', label: 'Indigenti e/o senza dimora' },
  { id: 'C2.9A', label: 'Rom e Sinti' },
  { id: 'C2.10A', label: 'Persone con disabilità fisica' },
  { id: 'C2.11A', label: 'Persone con disabilità cognitiva' },
  { id: 'C2.12A', label: 'Persone con disturbi psichiatrici' },
  { id: 'C2.13A', label: 'Persone con dipendenze' },
  { id: 'C2.14A', label: 'Genitori precoci' },
  { id: 'C2.15A', label: 'Persone con problemi legati all\'orientamento sessuale' },
  { id: 'C2.16A', label: 'Altro' }
];

// Aggiungo tutte le opzioni per le persone trattate (giovani adulti)
const opzioniPersoneTrattateGiovani = [
  { id: 'C2.1B', label: 'Stranieri con problemi legati alla condizione migratoria' },
  { id: 'C2.2B', label: 'Vittime di tratta' },
  { id: 'C2.3B', label: 'Vittime di violenza domestica' },
  { id: 'C2.4B', label: 'Persone allontanate dalla famiglia' },
  { id: 'C2.5B', label: 'Detenuti' },
  { id: 'C2.6B', label: 'Ex detenuti' },
  { id: 'C2.7B', label: 'Persone in esecuzione penale esterna /misura alternativa alla detenzione' },
  { id: 'C2.8B', label: 'Indigenti e/o senza dimora' },
  { id: 'C2.9B', label: 'Rom e Sinti' },
  { id: 'C2.10B', label: 'Persone con disabilità fisica' },
  { id: 'C2.11B', label: 'Persone con disabilità cognitiva' },
  { id: 'C2.12B', label: 'Persone con disturbi psichiatrici' },
  { id: 'C2.13B', label: 'Persone con dipendenze' },
  { id: 'C2.14B', label: 'Genitori precoci' },
  { id: 'C2.15B', label: 'Persone con problemi legati all\'orientamento sessuale' },
  { id: 'C2.16B', label: 'Altro' }
];

// Stesse opzioni per persone non ospitate (C4.1A-C4.16A e C4.1B-C4.16B)
const opzioniPersoneNonOspitateAdolescenti = [
  { id: 'C4.1A', label: 'Stranieri con problemi legati alla condizione migratoria' },
  // ... stesse opzioni come sopra ma con id C4.*A
];

const opzioniPersoneNonOspitateGiovani = [
  { id: 'C4.1B', label: 'Stranieri con problemi legati alla condizione migratoria' },
  // ... stesse opzioni come sopra ma con id C4.*B
]; 