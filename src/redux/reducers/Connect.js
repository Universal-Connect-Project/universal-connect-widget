import _find from 'lodash/find'
import _get from 'lodash/get'
import { createReducer } from '../../utils/Reducer'
import { ActionTypes } from '../actions/Connect'
import { ActionTypes as AccountTransactionTypes } from '../actions/Accounts'
import { ActionTypes as ConnectionsActionTypes } from '../actions/Connections'
import { ActionTypes as WidgetProfileActionTypes } from '../actions/WidgetProfile'

import { ProcessingStatuses, ReadableStatuses } from '../../connect/const/Statuses'

import { VERIFY_MODE, STEPS } from '../../connect/const/Connect'
import * as JobSchedule from '../../connect/JobSchedule'
import { MicrodepositsStatuses } from '../../connect/views/microdeposits/const'

import { ReadableAccountTypes } from '../../connect/const/Accounts'

export const defaultState = {
  // this is the same as what we get out from the mergeProps function as our
  // final connectConfig for Connect we keep them here as well to avoid passing
  // them around to each and every epic/action that may need it
  connectConfig: {},
  error: null, // The most recent job request error, if any
  hasInvalidData: false, // no dda accounts for verification
  isComponentLoading: true, // whether or not the entire component is loading
  isConnectMounted: false,
  isOauthLoading: false, // whether or not the oauth process is starting
  oauthURL: null, // the URL to the oauth provider
  oauthErrorReason: null, // the reason there was an oauth error
  // whether or not there was an error *after* the user authenticated with
  // the provider, this means mx messed up after successful auth.
  loadError: null, // any error related to loading the widget, if any
  step: STEPS.DISCLOSURE,
  updateCredentials: false,
  selectedInstitution: {},
  // set by client config and resets after exiting Microdeposits back to Connect
  currentMicrodepositGuid: null,
  currentMemberGuid: '',
  members: [],
  jobSchedule: JobSchedule.UNINITIALIZED,
  widgetProfile: {},
}

/**
 * We need to make sure we clear out all of the connect state when it resets
 * or is unmounted from other widgets.
 *
 * However, there are some peices of 'app level' data (i.e. widgetProfile, members, isComponentLoading)
 * that we should keep around. This is because that data is only loaded once, when the app
 * initializes. We need to keep that data around until we can update connect to load the data for itself.
 */
const resetConnect = state => ({
  ...defaultState,
  isComponentLoading: state.isComponentLoading,
  members: state.members,
  widgetProfile: state.widgetProfile,
})

/**
 * Step reducers ==============================================================
 */
const resetStep = (state, action) => {
  const mode = action.payload.mode
  const iavMembers = getIavMembers(state.members)
  return {
    ...state,
    currentMemberGuid: defaultState.currentMemberGuid,
    step:
      mode === VERIFY_MODE && iavMembers.length > 0 ? STEPS.VERIFY_EXISTING_MEMBER : STEPS.SEARCH,
    error: defaultState.error,
    updateCredentials: defaultState.updateCredentials,
    oauthURL: defaultState.oauthURL,
    oauthErrorReason: defaultState.oauthErrorReason,
    jobSchedule: JobSchedule.UNINITIALIZED,
    hasInvalidData: defaultState.hasInvalidData,
  }
}

const verifyDifferentConnection = state => ({
  ...state,
  step: STEPS.SEARCH,
  error: defaultState.error,
  updateCredentials: defaultState.updateCredentials,
  oauthURL: defaultState.oauthURL,
})

// if going to enter creds make sure updateCredentials is false
const stepToEnterCredentials = state => ({
  ...state,
  step: STEPS.ENTER_CREDENTIALS,
  updateCredentials: false,
})

const stepToExistingMember = state => ({
  ...state,
  step: STEPS.EXISTING_MEMBER,
})

/**
 * Use to remove a member with "guid" from an array of members
 * @param {String} guid guid of member to remove
 * @param {Array<{guid: string}>} members Array of members with a guid property
 * @returns Array of remaining members
 */
