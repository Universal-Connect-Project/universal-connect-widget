/* eslint-disable no-process-env */
export const isProd = process.env.NODE_ENV !== 'development'

export const Environments = Object.freeze({
  DEVELOPMENT: 'development',
  SANDBOX: 'sandbox',
  QA: 'qa',
  INTEGRATION: 'integration',
  PRODUCTION: 'production',
})

function getEnvironment() {
  if (isProd) {
    if (/\bint\b/.test(location.host)) return Environments.INTEGRATION
    else if (/\bqa\b/.test(location.host)) return Environments.QA
    else if (/\bsand\b/.test(location.host)) return Environments.SANDBOX
    else return Environments.PRODUCTION
  } else {
    return Environments.DEVELOPMENT
  }
}

export const currentEnvironment = getEnvironment()
