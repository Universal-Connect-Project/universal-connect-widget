const processEnv = {};
const envs = { ...process.env, ...process.client_envs };
Object.keys(envs).forEach((k) => {
  processEnv[k.toUpperCase()] = envs[k];
});
const config = {
  LogLevel: 'debug',
  Port: '8088',
  Env: 'pre', // mocked
  Version: '',
  CryptoAlgorithm: 'aes-256-cbc',

  SophtronAuthServiceEndpoint: 'https://auth.sophtron-prod.com/api',

  SophtronApiServiceEndpoint: 'https://api.sophtron-prod.com/api',
  SophtronVCServiceEndpoint: 'https://vc.sophtron-prod.com/api/',
  //SophtronVCServiceEndpoint: 'http://localhost:8083/api/',

  SophtronApiUserId: '8eaf206f-0bb5-4e1f-be34-474de1f3e336',
  SophtronApiUserSecret: 'MGNmODI1YWItODU5ZS00YTY3LWEzMDktY2EzYTYwODNlYzJl',

  MxClientId: '',
  MxApiSecret: '',
  MxClientIdProd: 'MDEmployees',
  MxApiSecretProd: '4582b747-34e9-4e3d-89e4-03963f391329',

  AkoyaClientId: '',
  AkoyaApiSecret: '',
  AkoyaClientIdProd: '',
  AkoyaApiSecretProd: '',

  FinicityPartnerId: '',
  FinicityAppKey: '',
  FinicitySecret: '',
  FinicityPartnerIdProd: '',
  FinicityAppKeyProd: '',
  FinicitySecretProd: '',
};

const arr = Object.keys(config);
for (let i = 0; i < arr.length; i++) {
  const key = arr[i];
  config[key] = processEnv[key.toUpperCase()] || config[key];
}
module.exports = config;
