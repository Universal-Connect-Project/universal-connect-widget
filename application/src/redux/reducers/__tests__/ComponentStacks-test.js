import { ActionTypes } from 'reduxify/actions/ComponentStacks'

import reducer, { defaultState } from 'reduxify/reducers/ComponentStacks'

const {
  POP_FOCUS_COMPONENT,
  POP_SCRIM_COMPONENT,
  PUSH_FOCUS_COMPONENT,
  PUSH_SCRIM_COMPONENT,
  SHIFT_SCRIM_COMPONENT,
  UNSHIFT_SCRIM_COMPONENT,
} = ActionTypes

describe('ComponentStacks Reducers', () => {
  it('should return the default state', () => {
    expect(reducer(undefined, {})).toEqual(defaultState) //eslint-disable-line no-undefined
  })

  describe('PUSH_SCRIM_COMPONENT', () => {
    it('should put our component into both autofocus and scrim stacks', () => {
      const action = { type: PUSH_SCRIM_COMPONENT, payload: 'foobar' }
      const result = reducer(defaultState, action)

      expect(result.focusStack).toHaveLength(1)
      expect(result.focusStack[0]).toEqual('foobar')
      expect(result.scrimStack).toHaveLength(1)
      expect(result.scrimStack[0]).toEqual('foobar')
    })

    it('should behave like a stack', () => {
      const action = { type: PUSH_SCRIM_COMPONENT, payload: 'baz' }
      const state = {
        focusStack: ['foo', 'bar'],
        scrimStack: ['foo', 'bar'],
      }
      const result = reducer(state, action)

      expect(result.focusStack).toHaveLength(3)
      expect(result.focusStack[2]).toEqual('baz')
      expect(result.scrimStack).toHaveLength(3)
      expect(result.scrimStack[2]).toEqual('baz')
    })
  })

  describe('POP_SCRIM_COMPONENT', () => {
    it('should pop off the last item of the stack', () => {
      const action = { type: POP_SCRIM_COMPONENT }
      const state = {
        focusStack: ['foo', 'bar'],
        scrimStack: ['foo', 'bar'],
      }
      const result = reducer(state, action)

      expect(result.focusStack).toHaveLength(1)
      expect(result.focusStack[0]).toEqual('foo')
      expect(result.scrimStack).toHaveLength(1)
      expect(result.scrimStack[0]).toEqual('foo')
    })
  })

  describe('UNSHIFT_SCRIM_COMPONENT', () => {
    it('should insert the item at the beginning of the stack', () => {
      const action = { type: UNSHIFT_SCRIM_COMPONENT, payload: 'baz' }
      const state = {
        focusStack: ['foo', 'bar'],
        scrimStack: ['foo', 'bar'],
      }
      const result = reducer(state, action)

      expect(result.focusStack).toHaveLength(3)
      expect(result.focusStack[0]).toEqual('baz')
      expect(result.scrimStack).toHaveLength(3)
      expect(result.scrimStack[0]).toEqual('baz')
    })
  })

  describe('SHIFT_SCRIM_COMPONENT', () => {
    it('should remove the first item in the stack', () => {
      const action = { type: SHIFT_SCRIM_COMPONENT }
      const state = {
        focusStack: ['foo', 'bar'],
        scrimStack: ['foo', 'bar'],
      }
      const result = reducer(state, action)

      expect(result.focusStack).toHaveLength(1)
      expect(result.focusStack[0]).toEqual('bar')
      expect(result.scrimStack).toHaveLength(1)
      expect(result.scrimStack[0]).toEqual('bar')
    })

    it('should return an empty array if it is the last item', () => {
      const action = { type: SHIFT_SCRIM_COMPONENT }
      const state = {
        focusStack: ['foo'],
        scrimStack: ['foo'],
      }
      const result = reducer(state, action)

      expect(result.focusStack).toHaveLength(0)
      expect(result.focusStack).toEqual([])
      expect(result.scrimStack).toHaveLength(0)
      expect(result.scrimStack).toEqual([])
    })
  })

  describe('POP_FOCUS_COMPONENT', () => {
    it('should pop off the last item of the focus stack but not the scrim stack', () => {
      const action = { type: POP_FOCUS_COMPONENT }
      const state = {
        focusStack: ['foo', 'bar'],
        scrimStack: ['foo', 'bar'],
      }
      const result = reducer(state, action)

      expect(result.focusStack).toHaveLength(1)
      expect(result.focusStack[0]).toEqual('foo')
      expect(result.scrimStack).toHaveLength(2)
      expect(result.scrimStack[1]).toEqual('bar')
    })
  })

  describe('PUSH_FOCUS_COMPONENT', () => {
    it('should put our component in just the focus stack', () => {
      const action = { type: PUSH_FOCUS_COMPONENT, payload: 'foobar' }
      const result = reducer(defaultState, action)

      expect(result.focusStack).toHaveLength(1)
      expect(result.focusStack[0]).toEqual('foobar')
      expect(result.scrimStack).toHaveLength(0)
    })

    it('should behave like a stack while not affecting the scrim stack', () => {
      const action = { type: PUSH_FOCUS_COMPONENT, payload: 'baz' }
      const state = {
        focusStack: ['foo', 'bar'],
        scrimStack: ['foo', 'bar'],
      }
      const result = reducer(state, action)

      expect(result.focusStack).toHaveLength(3)
      expect(result.focusStack[2]).toEqual('baz')
      expect(result.scrimStack).toHaveLength(2)
      expect(result.scrimStack[1]).toEqual('bar')
    })
  })
})
