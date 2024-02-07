import _isFunction from 'lodash/isFunction'
import keycode from 'keycode'

import { TestScheduler } from 'rxjs/testing'

/**
 * Test helpers
 */

/**
 * Create an identity Proxy on an object where any key not defined returns the key.
 * e.g.
 *  const o = createIdentityProxy({ foo: 'abcd' });
 *  o.foo // returns 'abcd'
 *  o.bar // returns 'bar'
 */
export const createIdentityProxy = (target = {}) =>
  new Proxy(target, {
    get: (target, key) => target[key] || key,
  })

// TODO: replace uses with Promise.resolve()
export const createPromise = result => Promise.resolve(result)

export const createPromiseWithTimeout = (delay = 0, result = null) =>
  new Promise(resolve => setTimeout(() => resolve(result), delay))

export const createRejectedPromise = error => Promise.reject(error)

/**
 * Adapter to bridge Jest and Rx test utils
 *
 * The TestScheduler in Rx has an `expectObservable().toBe()` interface that is
 * intended to be a testing-library-agnostic interface to whatever testing
 * library you're using. The `toBe` name is unfortunate because it means
 * something specific in some testing libraries like Jest which is confusing.
 *
 * The expectRx methods below map that `expectObservable.toBe()` method to
 * various Jest expect methods that we may be interested in calling.
 *
 * For example, `expectRx.toMatchObject()` causes the enclosed
 * `expectObservable().toBe()` to call Jest's `expect().toMatchObject()`
 * method.
 *
 * Usage:
 *  expectRx.toMatchObject.run(yourTestSchedulerRunCallbackHere)
 *  expectRx.toBe.run(yourTestSchedulerRunCallbackHere)
 */
const wrapScheduler = compFn => cb => {
  const scheduler = new TestScheduler(compFn)

  return scheduler.run(({ ...params }) => cb({ scheduler, ...params }))
}

export const expectRx = {
  toBe: { run: wrapScheduler((a, b) => expect(a).toBe(b)) },
  toEqual: { run: wrapScheduler((a, b) => expect(a).toEqual(b)) },
  toMatchObject: { run: wrapScheduler((a, b) => expect(a).toMatchObject(b)) },
}

/**
 * Usage example:
 *   const { createReduxActionUtils, resetSpyObj } = require('utils/Test');
 *   const { itemAction } = require('utils/ActionHelpers');
 *   const FireflyAPIMock = jest.fn();
 *   const FooActions = require('inject!reduxify/actions/foo');
 *   const dispatcher = FooActions({
 *     'utils/FireflyAPI': FireflyAPIMock
 *   });
 *   const { actions, expectDispatch, resetDispatch } = createReduxActionUtils(dispatcher);
 *
 *   describe('Reduxy Actions', () => {
 *     let actions;
 *     beforeEach(() => {
 *       resetDispatch();
 *       resetSpyObj(FireflyAPIMock);
 *     });
 *     it('tests async stuff', done => {
 *       actions.myAction().then(() => {
 *         expectDispatch(itemAction(DID_SOME_STUFF, true));
 *         done();
 *       });
 *     });
 *   });
 */

export const createReduxActionUtils = (dispatcher, state = {}) => {
  const getState = jest.fn().mockReturnValue(state)
  const dispatch = jest.fn(arg => (_isFunction(arg) ? arg(dispatch, getState) : arg))
  const actions = dispatcher(dispatch)

  /* filter out the initial dispatch call that receives the action function
   * e.g.
   *   const dispatcher = dispatch => ({
   *     updateRetirementGoal: goal => dispatch(fetchUpdateRetirementGoal(goal))
   *   });
   */
  const allCallArgs = () => dispatch.mock.calls.filter(c => !_isFunction(c[0]))

  return {
    actions,

    expectDispatch: action => {
      expect(allCallArgs()).toEqual(expect.arrayContaining([[action]]))
    },

    expectNoDispatch: action => {
      expect(allCallArgs()).not.toEqual(expect.arrayContaining([[action]]))
    },

    resetDispatch: () => {
      // dispatch.mockClear() this is not working as expected
      jest.clearAllMocks()
    },
  }
}

export const clearSpyObj = spyObj =>
  Object.getOwnPropertyNames(spyObj).forEach(spyName => spyObj[spyName].mockClear())

export const resetSpyObj = spyObj =>
  Object.getOwnPropertyNames(spyObj).forEach(spyName => spyObj[spyName].mockReset())

/**
 * Mock a KeyboardEvent with the help of the keycode library.
 *
 * e.g. mockKeyboardEvent('enter')
 */
export const mockKeyboardEvent = key => ({
  keyCode: keycode.codes[key],
  nativeEvent: {
    preventDefault() {},
    stopImmediatePropagation() {},
    stopPropagation() {},
  },
  preventDefault() {},
  stopPropagation() {},
})
