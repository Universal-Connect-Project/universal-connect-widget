// import React from 'react'
// import { mount, render } from 'enzyme'
//
// import { Text } from '@kyper/text'
//
// import { __, B } from 'src/connect/utilities/Intl'

describe('Intl placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('Intl fns', () => {
//   it('should not have strong elements', () => {
//     const ret = <B>{__('This is a statement.')}</B>
//     const wrapper = mount(ret)
//
//     expect(wrapper.find('strong')).toHaveLength(0)
//   })
//
//   it('should have strong elements', () => {
//     const ret = <B>{__('This is a *bold* statement. And *so* is this. But *not this.')}</B>
//     const wrapper = mount(ret)
//
//     expect(wrapper.find('strong')).toHaveLength(2)
//   })
//
//   it('should produce text', () => {
//     const ret = <B>{__('This is a *bold* statement. And *so* is this. But *not this.')}</B>
//     const wrapper = render(ret)
//
//     expect(wrapper.text()).toBe('This is a bold statement. And so is this. But *not this.')
//   })
//
//   it('should override tag', () => {
//     const ret = (
//       <B boldTag="span">{__('This is a *bold* statement. And *so* is this. But *not this.')}</B>
//     )
//     const wrapper = mount(ret)
//
//     expect(wrapper.find('span')).toHaveLength(2)
//   })
//
//   it('should override tag with custom component', () => {
//     const MyEl = props => <div className="foo">{props.children}</div>
//
//     const ret = (
//       <B boldTag={MyEl}>{__('This is a *bold* statement. And *so* is this. But *not this.')}</B>
//     )
//     const wrapper = mount(ret)
//
//     expect(wrapper.find('div')).toHaveLength(2)
//   })
//
//   it('should work with kyper text via wrapper', () => {
//     const MyEl = props => (
//       <Text bold={true} tag="span">
//         {props.children}
//       </Text>
//     )
//
//     const ret = (
//       <B boldTag={MyEl}>{__('This is a *bold* statement. And *so* is this. But *not this.')}</B>
//     )
//     const wrapper = mount(ret)
//
//     expect(wrapper.find('span.bold')).toHaveLength(2)
//   })
//
//   it('should work with kyper text directly', () => {
//     const ret = (
//       <B bold={true} boldTag={Text} tag="span">
//         {__('This is a *bold* statement. And *so* is this. But *not this.')}
//       </B>
//     )
//     const wrapper = mount(ret)
//
//     expect(wrapper.find('span.bold')).toHaveLength(2)
//   })
// })
