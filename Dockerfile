# FROM node:14 as build-frontend
# WORKDIR /app
# COPY ./frontend/src ./src
# COPY ./frontend/*.* ./

# RUN npm install
# RUN npm run build

#FROM node:17 AS build
FROM node:17 

# Create app directory
WORKDIR /app

# ARG NPM_TOKEN  
# COPY npmrc .npmrc  
COPY ./ ./

RUN npm install --legacy-peer-deps
RUN npm install ts-node -g
RUN npm run build-client
#RUN npm run build-server

# FROM build
# WORKDIR /app
# COPY ./server/dist/ ./

#COPY --from=build-frontend /app/dist ./views

ENV Env prod
ENV ResourcePrefix 'local'

EXPOSE 8080
#ENTRYPOINT ["./entrypoint.sh"]

CMD [ "ts-node", "./server/server.js" ]