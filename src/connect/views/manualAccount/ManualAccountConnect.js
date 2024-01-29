import React, { useEffect, useReducer } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { sendAnalyticsEvent } from '../../../redux/actions/Analytics'
import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import {
  EventCategories,
  EventLabels,
  EventActions,
  PageviewInfo,
} from '../../const/Analytics'
import { AccountTypeNames } from '../../../constants/Account'

import { Container } from '../../components/Container'
import { ManualAccountForm } from './ManualAccountForm'
import { ManualAccountMenu } from './ManualAccountMenu'
import { ManualAccountSuccess } from './ManualAccountSuccess'

export const ManualAccountConnect = props => {
  useAnalyticsPath(...PageviewInfo.CONNECT_MANUAL_ACCOUNT)
  const [state, dispatch] = useReducer(reducer, {
    showForm: false,
    showSuccess: false,
    // Autoload to the form if there is only one account type
    accountType: props.availableAccountTypes?.length === 1 ? props.availableAccountTypes[0] : null,
    validationErrors: {},
  })
  const reduxDispatch = useDispatch()
  const label = EventLabels.MANUAL_ACCOUNT

  useEffect(() => {
    reduxDispatch(
      sendAnalyticsEvent({
        category: EventCategories.CONNECT,
        label,
        action: `${label} - ${EventActions.START}`,
      }),
    )
  }, [])

  const handleAccountTypeSelect = accountType => {
    reduxDispatch(
      sendAnalyticsEvent({
        category: EventCategories.CONNECT,
        label,
        action: `${label} - ${EventActions.SELECTED_ACCOUNT_TYPE} - ${AccountTypeNames[accountType]}`,
      }),
    )
    dispatch({ type: Actions.SELECT_ACCOUNT_TYPE, payload: accountType })
  }
  const handleGoBackClick = () => {
    reduxDispatch(
      sendAnalyticsEvent({
        category: EventCategories.CONNECT,
        label,
        action: `${label} - ${EventActions.CANCEL}`,
      }),
    )
    props.onClose()
  }

  if (state.showSuccess) {
    return (
      <Container>
        <ManualAccountSuccess
          accountType={state.accountType}
          handleDone={() => {
            if (props.onManualAccountAdded) {
              props.onManualAccountAdded()
            }

            props.onClose()
          }}
        />
      </Container>
    )
  }

  return (
    <Container>
      {state.showForm ? (
        <ManualAccountForm
          accountType={state.accountType}
          handleGoBack={() => {
            reduxDispatch(
              sendAnalyticsEvent({
                category: EventCategories.CONNECT,
                label,
                action: `${label} - ${EventActions.RESTART}`,
              }),
            )
            dispatch({ type: Actions.CANCEL_FORM })
          }}
          handleSuccess={() => {
            reduxDispatch(
              sendAnalyticsEvent({
                category: EventCategories.CONNECT,
                label,
                action: `${label} - ${EventActions.END}`,
              }),
            )
            dispatch({ type: Actions.HANDLE_SUCCESS })
          }}
        />
      ) : (
        <ManualAccountMenu
          availableAccountTypes={props.availableAccountTypes || []}
          handleAccountTypeSelect={handleAccountTypeSelect}
          handleGoBack={handleGoBackClick}
        />
      )}
    </Container>
  )
}

ManualAccountConnect.propTypes = {
  availableAccountTypes: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  onManualAccountAdded: PropTypes.func,
}

const reducer = (state, action) => {
  switch (action.type) {
    case Actions.SELECT_ACCOUNT_TYPE:
      return {
        ...state,
        showForm: true,
        accountType: action.payload,
      }
    case Actions.CANCEL_FORM:
      return {
        ...state,
        showForm: false,
        accountType: null,
      }
    case Actions.HANDLE_SUCCESS:
      return {
        ...state,
        showSuccess: true,
        validationErrors: {},
      }
    default:
      return state
  }
}

const Actions = {
  SELECT_ACCOUNT_TYPE: 'manualAccount/selectAccountType',
  CANCEL_FORM: 'manualAccount/cancelForm',
  HANDLE_SUCCESS: 'manualAccount/handleSuccess',
}
