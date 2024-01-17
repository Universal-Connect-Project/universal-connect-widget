import { ActionTypes } from 'reduxify/actions/Analytics'
import { analytics as reducer, defaultState } from 'reduxify/reducers/Analytics'

const {
  CREATE_FEATURE_VISIT_SUCCESS,
  INITIALIZE_ANALYTICS_SESSION_SUCCESS,
  INITIALIZE_POSTHOG,
  INITIALIZE_POSTHOG_SUCCESS,
  UPDATE_DATA_SOURCE,
} = ActionTypes

describe('Analytics reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(defaultState)
  })

  it('should have a INITIALIZE_ANALYTICS_SESSION_SUCCESS reducer', () => {
    const currentSession = { foo: 'bar' }
    const stateBefore = { currentSession: { foo: 'notBar' }, featureVisit: { foo: 'bar' } }
    const stateAfter = { currentSession: { foo: 'bar' }, featureVisit: { foo: 'bar' } }

    expect(
      reducer(stateBefore, { type: INITIALIZE_ANALYTICS_SESSION_SUCCESS, payload: currentSession }),
    ).toEqual(stateAfter)
  })

  it('should have a CREATE_FEATURE_VISIT_SUCCESS reducer', () => {
    const featureVisit = { foo: 'bar' }
    const stateBefore = { currentSession: { foo: 'bar' }, featureVisit: { foo: 'notBar' } }
    const stateAfter = { currentSession: { foo: 'bar' }, featureVisit: { foo: 'bar' } }

    expect(
      reducer(stateBefore, { type: CREATE_FEATURE_VISIT_SUCCESS, payload: featureVisit }),
    ).toEqual(stateAfter)
  })

  describe('UPDATE_DATA_SOURCE', () => {
    const action = { type: UPDATE_DATA_SOURCE, payload: 'foo' }

    it('should set the data source', () => {
      const result = reducer(defaultState, action)

      expect(result.dataSource).toEqual('foo')
    })
  })

  describe('INITIALIZE_POSTHOG', () => {
    const action = { type: INITIALIZE_POSTHOG }

    it('should keep posthogInitialize as false', () => {
      const result = reducer(defaultState, action)

      expect(result.posthogInitialized).toEqual(defaultState.posthogInitialized)
    })
  })

  describe('INITIALIZE_POSTHOG_SUCCESS', () => {
    const action = { type: INITIALIZE_POSTHOG_SUCCESS }

    it('should set posthogInitialize to true', () => {
      const result = reducer(defaultState, action)

      expect(result.posthogInitialized).toEqual(true)
    })
  })
})
