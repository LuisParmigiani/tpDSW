###############################################################
# Dockerfile para backend Node.js/TypeScript
# Construye y prepara la app para producción en Fly.io
#
# FASE 1: Build (compilación de TypeScript a JavaScript)
###############################################################

# Imagen base ligera con Node 20 para compilar
FROM node:20-alpine AS build           
# Directorio de trabajo dentro del contenedor
WORKDIR /app                           
# Copia archivos de dependencias
COPY package.json pnpm-lock.yaml ./    
# Instala dependencias de desarrollo y producción
RUN corepack enable && pnpm install --no-frozen-lockfile  
# Copia configuración de TypeScript
COPY tsconfig.json ./                  
# Copia el código fuente
COPY src ./src                         
# Compila TypeScript a JavaScript en /dist
RUN pnpm build                        

###############################################################
# FASE 2: Producción (solo ejecuta el código compilado)
###############################################################

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
# Expone el puerto 8080 (Fly.io lo usará)
EXPOSE 8080                           
# Comando para iniciar la app
CMD ["node","dist/app.js"]             

