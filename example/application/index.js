const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');
const logger = require('./infra/logger');
const crypto = require('crypto');
const {encrypt} = require('./utils');
const ProviderCredentials = require('./configuration.js')
const {AuthClient} = require('./serviceClients/sophtronClient/auth.js');
const SophtronClient = require('./serviceClients/sophtronClient');
const GetSophtronVc = require('./providers/sophtron');
const GetMxVc = require('./providers/mx');
const GetAkoyaVc = require('./providers/akoya');
const GetFinicityVc = require('./providers/finicity');

process.on('unhandledRejection', (error) => {
  logger.error(`unhandledRejection: ${error.message}`, error);
});
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

function getVc(provider, id, type, userId){
  switch(provider){
    case 'mx':
      return GetMxVc(id, type, userId);
    case 'akoya':
      return GetAkoyaVc(id, type, userId);
    case 'finicity':
      return GetFinicityVc(id, type, userId);
    case 'sophtron':
      return GetSophtronVc(id, type, userId);
  }
}

app.get('/example/getAuthCode', asyncHandler(async (req, res) => {
  const uuid = Buffer.from(config.SophtronApiUserSecret, 'base64').toString('utf-8');
  const key = Buffer.from(uuid.replaceAll('-', '')).toString('hex');
  const iv = crypto.randomBytes(16).toString('hex');
  const payload = encrypt(JSON.stringify(ProviderCredentials), key, iv);
  const token = await authApi.secretExchange(payload);
  const str = `sophtron;${token.Token};${iv}`
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
      res.send(data);
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
      res.send(data);
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
        id,
        'transactions',
        userId
      );
      res.setHeader('content-type', 'application/json');
      res.send(data);
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
