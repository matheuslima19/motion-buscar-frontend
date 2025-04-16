# Etapa 1: Construção do Build com Node.js
FROM node:18-alpine as build

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json para o container
COPY package*.json ./ 

# Instala as dependências
RUN npm install

# Copia todos os arquivos do projeto para o container
COPY . .

# Executa o build da aplicação React
RUN npm run build

# Etapa 2: Servir os arquivos estáticos com Nginx
FROM nginx:alpine

# Copia o arquivo de configuração do Nginx com suporte a SSL
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os certificados SSL para dentro do container
COPY ./fullchain.pem /etc/ssl/certs/fullchain.pem
COPY ./domain.key /etc/ssl/private/domain.key


# Copia os arquivos do build para o diretório de onde o Nginx irá servir
COPY --from=build /app/build /usr/share/nginx/html

# Expõe as portas 80 (HTTP) e 443 (HTTPS)
EXPOSE 80 443

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
