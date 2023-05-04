const processEnv = {};
const envs = {...process.env, ...process.client_envs};
Object.keys(envs).forEach((k) => {
  processEnv[k.toUpperCase()] = envs[k];
});
const config = {
  //SophtronSearchEndpoint: 'http://localhost:8081/api/',
  SophtronSearchEndpoint: 'https://search.sophtron-prod.com/api/',
  SophtronApiServiceEndpoint: 'https://api.sophtron-prod.com/api',
  SophtronVCServiceEndpoint: 'https://vc.sophtron-prod.com/api/',
  HostUrl: 'http://localhost:8080',
  Demo: true,
  DefaultProvider: 'sophtron',
  OrgName: 'sophtron',
  LogLevel: 'debug',
  Port: '8080',
  Env: 'pre', // mocked
  Version: '',
  CryptoKey: 'c42359fd32f1ce97c65d7636e82ec8646309df2b8d5e17282b80b23d213fa2c2',
  CryptoIv: '453687d854d55101f001b5999b68bc3d',
  CryptoAlgorithm: 'aes-256-cbc',
  ResourcePrefix: 'http://localhost:3000',
  // ResourcePrefix: 'http://192.168.111.217:3000',
  // ResourcePrefix: 'local', //
  ResourceVersion: '', // 'development'
  SophtronApiUserId: 'ba10bd5b-5387-47ff-a7f2-ae023b78a734',
  SophtronApiUserSecret: '',
  MxClientId:'861c3518-79df-4ed2-99cc-a21637694ea6',
  MxClientIdProd: 'cb102a7c-14a2-4b4a-8241-076d5eedd115',
  MxApiSecret: '', //mx-int credential for testing
  MxApiSecretProd: '',
};
const arr = Object.keys(config);
for (let i = 0; i < arr.length; i++) {
  const key = arr[i];
  config[key] = processEnv[key.toUpperCase()] || config[key];
}
module.exports = config;
