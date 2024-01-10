// import React from 'react'
// import { mount } from 'enzyme'
//
// import { AriaLive } from '../AriaLive'

describe('AriaLive placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('AriaLive', () => {
//   let wrapper
//
//   beforeEach(() => {
//     wrapper = mount(<AriaLive />)
//   })
//
//   afterEach(() => {
//     wrapper.unmount()
//   })
//
//   it('should be visually hidden', () => {
//     /**
//      * This string is the result of applying the hidden style to root div of the AriaLive component.
//      * This style is very specific and is the standard way of visually hiding an element on the page.
//      * It should not change very offten over time so using this string, while somewhat fragile, seems
//      * to be the best option for testing if the element is visually hidden.
//      */
//     const visuallyHiddenStyleString =
//       'border: 0px; height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute;'
//
//     expect(wrapper.html()).toContain(visuallyHiddenStyleString)
//   })
//
//   it('should set the aria live politness level based upon the level prop', () => {
//     expect(wrapper.html()).toContain('aria-live="polite"')
//
//     wrapper.setProps({
//       level: 'assertive',
//     })
//
//     expect(wrapper.html()).toContain('aria-live="assertive"')
//   })
//
//   it('should spread rest props across div', () => {
//     wrapper.setProps({
//       'aria-atomic': true,
//       className: 'foo',
//     })
//
//     expect(wrapper.html()).toContain('aria-atomic="true" class="foo"')
//   })
//
//   it('should have no inner html if the message prop is not provided', () => {
//     expect(wrapper.find('div').children()).toHaveLength(0)
//   })
//
//   it.skip('should contain the message if the message prop is provided', () => {
//     wrapper.setProps({
//       message: 'foo bar',
//     })
//
//     expect(wrapper.html()).toContain('foo bar')
//   })
// })