const deleteMemberFromMembers = (guid, members) => members.filter(member => member.guid !== guid)

const deleteMemberSuccess = (state, { payload }) => ({
  ...state,
  members: deleteMemberFromMembers(payload.memberGuid, state.members),
})

const stepToDeleteMemberSuccess = (state, { payload }) => ({
  ...state,
  step: STEPS.DELETE_MEMBER_SUCCESS,
  members: deleteMemberFromMembers(payload.memberGuid, state.members),
})

// when updating credentials go to enter creds but with updateCredentials as true
const stepToUpdateCredentials = state => ({
  ...state,
  step: STEPS.ENTER_CREDENTIALS,
  updateCredentials: true,
})

const stepToConnecting = state => ({ ...state, step: STEPS.CONNECTING })
const stepToVerifyExistingMember = state => ({ ...state, step: STEPS.VERIFY_EXISTING_MEMBER })

const stepToAddManualAccount = state => ({ ...state, step: STEPS.ADD_MANUAL_ACCOUNT })

// Determine the next step via the currentMember's connection status
const setStepFromConnectionStatus = (state, { payload }) => ({
  ...state,
  step: getStepFromMember(payload),
})

function stepToLoginError(state) {
  return {
    ...state,
    step: STEPS.LOGIN_ERROR,
  }
}

const loadConnect = (state, { payload }) => ({
  ...defaultState,
  connectConfig: { ...state.connectConfig, ...payload },
  isConnectMounted: true,
  isComponentLoading: true,
  members: state.members,
  updateCredentials: payload.update_credentials || false,
  widgetProfile: state.widgetProfile,
})

const loadConnectSuccess = (state, action) => {
  const {
    members,
    member,
    microdeposit,
    config = {},
    institution = {},
    accounts = [],
  } = action.payload
  const currentMicrodepositGuid = config.current_microdeposit_guid
  let hasInvalidData = state.hasInvalidData
  let startingStep = getStartingStep(
    members,
    member,
    microdeposit,
    config,
    institution,
    state.widgetProfile,
  )
  const mfaCredentials = _get(member, 'mfa.credentials', [])
  const isSAS = mfaCredentials[0]?.external_id === 'single_account_select'

  if (
    member?.connection_status === ReadableStatuses.CHALLENGED &&
    isSAS &&
    !mfaCredentials[0].options.length
  ) {
    startingStep = STEPS.LOGIN_ERROR
    hasInvalidData = true
  }

  if (
    member?.connection_status === ReadableStatuses.CONNECTED &&
    config.mode === VERIFY_MODE &&
    (!accounts.length ||
      !accounts.filter(account =>
        [ReadableAccountTypes.CHECKING, ReadableAccountTypes.SAVINGS].includes(
          account.account_type,
        ),
      ).length)
  ) {
    startingStep = STEPS.LOGIN_ERROR
    hasInvalidData = true
  }

  return {
    ...state,
    currentMemberGuid: member?.guid ?? defaultState.currentMemberGuid,
    currentMicrodepositGuid,
    isComponentLoading: false,
    selectedInstitution: institution,
    step: startingStep,
    hasInvalidData,
    updateCredentials:
      member?.connection_status === ReadableStatuses.DENIED || state.updateCredentials,
    members,
  }
}

const loadConnectError = (state, action) => ({
  ...state,
  loadError: action.payload,
  isComponentLoading: false,
})

const goBackExistingMember = state => ({
  ...state,
  step: STEPS.SEARCH,
})

const acceptDisclosure = state => {
  let nextStep = STEPS.SEARCH

  if (
    state.selectedInstitution &&
    (state.connectConfig.current_institution_guid || state.connectConfig.current_institution_code)
  ) {
    // They configured connect with an institution
    nextStep = STEPS.ENTER_CREDENTIALS
  } else if (state.connectConfig.mode === VERIFY_MODE) {
    // They are in verification mode, with no member or institution pre configured
    const iavMembers = getIavMembers(state.members)
    nextStep = iavMembers.length > 0 ? STEPS.VERIFY_EXISTING_MEMBER : STEPS.SEARCH
  }

  return { ...state, step: nextStep }
}

