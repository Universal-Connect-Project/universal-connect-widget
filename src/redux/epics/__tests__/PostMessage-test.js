import * as actions from '../../actions/PostMessage'
import * as epics from '../../epics/PostMessage'
import { expectRx } from '../../../utils/Test'
import { sendPostMessage, setWebviewURL } from '../../../utils/PostMessage'

jest.mock('utils/PostMessage')

describe('postMessages epic', () => {
  afterEach(() => {
    sendPostMessage.mockReset()
    setWebviewURL.mockReset()
  })

  it('should call regular postMessage if ui_message_version is 4 and not a mobile webview', () => {
    const message = {
      event: 'event',
      data: { some: 'data' },
    }

    const config = { initializedClientConfig: { ui_message_version: 4 } }
    const state = { value: config }

    expect.assertions(2)
    sendPostMessage.mockImplementationOnce(() => 'Success')

    expectRx.toMatchObject.run(({ scheduler, hot, expectObservable }) => {
      const actions$ = hot('aa', {
        a: actions.sendPostMessage(message.event, message.data),
      })

      // it no longer emits anything. We don't really care about failure or error.
      expectObservable(epics.postMessages(actions$, state, { scheduler }), '1m !').toBe('')
    })

    // We really only care about it sending a post message
    expect(sendPostMessage).toHaveBeenCalled()
  })

  it('should call setWebviewURL if is_mobile_webview and ui_message_version is 4', () => {
    const postMessage = {
      event: 'event',
      data: { some: 'data' },
    }
    const config = { initializedClientConfig: { ui_message_version: 4, is_mobile_webview: true } }
    const state = { value: config }

    expect.assertions(2)
    setWebviewURL.mockImplementationOnce(() => 'Success')

    expectRx.toMatchObject.run(({ hot, expectObservable, scheduler }) => {
      const actions$ = hot('a', {
        a: actions.sendPostMessage(postMessage.event, postMessage.data),
      })

      // it no longer emits anything. We don't really care about failure or error.
      expectObservable(epics.postMessages(actions$, state, { scheduler }), '1m !').toBe('')
    })

    expect(setWebviewURL).toHaveBeenCalled()
  })

  it('should not send any message if this config is anything other than v4', () => {
    const postMessage = {
      event: 'event',
      data: { some: 'data' },
    }
    const config = { initializedClientConfig: {} }
    const state = { value: config }

    expect.assertions(3)

    expectRx.toMatchObject.run(({ hot, expectObservable, scheduler }) => {
      const actions$ = hot('a', {
        a: actions.sendPostMessage(postMessage.event, postMessage.data),
      })

      // 30ms because our post messages need to be delayed for iOS.
      expectObservable(epics.postMessages(actions$, state, { scheduler }), '1m !').toBe('')
    })

    expect(setWebviewURL).not.toHaveBeenCalled()
    expect(sendPostMessage).not.toHaveBeenCalled()
  })
})
