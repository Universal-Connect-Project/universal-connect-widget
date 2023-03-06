const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');
const { contextHandler } = require('./infra/context.ts');
const api = require('./api');
const http = require('./serviceClients/http');
const logger = require('./infra/logger');
const example = require('./loaderExample');
const useConnect = require('./connect/connectApiExpress');
process.on('unhandledRejection', (error) => {
  logger.error(`unhandledRejection: ${error.message}`, error);
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/static/*", function (req, res) {
//     req.metricsPath = '/static'
//     var resourcePath = `${config.ResourcePrefix}${config.ResourceVersion}${req.path.replace('/static', '')}`;
//     http.stream(resourcePath, null, res)
// })
app.get('/ping', function (req, res) {
  res.send('ok');
});

if (config.env !== 'prod') {
  example(app);
}

useConnect(app)

Object.keys(api).forEach((key) => {
  app.post(`/api/${key}`, contextHandler, (req, res) => {
    // console.log(req.body);
    const promise = api[key](req, res);
    logger.info(`Api request handler invoked: ${req.path}`);
    if (promise.catch) {
      promise.catch((err) => {
        logger.error(`Api request handler error: ${req.path}`, err);
        res
          .status(
            err.httpCode || ((err.response || {}).status === 401 ? 401 : 500)
          )
          .send({ error: { message: err.message } });
        if (err.response && err.response.data) {
          logger.debug(err.response.data);
        }
      });
    }
  });
});

if(config.ResourcePrefix !== 'local'){
  app.get('*', function (req, res) {
    logger.info(`serving resources from ${config.ResourcePrefix}`)
    req.metricsPath = '/catchall';
    const resourcePath = `${config.ResourcePrefix}${config.ResourceVersion}${req.path}`;
    if (req.path.indexOf('_next/webpack-hmr') === -1) {
      http.stream(resourcePath, null, res);
    } else {
      res.sendStatus(404);
    }
  });
}else{
  logger.info(`using local resources from "../out"`)
  app.use('/', express.static(path.join(__dirname, '../out')));
}


app.listen(config.Port, () => {
  const message = `Server is running on port ${config.Port}, env: ${config.Env}`;
  logger.info(message);
});
