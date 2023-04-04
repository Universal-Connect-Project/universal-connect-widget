const processEnv = {};
Object.keys(process.env).forEach((k) => {
  processEnv[k.toUpperCase()] = process.env[k];
});

const providerMapping = [
  {'name': 'American Express Credit Card', id: 'amex', provider: 'mx' },
  {'name': 'Chase Bank', id: 'chase', provider: 'mx' },
  {'name': 'Chase', id: 'chase', provider: 'mx' },
  {'name': 'Citi Bank', id: 'citibank', provider: 'mx' },
  {'name': 'Citi', id: 'citibank', provider: 'sophtron' },
  {'name': 'Wells Fargo', id: 'wells_fargo', provider: 'mx' },
  {'name': 'Wells Fargo Bank', id: 'wells_fargo', provider: 'mx' },
];

const demoBanks = [
  {
    id: '4b2eca34-a729-438f-844c-ba8ce51047f9',
    name: 'Citibank',
    url: 'https://online.citi.com/US/login.do',
    logo_url: 'https://sophtron.com/images/banklogos/citibank.png ',
    provider: 'sophtron',
  },
  // {
  //   id: 'citibank',
  //   name: 'Citibank',
  //   url: 'https://online.citi.com/US/login.do',
  //   logo_url: 'https://sophtron.com/images/banklogos/citibank.png ',
  //   provider: 'mx',
  // },
  {
    id: 'b2a957e5-7bf2-47c0-bd63-ce96736cdacd',
    name: 'Chase Bank',
    url: 'https://www.chase.com/',
    logo_url: 'https://sophtron.com/images/banklogos/chase.png',
    provider: 'sophtron',
  },
  // {
  //   id: 'chase',
  //   name: 'Chase Bank',
  //   url: 'https://www.chase.com/',
  //   logo_url: 'https://sophtron.com/images/banklogos/chase.png',
  //   provider: 'mx',
  // },
  {
    id: 'e3d4c866-1c48-44c3-9cc5-5e9c7db43ef0',
    name: 'Wells Fargo',
    url: 'https://connect.secure.wellsfargo.com/auth/login/present?origin=tpb',
    logo_url: 'https://sophtron.com/images/banklogos/wells%20fargo.png',
    provider: 'sophtron',
  },
  // {
  //   id: 'wells_fargo',
  //   name: 'Wells Fargo',
  //   url: 'https://connect.secure.wellsfargo.com/auth/login/present?origin=tpb',
  //   logo_url: 'https://sophtron.com/images/banklogos/wells%20fargo.png',
  //   provider: 'mx',
  // },
  // {
  //   id: '40a24f71-16e4-411c-b6e4-05b55577b66e',
  //   name: 'Ally Bank',
  //   url: 'https://www.ally.com',
  //   logo_url: 'https://sophtron.com/images/banklogos/ally%20bank.png',
  //   provider: 'mx',
  // },
  {
    id: '3e9fbc88-be07-4478-9a4c-9d3061d5d6d4',
    name: 'Bank of America',
    url: 'https://connect.bnymellon.com/ConnectLogin/login/LoginPage.jsp',
    logo_url:
      'https://logos-list.s3-us-west-2.amazonaws.com/bank_of_america_logo.png',
    provider: 'sophtron',
  },
  {
    id: '227d9de3-7c18-4781-97a0-ce2ecefb1b7a',
    name: 'Barclays',
    url: 'https://www.securebanking.barclaysus.com/',
    logo_url: 'https://sophtron.com/images/banklogos/barclays.png',
    provider: 'sophtron',
  },
  {
    id: '7da0e182-a2f3-41f1-84e2-4b6f5b8112e5',
    name: 'BB&T',
    url: 'https://www.bbt.com/online-access/online-banking/default.page',
    logo_url: 'https://sophtron.com/images/banklogos/bbt.png',
    provider: 'sophtron',
  },
  {
    id: '0d8a29dd-4c28-4364-a493-b508f0a84758',
    name: 'Capital One',
    url: 'https://www.capitalone.com/',
    logo_url: 'https://sophtron.com/images/banklogos/capital%20one.png',
    provider: 'sophtron',
  },
  {
    id: '3d7671e4-36be-4266-971e-b50d33001382',
    name: 'Charles Schwab',
    url: 'https://client.schwab.com/Login/SignOn/CustomerCenterLogin.aspx',
    logo_url: 'https://sophtron.com/images/banklogos/charles%20schwab.png',
    provider: 'sophtron',
  },
  {
    id: 'd06b4cb4-d11f-47cf-92bd-6d0fe52760b1',
    name: 'USAA',
    url: 'https://www.usaa.com/inet/ent_logon/Logon',
    logo_url: 'https://sophtron.com/images/banklogos/usaa.png',
    provider: 'sophtron',
  },
  {
    id: '71ec5788-adf0-43a4-b1dd-8d5958a0d13c',
    name: 'Fifth Third Bank ',
    url: 'http://www.53.com/content/fifth-third/en/login.html',
    logo_url:
      'https://logos-list.s3-us-west-2.amazonaws.com/fifth_third_bank_logo.png',
    provider: 'sophtron',
  },
  {
    id: 'd03878fe-5b40-4b4d-95fc-c48d92105888',
    name: 'GoldMan Sachs',
    url: 'https://www.goldman.com/',
    logo_url: 'https://sophtron.com/images/banklogos/goldman%20sachs.png',
    provider: 'sophtron',
  },
  {
    id: 'c155dab2-9133-4df3-a28e-b862af43bb38',
    name: 'HSBC Bank',
    url: 'https://www.services.online-banking.us.hsbc.com/',
    logo_url: 'https://sophtron.com/images/banklogos/hsbc%20bank.png',
    provider: 'sophtron',
  },
  {
    id: 'abd4059c-adf1-4f16-b493-37767f6cf233',
    name: 'Morgan Stanley',
    url: 'https://www.morganstanleyclientserv.com/',
    logo_url: 'https://sophtron.com/images/banklogos/morgan%20stanley.png',
    provider: 'sophtron',
  },
  {
    id: '13793b9f-2ebf-4f31-815e-7dfe38e906c4',
    name: 'PNC Bank',
    url: 'https://www.pnc.com/en/personal-banking/banking/online-and-mobile-banking.html',
    logo_url: 'https://logos-list.s3-us-west-2.amazonaws.com/pnc_bank_logo.png',
    provider: 'sophtron',
  },
  {
    id: '86e1f8a0-5963-4125-9999-ccbe44d5940e',
    name: 'State Street',
    url: 'https://www.statestreetbank.com/online-banking',
    logo_url: 'https://sophtron.com/images/banklogos/state%20street.png',
    provider: 'sophtron',
  },
  {
    id: '8275fc09-149b-4849-8a31-51ef9ba8eb6d',
    name: 'SunTrust',
    url: 'https://onlinebanking.suntrust.com/',
    logo_url: 'https://logos-list.s3-us-west-2.amazonaws.com/suntrust_logo.png',
    provider: 'sophtron',
  },
  {
    id: 'b8cb06e4-4f42-42b7-ba5a-623a5d1afe0f',
    name: 'TD Bank',
    url: 'https://onlinebanking.tdbank.com',
    logo_url: 'https://logos-list.s3-us-west-2.amazonaws.com/td_bank_logo.png',
    provider: 'sophtron',
  },
  {
    id: '9aee59a1-59c9-4e5e-88f6-a00aa19f1612',
    name: 'US Bank',
    url: 'https://www.usbank.com/index.html',
    logo_url: 'https://logos-list.s3-us-west-2.amazonaws.com/us_bank_logo.png',
    provider: 'sophtron',
  },
  {
    id: 'Sophtron Bank',
    name: 'Sophtron Bank',
    url: 'http://sophtron.com',
    logo_url: 'https://sophtron.com/Images/logo.png',
    provider: 'sophtron',
  },
  {
    id: 'mxbank',
    name: 'MX Bank',
    url: 'http://mx.com',
    logo_url: 'https://assets.mx.com/images/home2022/mx-logo.svg',
    provider: 'mx',
  },
];

const config = {
  SophtronSearchEndpoint: 'https://search.sophtron-prod.com/api/',
  SophtronAutoSuggestEndpoint: 'https://sophtron-prod.com/autoSuggest',
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
  ResourcePrefix: 'http://localhost:3000', // 'http://static.sophtron-prod.com/widget',
  ResourceVersion: '', // 'development'
  SophtronApiUserId: 'ba10bd5b-5387-47ff-a7f2-ae023b78a734',
  SophtronApiUserSecret: '',
  MxClientId: 'cb102a7c-14a2-4b4a-8241-076d5eedd115',
  MxDemoUserId: 'USR-753b539c-6281-4a71-b68b-347e68876035',
  MxDemoMemberId: 'MBR-32d68a9e-7b50-4826-b215-332bc36ca011',
  MxApiSecret: '',
  ProviderMapping: providerMapping,
  DemoBanks:demoBanks
};
const arr = Object.keys(config);
for (let i = 0; i < arr.length; i++) {
  const key = arr[i];
  config[key] = processEnv[key.toUpperCase()] || config[key];
}
module.exports = config;
