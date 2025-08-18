ARG NODE_VERSION=22.11.0

FROM node:${NODE_VERSION}-alpine as build

RUN apk add --no-cache python3 py3-pip make build-base \
                       gcc libc-dev libffi-dev abuild \
                       binutils binutils-doc gcc-doc \
                       linux-headers tini

# Establece el directorio de trabajo en /app
WORKDIR /app

ARG NODE_ENV
ARG CHAIN_ID
ARG RPC_HTTP
ARG ZERODEV_PROJECT_ID
ARG ZERODEV_BUNDLER_RPC
ARG ZERODEV_PAYMASTER_RPC
ARG ZERODEV_PASSKEY_URL
ARG OPENSEA_URL

# Define los argumentos de construcción para las credenciales de npm
ARG NPM_TOKEN
# Configura el archivo .npmrc para usar el token
RUN echo "${NPM_TOKEN}" >> ~/.npmrc

COPY package.json package.json
COPY package-lock.json package-lock.json

COPY apps/demo/package.json apps/demo/package.json

RUN --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

# Copia todo el contenido del proyecto al directorio de trabajo
COPY . .

###
# Update this part if the Player application has new VITE_* to compile in the dist folder
###
ENV VITE_NODE_ENV=${NODE_ENV}
ENV VITE_CHAIN_ID=${CHAIN_ID}
ENV VITE_RPC_HTTP=${RPC_HTTP}
ENV VITE_ZERODEV_PROJECT_ID=${ZERODEV_PROJECT_ID}
ENV VITE_ZERODEV_BUNDLER_RPC=${ZERODEV_BUNDLER_RPC}
ENV VITE_ZERODEV_PAYMASTER_RPC=${ZERODEV_PAYMASTER_RPC}
ENV VITE_ZERODEV_PASSKEY_URL=${ZERODEV_PASSKEY_URL}
ENV VITE_OPENSEA_URL=${OPENSEA_URL}

# Construye el proyecto para producción
RUN npx ultra-runner --r --build

# Etapa 2: Servidor web
FROM nginx:alpine

# Copia los archivos construidos desde la etapa anterior
COPY --from=build /app/apps/demo/dist /usr/share/nginx/html

# Copia la configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto 80
EXPOSE 80

# Inicia nginx cuando se levante el contenedor
CMD ["nginx", "-g", "daemon off;"]