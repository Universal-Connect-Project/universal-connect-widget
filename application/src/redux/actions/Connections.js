import FireflyAPI from '../../utils/FireflyAPI'

const ActionTypes = {
  CONNECTIONS_MOUNTED: 'connections/mounted',
  CONNECTIONS_UNMOUNTED: 'connections/unmounted',
  LOAD_CONNECTIONS: 'connections/load',
  LOAD_CONNECTIONS_SUCCESS: 'connections/load_success',
  LOAD_CONNECTIONS_ERROR: 'connections/load_error',
  MEMBER_LOADED: 'connections/member_loaded',
}

/**
 * This is used in the Connection Details view. When you click the sync
 * icon this will run a background aggregation job. NOTE - When a member
 * is created via the createMember epic, aggregation automatically happens.
 *
 * This is also used when a closed external account is reopened.
 */
const syncMember = guid => (dispatch, getState) => {
  const isHuman = getState().app.humanEvent
  const connectConfig = getState().connect?.connectConfig

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

const dispatcher = dispatch => ({
  loadConnections: selectedMemberGuid =>
    dispatch({ type: ActionTypes.LOAD_CONNECTIONS, payload: selectedMemberGuid }),
  loadConnectionsSuccess: () => dispatch({ type: ActionTypes.LOAD_CONNECTIONS_SUCCESS }),
  loadConnectionsError: () => dispatch({ type: ActionTypes.LOAD_CONNECTIONS_ERROR }),
  connectionsUnmounted: () => dispatch({ type: ActionTypes.CONNECTIONS_UNMOUNTED }),
  syncMember: guid => dispatch(syncMember(guid)),
})

export { ActionTypes, dispatcher }
