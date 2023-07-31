import * as config from '../config';

export const mxInt = {
  username: config.MxClientId,
  password: config.MxApiSecret,
  basePath: 'https://int-api.mx.com',
  baseOptions: {
    headers: {
      Accept: 'application/vnd.mx.api.v1+json',
    },
  },
};

export const mxProd = {
  username: config.MxClientIdProd,
  password: config.MxApiSecretProd,
  basePath: 'https://api.mx.com',
  baseOptions: {
    headers: {
      Accept: 'application/vnd.mx.api.v1+json',
    },
  },
};

export const akoyaSandbox = {
  clientId: config.AkoyaClientId,
  secret: config.AkoyaApiSecret,
  basePath: 'sandbox-idp.ddp.akoya.com',
  productPath: 'sandbox-products.ddp.akoya.com',
  provider: 'akoya_sandbox'
}

export const akoyaProd = {
  clientId: config.AkoyaClientIdProd,
  secret: config.AkoyaApiSecretProd,
  basePath: 'idp.ddp.akoya.com',
  productPath: 'products.ddp.akoya.com',
  provider: 'akoya'
}

export const finicitySandbox = {
  basePath: 'https://api.finicity.com',
  partnerId: config.FinicityPartnerId,
  appKey: config.FinicityAppKey,
  secret: config.FinicitySecret,
  provider: 'finicity_sandbox'
}

export const finicityProd = {
  basePath: 'https://api.finicity.com',
  partnerId: config.FinicityPartnerIdProd,
  appKey: config.FinicityAppKeyProd,
  secret: config.FinicitySecretProd,
  provider: 'finicity'
}

export const sophtron = {
  clientId: config.SophtronApiUserId,
  secret: config.SophtronApiUserSecret,
};
