import { ActionTypes } from 'reduxify/actions/App'
import { app as reducer, defaultState } from 'reduxify/reducers/App'

const { LOAD_MASTER_DATA_SUCCESS, SESSION_IS_TIMED_OUT } = ActionTypes

describe('app reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(defaultState)
  })

  describe('SESSION_IS_TIMED_OUT', () => {
    it('should mark the session timed out', () => {
      const action = { type: SESSION_IS_TIMED_OUT }

      expect(reducer(undefined, action).sessionIsTimedOut).toBe(true)
    })
  })

  describe('LOAD_MASTER_DATA_SUCCESS', () => {
    it('should updating the loading boolean', () => {
      const action = { type: LOAD_MASTER_DATA_SUCCESS }

      expect(reducer(undefined, action).loading).toEqual(false)
    })
  })
})
