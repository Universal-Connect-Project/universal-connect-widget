import React, { useEffect, useReducer } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { defer, interval } from 'rxjs'
import { filter, mergeMap, pluck, scan, switchMap, take, tap } from 'rxjs/operators'

import FireflyAPI from '../../../utils/FireflyAPI'
import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import {
  EventCategories,
  EventLabels,
  EventActions,
  PageviewInfo,
} from '../../const/Analytics'

import { RoutingNumber } from './RoutingNumber'
import { HowItWorks } from './HowItWorks'
import { PersonalInfoForm } from './PersonalInfoForm'
import { AccountInfo } from './AccountInfo'
import { ConfirmDetails } from './ConfirmDetails'
import { ComeBack } from './ComeBack'
import { VerifyDeposits } from './VerifyDeposits'
import { MicrodepositErrors } from './MicrodepositErrors'
import { Verifying } from './Verifying'
import { Verified } from './Verified'
import { MicrodepositsStatuses } from './const'
import { AccountFields } from './const'

import { Container } from '../../components/Container'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { PrivateAndSecure } from '../../components/PrivateAndSecure'
import { ErrorStatuses } from './const'
import { ActionTypes } from '../../../redux/actions/Connect'

export const VIEWS = {
  LOADING: 'loading',
  OOPS: 'oops',
  ROUTING_NUMBER: 'routingNumber',
  HOW_IT_WORKS: 'howItWorks',
  PERSONAL_INFO_FORM: 'personal_info_form',
  ACCOUNT_INFO: 'accountInfo',
  CONFIRM_DETAILS: 'confirmDetails',
  COME_BACK: 'comeBack',
  VERIFY_DEPOSITS: 'verifyDeposits',
  ERRORS: 'errors',
  VERIFYING: 'verifying',
  VERIFIED: 'verified',
}

const ACTIONS = {
  LOAD_MICRODEPOSITS_SUCCESS: 'microdeposits/load_microdeposits',
  LOAD_MICRODEPOSITS_BY_GUID_SUCCESS: 'microdeposits/load_microdeposits_by_guid_success',
  LOAD_MICRODEPOSITS_ERROR: 'microdeposits/load_microdeposits_error',
  SAVE_USER_DATA_SUCCESS: 'microdeposits/save_user_data_success',
  CREATE_MICRODEPOSIT_SUCCESS: 'microdeposits/create_microdeposit_success',
  CREATE_MICRODEPOSIT_ERROR: 'microdeposits/create_microdeposit_error',
  AMOUNTS_SUBMITTED: 'microdeposits/amounts_submitted',
  AMOUNTS_SUBMITTED_ERROR: 'microdeposits/amounts_submitted_error',
  VERIFYING_ERROR: 'microdeposits/verifying_error',
  VERIFYING_SUCCESS: 'microdeposits/verifying_success',
  VERIFY_DEPOSITS_ERROR: 'microdeposits/verifying/depositst/error',
  STEP_TO_HOW_IT_WORKS: 'micro_deposits/step_to_how_it_works',
  STEP_TO_PERSONAL_INFO_FORM: 'micro_deposits/step_to_personal_info_form',
  STEP_TO_ACCOUNT_INFO: 'micro_deposits/step_to_account_info',
  STEP_TO_CONFIRM_DETAILS: 'micro_deposits/step_to_confirm_details',
  STEP_TO_ROUTING_NUMBER: 'micro_deposits/step_to_routing_number',
  EDIT_DETAILS: 'micro_deposits/edit_details',
  RESET_MICRODEPOSITS: 'micro_deposits/reset_microdeposits',
}

