import { agreement as reducer, defaultState } from 'reduxify/reducers/Agreement'
import { ActionTypes } from 'reduxify/actions/Agreement'

describe('Agreement reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(defaultState)
  })

  it('should load an agreement', () => {
    const reduced = reducer(
      {},
      { type: ActionTypes.AGREEMENT_LOADED, payload: { agreement: 'ABC-123' } },
    )
    const stateAfter = {
      error: false,
      loading: false,
      details: 'ABC-123',
    }

    expect(reduced).toEqual(stateAfter)
  })
  it('should handle agreement loading errors', () => {
    const reduced = reducer({}, { type: ActionTypes.AGREEMENT_ERROR })
    const stateAfter = {
      error: true,
      loading: false,
    }

    expect(reduced).toEqual(stateAfter)
  })
})
