const http = require('./real');

const mfaRes = [
  {
    CaptchaImage:
      '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',
    SuccessFlag: 'Processing',
  },
  {
    SecurityQuestion: '["What is your favorite color?"]',
    SuccessFlag: 'Processing',
  },
  { TokenMethod: '["xxx-xxx-1234","xxx-xxx-5678"]', SuccessFlag: 'Processing' },
  { TokenSentFlag: true, TokenInputName: 'pin', SuccessFlag: 'Processing' },
  { LastStatus: 'AccountsReady' },
  // {SuccessFlag: false},
  { SuccessFlag: true },
];
let counter = 0;

const mocks = {
  get: {
    '/v1/phrase': () => 'AuthPhrase:UserID:base64:path',
    '/v1/user/integrationInfo': () => ({
      IntegrationKey: 'MockedIntegrationKey',
    }),
    // 'v1/user/' + id
    // v1/userprofile
    default: (url) => {
      console.log(`default mock get: ${url}`);
    },
  },
  wget: {
    // '/widget/preferences/paystand.json': (url) => ({fish: false, contactEmail: 'contact@paystand.com', valid: true}),
    '/api/institutions': (url) => http.wget(url),
    '/api/institution/resolve': (url) => http.wget(url),
    default: (url) => {
      console.log(`Default mock wget: ${url}`);
      return http.wget(url);
    },
  },
  post: {
    '/api/UserInstitution/InternalGetUserInstitutionByID': () => ({
      InstitutionID: 'MockedInstitutionID',
      UserInstitutionID: 'MockedUserInstitutionID',
    }),
    '/api/UserInstitution/GetUserInstitutionAccounts': () => [
      {
        AccountId: 'MockedAccountId',
        AccountName: 'MockedUserInstitutionAccount',
        AccountNumber: 'AccountNumber',
        AccountType: 'AccountType',
        SubType: 'SubType',
      },
    ],
    '/api/UserInstitution/CreateUserInstitutionWithRefresh': () => ({
      JobID: 'CreateUserInstitutionWithRefresh',
      UserInstitutionID: 'MockedUserInstitutionID',
    }),
    '/api/UserInstitution/CreateUserInstitutionWithFullAccountNumbers': () => ({
      JobID: 'CreateUserInstitutionWithFullAccountNumbers',
      UserInstitutionID: 'MockedUserInstitutionID',
    }),
    '/api/UserInstitution/CreateUserInstitutionWOJob': () =>
      'MockedUserInstitutionID',
    '/api/UserInstitution/GetUserInstitutionProfileInfor': () => ({
      JobID: 'GetUserInstitutionProfileInfor',
    }),
    '/api/UserInstitution/UpdateUserInstitution': () => ({}),
    '/api/UserInstitution/RefreshUserInstitution': () => ({
      JobID: 'RefreshUserInstitution',
    }),
    '/api/Institution/GetInstitutionByID': () => ({
      InstitutionID: 'MockedInstitutionID',
      InstitutionName: 'MockedInstitutionName',
      URL: 'https://sophtron.com/Images/logo.png',
      Logo: 'https://sophtron.com/Images/logo.png',
    }),
    '/api/Institution/GetInstitutionByName': () => [
      {
        InstitutionID: 'MockedInstitutionID',
        InstitutionName: 'MockedInstitutionName',
        URL: 'https://sophtron.com/Images/logo.png',
        Logo: 'https://sophtron.com/Images/logo.png',
      },
    ],
    '/api/Institution/GetInstitutionByRoutingNumber': () => [
      {
        InstitutionID: 'MockedInstitutionID',
        InstitutionName: 'MockedInstitutionName',
        URL: 'http://mocked.com',
      },
    ],
    '/api/Job/GetJobByID': () => {
      // return {JobID: 'MockedJobId', SuccessFlag: false,  LastStep: 'TokenMethods', LastStatus: 'Timeout'};
      const mfa = mfaRes[counter % mfaRes.length];
      counter++;
      return {
        ...mfa,
        JobID: 'MockedJobID',
        UserInstitutionID: 'MockedUserInstitutionID',
        // SuccessFlag: true,
      };
    },
    '/api/Job/UpdateJobSecurityAnswer': () => ({}),
    '/api/Job/UpdateJobTokenInput': () => ({}),
    '/api/Job/UpdateJobCaptcha': () => ({}),
    '/api/v1/securecallback': () => {
      // http.wget('http://localhost:63880/hang')
    },
    default: (url) => {
      console.log(`default mock post: ${url}`);
    },
  },
};

function getMocks(method, fullUrl) {
  const path = new URL(fullUrl).pathname;
  console.log(`Mocking: ${method} ${fullUrl}, path: ${path}`);
  if (mocks[method][path]) {
    return Promise.resolve(mocks[method][path](fullUrl));
  }
  return Promise.resolve(mocks[method].default(fullUrl));
}

module.exports = {
  get(url) {
    return getMocks('get', url);
  },
  wget(url) {
    return getMocks('wget', url);
  },
  post(url) {
    return getMocks('post', url);
  },
  stream: http.stream,
  buildAuthCode: http.buildAuthCode,
};
