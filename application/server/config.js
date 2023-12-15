const processEnv = {};
const envs = { ...process.env, ...process.client_envs };
Object.keys(envs).forEach((k) => {
  processEnv[k.toUpperCase()] = envs[k];
});
const config = {
  AuthServiceEndpoint: 'https://auth.sophtron-prod.com/api',
  StorageEndpoint: 'https://search.sophtron-prod.com/api/',
  SearchEndpoint: 'https://search.sophtron-prod.com/api/',
  // SearchEndpoint: 'http://localhost:8082/api/',
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
  CryptoKey: '70eeaf77cd090702eb51d14375039b1750e45e128f984f3b53e1ae3b2ecd0926', //crypto.randomBytes(32).toString("hex");
  CryptoIv: '428df7351394e48641ba7f55febcbcf6', //crypto.randomBytes(16).toString("hex");
  CryptoAlgorithm: 'aes-256-cbc',
  ResourcePrefix: 'http://127.0.0.1:3000',
  // ResourcePrefix: 'local',
  ResourceVersion: '', // 'development'

  SophtronClientId: '8eaf206f-0bb5-4e1f-be34-474de1f3e336',
  SophtronClientSecret: 'MGNmODI1YWItODU5ZS00YTY3LWEzMDktY2EzYTYwODNlYzJl',
};
const arr = Object.keys(config);
for (let i = 0; i < arr.length; i++) {
  const key = arr[i];
  config[key] = processEnv[key.toUpperCase()] || config[key];
}
module.exports = config;
