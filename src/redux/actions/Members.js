import FireflyAPI from '../../utils/FireflyAPI'

export const ActionTypes = {
  MEMBER_LOADED: 'members/member_loaded',
  MEMBERS_LOADED: 'members/members_loaded',
  MEMBERS_LOADED_ERROR: 'members/members_loaded_error',
  FAYE_MEMBERS_AGGREGATED: 'members/faye_members_aggregated',
  FAYE_MEMBERS_CREATED: 'members/faye_members_created',
  FAYE_MEMBERS_DELETED: 'members/faye_members_deleted',
  FAYE_MEMBERS_UPDATED: 'members/faye_members_updated',
  MEMBER_LOADING: 'members/member_loading',
  MEMBERS_LOADING: 'members/members_loading',
  MEMBER_MFA_DISMISSED: 'members/member_mfa_dismissed',
  SET_MEMBER_CREDS: 'members/set_member_creds',
  MFA_MODAL_SUBMIT: 'members/mfa_modal_submit',
  MFA_MODAL_ERROR: 'members/mfa_modal_error',
}

/**
 * REDUX OBSERVABLE EPICS
 */

/**
 * REDUX ACTIONS
 */
export const dismissMFAModalForMember = member => ({
  type: ActionTypes.MEMBER_MFA_DISMISSED,
  payload: member,
})

/**
 * This is used in the Connection Details view. When you click the sync
 * icon this will run a background aggregation job. NOTE - When a member
 * is created via the createMember epic, aggregation automatically happens.
 *
 * This is also used when a closed external account is reopened.
 */
const syncMember = guid => (dispatch, getState) => {
  const isHuman = getState().app.humanEvent
  const connectConfig = getState().initializedClientConfig?.connect

  return FireflyAPI.aggregate(guid, connectConfig, isHuman)
    .then(() => {
      return FireflyAPI.loadMemberByGuid(guid).then(member =>
        dispatch({
          type: ActionTypes.MEMBER_LOADED,
          payload: { item: member },
        }),
      )
    })
    .catch(() => {
      // Swallowing the error here if aggregation fails or we get a 409 conflict
    })
}

export const mfaModalSubmit = member => ({
  type: ActionTypes.MFA_MODAL_SUBMIT,
  payload: member,
})

export const loadMembers = () => ({ type: ActionTypes.MEMBERS_LOADING })

export const dispatcher = dispatch => ({
  dismissMFAModalForMember: member => dispatch(dismissMFAModalForMember(member)),
  loadMemberByGuid: guid => dispatch({ type: ActionTypes.MEMBER_LOADING, payload: guid }),
  loadMembers: () => dispatch(loadMembers()),
  mfaModalSubmit: member => dispatch(mfaModalSubmit(member)),
  syncAccounts: () =>
    FireflyAPI.syncAccounts().then(dispatch({ type: ActionTypes.MEMBERS_LOADING })),
  syncMember: guid => dispatch(syncMember(guid)),
})
