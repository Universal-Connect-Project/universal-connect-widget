import { createStore } from 'redux'

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
export default function createSimpleStore(state) {
  return createStore((state = {}, action) => {
    switch (action.type) {
      default:
        return state
    }
  }, state)
}
