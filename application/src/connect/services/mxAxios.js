/*
  The purpose of this file is to provide an importable axios instance
  that is set up in the way we'd like it to be.
  
  Interceptors, basic validation, etc have all been taken care of here.

  When other files import mxAxios it is ready to go.
*/

import axios from 'axios'
import _get from 'lodash/get'

import { dispatcher as appDispatcher } from '../../redux/actions/App'
import Store from '../../redux/Store'

function validateStatus(status) {
  return status >= 200 && status < 300
}

/**
 * Look at the navigator global and try to get a comma separated list of
 * plugins. This is just an effort to fingerprint requests for security.
 *
 * NOTE: plugins is a PluginArray, not an Array see:
 * https://developer.mozilla.org/en-US/docs/Web/API/PluginArray
 */
export function getNavigatorPluginNames(plugins) {
  if (!plugins) return ''

  const pluginNames = []

  for (let i = 0; i < plugins.length; i++) {
    pluginNames.push(plugins[i].name)
  }

  return pluginNames.sort().join(',')
}

/**
 * Look at the navigator global and try to get a comma separated list of mime
 * type names for the headers. This is just an effort to finger print requests
 * This isn't required from a server view point.
 *
 * NOTE: mimeTypes is a MimeTypeArray, not an Array, see:
 * https://developer.mozilla.org/en-US/docs/Web/API/MimeTypeArray
 */
export function getNavigatorMimeTypeNames(mimeTypes) {
  if (!mimeTypes) return ''

  const mimeTypeNames = []

  for (let i = 0; i < mimeTypes.length; i++) {
    mimeTypeNames.push(mimeTypes[i].type)
  }

  return mimeTypeNames.sort().join(',')
}

// Initialize Axios
const mxAxios = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'MD-Session-Token': _get(window, ['app', 'options', 'session_token']),
    // The 'Inter-x' headers are just for security to fingerprint requests.
    'x-inter-ua': navigator.userAgent,
    'x-inter-av': navigator.appVersion,
    'x-inter-platform': navigator.platform,
    'x-inter-pg': getNavigatorPluginNames(navigator.plugins),
    'x-inter-mt': getNavigatorMimeTypeNames(navigator.mimeTypes),
  },
  validateStatus,
})

// Configure Interceptors for the instance
const successCallback = response => response
const errorCallback = error => {
  const status = _get(error, ['response', 'status'], 'UNKNOWN')

  // handle "401 Unauthorized" errors
  if (status === 401) {
    appDispatcher(Store.dispatch).markSessionTimedOut()
  }

  return Promise.reject(error)
}

mxAxios.interceptors.response.use(successCallback, errorCallback)

// Return the configured axios instance
export default mxAxios
