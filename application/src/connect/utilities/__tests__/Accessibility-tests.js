import { focusElement } from 'src/connect/utilities/Accessibility'

describe('Accessibility Utils', () => {
  describe('focusElement', () => {
    const focus = jest.fn()

    beforeEach(() => {
      focus.mockClear()
    })

    describe('focusElement', () => {
      it('should call focus if it has it', () => {
        focusElement({ focus })
        expect(focus).toHaveBeenCalled()
      })
      it('should not call focus if it does not have it', () => {
        focusElement({})
        expect(focus).not.toHaveBeenCalled()
      })
      it('should not call focus if it does not exist', () => {
        focusElement()
        expect(focus).not.toHaveBeenCalled()
      })
    })
  })
})
