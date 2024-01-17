import * as ConnectActions from 'reduxify/actions/Connect'
const { ActionTypes, ...actions } = ConnectActions

describe('Connect Dispatcher', () => {
  it('has resetConnect', () => {
    expect(ActionTypes.RESET_CONNECT).toBeDefined()
    expect(actions.resetConnect()).toEqual({ type: ActionTypes.RESET_CONNECT })
  })

  it('has stepToUpdateCredentials', () => {
    expect(ActionTypes.STEP_TO_UPDATE_CREDENTIALS).toBeDefined()
    expect(actions.stepToUpdateCredentials()).toEqual({
      type: ActionTypes.STEP_TO_UPDATE_CREDENTIALS,
    })
  })

  it('has stepToConnecting', () => {
    expect(ActionTypes.STEP_TO_CONNECTING).toBeDefined()
    expect(actions.stepToConnecting()).toEqual({ type: ActionTypes.STEP_TO_CONNECTING })
  })

  it('has stepToVerifyExistingMember', () => {
    expect(ActionTypes.STEP_TO_VERIFY_EXISTING_MEMBER).toBeDefined()
    expect(actions.stepToVerifyExistingMember()).toEqual({
      type: ActionTypes.STEP_TO_VERIFY_EXISTING_MEMBER,
    })
  })

  describe('selecting an institution', () => {
    it('should have a selectInstitution action', () => {
      expect(ActionTypes.SELECT_INSTITUTION).toBeDefined()
      expect(actions.selectInstitution('INST-1')).toEqual({
        type: ActionTypes.SELECT_INSTITUTION,
        payload: 'INST-1',
      })
    })

    it('should have a selectInstitutionSuccess action', () => {
      expect(ActionTypes.SELECT_INSTITUTION_SUCCESS).toBeDefined()
      expect(actions.selectInstitutionSuccess({ guid: 'INST-1' })).toEqual({
        type: ActionTypes.SELECT_INSTITUTION_SUCCESS,
        payload: { guid: 'INST-1' },
      })
    })

    it('should have a selectInstitutionError action', () => {
      expect(ActionTypes.SELECT_INSTITUTION_ERROR).toBeDefined()
      expect(actions.selectInstitutionError({ status: 404 })).toEqual({
        type: ActionTypes.SELECT_INSTITUTION_ERROR,
        payload: { status: 404 },
      })
    })
  })

  describe('loading connection actions', () => {
    it('should have a loadConnect action that starts the loading process with a given config', () => {
      expect(ActionTypes.LOAD_CONNECT).toBeDefined()
      expect(actions.loadConnect({ config: true })).toEqual({
        type: ActionTypes.LOAD_CONNECT,
        payload: { config: true },
      })
    })

    it('should have a loadConnectSuccess creator that takes a member and institution', () => {
      const currentMemberGuid = 'MBR-1'
      const members = [{ guid: 'MBR-1' }]
      const institution = { guid: 'INST-1' }

      expect(ActionTypes.LOAD_CONNECT_SUCCESS).toBeDefined()
      expect(actions.loadConnectSuccess({ currentMemberGuid, members, institution })).toEqual({
        type: ActionTypes.LOAD_CONNECT_SUCCESS,
        payload: { currentMemberGuid, members, institution },
      })
    })

    it('should have a loadConnectError creator that takes an error', () => {
      expect(ActionTypes.LOAD_CONNECT_ERROR).toBeDefined()
      expect(actions.loadConnectError({ status: 404 })).toEqual({
        type: ActionTypes.LOAD_CONNECT_ERROR,
        payload: { status: 404 },
      })
    })
  })

  describe('oauth actions', () => {
    it('should have a start, success, and error action creators', () => {
      expect(actions.startOauth('INST-1')).toEqual({
        type: ActionTypes.START_OAUTH,
        payload: 'INST-1',
      })
      expect(actions.startOauthSuccess({ guid: 'MBR-1' }, 'something.com')).toEqual({
        type: ActionTypes.START_OAUTH_SUCCESS,
        payload: { member: { guid: 'MBR-1' }, oauthWindowURI: 'something.com' },
      })
    })
  })
})
