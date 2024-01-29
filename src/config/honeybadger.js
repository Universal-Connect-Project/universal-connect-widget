import Honeybadger from 'honeybadger-js'

import { isProd, currentEnvironment } from './env'

Honeybadger.configure({
  //apiKey: process.env.HONEYBADGER_API_KEY, // eslint-disable-line no-process-env
  debug: !isProd,
  environment: currentEnvironment,
  //revision: process.env.GIT_HEAD_COMMIT, // eslint-disable-line no-process-env
})
