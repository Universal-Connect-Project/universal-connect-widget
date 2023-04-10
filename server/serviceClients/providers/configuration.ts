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
  demoUserId: config.MxDemoUserId,
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
  demoUserId: config.MxDemoUserIdProd,
};

export const sophtron = {
  clientId: config.SophtronApiUserId,
  secret: config.SophtronApiUserSecret,
};
