import _get from 'lodash/get'

import { dispatcher as appDispatcher } from '../redux/actions/App'
import FireflyAPI from '../utils/FireflyAPI'

export function registerAxiosInterceptors(dispatch) {
  FireflyAPI.registerAxiosInterceptor(
    'response',
    response => response,
    error => {
      const status = _get(error, ['response', 'status'], 'UNKNOWN')

      // handle "401 Unauthorized" errors
      if (status === 401) {
        appDispatcher(dispatch).markSessionTimedOut()
      }

      return Promise.reject(error)
    },
  )
}