const initialState = {
  // The view that should be rendered. Must be one of VIEWS.
  currentView: VIEWS.LOADING,
  // The error from loading the widget, if applicable
  loadingError: null,
  // The error from creating microdeposit
  microdepositCreateError: null,
  // The current microdeposit
  currentMicrodeposit: {},
  accountDetails: null,
  focus: null,
  returnToConfirm: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_MICRODEPOSITS_BY_GUID_SUCCESS:
      return {
        ...state,
        accountDetails: action.payload,
        currentView: getViewByStatus(action.payload.status),
        currentMicrodeposit: action.payload,
        loadingError: initialState.loadingError,
      }
    case ACTIONS.LOAD_MICRODEPOSITS_SUCCESS:
      return {
        ...state,
        currentView: VIEWS.ROUTING_NUMBER,
        loadingError: initialState.loadingError,
      }
    case ACTIONS.LOAD_MICRODEPOSITS_ERROR:
      return {
        ...state,
        loadingError: action.payload.message,
        currentView: VIEWS.OOPS,
      }
    case ACTIONS.STEP_TO_HOW_IT_WORKS:
      return {
        ...state,
        currentView: VIEWS.HOW_IT_WORKS,
        accountDetails: action.payload ?? state.accountDetails,
      }
    case ACTIONS.STEP_TO_PERSONAL_INFO_FORM:
      return {
        ...state,
        currentView: VIEWS.PERSONAL_INFO_FORM,
        accountDetails: action.payload || state.accountDetails,
      }
    case ACTIONS.SAVE_USER_DATA_SUCCESS:
      return {
        ...state,
        currentView: VIEWS.CONFIRM_DETAILS,
        accountDetails: { ...state.accountDetails, ...action.payload },
      }
    case ACTIONS.STEP_TO_ACCOUNT_INFO:
      return {
        ...state,
        currentView: VIEWS.ACCOUNT_INFO,
        accountDetails: action.payload ?? state.accountDetails,
      }
    case ACTIONS.EDIT_DETAILS: {
      let currentView = VIEWS.ACCOUNT_INFO

      if (action.payload === AccountFields.ROUTING_NUMBER) {
        currentView = VIEWS.ROUTING_NUMBER
      } else if ([AccountFields.EMAIL, AccountFields.USER_NAME].includes(action.payload)) {
        currentView = VIEWS.PERSONAL_INFO_FORM
      }

      return {
        ...state,
        currentView,
        returnToConfirm: true,
        focus: action.payload,
      }
    }
    case ACTIONS.STEP_TO_CONFIRM_DETAILS:
      return {
        ...state,
        currentView: VIEWS.CONFIRM_DETAILS,
        accountDetails: action.payload,
      }
    case ACTIONS.STEP_TO_ROUTING_NUMBER:
      return {
        ...state,
        currentView: VIEWS.ROUTING_NUMBER,
      }
    case ACTIONS.CREATE_MICRODEPOSIT_SUCCESS:
      return {
        ...state,
        currentView: ErrorStatuses.includes(action.payload.status) ? VIEWS.ERRORS : VIEWS.COME_BACK,
        currentMicrodeposit: action.payload,
        accountDetails: initialState.accountDetails,
        microdepositCreateError: initialState.microdepositCreateError,
      }
    case ACTIONS.CREATE_MICRODEPOSIT_ERROR:
      return {
        ...state,
        currentView: VIEWS.ERRORS,
        microdepositCreateError: action.payload,
      }
    case ACTIONS.AMOUNTS_SUBMITTED:
      return {
        ...state,
        currentView: VIEWS.VERIFYING,
      }
    case ACTIONS.VERIFYING_ERROR:
      return {
        ...state,
        currentView: getViewByStatus(action.payload.status),
        currentMicrodeposit: action.payload,
      }
    case ACTIONS.VERIFYING_SUCCESS:
      return {
        ...state,
        currentView: VIEWS.VERIFIED,
        currentMicrodeposit: action.payload,
      }
    case ACTIONS.RESET_MICRODEPOSITS:
      return {
        ...initialState,
        currentView: VIEWS.ROUTING_NUMBER,
      }
    default:
      return state
  }
}

