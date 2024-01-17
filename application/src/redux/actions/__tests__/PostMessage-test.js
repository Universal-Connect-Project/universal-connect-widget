import { ActionTypes, sendPostMessage } from 'reduxify/actions/PostMessage'

describe('PostMessage action creators', () => {
  it('should have a sendPostMessage action', () => {
    expect(ActionTypes.SEND_POST_MESSAGE).toBeDefined()
    expect(sendPostMessage('some-event', { meta: 'data' })).toEqual({
      type: ActionTypes.SEND_POST_MESSAGE,
      payload: { event: 'some-event', data: { meta: 'data' } },
    })
  })
})
