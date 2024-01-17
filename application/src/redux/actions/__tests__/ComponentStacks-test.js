import {
  ActionTypes,
  popFocusComponentFromStack,
  popScrimComponentFromStack,
  pushFocusComponentToStack,
  pushScrimComponentToStack,
  shiftComponentFromStack,
  unshiftScrimComponentToStack,
} from 'reduxify/actions/ComponentStacks'

describe('ComponentStacks actions', () => {
  describe('popScrimComponentFromStack', () => {
    it('should trigger the appropriate action', () => {
      const response = popScrimComponentFromStack()

      expect(response.type).toEqual(ActionTypes.POP_SCRIM_COMPONENT)
    })
  })

  describe('pushScrimComponentToStack', () => {
    it('should pass along the unique component name', () => {
      const uniqueName = 'foobar'
      const response = pushScrimComponentToStack(uniqueName)

      expect(response.payload).toEqual(uniqueName)
      expect(response.type).toEqual(ActionTypes.PUSH_SCRIM_COMPONENT)
    })
  })

  describe('shiftComponentFromStack', () => {
    it('should trigger the appropriate action', () => {
      const response = shiftComponentFromStack()

      expect(response.type).toEqual(ActionTypes.SHIFT_SCRIM_COMPONENT)
    })
  })

  describe('unshiftScrimComponentToStack', () => {
    it('should pass along the unique component name', () => {
      const uniqueName = 'foobar'
      const response = unshiftScrimComponentToStack(uniqueName)

      expect(response.payload).toEqual(uniqueName)
      expect(response.type).toEqual(ActionTypes.UNSHIFT_SCRIM_COMPONENT)
    })
  })

  describe('popFocusComponentFromStack', () => {
    it('should trigger the appropriate action', () => {
      const response = popFocusComponentFromStack()

      expect(response.type).toEqual(ActionTypes.POP_FOCUS_COMPONENT)
    })
  })

  describe('pushFocusComponentToStack', () => {
    it('should pass along the unique component name', () => {
      const uniqueName = 'foobar'
      const response = pushFocusComponentToStack(uniqueName)

      expect(response.payload).toEqual(uniqueName)
      expect(response.type).toEqual(ActionTypes.PUSH_FOCUS_COMPONENT)
    })
  })
})
