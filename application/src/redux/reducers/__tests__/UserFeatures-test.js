import { userFeatures as reducer, defaultState } from 'reduxify/reducers/UserFeatures'
import * as actions from 'reduxify/actions/UserFeatures'

describe('UserFeatures reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(defaultState)
  })

  it('should have a LOAD_USER_FEATURES reducer that sets loading to true', () => {
    expect(reducer({ loading: false }, actions.loadUserFeatures())).toEqual({ loading: true })
  })

  it('should have a LOAD_USER_FEATURES_SUCCESS reducer that sets the items to an array of user features and loading to false ', () => {
    const items = [{ foo: 'bar' }, { bar: 'foo' }]
    const stateBefore = { items: [], loading: true }
    const stateAfter = { items, loading: false }

    expect(reducer(stateBefore, actions.loadUserFeaturesSuccess({ user_features: items }))).toEqual(
      stateAfter,
    )
  })
})
