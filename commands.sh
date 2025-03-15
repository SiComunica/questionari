# Crea un nuovo progetto Next.js
npx create-next-app@latest progetto-questionari --typescript --tailwind --app
cd progetto-questionari 

# Crea la struttura delle cartelle
mkdir -p app/dashboard/admin
mkdir -p app/dashboard/anonimo
mkdir -p app/dashboard/operatore
mkdir -p app/questionari
mkdir -p contexts
mkdir -p lib
mkdir -p types

# Installa le dipendenze
npm install @supabase/supabase-js @types/node @types/react @types/react-dom react react-dom next
npm install --save-dev typescript @types/node
npm install next-auth
npm install xlsx jspdf @react-pdf/renderer

# Inizializza git e collega al repository remoto
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SiComunica/questionari.git
git push -u origin main