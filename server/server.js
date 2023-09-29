const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');
const http = require('./infra/http');
const logger = require('./infra/logger');
const useConnect = require('./connect/connectApiExpress');
const useVcs = require('./incubationVcs/vcsServiceExpress');
const {readFile} = require('./utils/fs');
const RateLimit = require('express-rate-limit');

process.on('unhandledRejection', (error) => {
  logger.error(`unhandledRejection: ${error.message}`, error);
});
process.removeAllListeners('warning'); // remove the noise caused by capacitor-community/http fetch plugin
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var limiter = RateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5000, // max average 500 requests per windowMs
});
app.use(limiter);

app.get('/ping', function (req, res) {
  res.send('ok');
});

useConnect(app);
// useVcs(app);

const pageQueries = new RegExp([
  'current_institution_code',
  'job_type',
  'scheme',
  'auth',
  'user_id',
  'client_guid',
  'current_member_guid',
  'current_provider',
  'oauth_referral_source',
  'single_account_select',
  'update_credentials',
  'server',
  'is_mobile_webview',
].map(r => `\\$${r}`).join('|'), 'g');
function renderDefaultPage(req, res, html){
  if(req.query.current_member_guid && !req.query.current_provider){
    delete req.query.current_member_guid;
  }
  let queries = {
    current_member_guid: req.query.connection_id,
    current_institution_code: req.query.bankid,
    ...req.query,
  }
  res.send(html.replaceAll(pageQueries, q => encodeURIComponent(queries[q.substring(1)] || '')));
}
if(config.ResourcePrefix !== 'local'){
  app.get('/', function (req, res) {
    logger.info(`serving resources from ${config.ResourcePrefix}`)
    req.metricsPath = '/catchall';
    const resourcePath = `${config.ResourcePrefix}${config.ResourceVersion}${req.path}`;
    http.wget(resourcePath).then(html => renderDefaultPage(req, res, html))
  })
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
  logger.info(`using local resources from "../build"`)
  app.get('/', async (req, res) => {
    const filePath = path.join(__dirname, '../', 'build', 'index.html');
    const html = await readFile(filePath);
    renderDefaultPage(req, res, html);
  });
  app.get('*', express.static(path.join(__dirname, '../build')))
}

app.listen(config.Port, () => {
  const message = `Server is running on port ${config.Port}, env: ${config.Env}`;
  logger.info(message);
});
