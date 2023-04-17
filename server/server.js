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

const pageQueries = new RegExp([
  'current_institution_code',
  'client_guid',
  'current_member_guid',
  'current_provider',
  'oauth_referral_source'
].map(r => `\\$${r}`).join('|'), 'g');

if(config.ResourcePrefix !== 'local'){
  app.get('*', function (req, res) {
    logger.info(`serving resources from ${config.ResourcePrefix}`)
    req.metricsPath = '/catchall';
    const resourcePath = `${config.ResourcePrefix}${config.ResourceVersion}${req.path}`;
    if(req.path === '/'){
      http.wget(resourcePath).then(html => {
        if(req.query.current_member_guid && !req.query.current_provider){
          delete req.query.current_member_guid;
        }
        res.send(html.replaceAll(pageQueries, q => req.query[q.substring(1)] || ''));
      })
    }else{
      http.stream(resourcePath, null, res);
    }
    // if (req.path.indexOf('_next/webpack-hmr') === -1) {
    //   http.stream(resourcePath, null, res);
    // } else {
    //   res.sendStatus(404);
    // }
  });
}else{
  logger.info(`using local resources from "../build"`)
  const fs = require('fs');
  app.use('/', (req, res, next) => {
    if(req.path === '/'){
      fs.readFile(path.join(__dirname, '../', 'build', 'index.html'), 'utf8', (err, html) => {
        if(req.query.current_member_guid && !req.query.current_provider){
          delete req.query.current_member_guid;
        }
        res.send(html.replaceAll(pageQueries, q => req.query[q.substring(1)] || ''));
      })
    }else{
      next()
    }
  }, express.static(path.join(__dirname, '../build')));
}

app.listen(config.Port, () => {
  const message = `Server is running on port ${config.Port}, env: ${config.Env}`;
  logger.info(message);
});
