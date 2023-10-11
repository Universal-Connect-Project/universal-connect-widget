FROM node:18 

WORKDIR /app

COPY ./ ./

RUN npm install --legacy-peer-deps
RUN npm run build
RUN sed -i '312s/.*/            return input;/' /app/node_modules/@capacitor-community/http/android/src/main/java/com/getcapacitor/plugin/http/HttpRequestHandler.java
RUN sed -i '35s/.*/return try JSONSerialization.jsonObject(with: data, options: [.mutableContainers, .fragmentsAllowed])/' /app/node_modules/@capacitor-community/http/ios/Plugin/HttpRequestHandler.swift
    
RUN npm install ts-node -g

ENV Env prod
ENV Port 8080
ENV ResourcePrefix 'local'

EXPOSE 8080

CMD [ "ts-node", "./server/server.js" ]