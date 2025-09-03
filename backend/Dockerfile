###############################################################
# Dockerfile para backend Node.js/TypeScript
# Construye y prepara la app para producción en Fly.io
#
# FASE 1: Build (compilación de TypeScript a JavaScript)
###############################################################

########################################
# Etapa de build: compila TypeScript   #
########################################
FROM node:20-alpine AS build
WORKDIR /app
# Instalar dependencias con npm
COPY package.json ./
RUN npm install
# Copiar código y compilar
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

###############################################################
# FASE 2: Producción (solo ejecuta el código compilado)
###############################################################

<<<<<<< HEAD
# Imagen base ligera para producción
FROM node:20-alpine                   
# Directorio de trabajo
WORKDIR /app                          
# Variable de entorno para modo producción
ENV NODE_ENV=production               
# Copia archivos de dependencias
COPY package.json pnpm-lock.yaml ./   
# Instala solo dependencias de producción
RUN corepack enable && pnpm install --prod --no-frozen-lockfile  
# Copia el código compilado desde la fase de build
COPY --from=build /app/dist ./dist    
=======
# Etapa de producción: solo artefactos
FROM node:20-alpine
# Directorio de trabajo
