# Étape de construction
FROM node:18-alpine as builder 

# Mettre à jour les dépôts et installer les dépendances
RUN apk update && \
    apk upgrade && \
    apk add --no-cache openssl

WORKDIR /app

# copier les fichier
# Copier les fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Mettre à jour les dépendances obsolètes
RUN npm update

# Copier les autres fichiers nécessaires
COPY . .

# Construction de l'application
RUN npm run build

# Étape de production
FROM node:18-alpine

# Mettre à jour les dépôts et installer les dépendances
RUN apk update && \
    apk upgrade && \
    apk add --no-cache openssl
    
WORKDIR /app

RUN npm install -g serve

# Copier les fichiers de l'étape de construction
COPY --from=builder /app/dist ./dist

# Exposer le port 3000
# EXPOSE 3000

# Commande d
CMD ["serve", "-s", "dist"]
