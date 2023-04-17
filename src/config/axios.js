import _get from 'lodash/get'

import { dispatcher as appDispatcher } from '../redux/actions/App'
import FireflyAPI from '../utils/FireflyAPI'

let meta = ''; //TODO move this to state

export function registerAxiosInterceptors(dispatch) {
  FireflyAPI.registerAxiosInterceptor(
    'request',
    request => {
      // console.log('request: ' + request.url + ' meta: ' + meta)
      request.headers.meta = meta
      return request;
    }
  )

  FireflyAPI.registerAxiosInterceptor(
    'response',
    response => {
      if(response.headers.meta){
        meta = response.headers.meta
      }
      // console.log(response)
      // console.log('response: ' + response?.config?.url + ' meta: ' + meta)
      return response;
    },
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
