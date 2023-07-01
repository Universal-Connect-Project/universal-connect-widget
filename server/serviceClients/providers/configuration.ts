import * as config from '../../config';

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

export const akoyaSandBox = {
  clientId: config.AkoyaClientId,
  secret: config.AkoyaApiSecret,
  basePath: 'sandbox-idp.ddp.akoya.com',
  productPath: 'sandbox-products.ddp.akoya.com',
  redirectUrl: config.AkoyaRedirectUrl,
  provider: 'akoya_sandbox'
}

export const akoyaProd = {
  clientId: config.AkoyaClientIdProd,
  secret: config.AkoyaApiSecretProd,
  basePath: 'idp.ddp.akoya.com',
  productPath: 'products.ddp.akoya.com',
  redirectUrl: config.AkoyaRedirectUrlProd,
  provider: 'akoya'
}

export const sophtron = {
  clientId: config.SophtronApiUserId,
  secret: config.SophtronApiUserSecret,
};
