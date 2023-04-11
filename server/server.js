const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');
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

app.get('/ping', function (req, res) {
  res.send('ok');
});

if (config.env !== 'prod') {
  example(app);
}

useConnect(app)

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
