FROM node:18-alpine

WORKDIR /app

# Copia i file di configurazione
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice
COPY . .

# Compila l'applicazione
RUN npm run build

# Espone la porta 3000
EXPOSE 3000

# Avvia l'applicazione
CMD ["npm", "start"] 