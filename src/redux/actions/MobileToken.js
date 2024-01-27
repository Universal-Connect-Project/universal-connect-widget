import FireflyAPI from '../../utils/FireflyAPI'

const ActionTypes = {
  MOBILE_TOKEN_GENERATED: 'mobiletoken/token_generated',
  MOBILE_TOKEN_ERROR: 'mobiletoken/token_error',
  MOBILE_TOKEN_RESET: 'mobiletoken/token_reset',
}

const generateMobileToken = () => dispatch => {
  return FireflyAPI.generateMobileToken().then(token => {
    if (!token || !token.mobile_token) {
      return dispatch({ type: ActionTypes.MOBILE_TOKEN_ERROR })
    } else {
      return dispatch({
        type: ActionTypes.MOBILE_TOKEN_GENERATED,
        payload: { token: token.mobile_token },
      })
    }
  })
}

const resetMobileToken = () => dispatch => {
  return dispatch({ type: ActionTypes.MOBILE_TOKEN_RESET })
}

const dispatcher = dispatch => ({
  generateMobileToken: () => dispatch(generateMobileToken()),
  resetMobileToken: () => dispatch(resetMobileToken()),
})

export { ActionTypes, dispatcher }
