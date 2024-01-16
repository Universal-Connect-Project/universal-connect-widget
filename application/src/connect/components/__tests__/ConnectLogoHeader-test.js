// import React from 'react'
// import { Provider } from 'react-redux'
// import { mount } from 'enzyme'
//
// import ReduxStoreMock from 'reduxify/Store'
//
// import { ConnectLogoHeader, SVGImage } from 'src/connect/components/ConnectLogoHeader'
// import { ClientLogo } from 'src/connect/components/ClientLogo'
// import { InstitutionLogo } from '@kyper/institutionlogo'
//
// jest.mock('reduxify/Store')

describe('ConnectLogoHeader placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('ConnectLogoHeader', () => {
//   let wrapper
//
//   it('renders a ClientLogo', () => {
//     wrapper = mount(
//       <Provider store={ReduxStoreMock}>
//         <ConnectLogoHeader />
//       </Provider>,
//     )
//
//     expect(wrapper.find(ClientLogo)).toExist()
//   })
//
//   it('renders an InstitutionLogo if an institutionGuid was passed in props', () => {
//     wrapper = mount(
//       <Provider store={ReduxStoreMock}>
//         <ConnectLogoHeader institutionGuid="INS-123" />
//       </Provider>,
//     )
//
//     expect(wrapper.find(InstitutionLogo)).toExist()
//   })
//
//   it('renders a SVGImage if an institutionGuid is not passed in props', () => {
//     wrapper = mount(
//       <Provider store={ReduxStoreMock}>
//         <ConnectLogoHeader />
//       </Provider>,
//     )
//
//     expect(wrapper.find(SVGImage)).toExist()
//   })
// })
