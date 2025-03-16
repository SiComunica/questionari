# Usa l'immagine Node.js ufficiale come base
FROM node:18-alpine

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm ci

# Copia il resto dei file del progetto
COPY . .

# Compila l'applicazione
RUN npm run build

# Espone la porta 3000
EXPOSE 3000

# Avvia l'applicazione
CMD ["npm", "start"] 