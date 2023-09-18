const processEnv = {};
const envs = {...process.env, ...process.client_envs};
Object.keys(envs).forEach((k) => {
  processEnv[k.toUpperCase()] = envs[k];
});
const config = {
  AuthServiceEndpoint: 'https://auth.sophtron-prod.com/api',
  SearchEndpoint: 'http://localhost:8082/api/',
  StorageEndpoint: 'http://localhost:8082/api/',
  // SearchEndpoint: 'https://search.sophtron-prod.com/api/',
  // AnalyticsServiceEndpoint: 'http://localhost:8081/api/',
  AnalyticsServiceEndpoint: 'https://analytics.sophtron-prod.com/api/',
  HostUrl: 'https://test.sophtron-prod.com',
  WebhookHostUrl: 'https://webhook.sophtron-prod.com',
  Component: 'UniversalWidget',
  ServiceName: 'universal_widget',
  Demo: true,
  DefaultProvider: 'sophtron',
  OrgName: 'sophtron',
  LogLevel: 'debug',
  Port: '8080',
  Env: 'pre', // mocked
  Version: '',
  UseAxios: true,
  CryptoKey: 'c42359fd32f1ce97c65d7636e82ec8646309df2b8d5e17282b80b23d213fa2c2', //crypto.randomBytes(32)
  CryptoIv: '453687d854d55101f001b5999b68bc3d', //crypto.randomBytes(16)
  CryptoAlgorithm: 'aes-256-cbc',
  ResourcePrefix: 'http://localhost:3000',
  // ResourcePrefix: 'http://192.168.111.217:3000',
  // ResourcePrefix: 'local', //
  ResourceVersion: '', // 'development'

  SophtronClientId: 'ba10bd5b-5387-47ff-a7f2-ae023b78a734',
  SophtronClientSecret: '',

};
const arr = Object.keys(config);
for (let i = 0; i < arr.length; i++) {
  const key = arr[i];
  config[key] = processEnv[key.toUpperCase()] || config[key];
}
module.exports = config;