/**
 * show or hide the existing member modal on select insitution success, based
 * on payload.
 */
const selectInstitutionSuccess = (state, action) => {
  const showExistingMember = _get(action, 'payload.showExistingMember', false)

  return {
    ...state,
    selectedInstitution: action.payload.institution,
    step: showExistingMember ? STEPS.EXISTING_MEMBER : STEPS.ENTER_CREDENTIALS,
  }
}

// Oauth reducers
const startOauthSuccess = (state, action) => ({
  ...state,
  currentMemberGuid: action.payload.member.guid,
  isOauthLoading: false,
  members: upsertMember(state, { payload: action.payload.member }),
  oauthURL: action.payload.oauthWindowURI,
})
const startOAuth = state => ({
  ...state,
  isOauthLoading: true,
  oauthURL: defaultState.oauthURL,
})
const oauthCompleteSuccess = (state, action) => {
  return {
    ...state,
    step: STEPS.CONNECTING,
    currentMemberGuid: action.payload,
  }
}
const oauthError = (state, action) => ({
  ...state,
  currentMemberGuid: action.payload.memberGuid,
  oauthURL: defaultState.oauthURL,
  oauthErrorReason: action.payload.errorReason,
  step: STEPS.OAUTH_ERROR,
})
const retryOAuth = state => ({
  ...state,
  oauthURL: defaultState.oauthURL,
  oauthErrorReason: defaultState.oauthErrorReason,
  step: STEPS.ENTER_CREDENTIALS,
})

const stepToMicrodeposits = state => ({
  ...defaultState,
  isComponentLoading: state.isComponentLoading,
  isConnectMounted: state.isConnectMounted,
  step: STEPS.MICRODEPOSITS,
  currentMicrodepositGuid: state.currentMicrodepositGuid,
})

const jobComplete = (state, action) => {
  const { member, job } = action.payload
  const members = upsertMember(state, { payload: member })

  // If we are connected, just update the jobschedule
  if (member.connection_status === ReadableStatuses.CONNECTED) {
    const scheduledJobs = JobSchedule.onJobFinished(state.jobSchedule, job)

    return { ...state, currentMemberGuid: member.guid, jobSchedule: scheduledJobs, members }
  }

  // If we are not connected, go to the step based on connection status
  return {
    ...state,
    currentMemberGuid: member.guid,
    members,
    step: getStepFromMember(member),
    updateCredentials:
      member.connection_status === ReadableStatuses.DENIED || state.updateCredentials,
  }
}

const createMemberSuccess = (state, action) => ({
  ...state,
  // TODO: Remove the use of `item` in the next two lines.
  currentMemberGuid: action.payload.item.guid,
  members: upsertMember(state, { payload: action.payload.item }),
  step: STEPS.CONNECTING,
})

const updateMemberSuccess = (state, action) => ({
  ...state,
  currentMemberGuid: action.payload.item.guid,
  members: upsertMember(state, { payload: action.payload.item }),
  step: STEPS.CONNECTING,
})

const loadConnectionsSuccess = (state, { payload }) => ({
  ...state,
  currentMemberGuid: payload.selectedMemberGuid || defaultState.currentMemberGuid,
  members: payload.members,
})

const initializeJobSchedule = (state, action) => {
  const { member, job, config } = action.payload

  const jobSchedule = JobSchedule.initialize(member, job, config)

  return { ...state, jobSchedule }
}

const verifyExistingConnection = (state, action) => {
  return {
    ...state,
    currentMemberGuid: action.payload.member.guid,
    step: STEPS.CONNECTING,
    selectedInstitution: action.payload.institution,
  }
}

const connectComplete = state => ({
  ...state,
  step: STEPS.CONNECTED,
})

const widgetProfileLoaded = (state, action) => ({
  ...state,
  widgetProfile: action.payload,
})

// Exit MD and reset state
const finishMicrodeposits = state => ({
  ...state,
  step: STEPS.SEARCH,
  error: defaultState.error,
  updateCredentials: defaultState.updateCredentials,
  oauthURL: defaultState.oauthURL,
  currentMicrodepositGuid: defaultState.currentMicrodepositGuid,
})

