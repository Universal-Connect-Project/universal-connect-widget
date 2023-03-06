import * as config from '../../config';

export const mx = {
  username: config.MxClientId,
  password: config.MxApiSecret,
  basePath: 'https://int-api.mx.com',
  baseOptions: {
    headers: {
      Accept: 'application/vnd.mx.api.v1+json',
    },
  },
  demoMemberId: config.MxDemoMemberId,
  demoUserId: config.MxDemoUserId,
};

export const sophtron = {
  clientId: config.SophtronApiUserId,
  secret: config.SophtronApiUserSecret,
};
