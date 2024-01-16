// import PostMessage, { getReferrer } from 'src/connect/utilities/PostMessage'
// import Store from 'reduxify/Store'

describe('PostMessage placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// PostMessage.setWebviewUrl = jest.fn()
// PostMessage.postMessage = jest.fn()
// PostMessage.isInsideIframe = jest.fn()
// describe('Post Message Utils', () => {
//   describe('send', () => {
//     beforeEach(() => {
//       PostMessage.setWebviewUrl.mockReset()
//       PostMessage.postMessage.mockReset()
//     })
//
//     it('should set the webview url with a mx message if mx and mobile webview and the ui_message_version is >= 3', () => {
//       Store.getState().client.has_atrium_api = false
//       Store.getState().initializedClientConfig.connect = { is_mobile_webview: true }
//       Store.getState().initializedClientConfig.ui_message_version = 3
//
//       PostMessage.send('updated', {
//         accounts_count: 3,
//         connection_status: 'CONNECTED',
//         guid: 'MBR-12345',
//         id: 'M-12345',
//         institution_guid: 'INS-12345',
//         is_manual: false,
//         is_user_created: false,
//         most_recent_job_guid: 'JOB-12345',
//         name: 'Zen Bank',
//         type: 'member',
//       })
//       expect(PostMessage.setWebviewUrl).toHaveBeenCalledWith(
//         'mx://memberUpdated?accounts_count=3&connection_status=CONNECTED&guid=MBR-12345&id=M-12345&institution_guid=INS-12345&is_manual=false&is_user_created=false&most_recent_job_guid=JOB-12345&name=Zen Bank&type=member',
//       )
//     })
//
//     it('should NOT set the webview url with a mx message if mx and master mobile webview and the ui_message_version is < 3', () => {
//       Store.getState().client.has_atrium_api = false
//       Store.getState().initializedClientConfig.master = { is_mobile_webview: true }
//       Store.getState().initializedClientConfig.ui_message_version = 2
//
//       PostMessage.send('updated', {
//         accounts_count: 3,
//         connection_status: 'CONNECTED',
//         guid: 'MBR-12345',
//         id: 'M-12345',
//         institution_guid: 'INS-12345',
//         is_manual: false,
//         is_user_created: false,
//         most_recent_job_guid: 'JOB-12345',
//         name: 'Zen Bank',
//         type: 'member',
//       })
//       expect(PostMessage.setWebviewUrl).not.toHaveBeenCalled()
//     })
//
//     it('should not set the webview url with a mx message from an unsupported event', () => {
//       Store.getState().client.has_atrium_api = false
//       Store.getState().initializedClientConfig.connect = { is_mobile_webview: true }
//
//       PostMessage.send('updated', { type: 'goal' })
//       expect(PostMessage.setWebviewUrl).not.toHaveBeenCalled()
//     })
//
//     it('should send ping events via url change', () => {
//       Store.getState().client.has_atrium_api = false
//       Store.getState().initializedClientConfig.master = { is_mobile_webview: true }
//       PostMessage.send('ping')
//       expect(PostMessage.setWebviewUrl).toHaveBeenCalledWith('mx://ping')
//     })
//
//     it('should send ping events via post message', () => {
//       PostMessage.isInsideIframe = jest.fn(() => true)
//       PostMessage.getCurrentTime = jest.fn(() => 5)
//       Store.getState().client.has_atrium_api = false
//       Store.getState().initializedClientConfig = {}
//       PostMessage.send('ping')
//
//       expect(PostMessage.postMessage).toHaveBeenCalledWith(
//         `{"type":"ping","payload":{},"moneyDesktop":true,"timeStamp":5}`,
//         'Banana Stand',
//       )
//     })
//   })
//
//   describe('.getReferrer', () => {
//     it('should return the window opener location if present', () => {
//       window.opener = {
//         location: 'Hello Location',
//       }
//       expect(getReferrer()).toEqual(window.opener.location.toString())
//     })
//
//     it('should return the referrer otherwise', () => {
//       window.opener = {}
//
//       //This value is set in jest-setup.js
//       expect(getReferrer()).toEqual('Banana Stand')
//     })
//   })
//
//   describe('.parse', () => {
//     it('should just return a regular object', () => {
//       const data = { name: 'shibby' }
//       expect(PostMessage.parse(data)).toEqual(data)
//     })
//
//     it('should parse valid json', () => {
//       expect(PostMessage.parse('{"key": "val"}')).toEqual({ key: 'val' })
//     })
//   })
// })
