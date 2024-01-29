export const AGG_MODE = 'aggregation'
export const VERIFY_MODE = 'verification'
export const REWARD_MODE = 'reward'
export const TAX_MODE = 'tax'

export const STEPS = {
  ADD_MANUAL_ACCOUNT: 'addManualAccount',
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  DELETE_MEMBER_SUCCESS: 'deleteMemberSuccess',
  DISCLOSURE: 'disclosure',
  ENTER_CREDENTIALS: 'enterCreds',
  ERROR: 'error',
  EXISTING_MEMBER: 'existingMember',
  LOGIN_ERROR: 'loginError',
  MFA: 'mfa',
  MICRODEPOSITS: 'microdeposits',
  OAUTH: 'oauth',
  OAUTH_ERROR: 'oauthError',
  SEARCH: 'search',
  VERIFY_ERROR: 'verifyError',
  VERIFY_EXISTING_MEMBER: 'verifyExistingMember',
}

export const COLOR_SCHEME = {
  LIGHT: 'light',
  DARK: 'dark',
}

export const REFERRAL_SOURCES = {
  BROWSER: 'BROWSER',
  APP: 'APP',
}

export const OAUTH_ERROR_REASONS = {
  CANCELLED: 'CANCELLED', // User cancelled/rejected/denied oauth
  DENIED: 'DENIED', // User couldnt authenticate
  IMPEDED: 'IMPEDED', // User needs to resolve an issue at the provider
  PROVIDER_ERROR: 'PROVIDER_ERROR', // Error from the oauth provider
  SERVER_ERROR: 'SERVER_ERROR', // MX error
}
