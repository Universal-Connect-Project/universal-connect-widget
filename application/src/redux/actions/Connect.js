export const ActionTypes = {
  ACCEPT_DISCLOSURE: 'connect/accept_disclosure',
  ADD_MANUAL_ACCOUNT_SUCCESS: 'connect/add_manual_account_success',
  CONNECT_MEMBER_DATA_LOADING: 'connect/connect_member_data_loading',
  CONNECT_MEMBER_DATA_LOADED: 'connect/connect_member_data_loaded',
  CONNECT_MOUNTED: 'connect/connect_mounted',
  CONNECT_UNMOUNTED: 'connect/connect_unmounted',
  CONTINUE_OAUTH: 'connect/continue_oauth',
  CREATE_MEMBER_DUPLICATE: 'connect/create_member_duplicate',
  CREATE_MEMBER_SUCCESS: 'connect/create_member_success',
  EXISTING_MEMBER_ADD_ANOTHER: 'connect/existing_member_add_another',
  EXISTING_MEMBER_GO_BACK: 'connect/existing_member_go_back',
  EXIT_MICRODEPOSITS: 'connect/exit_microdeposits',
  FINISH_MICRODEPOSITS: 'connect/finish_microdeposits',
  HAS_INVALID_DATA: 'connect/has_invalid_data',
  INIT_JOB_SCHEDULE: 'connect/init_job_schedule',
  DELETE_MEMBER_SUCCESS: 'connect/delete_member_success',
  STEP_TO_DELETE_MEMBER_SUCCESS: 'connect/step_to_member_delete_success',
  LOAD_CONNECT: 'connect/load_connect',
  LOAD_CONNECT_SUCCESS: 'connect/load_connect_success',
  LOAD_CONNECT_ERROR: 'connect/load_connect_error',
  STEP_TO_ENTER_CREDENTIALS: 'connect/step_to_enter_credentials',
  STEP_TO_EXISTING_MEMBER: 'connect/step_to_existing_member',
  STEP_TO_UPDATE_CREDENTIALS: 'connect/step_to_update_credentials',
  STEP_TO_CONNECTING: 'connect/step_to_connecting',
  STEP_TO_MICRODEPOSIT: 'connect/step_to_microdeposit',
  STEP_TO_VERIFY_EXISTING_MEMBER: 'connect/step_to_verify_existing_member',
  STEP_TO_ADD_MANUAL_ACCOUNT: 'connect/step_to_add_manual_account',
  RESET_STEP: 'connect/reset_step',
  RESET_CONNECT: 'connect/reset_connect',
  RESET_CREDENTIALS: 'connect/reset_credentials',
  SELECT_INSTITUTION: 'connect/select_institution',
  SELECT_INSTITUTION_SUCCESS: 'connect/select_institution_success',
  SELECT_INSTITUTION_ERROR: 'connect/select_institution_error',
  SET_STEP_FROM_CONNECTION_STATUS: 'connect/set_step_from_connection_status',
  RETRY_OAUTH: 'connect/retry_oauth',
  START_OAUTH: 'connect/start_oauth',
  START_OAUTH_SUCCESS: 'connect/start_oauth_success',
  OAUTH_COMPLETE_SUCCESS: 'connect/oauth_complete/success',
  OAUTH_COMPLETE_ERROR: 'connect/oauth_complete/error',
  JOB_COMPLETE: 'connect/job_complete',
  CONNECT_COMPLETE: 'connect/complete',
  VERIFY_DIFFERENT_CONNECTION: 'connect/verify_different_connection',
  VERIFY_EXISTING_CONNECTION: 'connect/verify_existing_connection',
  UPDATE_MEMBER_SUCCESS: 'connect/update_member_success',
  MFA_CONNECT_SUBMIT: 'connect/mfa_connect_submit',
  MFA_CONNECT_SUBMIT_ERROR: 'connect/mfa_connect_submit_error',
  MFA_CONNECT_SUBMIT_SUCCESS: 'connect/mfa_connect_submit_success',
}

export const loadConnect = (config = {}) => ({ type: ActionTypes.LOAD_CONNECT, payload: config })
export const loadConnectSuccess = (dependencies = {}) => ({
  type: ActionTypes.LOAD_CONNECT_SUCCESS,
  payload: dependencies,
})