// Exit MD but dont reset state
const exitMicrodeposits = state => ({
  ...state,
  step: STEPS.SEARCH,
})

/**
 * When a manual account is added and it has a member in the payload, update
 * members to include the new member
 */
const addManualAccount = (state, { payload }) => {
  if (payload && payload.member) {
    return {
      ...state,
      members: upsertMember(state, { payload: payload.member }),
    }
  }
  return state
}

/**
 *  Helper functions
 */

// Helper to either update or add the member to the members array.
const upsertMember = (state, action) => {
  const loadedMember = action.payload
  const previousMember = _find(state.members, { guid: loadedMember.guid })

  if (previousMember) {
    return [...state.members.filter(member => member.guid !== previousMember.guid), loadedMember]
  }

  return [...state.members, loadedMember]
}

function getStartingStep(members, member, microdeposit, config, institution, widgetProfile) {
  const shouldUpdateCredentials = !!member;
    // member && (config.update_credentials || member.connection_status === ReadableStatuses.DENIED)

  if (shouldUpdateCredentials) {
    return STEPS.ENTER_CREDENTIALS
  } else if (member && config.current_member_guid) {
    const shouldStepToConnecting =
      member.connection_status === ReadableStatuses.REJECTED ||
      member.connection_status === ReadableStatuses.EXPIRED

    return shouldStepToConnecting ? STEPS.CONNECTING : getStepFromMember(member)
  } else if (
    config.current_microdeposit_guid &&
    config.mode === VERIFY_MODE &&
    microdeposit.status !== MicrodepositsStatuses.PREINITIATED
  ) {
    // They configured connect with a non PREINITIATED microdeposit, step to MICRODEPOSITS.
    return STEPS.MICRODEPOSITS
  } else if (widgetProfile.display_disclosure_in_connect) {
    return STEPS.DISCLOSURE
  } else if (institution && (config.current_institution_guid || config.current_institution_code)) {
    // They configured connect with an institution
    return STEPS.ENTER_CREDENTIALS
  } else if (config.mode === VERIFY_MODE) {
    // They are in verification mode, with no member or institution pre configured
    const iavMembers = getIavMembers(members)
    return iavMembers.length > 0 ? STEPS.VERIFY_EXISTING_MEMBER : STEPS.SEARCH
  }

  return STEPS.SEARCH
}

function getStepFromMember(member) {
  const connection_status = member.connection_status

  if (connection_status === ReadableStatuses.CHALLENGED) {
    return STEPS.MFA
  } else if (connection_status === ReadableStatuses.CONNECTED) {
    return STEPS.CONNECTED
  } else if (
    connection_status === ReadableStatuses.PENDING ||
    connection_status === ReadableStatuses.DENIED
  ) {
    return STEPS.ENTER_CREDENTIALS
  } else if (ProcessingStatuses.indexOf(connection_status) !== -1) {
    return STEPS.CONNECTING
  } else {
    return STEPS.LOGIN_ERROR
  }
}

function getIavMembers(members) {
  // Verification mode is enabled on the members, and they are not pre configured
  const iavMembers = members.filter(
    member =>
      member.verification_is_enabled && member.connection_status !== ReadableStatuses.PENDING,
  )
  return iavMembers
}

