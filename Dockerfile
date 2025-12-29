FROM node:22-slim AS deps

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
FROM node:22-slim

WORKDIR /app

# Necesario para healthcheck (docker-compose usa `curl`)
RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

#PROD
# Etapa 1: Build
#FROM node:22-slim AS build
#
#WORKDIR /app
#
#COPY package*.json ./
#RUN npm install
#
#COPY . .
#RUN npm run build
#
## Etapa 2: Producción
#FROM node:22-slim
#
#WORKDIR /app
#
#COPY package*.json ./
#RUN npm install --omit=dev
#
## Solo copia el código compilado y lo necesario
#COPY --from=build /app/dist ./dist
#
#EXPOSE 3000
#
#CMD ["node", "dist/main"]