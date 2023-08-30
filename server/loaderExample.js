const { VcType } = require('../shared/contract.ts');
const {ConnectApi} = require('./connect/connectApi')

const http = require('./infra/http/index.js');
const config = require('./config');
const logger = require('./infra/logger');
const AuthClient = require('./serviceClients/authClient');
const {Config} = require('./providers')
const {encrypt} = require('./utils');
const crypto = require('crypto');

const authApi = new AuthClient();

const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch((err) => {
    logger.error('Error making example did-vc', err);
    res.status(500);
    res.send('Unexpected error, please refresh the page and try agin');
  });
};
module.exports = async function (app) {
  app.get('/example/getAuthCode', asyncHandler(async (req, res) => {
    const key = crypto.randomBytes(32).toString('hex');
    const iv = crypto.randomBytes(16).toString('hex');
    const payload = encrypt(JSON.stringify(Config), key, iv);
    const token = await authApi.secretExchange(payload);
    const str = `sophtron;${token.Token};${key};${iv}`
    const b64 = Buffer.from(str).toString('base64')
    res.send(b64)
  })),
  app.get(
    '/example/did/vc/identity/:provider/:id/:userId?',
    asyncHandler(async (req, res) => {
      const { userId, id, provider } = req.params;
      const service = new ConnectApi({context: {provider}});
      await service.init();
      if (id) {
        const data = await service.getVC(
          id,
          VcType.IDENTITY,
          userId
        );
        res.setHeader('content-type', 'application/json');
        res.send(data);
      } else {
        res.status(404).send('invalid id');
      }
    })
  );
  app.get(
    '/example/did/vc/banking/:provider/:id/:userId?',
    asyncHandler(async (req, res) => {
      const { userId, id, provider } = req.params;
      const service = new ConnectApi({context: {provider}});
      await service.init();
      if (id) {
        const data = await service.getVC(
          id,
          VcType.ACCOUNTS,
          userId
        );
        res.setHeader('content-type', 'application/json');
        res.send(data);
      } else {
        res.status(404).send('invalid id');
      }
    })
  );
  // app.get('/example/*', async (req, res) => {
  //   // console.log('loading default page');
  //   const resourcePath = `${config.ResourcePrefix}${
  //     config.ResourceVersion
  //   }/${req.path.replace('/example/', '').replace('did', 'loader')}.html`;
  //   logger.trace(`serving: ${resourcePath}`);
  //   await http
  //     .get(resourcePath)
  //     .then((r) => {
  //       res.setHeader('content-type', 'text/html');
  //       res.send(
  //         r.replace(
  //           '$did_demo',
  //           req.path.indexOf('did') > -1 ? 'true' : 'false'
  //         )
  //       );
  //     })
  //     .catch((err) => {
  //       res.sendStatus(500);
  //       logger.error(`Unable to load idnex resource from ${resourcePath}`, err);
  //     });
  // });
};
