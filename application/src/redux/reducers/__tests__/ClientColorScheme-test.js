import { clientColorScheme as reducer, defaultState } from 'reduxify/reducers/ClientColorScheme'
import { ActionTypes as AppActionTypes } from 'reduxify/actions/App'

describe('ClientColorScheme reducer', () => {
  it('should return the default state', () => {
    expect(reducer(undefined, {})).toEqual(defaultState)
  })

  it('should update with the master data request for now', () => {
    const payload = {
      type: AppActionTypes.LOAD_MASTER_DATA_SUCCESS,
      payload: {
        client_color_scheme: { foo: 'bar' },
      },
    }
    const result = reducer(defaultState, payload)

    expect(result.foo).toEqual('bar')
  })
})
