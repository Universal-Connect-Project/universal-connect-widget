FROM node:17

WORKDIR /app

COPY ./application ./

RUN rm -f package-lock.json
RUN rm -f pnpm-lock.yaml
RUN npm install 

ENV Env prod

EXPOSE 8080
CMD node ./index.js