# Etapa de construcción
FROM node:23.5.0-alpine AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del proyecto
COPY . .

# Construye la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Establece la zona horaria a Lima/Perú
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/America/Lima /etc/localtime \
    && echo "America/Lima" > /etc/timezone \
    && apk del tzdata

# Copia los archivos construidos desde la etapa de construcción
COPY --from=build /app/dist /usr/share/nginx/html

# Copia el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto de la aplicación
EXPOSE 8080

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]