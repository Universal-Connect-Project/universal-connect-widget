const processEnv = {};
const envs = {...process.env, ...process.client_envs};

Object.keys(envs).forEach((k) => {
  processEnv[k.toUpperCase()] = envs[k];
});

const config = {
  AuthServiceEndpoint: 'https://login.universalconnectproject.org/api',
  SearchEndpoint: 'https://search.universalconnectproject.org/api/',
  AnalyticsServiceEndpoint: 'https://analytics.universalconnectproject.org/api/',
  HostUrl: 'https://test.universalconnectproject.org',
  WebhookHostUrl: 'https://webhook.universalconnectproject.org',
  Component: 'UniversalWidget',
  ServiceName: 'universal_widget',
  Demo: true,
  DefaultProvider: 'sophtron',
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

  SophtronClientId: '', //sophtron.com -> api settings -> direct auth -> UserId
  SophtronClientSecret: '',  //sophtron.com -> api settings -> direct auth -> AccessKey

  UcpAuthClientId: '', // https://login.universalconnectproject.org/
  UcpAuthClientSecret: '',
  UcpAuthEncryptionKey: ''

};

const arr = Object.keys(config);
for (let i = 0; i < arr.length; i++) {
  const key = arr[i];
  config[key] = processEnv[key.toUpperCase()] || config[key];
}

module.exports = config;