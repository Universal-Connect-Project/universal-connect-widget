import _flatMap from 'lodash/flatMap'
import _isEmpty from 'lodash/isEmpty'
import _keys from 'lodash/keys'
import _uniq from 'lodash/uniq'
import { createStore } from 'redux'

/**
 * Combine multiple action dispatchers.
 * Useful for the `mapDispatchToProps` argument in redux `connect`.
 */
export const combineDispatchers = (...dispatchers) => dispatch => {
  const actionsList = dispatchers.map(dispatcher => dispatcher(dispatch))
  const duplicateKeys = findDuplicateKeys(actionsList)

  if (!_isEmpty(duplicateKeys))
    throw new Error(`Duplicate action keys found: ${duplicateKeys.join(',')}`)

  return Object.assign({}, ...actionsList)
}

/**
 * Creates a reducer function that handles different actions based on their type.
 *
 * @param {any} initialState - The initial state of the reducer.
 * @param {Object} handlers - An object containing action type as key and corresponding handler function as value.
 * @return {Function} The reducer function that takes the current state and action as arguments and returns the updated state.
 */
export const createReducer = (initialState, handlers) => (state = initialState, action) => {
  return handlers.hasOwnProperty(action.type) ? handlers[action.type](state, action) : state
}

/**
 * @description - When testing code that uses redux
 * selectors, you can set up a simple store with the exact
 * state you need for your test.
 *
 * Note - This is most useful for Unit Tests rather than
 * Integration level tests.
 *
 * If you need more of the behavior of a full redux store and
 * all of its configurations, use src/redux/__mocks__/Store.js
 *
 * @param {any} state - Data to be used for selectors
 * @returns
 */
export function createSimpleStore(state) {
  return createStore((state = {}, action) => {
    switch (action.type) {
      default:
        return state
    }
  }, state)
}

// private
const findDuplicateKeys = actionsList => {
  const allActionKeys = _flatMap(actionsList, _keys)

  return _uniq(allActionKeys.filter(a1 => allActionKeys.filter(a2 => a1 === a2).length > 1))
}
