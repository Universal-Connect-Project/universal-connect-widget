const processEnv = {};
const envs = {...process.env, ...process.client_envs};

Object.keys(envs).forEach((k) => {
  processEnv[k.toUpperCase()] = envs[k];
});

const config = {
  AuthServiceEndpoint: 'http://localhost:8081/api',
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
  CryptoKey: '', //crypto.randomBytes(32).toString("hex");
  CryptoIv: '', //crypto.randomBytes(16).toString("hex");
  CryptoAlgorithm: 'aes-256-cbc',
  RedisServer: 'redis://localhost:6379',
  RedisCacheTimeSeconds: 600,
  ResourcePrefix: 'http://127.0.0.1:3000',
  // ResourcePrefix: 'local',
  ResourceVersion: '', // 'development'

  SophtronClientId: '',
  SophtronClientSecret: '',

  UcpAuthClientId: '',
  UcpAuthClientSecret: '',
  UcpEncryptionKey: ''

};

const arr = Object.keys(config);
for (let i = 0; i < arr.length; i++) {
  const key = arr[i];
  config[key] = processEnv[key.toUpperCase()] || config[key];
}

module.exports = config;