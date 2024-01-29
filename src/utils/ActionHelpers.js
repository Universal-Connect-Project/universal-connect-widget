import _flatMap from 'lodash/flatMap'
import _isEmpty from 'lodash/isEmpty'
import _keys from 'lodash/keys'
import _pick from 'lodash/pick'
import _uniq from 'lodash/uniq'

export const setupAction = (type, payload) => ({ type, payload })
export const itemAction = (type, item) => setupAction(type, { item })
export const itemsAction = (type, items) => setupAction(type, { items })
export const initiateRequest = type => dispatch => dispatch({ type })

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
 * Filter an action dispatcher to a subset of keys.
 * Useful for the `mapDispatchToProps` argument in redux `connect`.
 *
 * Example:
 *   const dispatcher = dispatch => ({
 *     loadStuff: () => dispatch(fetchLoadStuff()),
 *     updateStuff: thing => dispatch(fetchUpdateStuff(thing))
 *   })
 *   filterDispatcher(dispatcher, 'loadStuff')
 *
 * The example ultimately returns an object with only the 'loadStuff' key.
 */
export const filterDispatcher = (dispatcher, ...keys) => dispatch => {
  if (typeof dispatcher !== 'function') {
    throw new Error(
      `You are trying to filter a dispatcher with following actions (${keys})
      but the dispatcher isn't a function! Got ${typeof dispatcher} instead.`,
    )
  }

  const actions = dispatcher(dispatch)

  return _isEmpty(keys) ? actions : _pick(actions, keys)
}

// private
const findDuplicateKeys = actionsList => {
  const allActionKeys = _flatMap(actionsList, _keys)

  return _uniq(allActionKeys.filter(a1 => allActionKeys.filter(a2 => a1 === a2).length > 1))
}