export const Microdeposits = props => {
  useAnalyticsPath(...PageviewInfo.CONNECT_MICRODEPOSITS)
  const [state, dispatch] = useReducer(reducer, initialState)
  const { microdepositGuid, sendAnalyticsEvent, sendPostMessage, stepToIAV } = props
  const reduxDispatch = useDispatch()
  const shouldShowUserDetails =
    !state.currentMicrodeposit.first_name ||
    !state.currentMicrodeposit.last_name ||
    !state.currentMicrodeposit.email

  /**
   * 1. Call loadMicrodepositByGuid() to get current status of Microdeposit
   * 2. Call refreshMicrodepositStatus() to tell backend to ask Dwolla for updated status
   * 3. Poll loadMicrodepositByGuid() and compare to microdeposit from step 1.
   *   - Once status has updated navigate to step based on new status
   */
  useEffect(() => {
    if (microdepositGuid) {
      const pollStatus = originalMicrodeposit =>
        interval(2000).pipe(
          switchMap(() => defer(() => FireflyAPI.loadMicrodepositByGuid(microdepositGuid))),
          scan(
            (acc, newMicrodeposit) => {
              return {
                newMicrodeposit,
                attempts: acc.attempts + 1,
              }
            },
            { newMicrodeposit: {}, attempts: 0 },
          ),
          filter(({ attempts, newMicrodeposit }) => {
            // If we have polled 3 attempts (6 seconds) without any updates
            // load based off current status
            if (attempts === 3) {
              return true
            }
            // If status is updated, load based off current status
            if (originalMicrodeposit.status !== newMicrodeposit.status) {
              return true
            }
            return false
          }),
          pluck('newMicrodeposit'),
          take(1),
        )

      const stream$ = defer(() => FireflyAPI.loadMicrodepositByGuid(microdepositGuid))
        .pipe(
          tap(() => FireflyAPI.refreshMicrodepositStatus(microdepositGuid)),
          mergeMap(originalMicrodeposit => pollStatus(originalMicrodeposit)),
        )
        .subscribe(
          microdeposit => {
            sendPostMessage('connect/microdeposits/loaded', {
              initial_step: getViewByStatus(microdeposit.status),
            })
            sendAnalyticsEvent({
              category: EventCategories.CONNECT,
              label: EventLabels.MICRODEPOSITS,
              action: `${EventLabels.MICRODEPOSITS} - ${EventActions.RETURN}`,
            })
            return dispatch({
              type: ACTIONS.LOAD_MICRODEPOSITS_BY_GUID_SUCCESS,
              payload: microdeposit,
            })
          },
          err =>
            dispatch({
              type: ACTIONS.LOAD_MICRODEPOSITS_ERROR,
              payload: { message: err },
            }),
        )

      return () => stream$.unsubscribe()
    } else {
      sendPostMessage('connect/microdeposits/loaded', {
        initial_step: VIEWS.ROUTING_NUMBER,
      })
      sendAnalyticsEvent({
        category: EventCategories.CONNECT,
        label: EventLabels.MICRODEPOSITS,
        action: `${EventLabels.MICRODEPOSITS} - ${EventActions.START}`,
      })
      dispatch({ type: ACTIONS.LOAD_MICRODEPOSITS_SUCCESS })

      return () => {}
    }
  }, [microdepositGuid])

  const handleGoBack = () => {
    switch (state.currentView) {
      case VIEWS.HOW_IT_WORKS:
        return dispatch({ type: ACTIONS.STEP_TO_ROUTING_NUMBER })
      case VIEWS.ACCOUNT_INFO:
        return dispatch({ type: ACTIONS.STEP_TO_HOW_IT_WORKS })
      case VIEWS.PERSONAL_INFO_FORM:
        return dispatch({ type: ACTIONS.STEP_TO_ACCOUNT_INFO })
      case VIEWS.CONFIRM_DETAILS:
        return dispatch({
          type: shouldShowUserDetails
            ? ACTIONS.STEP_TO_PERSONAL_INFO_FORM
            : ACTIONS.STEP_TO_ACCOUNT_INFO,
        })
      default:
        return reduxDispatch({ type: ActionTypes.EXIT_MICRODEPOSITS })
    }
  }

  // This allows us to bubble up the exception in the case of an endpoint failing
  // Which will show the GlobalErrorBoundary screen, while retaining the error
  if (state.currentView === VIEWS.OOPS) {
    throw state.loadingError
  }

  return (
    <Container>
      {state.currentView === VIEWS.LOADING && <LoadingSpinner />}

      {state.currentView === VIEWS.ROUTING_NUMBER && (
        <RoutingNumber
          accountDetails={state.accountDetails}
          handleGoBack={handleGoBack}
          onContinue={accountDetails =>
            dispatch({
              type: state.returnToConfirm
                ? ACTIONS.STEP_TO_CONFIRM_DETAILS
                : ACTIONS.STEP_TO_HOW_IT_WORKS,
              payload: accountDetails,
            })
          }
          sendAnalyticsEvent={sendAnalyticsEvent}
          sendPostMessage={sendPostMessage}
          stepToIAV={stepToIAV}
        />
      )}

      {state.currentView === VIEWS.HOW_IT_WORKS && (
        <HowItWorks
          handleGoBack={handleGoBack}
          onContinue={() => dispatch({ type: ACTIONS.STEP_TO_ACCOUNT_INFO })}
        />
      )}

      {state.currentView === VIEWS.PERSONAL_INFO_FORM && (
        <PersonalInfoForm
          accountDetails={state.accountDetails}
          handleGoBack={handleGoBack}
          onContinue={userData =>
            dispatch({ type: ACTIONS.SAVE_USER_DATA_SUCCESS, payload: userData })
          }
        />
      )}

      {state.currentView === VIEWS.ACCOUNT_INFO && (
        <AccountInfo
          accountDetails={state.accountDetails}
          focus={state.focus}
          handleGoBack={handleGoBack}
          onContinue={accountDetails => {
            if (state.returnToConfirm || !shouldShowUserDetails) {
              dispatch({ type: ACTIONS.STEP_TO_CONFIRM_DETAILS, payload: accountDetails })
            } else {
              dispatch({ type: ACTIONS.STEP_TO_PERSONAL_INFO_FORM, payload: accountDetails })
            }
          }}
          sendAnalyticsEvent={sendAnalyticsEvent}
        />
      )}

      {state.currentView === VIEWS.CONFIRM_DETAILS && (
        <ConfirmDetails
          accountDetails={state.accountDetails}
          currentMicrodeposit={state.currentMicrodeposit}
          handleGoBack={handleGoBack}
          onEditForm={focus =>
            dispatch({
              type: ACTIONS.EDIT_DETAILS,
              payload: focus,
            })
          }
          onError={err => dispatch({ type: ACTIONS.CREATE_MICRODEPOSIT_ERROR, payload: err })}
          onSuccess={microdeposit =>
            dispatch({ type: ACTIONS.CREATE_MICRODEPOSIT_SUCCESS, payload: microdeposit })
          }
          shouldShowUserDetails={shouldShowUserDetails}
        />
      )}

      {state.currentView === VIEWS.COME_BACK && (
        <ComeBack
          microdeposit={state.currentMicrodeposit}
          onDone={() => reduxDispatch({ type: ActionTypes.FINISH_MICRODEPOSITS })}
          sendPostMessage={sendPostMessage}
        />
      )}

      {state.currentView === VIEWS.VERIFY_DEPOSITS && (
        <VerifyDeposits
          amountsSubmittedError={state.amountsSubmittedError}
          microdeposit={state.currentMicrodeposit}
          onSuccess={() => dispatch({ type: ACTIONS.AMOUNTS_SUBMITTED })}
        />
      )}

      {state.currentView === VIEWS.ERRORS && (
        <MicrodepositErrors
          accountDetails={state.accountDetails}
          microdeposit={state.currentMicrodeposit}
          microdepositCreateError={state.microdepositCreateError}
          onResetMicrodeposits={() => reduxDispatch({ type: ActionTypes.FINISH_MICRODEPOSITS })}
          resetMicrodeposits={() => dispatch({ type: ACTIONS.RESET_MICRODEPOSITS })}
          sendAnalyticsEvent={sendAnalyticsEvent}
          sendPostMessage={sendPostMessage}
        />
      )}

      {state.currentView === VIEWS.VERIFYING && (
        <Verifying
          microdeposit={state.currentMicrodeposit}
          onError={microdeposit =>
            dispatch({ type: ACTIONS.VERIFYING_ERROR, payload: microdeposit })
          }
          onSuccess={microdeposit => {
            sendAnalyticsEvent({
              category: EventCategories.CONNECT,
              label: EventLabels.MICRODEPOSITS,
              action: `${EventLabels.MICRODEPOSITS} - ${EventActions.END}`,
            })
            dispatch({ type: ACTIONS.VERIFYING_SUCCESS, payload: microdeposit })
          }}
        />
      )}

      {state.currentView === VIEWS.VERIFIED && (
        <Verified
          microdeposit={state.currentMicrodeposit}
          onDone={() => reduxDispatch({ type: ActionTypes.FINISH_MICRODEPOSITS })}
          sendPostMessage={sendPostMessage}
        />
      )}

      <PrivateAndSecure />
    </Container>
  )
}

Microdeposits.propTypes = {
  microdepositGuid: PropTypes.string,
  sendAnalyticsEvent: PropTypes.func.isRequired,
  sendPostMessage: PropTypes.func.isRequired,
  stepToIAV: PropTypes.func.isRequired,
}

const getViewByStatus = status => {
  if (status === MicrodepositsStatuses.PREINITIATED) {
    return VIEWS.ROUTING_NUMBER
  } else if ([MicrodepositsStatuses.INITIATED, MicrodepositsStatuses.REQUESTED].includes(status)) {
    return VIEWS.COME_BACK
  } else if ([MicrodepositsStatuses.DEPOSITED, MicrodepositsStatuses.DENIED].includes(status)) {
    return VIEWS.VERIFY_DEPOSITS
  } else if (status === MicrodepositsStatuses.VERIFIED) {
    return VIEWS.VERIFIED
  } else {
    return VIEWS.ERRORS
  }
}
