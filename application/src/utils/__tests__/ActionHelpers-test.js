import _keys from 'lodash/keys'
import { combineDispatchers, filterDispatcher } from '../ActionHelpers'

describe('ActionHelpers', () => {
  let dispatchCalled = false
  const dispatch = () => (dispatchCalled = true)
  const dispatcherA = dispatch => ({
    create: () => dispatch(),
    read: () => dispatch(),
  })
  const dispatcherB = dispatch => ({
    update: () => dispatch(),
    delete: () => dispatch(),
  })

  beforeEach(() => {
    dispatchCalled = false
  })

  describe('combineDispatchers', () => {
    it('combines dispatchers', () => {
      const actionHandlers = combineDispatchers(dispatcherA, dispatcherB)(dispatch)

      expect(_keys(actionHandlers).sort()).toEqual(['create', 'delete', 'read', 'update'])

      actionHandlers.read()
      expect(dispatchCalled).toEqual(true)
    })

    it('throws if there would be duplicate keys when combined', () => {
      expect(() => {
        combineDispatchers(dispatcherA, dispatcherA)(dispatch)
      }).toThrowError('Duplicate action keys found: create,read')
    })
  })

  describe('filterDispatcher', () => {
    it('returns a subset of the dispatchers', () => {
      expect(_keys(filterDispatcher(dispatcherA, 'create')(dispatch))).toEqual(['create'])
      expect(_keys(filterDispatcher(dispatcherA, 'read')(dispatch))).toEqual(['read'])
      expect(_keys(filterDispatcher(dispatcherA, 'FOO')(dispatch))).toEqual([])
    })
  })
})