export const loadConnectError = err => ({
  type: ActionTypes.LOAD_CONNECT_ERROR,
  payload: err,
})

export const addExistingMember = () => ({ type: ActionTypes.EXISTING_MEMBER_ADD_ANOTHER })
export const goBackExistingMember = () => ({ type: ActionTypes.EXISTING_MEMBER_GO_BACK })
export const selectInstitution = guid => ({ type: ActionTypes.SELECT_INSTITUTION, payload: guid })
export const selectInstitutionSuccess = inst => ({
  type: ActionTypes.SELECT_INSTITUTION_SUCCESS,
  payload: inst,
})

export const selectInstitutionError = err => ({
  type: ActionTypes.SELECT_INSTITUTION_ERROR,
  payload: err,
})

export const initializeJobSchedule = (member, job, config) => ({
  type: ActionTypes.INIT_JOB_SCHEDULE,
  payload: { member, job, config },
})

export const startOauth = institutionGuid => ({
  type: ActionTypes.START_OAUTH,
  payload: institutionGuid,
})

export const startOauthSuccess = (member, oauthWindowURI) => ({
  type: ActionTypes.START_OAUTH_SUCCESS,
  payload: { member, oauthWindowURI },
})

export const startOauthError = err => ({
  type: ActionTypes.START_OAUTH_ERROR,
  payload: err,
})

export const jobComplete = (member, job) => ({
  type: ActionTypes.JOB_COMPLETE,
  payload: { member, job },
})

export const connectComplete = () => ({
  type: ActionTypes.CONNECT_COMPLETE,
})

export const handleOAuthError = ({ memberGuid, errorReason }) => ({
  type: ActionTypes.OAUTH_COMPLETE_ERROR,
  payload: { memberGuid, errorReason },
})
export const handleOAuthSuccess = memberGuid => ({
  type: ActionTypes.OAUTH_COMPLETE_SUCCESS,
  payload: memberGuid,
})
export const stepToEnterCredentials = () => ({ type: ActionTypes.STEP_TO_ENTER_CREDENTIALS })
export const stepToExistingMember = () => ({ type: ActionTypes.STEP_TO_EXISTING_MEMBER })

export const deleteMemberSuccess = memberGuid => ({
  type: ActionTypes.DELETE_MEMBER_SUCCESS,
  payload: { memberGuid },
})

export const stepToDeleteMemberSuccess = memberGuid => ({
  type: ActionTypes.STEP_TO_DELETE_MEMBER_SUCCESS,
  payload: { memberGuid },
})
export const stepToUpdateCredentials = () => ({ type: ActionTypes.STEP_TO_UPDATE_CREDENTIALS })
export const stepToConnecting = () => ({ type: ActionTypes.STEP_TO_CONNECTING })
export const resetStep = mode => ({ type: ActionTypes.RESET_STEP, payload: { mode } })
export const stepToAddManualAccount = () => ({ type: ActionTypes.STEP_TO_ADD_MANUAL_ACCOUNT })
export const setStepFromConnectionStatus = member => ({
  type: ActionTypes.SET_STEP_FROM_CONNECTION_STATUS,
  payload: member,
})
export const stepToVerifyExistingMember = () => ({
  type: ActionTypes.STEP_TO_VERIFY_EXISTING_MEMBER,
})
export const resetConnect = () => ({ type: ActionTypes.RESET_CONNECT })
export const stepToMicrodeposits = () => ({ type: ActionTypes.STEP_TO_MICRODEPOSIT })
export const retryOAuth = () => ({ type: ActionTypes.RETRY_OAUTH })
export const verifyDifferentConnection = () => ({
  type: ActionTypes.VERIFY_DIFFERENT_CONNECTION,
})
export const verifyExistingConnection = (member, institution) => ({
  type: ActionTypes.VERIFY_EXISTING_CONNECTION,
  payload: { member, institution },
})
export const send = (actionType, payload) => ({ type: actionType, payload })
export const addManualAccountSuccess = (account, member, institution) => ({
  type: ActionTypes.ADD_MANUAL_ACCOUNT_SUCCESS,
  payload: { account, member, institution },
})
