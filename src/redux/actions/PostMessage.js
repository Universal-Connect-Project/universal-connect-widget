export const ActionTypes = {
  SEND_POST_MESSAGE: 'postmessage/send',
}

// Attempt to send a post message
export const sendPostMessage = (event, data) => ({
  type: ActionTypes.SEND_POST_MESSAGE,
  payload: { event, data },
})
