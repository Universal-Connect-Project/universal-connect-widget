import FireflyAPI from '../../utils/FireflyAPI'

import { EmailActions, PhoneActions } from '../../constants/Settings'
import _get from 'lodash/get'

const ActionTypes = {
  UPDATE_USER: 'user/update_user',
  UPDATE_USER_SUCCESS: 'user/update_user_success',
  UPDATE_USER_ERROR: 'user/update_user_error',
  EMAIL_VERIFICATION_STEP: 'user/email_verification_step',
  PHONE_VERIFICATION_STEP: 'user/phone_verification_step',
  PASSWORD_UPDATING: 'user/password_updating',
  PASSWORD_UPDATED: 'user/password_updated',
  PASSWORD_UPDATED_ERROR: 'user/password_updated_error',
}

export const updateUser = user => ({
  type: ActionTypes.UPDATE_USER,
  payload: user,
})

/**
 * If the user accepts terms. We need to ensure that
 * has_accepted_terms is true
 * has_updated_terms_and_conditions is false
 */
export const acceptTerms = () => ({
  type: ActionTypes.UPDATE_USER,
  payload: {
    has_accepted_terms: true,
    has_updated_terms_and_conditions: false,
  },
})

const updatePassword = args => dispatch => {
  dispatch({ type: ActionTypes.PASSWORD_UPDATING })
  return FireflyAPI.updatePassword(args)
    .then(() => dispatch({ type: ActionTypes.PASSWORD_UPDATED }))
    .catch(error => {
      return dispatch({
        type: ActionTypes.PASSWORD_UPDATED_ERROR,
        payload: {
          error: _get(
            error,
            ['response', 'data', 'plaintext_password', '0'],
            'Something went wrong updating your password!',
          ),
        },
      })
    })
}

const setPhoneVerificationStep = step => ({
  type: ActionTypes.PHONE_VERIFICATION_STEP,
  payload: { step },
})

const setEmailVerificationStep = step => ({
  type: ActionTypes.EMAIL_VERIFICATION_STEP,
  payload: { step },
})

const sendEmailVerification = () => dispatch => {
  dispatch(setEmailVerificationStep(EmailActions.sendVerificationEmailLoading))
  return FireflyAPI.sendEmailVerification().then(
    () => dispatch(setEmailVerificationStep(EmailActions.emailVerificationUpdate)),
    () => dispatch(setEmailVerificationStep(EmailActions.sendVerificationEmailError)),
  )
}

const sendPhoneVerification = () => dispatch => {
  dispatch(setPhoneVerificationStep(PhoneActions.sendVerificationTokenLoading))
  return FireflyAPI.sendPhoneVerification().then(
    () => dispatch(setPhoneVerificationStep(PhoneActions.enterVerificationToken)),
    () => dispatch(setPhoneVerificationStep(PhoneActions.sendVerificationTokenError)),
  )
}

const verifyPhoneToken = token => dispatch => {
  dispatch(setPhoneVerificationStep(PhoneActions.sendVerificationTokenLoading))
  return FireflyAPI.verifyPhoneToken(token).then(
    step => dispatch(setPhoneVerificationStep(step)),
    () => dispatch(setPhoneVerificationStep(PhoneActions.enterVerificationTokenError)),
  )
}

const dispatcher = dispatch => ({
  acceptTerms: () => dispatch(acceptTerms()),
  updateUser: user => dispatch(updateUser(user)),
  updatePassword: args => dispatch(updatePassword(args)),
  sendEmailVerification: () => dispatch(sendEmailVerification()),
  sendPhoneVerification: () => dispatch(sendPhoneVerification()),
  setPhoneVerificationStep: step => dispatch(setPhoneVerificationStep(step)),
  setEmailVerificationStep: step => dispatch(setEmailVerificationStep(step)),
  verifyPhoneToken: token => dispatch(verifyPhoneToken(token)),
})

export { dispatcher, ActionTypes }
