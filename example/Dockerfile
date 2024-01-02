FROM node:17

WORKDIR /app

COPY ./application ./

RUN rm -f package-lock.json
RUN rm -f pnpm-lock.yaml
RUN npm install 
RUN npm install -g ts-node 

ENV Env prod

EXPOSE 8080
CMD ts-node ./index.js