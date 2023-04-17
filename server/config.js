const processEnv = {};
Object.keys(process.env).forEach((k) => {
  processEnv[k.toUpperCase()] = process.env[k];
});

const config = {
  //SophtronSearchEndpoint: 'http://localhost:8081/api/',
  SophtronSearchEndpoint: 'https://search.sophtron-prod.com/api/',
  SophtronApiServiceEndpoint: 'https://api.sophtron-prod.com/api',
  SophtronVCServiceEndpoint: 'https://vc.sophtron-prod.com/api/',
  Demo: true,
  DefaultProvider: 'sophtron',
  OrgName: 'sophtron',
  LogLevel: 'debug',
  Port: '8080',
  Env: 'dev', // mocked
  Version: '',
  CryptoKey: 'c42359fd32f1ce97c65d7636e82ec8646309df2b8d5e17282b80b23d213fa2c2',
  CryptoIv: '453687d854d55101f001b5999b68bc3d',
  CryptoAlgorithm: 'aes-256-cbc',
  // ResourcePrefix: 'http://localhost:3000',
  ResourcePrefix: 'local', //
  ResourceVersion: '', // 'development'
  SophtronApiUserId: 'ba10bd5b-5387-47ff-a7f2-ae023b78a734',
  SophtronApiUserSecret: '',
  MxClientId:'861c3518-79df-4ed2-99cc-a21637694ea6',
  MxClientIdProd: 'cb102a7c-14a2-4b4a-8241-076d5eedd115',
  MxDemoUserIdProd: 'USR-753b539c-6281-4a71-b68b-347e68876035',
  MxDemoUserId: 'USR-0434788a-7791-49ac-8be7-503b587a0d5c',
  MxApiSecret: '', //mx-int credential for testing
  MxApiSecretProd: '',
};
const arr = Object.keys(config);
for (let i = 0; i < arr.length; i++) {
  const key = arr[i];
  config[key] = processEnv[key.toUpperCase()] || config[key];
}
module.exports = config;
