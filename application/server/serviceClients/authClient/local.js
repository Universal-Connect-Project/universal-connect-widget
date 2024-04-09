// This is an example of the simplest scenario when the widget is hosted and used in the same secure domain
// where as the provider credentials are safe to be stored in the widget server, hence as soon as the auth token is valid
// Or no auth token needed at all, 
// simply return the provider credentials, coppied from : 
// const providerConfig = require('../../../../example/application/configuration')

const {decrypt} = require('../../utils');
const config = require('../../config');

export class AuthClient {
  token;
  constructor(token){
    this.token = token;
  }

  async getSecretExchange(iv){

    const key = Buffer.from(config.LocalAuthEncryptionKey, 'base64').toString('hex')
    const token = decrypt(this.token, key, iv);
    // if token is valid, or use your own way to validate the token.
    if(token === config.LocalAuthPhrase){ 
      return {
        mxInt: {
          username: process.env.MxClientId,
          password: process.env.MxApiSecret,
          basePath: 'https://int-api.mx.com',
          vcEndpoint: 'https://int-api.mx.com/',
          provider: 'mx_int',
          available: true
        },
        mxProd: {
          username: process.env.MxClientIdProd,
          password: process.env.MxApiSecretProd,
          basePath: 'https://api.mx.com',
          vcEndpoint: 'https://api.mx.com/',
          provider: 'mx',
          available: true
        },
        akoyaSandbox: {
          clientId: process.env.AkoyaClientId,
          secret: process.env.AkoyaApiSecret,
          basePath: 'sandbox-idp.ddp.akoya.com',
          productPath: 'sandbox-products.ddp.akoya.com',
          provider: 'akoya_sandbox',
          available: true
        },
        akoyaProd: {
          clientId: process.env.AkoyaClientIdProd,
          secret: process.env.AkoyaApiSecretProd,
          basePath: 'idp.ddp.akoya.com',
          productPath: 'products.ddp.akoya.com',
          provider: 'akoya',
          available: true
        },
        finicitySandbox: {
          basePath: 'https://api.finicity.com',
          partnerId: process.env.FinicityPartnerId,
          appKey: process.env.FinicityAppKey,
          secret: process.env.FinicitySecret,
          provider: 'finicity_sandbox',
          available: true
        },
        finicityProd: {
          basePath: 'https://api.finicity.com',
          partnerId: process.env.FinicityPartnerIdProd,
          appKey: process.env.FinicityAppKeyProd,
          secret: process.env.FinicitySecretProd,
          provider: 'finicity',
          available: true
        },
        sophtron: {
          clientId: process.env.SophtronApiUserId,
          secret: process.env.SophtronApiUserSecret,
          endpoint: process.env.SophtronApiServiceEndpoint,
          vcEndpoint: process.env.SophtronVCServiceEndpoint,
          provider: 'sophtron',
          available: true
        },
      };
    }
    return {}
  }
};

