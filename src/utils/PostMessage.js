import _get from 'lodash/get'
import _includes from 'lodash/includes'
import _isString from 'lodash/isString'
import Store from '../redux/Store'

/**
 * Post Message v1, a messy api that serves post message and url change event messages for communication between our application and host web or native applications
 * URL change events are limited to those that are documented and have been communicated to partners
 * All events that come through are currently forwarded through as post messages.
 * Side effect code was moved to functions for testing and naming to attempt to make intent clearer.
 *
 */
const PostMessage = {
  setWebviewUrl(url) {
    //console.log('setWebviewUrl')
    window.location = encodeURI(url)
  },

  send(event, payload, url) {
    //console.log('send')

    const config = Store.getState().initializedClientConfig

    // Don't do anything if this is ui_message_version 4, use the epic instead
    if (config.ui_message_version === 4) return
    const payloadType = _get(payload, 'type', null)
    const mxWebviewEventTypes = [
      'transaction',
      'account',
      'member',
      'ping',
      'mxConnect:widgetLoaded',
      'load',
      'focusTrap',
    ]
    const isMobileWebview =
      _get(config, 'connect.is_mobile_webview', false) ||
      _get(config, 'master.is_mobile_webview', false) ||
      _get(config, 'is_mobile_webview', false)

    const uiMessageVersion =
      _get(config, 'connect.ui_message_version') ||
      _get(config, 'master.ui_message_version') ||
      _get(config, 'ui_message_version', 2)

    const shouldSetMXWebview =
      isMobileWebview &&
      (_includes(mxWebviewEventTypes, event) || _includes(mxWebviewEventTypes, payloadType))
    const s =  _get(config, 'connect.scheme', 'vcs') || 'mx';
    if (shouldSetMXWebview) {
      let webviewUrl = ''

      if (payloadType) {
        webviewUrl = `${s}://${payload.type + event[0].toUpperCase() + event.substr(1)}`
      } else {
        webviewUrl = `${s}://${event}`
      }
      if (payload) {
        webviewUrl +=
          '?' +
          Object.keys(payload)
            .map(key => key + '=' + payload[key])
            .join('&')
      }

      if (
        uiMessageVersion === 3 ||
        // This is the old check that we had previously. We have to keep it to protect
        // others from breaking.
        (isMobileWebview && event === 'ping')
      ) {
        PostMessage.setWebviewUrl(webviewUrl)
      }

      //if the current window is different from the top window we are in an iframe
    } else if (PostMessage.isInsideIframe()) {
      const postUrl = (url || getReferrer()).replace(/([^:]+:\/\/[^/]+).*/, '$1')

      if (postUrl) {
        PostMessage.postMessage(
          JSON.stringify({
            type: event,
            payload: payload || {},
            moneyDesktop: true,
            timeStamp: PostMessage.getCurrentTime(),
          }),
          postUrl,
        )
      }
    }
  },

  getCurrentTime() {
    return new Date().getTime()
  },

  isInsideIframe() {
    return window.self !== window.top
  },

  postMessage(payload, url) {
    // console.log('posting message, url: ' + url)
    // console.log(payload)
    try {
      if (window.parent) {
        window.parent.postMessage(payload, url)
      }
      if (window.opener) {
        window.opener.postMessage(payload, url)
      }
    } catch (error) {
      console.warn('Post message error', error)
    }
  },

  /**
   * Attempt to json parse data from a post message event.
   *
   * Some of our event payloads are JSON strings and some are not. The reasons
   * for this are both historical and due to some limitations with how consumers
   * like ReactNative can send post messages.
   *
   * @param  {any} data    The 'data' property of the post message event
   * @return {any}
   */
  parse(data) {
    // If `data` isn't a string, just return it as is.
    if (!_isString(data)) return data

    try {
      return JSON.parse(data)
    } catch {
      // If we can't parse the data correctly, just return an empty object
      return {}
    }
  },
}

export default PostMessage

/**
 * New version of post message sending in the app. must have
 * `ui_message_version` of 4
 */
export function sendPostMessage(event, data, scheme = 'mx') {
  const config = Store.getState().initializedClientConfig
  const s =  _get(config, 'connect.scheme', 'vcs') || scheme
  const message = { 
    metadata: data, 
    // mx: true,
    type: `${s}/${event}` 
  }
  // console.log(message)
  const postUrl = getReferrer().replace(/([^:]+:\/\/[^/]+).*/, '$1')

  try {
    if (window.parent) {
      if(window === window.parent){
        console.log('Post message: ' + postUrl);
        console.log(message)
      }else{
        window.parent.postMessage(message, postUrl)
      }
      return;
    }
    if (window.opener) {
      // console.log('window.opener')
      window.opener.postMessage(message, postUrl)
      return;
    }
  } catch (error) {
    // This will quiet the noise in the console, while hopefully removing the error from honeybadger
    // console.warn('Post message error', error)
  }
}

/**
 * Set the webview url instead of sending a post message to webviews.
 */
export function setWebviewURL(event, data, scheme = 'mx') {
    console.log('setWebviewUrl')
    let webviewUrl = `${scheme}://${event}`

  if (data) {
    webviewUrl += '?metadata=' + encodeURIComponent(JSON.stringify(data))
  }

  window.location = webviewUrl
}

export function getReferrer() {
  const target_origin_referrer = Store.getState().initializedClientConfig.target_origin_referrer

  if (target_origin_referrer) {
    if (!isValidUrl(target_origin_referrer))
      console.error(
        `Target origin referrer must be a valid url. Post messages may not work correctly. Provided value: ${target_origin_referrer}`,
      )

    return target_origin_referrer
  } else if (window.opener && window.opener.location) {
    return window.opener.location.toString()
  } else {
    return document.referrer
  }
}

// See https://regexr.com/6h1pt for test cases
const isValidUrl = url =>
  typeof url === 'string' && url.match(/((\w+:\/\/)[-a-zA-Z0-9:@;?&=/%+.*!'(),$_{}^~[\]`#|]+)/g)