//This steps to the credential step of the same institution and allows you to create a new member
const resetCredentials = state => {
  return {
    ...state,
    step: STEPS.ENTER_CREDENTIALS,
    error: defaultState.error,
    updateCredentials: defaultState.updateCredentials,
    oauthURL: defaultState.oauthURL,
    oauthErrorReason: defaultState.oauthErrorReason,
    jobSchedule: JobSchedule.UNINITIALIZED,
    currentMemberGuid: defaultState.currentMemberGuid,
    hasInvalidData: defaultState.hasInvalidData,
  }
}
const hasInvalidData = state => {
  return {
    ...state,
    step: STEPS.LOGIN_ERROR,
    hasInvalidData: true,
  }
}
export const connect = createReducer(defaultState, {
  [ActionTypes.ACCEPT_DISCLOSURE]: acceptDisclosure,
  [ActionTypes.CREATE_MEMBER_SUCCESS]: createMemberSuccess,
  [ActionTypes.CONNECT_COMPLETE]: connectComplete,
  [ActionTypes.EXISTING_MEMBER_ADD_ANOTHER]: stepToEnterCredentials,
  [ActionTypes.EXISTING_MEMBER_GO_BACK]: goBackExistingMember,
  [ActionTypes.EXIT_MICRODEPOSITS]: exitMicrodeposits,
  [ActionTypes.FINISH_MICRODEPOSITS]: finishMicrodeposits,
  [ActionTypes.DELETE_MEMBER_SUCCESS]: deleteMemberSuccess,
  [ActionTypes.STEP_TO_DELETE_MEMBER_SUCCESS]: stepToDeleteMemberSuccess,
  [ActionTypes.HAS_INVALID_DATA]: hasInvalidData,
  [ActionTypes.INIT_JOB_SCHEDULE]: initializeJobSchedule,
  [ActionTypes.JOB_COMPLETE]: jobComplete,
  [ActionTypes.LOAD_CONNECT]: loadConnect,
  [ActionTypes.LOAD_CONNECT_ERROR]: loadConnectError,
  [ActionTypes.LOAD_CONNECT_SUCCESS]: loadConnectSuccess,
  [ActionTypes.OAUTH_COMPLETE_SUCCESS]: oauthCompleteSuccess,
  [ActionTypes.OAUTH_COMPLETE_ERROR]: oauthError,
  [ActionTypes.RESET_CONNECT]: resetConnect,
  [ActionTypes.RESET_CREDENTIALS]: resetCredentials,
  [ActionTypes.RESET_STEP]: resetStep,
  [ActionTypes.RETRY_OAUTH]: retryOAuth,
  [ActionTypes.SELECT_INSTITUTION_SUCCESS]: selectInstitutionSuccess,
  [ActionTypes.SET_STEP_FROM_CONNECTION_STATUS]: setStepFromConnectionStatus,
  [ActionTypes.START_OAUTH]: startOAuth,
  [ActionTypes.START_OAUTH_SUCCESS]: startOauthSuccess,
  [ActionTypes.STEP_TO_ADD_MANUAL_ACCOUNT]: stepToAddManualAccount,
  [ActionTypes.STEP_TO_CONNECTING]: stepToConnecting,
  [ActionTypes.STEP_TO_ENTER_CREDENTIALS]: stepToEnterCredentials,
  [ActionTypes.STEP_TO_EXISTING_MEMBER]: stepToExistingMember,
  [ActionTypes.STEP_TO_MICRODEPOSIT]: stepToMicrodeposits,
  [ActionTypes.STEP_TO_VERIFY_EXISTING_MEMBER]: stepToVerifyExistingMember,
  [ActionTypes.STEP_TO_UPDATE_CREDENTIALS]: stepToUpdateCredentials,
  [ActionTypes.VERIFY_DIFFERENT_CONNECTION]: verifyDifferentConnection,
  [ActionTypes.VERIFY_EXISTING_CONNECTION]: verifyExistingConnection,
  [ActionTypes.UPDATE_MEMBER_SUCCESS]: updateMemberSuccess,
  [ActionTypes.MFA_CONNECT_SUBMIT_SUCCESS]: updateMemberSuccess,
  [ActionTypes.MFA_CONNECT_SUBMIT_ERROR]: stepToLoginError,
  [ActionTypes.ADD_MANUAL_ACCOUNT_SUCCESS]: addManualAccount,
  [ConnectionsActionTypes.LOAD_CONNECTIONS_SUCCESS]: loadConnectionsSuccess,
  [AccountTransactionTypes.ADD_MANUAL_ACCOUNT_SUCCESS]: resetStep,
  [WidgetProfileActionTypes.WIDGET_PROFILE_LOADED]: widgetProfileLoaded,
})
