FROM node:18

WORKDIR /app

COPY ./ ./

RUN npm install --legacy-peer-deps
RUN npm run build
RUN npm install -g serve

ENV Env prod
ENV Port 3000
ENV ResourcePrefix 'local'

EXPOSE 3000

CMD serve -s build