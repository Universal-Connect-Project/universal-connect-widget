import _isNil from 'lodash/isNil'

export const createReducer = (initialState, handlers) => (state = initialState, action) => {
  return handlers.hasOwnProperty(action.type) ? handlers[action.type](state, action) : state
}

/**
 * Use this to check that an incoming item should be updated with the current
 * item.
 *
 * We ignore the update if there is no revision number. This may cause some
 * strange behavior (bugs) but this means that whatever source sent us that
 * data did not send us a revision number, which should be addressed in the
 * source.
 *
 * @returns {Bool}
 */
export const shouldUpdateItem = (currentItem, newItem) =>
  _isNil(currentItem.revision) || currentItem.revision <= newItem.revision

/**
 * Insert or update an item to a reducer that follows the `items: []` pattern.
 *
 * If the new item's revision number is outdated it will be ignored.
 *
 * @param {Object} state
 * @param {Object} item
 * @returns {Object} the updated state
 */
export const upsertItem = (state, item) => {
  let itemIsNew = true
  const items = []

  // not using map here as an optimization so only 1 iteration is needed
  state.items.forEach(i => {
    if (i.guid === item.guid) {
      itemIsNew = false // optimization
      items.push(shouldUpdateItem(i, item) ? { ...i, ...item } : i)
    } else {
      items.push(i)
    }
  })

  if (itemIsNew) items.push(item)

  return { ...state, items }
}

// DEPRECATED: use object spread notation instead.
export const updateObject = (oldObject, newValues) => {
  return Object.assign({}, oldObject, newValues)
}
