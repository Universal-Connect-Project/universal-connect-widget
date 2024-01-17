const config = require('./config');

module.exports = {
  mxInt: {
    username: config.MxClientId,
    password: config.MxApiSecret,
    basePath: 'https://int-api.mx.com',
    vcEndpoint: 'https://int-api.mx.com/',
    provider: 'mx_int',
    available: true
  },
  mxProd: {
    username: config.MxClientIdProd,
    password: config.MxApiSecretProd,
    basePath: 'https://api.mx.com',
    vcEndpoint: 'https://api.mx.com/',
    provider: 'mx',
    available: true
  },
  akoyaSandbox: {
    clientId: config.AkoyaClientId,
    secret: config.AkoyaApiSecret,
    basePath: 'sandbox-idp.ddp.akoya.com',
    productPath: 'sandbox-products.ddp.akoya.com',
    provider: 'akoya_sandbox',
    available: true
  },
  akoyaProd: {
    clientId: config.AkoyaClientIdProd,
    secret: config.AkoyaApiSecretProd,
    basePath: 'idp.ddp.akoya.com',
    productPath: 'products.ddp.akoya.com',
    provider: 'akoya',
    available: true
  },
  finicitySandbox: {
    basePath: 'https://api.finicity.com',
    partnerId: config.FinicityPartnerId,
    appKey: config.FinicityAppKey,
    secret: config.FinicitySecret,
    provider: 'finicity_sandbox',
    available: true
  },
  finicityProd: {
    basePath: 'https://api.finicity.com',
    partnerId: config.FinicityPartnerIdProd,
    appKey: config.FinicityAppKeyProd,
    secret: config.FinicitySecretProd,
    provider: 'finicity',
    available: true
  },
  sophtron: {
    clientId: config.SophtronApiUserId,
    secret: config.SophtronApiUserSecret,
    endpoint: config.SophtronApiServiceEndpoint,
    vcEndpoint: config.SophtronVCServiceEndpoint,
    provider: 'sophtron',
    available: true
  },
}
