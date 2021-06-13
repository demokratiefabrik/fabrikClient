# develop stage
FROM node:lts-alpine as develop-stage
WORKDIR /app
COPY package*.json ./

# RUN npm install
RUN yarn --silent
RUN yarn --silent global add @quasar/cli
# copy everything but the node-modules directory (which is ignored in .dockerignore file)
COPY . .
COPY .env.production .env

# build stage
FROM develop-stage as build-stage
RUN quasar build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

# REplace NGINX CONF
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80
COPY start-server-nginx.sh /
RUN chmod +x ./start-server-nginx.sh
CMD ["./start-server-nginx.sh"]

# CMD ["nginx", "-g", "daemon off;"]