#!/bin/bash

# Crea un nuovo progetto Next.js
npx create-next-app@latest progetto-questionari --typescript --tailwind --app
cd progetto-questionari

# Copia il package.json aggiornato
cp ../package.json .

# Rimuovi node_modules e package-lock.json se esistono
rm -rf node_modules package-lock.json

# Installa tutte le dipendenze
npm install

# Rimuovi il pacchetto esistente
npm uninstall @heroicons/react

# Installa l'ultima versione
npm install @heroicons/react@latest

# Crea la struttura delle cartelle
mkdir -p app/dashboard/{admin,operatore,anonimo}
mkdir -p app/questionari/{strutture,operatori,giovani}
mkdir -p components/questionari
mkdir -p lib
mkdir -p utils
mkdir -p supabase/migrations
mkdir -p types

# Copia il file di dichiarazione dei tipi
cp ../types/headlessui.d.ts ./types/

# Aggiorna tailwind.config.js
echo 'module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@headlessui/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroicons/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms")
  ],
}' > tailwind.config.js

# Inizializza git
git init
git add .
git commit -m "Initial commit"

# Inizializza git e collega al repository remoto
git branch -M main
git remote add origin https://github.com/SiComunica/questionari.git
git push -u origin main

# Aggiungi tutti i file modificati
git add .

# Crea un commit descrittivo con tutte le modifiche fatte
git commit -m "Fix: Risolti errori TypeScript, aggiornate le icone e corretti i tipi dei form

- Aggiornato il tipo Database e spostato in types/database.ts
- Corretti i tipi nei form dei questionari
- Aggiornate le icone Heroicons
- Sistemato tsconfig.json con downlevelIteration
- Rimossi campi non necessari da QuestionarioOperatori
- Convertito famiglia_origine da array a stringa in QuestionarioGiovani"

# Pusha le modifiche per attivare il deploy
git push origin main

# Aggiungi questo comando
mv database.types.ts lib/database.types.ts