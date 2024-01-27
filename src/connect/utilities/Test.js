import { TestScheduler } from 'rxjs/testing'

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
