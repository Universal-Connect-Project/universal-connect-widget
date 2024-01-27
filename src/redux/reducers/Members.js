import _find from 'lodash/find'
import _get from 'lodash/get'
import { createReducer, updateObject, upsertItem } from '../../utils/Reducer'

import { ReadableStatuses } from '../../constants/Member'

import { ActionTypes } from '../actions/Members'
import { ActionTypes as NetWorthActionTypes } from '../actions/NetWorth'
import { ActionTypes as ConnectActionTypes } from '../actions/Connect'
import { ActionTypes as ConnectionsActionTypes } from '../actions/Connections'
import { ActionTypes as AccountActionTypes } from '../actions/Accounts'

const {
  MEMBER_LOADED,
  MEMBERS_LOADING,
  MEMBERS_LOADED,
  FAYE_MEMBERS_DELETED,
  FAYE_MEMBERS_UPDATED,
  MEMBER_MFA_DISMISSED,
  MFA_MODAL_ERROR,
  MFA_MODAL_SUBMIT,
} = ActionTypes
const { NET_WORTH_DATA_LOADED } = NetWorthActionTypes

export const defaultState = {
  loading: true,
  items: [],
  dismissedMFAMembers: {},
}
const membersLoading = state => updateObject(state, { loading: true })

const membersLoaded = (state, action) => ({
  ...state,
  items: action.payload.items,
  loading: false,
})

const netWorthDataLoaded = (state, action) =>
  membersLoaded(state, {
    payload: { items: action.payload.members },
  })

const memberLoaded = (state, action) => {
  const loadedMember = action.payload.item
  const previousMember = _find(state.items, { guid: loadedMember.guid })

  //only return true if transitioning from non challenged to challenged or if transitioning from challenged without credentials to challenged with credentials
  const shouldUpdateDismissedMFAMembers =
    (previousMember &&
      previousMember.connection_status !== ReadableStatuses.CHALLENGED &&
      loadedMember.connection_status === ReadableStatuses.CHALLENGED) ||
    (previousMember &&
      previousMember.connection_status === ReadableStatuses.CHALLENGED &&
      loadedMember.connection_status === ReadableStatuses.CHALLENGED &&
      _get(previousMember, 'mfa.credentials.length', 0) === 0 &&
      _get(loadedMember, 'mfa.credentials.length', 0) > 0)

  // If the loaded member exists in items, update it there.
  // If the update puts the member in mfa from another state, reset in dismissedMFAMembers
  if (previousMember) {
    return {
      ...upsertItem(state, loadedMember),
      dismissedMFAMembers: shouldUpdateDismissedMFAMembers
        ? { ...state.dismissedMFAMembers, [loadedMember.guid]: false }
        : state.dismissedMFAMembers,
    }
  }

  // otherwise, just add the new member to items
  // make sure the dismissedMFAMembers is false
  return {
    ...state,
    items: [...state.items, loadedMember],
  }
}

const memberDeleted = (state, action) => {
  const deletedMember = action.payload.item

  return {
    ...state,
    items: state.items.filter(member => member.guid !== deletedMember.guid),
  }
}

/**
 * Adds guid to dismissed members map object with true so that the modal will not continually prompt for MFA
 */
const dismissMFAModalForMember = (state, action) => ({
  ...state,
  dismissedMFAMembers: { ...state.dismissedMFAMembers, [action.payload.guid]: true },
})

/**
 * Adds guid to dismissed members map object with false so that the modal will appear for user to try again
 */
const mfaModalError = (state, action) => {
  return {
    ...state,
    dismissedMFAMembers: { ...state.dismissedMFAMembers, [action.payload.guid]: false },
  }
}

const startOAuthSuccess = (state, { payload }) => ({
  ...state,
  ...memberLoaded(state, { payload: { item: payload.member } }),
})

const loadConnectSuccess = (state, { payload }) => {
  if (payload && payload.member) {
    return {
      ...state,
      ...memberLoaded(state, { payload: { item: payload.member } }),
    }
  }
  return state
}

/**
 * When a manual account is added and it has a member in the payload, update
 * that member in state with the memberLoaded logic, otherwise, do nothing
 */
const addManualAccount = (state, { payload }) => {
  if (payload && payload.member) {
    return memberLoaded(state, { payload: { item: payload.member } })
  }

  return state
}

const loadConnectionsSuccess = (state, { payload }) => ({
  ...state,
  items: payload.members,
})

const handleJobComplete = (state, action) => {
  const member = action.payload.member

  return {
    ...memberLoaded(state, { payload: { item: member } }),
  }
}

export const members = createReducer(defaultState, {
  [MEMBERS_LOADED]: membersLoaded,
  [MEMBERS_LOADING]: membersLoading,
  [NET_WORTH_DATA_LOADED]: netWorthDataLoaded,
  [MEMBER_LOADED]: memberLoaded,
  [FAYE_MEMBERS_UPDATED]: memberLoaded,
  [FAYE_MEMBERS_DELETED]: memberDeleted,
  [MEMBER_MFA_DISMISSED]: dismissMFAModalForMember,
  [MFA_MODAL_SUBMIT]: dismissMFAModalForMember,
  [MFA_MODAL_ERROR]: mfaModalError,
  [AccountActionTypes.ADD_MANUAL_ACCOUNT_SUCCESS]: addManualAccount,
  [ConnectActionTypes.ADD_MANUAL_ACCOUNT_SUCCESS]: addManualAccount,
  [ConnectActionTypes.LOAD_CONNECT_SUCCESS]: loadConnectSuccess,
  [ConnectActionTypes.START_OAUTH_SUCCESS]: startOAuthSuccess,
  [ConnectActionTypes.CREATE_MEMBER_SUCCESS]: memberLoaded,
  [ConnectActionTypes.UPDATE_MEMBER_SUCCESS]: memberLoaded,
  [ConnectActionTypes.JOB_COMPLETE]: handleJobComplete,
  [ConnectActionTypes.MFA_CONNECT_SUBMIT]: dismissMFAModalForMember,
  [ConnectionsActionTypes.LOAD_CONNECTIONS_SUCCESS]: loadConnectionsSuccess,
  [ConnectionsActionTypes.MEMBER_LOADED]: memberLoaded,
})
