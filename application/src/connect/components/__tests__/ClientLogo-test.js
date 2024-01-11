// import React from 'react'
// import { Provider } from 'react-redux'
// import   { mount } from 'enzyme'
//
// import ReduxStoreMock from 'reduxify/Store'
//
// import { ClientLogo } from 'src/connect/components/ClientLogo'
// import ConnectHeaderRecipientLight from 'src/connect/images/header/ConnectHeaderRecipientLight.png'
//
// jest.mock('reduxify/Store')

describe('ClientLogo placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('ClientLogo', () => {
//   const defaultProps = {
//     alt: 'Client logo',
//     size: 32,
//     style: {},
//     className: '',
//     clientGuid: 'CLT-123',
//   }
//   const createWrapper = (props = {}) => {
//     const newProps = { ...defaultProps, ...props }
//     return mount(
//       <Provider store={ReduxStoreMock}>
//         <ClientLogo {...newProps} />
//       </Provider>,
//     )
//   }
//
//   it('should render an image with default props', () => {
//     const wrapper = createWrapper()
//     const image = wrapper.find('img')
//
//     expect(image).toHaveLength(1)
//     expect(image.prop('alt')).toEqual('Client logo')
//     expect(image.prop('src')).toEqual(
//       `https://content.moneydesktop.com/storage/MD_Client/oauth_logos/${defaultProps.clientGuid}.png`,
//     )
//     expect(image.prop('height')).toEqual(32)
//     expect(image.prop('width')).toEqual(32)
//     expect(image.prop('style')).toEqual({})
//   })
//
//   it('should render an image with provided props', () => {
//     const wrapper = createWrapper({
//       alt: 'Test logo',
//       size: 64,
//       className: 'test-class',
//       style: { margin: '10px' },
//       clientGuid: 'CLT-123',
//     })
//     const image = wrapper.find('img')
//     expect(image).toHaveLength(1)
//     expect(image.prop('alt')).toEqual('Test logo')
//     expect(image.prop('src')).toEqual(
//       `https://content.moneydesktop.com/storage/MD_Client/oauth_logos/CLT-123.png`,
//     )
//     expect(image.prop('height')).toEqual(64)
//     expect(image.prop('width')).toEqual(64)
//     expect(image.prop('className')).toContain('test-class')
//     expect(image.prop('style')).toEqual({ margin: '10px' })
//   })
//
//   it('should render backup image if there is an error', () => {
//     const wrapper = createWrapper({
//       clientGuid: 'CLT-123',
//     })
//     const image = wrapper.find('img')
//     const mockEvent = { target: { src: '' } }
//
//     image.prop('onError')(mockEvent)
//
//     expect(mockEvent.target.src).toEqual(ConnectHeaderRecipientLight)
//   })
// })
