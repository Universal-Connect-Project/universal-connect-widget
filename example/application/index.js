const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');
const logger = require('./infra/logger');
const crypto = require('crypto');
const {encrypt} = require('./utils');
const ProviderCredentials = require('./configuration.js')
const {AuthClient} = require('./serviceClients/authClient');
const SophtronClient = require('./serviceClients/sophtronClient');
const {GetSophtronVc} = require('./providers/sophtron');
const {GetMxIntVc, GetMxProdVc} = require('./providers/mx');
const GetAkoyaVc = require('./providers/akoya');
const GetFinicityVc = require('./providers/finicity');

process.on('unhandledRejection', (error) => {
  logger.error(`unhandledRejection: ${error.message}`, error);
});
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (err, req, res, next) {
  if(err){
    logger.err("Unhandled error: ", err);
    res.status(500);
    res.send(err.message);
  }
});

app.get('/ping', function (req, res) {
  res.send('ok');
});

const authApi = new AuthClient();
const sophtronClient = new SophtronClient(ProviderCredentials.sophtron);

const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch((err) => {
    logger.error('Error making example did-vc', err);
    res.status(500);
    res.send('Unexpected error, please refresh the page and try agin');
  });
};

function getVc(provider, id, type, userId, account_id){
  logger.info(`Getting vc from provider: ${provider}`)
  switch(provider){
    case 'mx':
      return GetMxProdVc(id, type, userId, account_id);
    case 'mx-int':
    case 'mx_int':
      return GetMxIntVc(id, type, userId, account_id);
    case 'akoya':
      return GetAkoyaVc(id, type, userId, account_id);
    case 'finicity':
      return GetFinicityVc(id, type, userId, account_id);
    case 'sophtron':
      return GetSophtronVc(id, type, userId, account_id);
  }
}

function parseVc(jwt){
  if(!jwt){
    return '';
  }
  if(jwt.startsWith('{')){
    return jwt; //it's actually json, for backward compatiblity
  }
  let payload = jwt.split('.')[1];
  return Buffer.from(payload, 'base64').toString('utf-8')
}

app.get('/example/getAuthCode', asyncHandler(async (req, res) => {
  const key = Buffer.from(config.UcpEncryptionKey, 'base64').toString('hex');
  const iv = crypto.randomBytes(16).toString('hex');
  const payload = encrypt(JSON.stringify(ProviderCredentials), key, iv);
  const token = await authApi.secretExchange(payload);
  const str = `ucp;${token.Token};${iv}`
  const b64 = Buffer.from(str).toString('base64')
  res.send(b64)
})),

app.get('/example/data/identity/:id/:userId', asyncHandler(async (req, res) => {
  const { userId, id } = req.params;
  let ret = await sophtronClient.getUserInstitutionById(id);
  res.send(ret);
})),

app.get('/example/data/accounts/:id/:userId', asyncHandler(async (req, res) => {
  const { userId, id } = req.params;
  let ret = await sophtronClient.getUserInstitutionAccounts(id);
  res.send(ret);
})),

app.get('/example/did/vc/identity/:provider/:id/:userId?',
  asyncHandler(async (req, res) => {
    const { userId, id, provider } = req.params;
    if (id) {
      const data = await getVc(
        provider,
        id,
        'identity',
        userId
      );
      res.setHeader('content-type', 'application/json');
      res.send(parseVc(data));
    } else {
      res.status(404).send('invalid id');
    }
  })
);

app.get('/example/did/vc/accounts/:provider/:id/:userId?',
  asyncHandler(async (req, res) => {
    const { userId, id, provider } = req.params;
    if (id) {
      const data = await getVc(
        provider,
        id,
        'banking',
        userId
      );
      res.setHeader('content-type', 'application/json');
      res.send(parseVc(data));
    } else {
      res.status(404).send('invalid id');
    }
  })
);

app.get('/example/did/vc/transactions/:provider/:id/:userId?',
  asyncHandler(async (req, res) => {
    const { userId, id, provider } = req.params;
    if (id) {
      const data = await getVc(
        provider,
        null,//get transactions doesn't need memberId/connectionId, 
        'transactions',
        userId,
        id 
      );
      res.setHeader('content-type', 'application/json');
      res.send(parseVc(data));
    } else {
      res.status(404).send('invalid id');
    }
  })
);

app.get('*', express.static(path.join(__dirname, './public')))

app.listen(config.Port, () => {
  const message = `Server is running on port ${config.Port}, env: ${config.Env}`;
  logger.info(message);
});
