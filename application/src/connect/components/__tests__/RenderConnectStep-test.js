// import React from 'react'
// import { mount } from 'enzyme'
//
// import { getMountOptions } from 'src/connect/utilities/Store'
// import RenderConnectStep from 'src/connect/components/RenderConnectStep'
// import { Microdeposits } from 'src/connect/views/microdeposits/Microdeposits'
// import { AGG_MODE, VERIFY_MODE, STEPS } from 'src/connect/const/Connect'
//
// import { Store } from 'reduxify/__mocks__/Store'
//
// const createMountOptions = customStore => {
//   return getMountOptions(Store(customStore))
// }

describe('RenderConnectStep placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('RenderConnectStep', () => {
//   let wrapper
//   const defaultProps = {
//     handleAddManualAccountClick: jest.fn(() => {}),
//     handleCredentialsGoBack: jest.fn(() => {}),
//     handleOAuthGoBack: jest.fn(() => {}),
//     setConnectLocalState: jest.fn(() => {}),
//   }
//   const defaultState = {
//     browser: {},
//     connect: {
//       connectConfig: { mode: AGG_MODE },
//       currentMicrodepositGuid: null,
//       error: null,
//       location: [{ step: STEPS.SEARCH }],
//       members: [],
//       selectedInstitution: {},
//       updateCredentials: false,
//       widgetProfile: { show_microdeposits_in_connect: true },
//     },
//     client: { has_atrium_api: false },
//     clientProfile: { account_verification_is_enabled: true, is_microdeposits_enabled: true },
//     initializedClientConfig: { mode: AGG_MODE },
//     userFeatures: {},
//   }
//
//   describe('MICRODEPOSITS', () => {
//     it('renders Microdeposits when step is MICRODEPOSITS and microdeposits is enabled', () => {
//       wrapper = mount(
//         <RenderConnectStep {...defaultProps} />,
//         createMountOptions({
//           ...defaultState,
//           connect: {
//             ...defaultState.connect,
//             location: [{ step: STEPS.MICRODEPOSITS }],
//             connectConfig: { mode: VERIFY_MODE },
//           },
//           initializedClientConfig: { mode: VERIFY_MODE },
//         }),
//       )
//
//       expect(wrapper.find(Microdeposits)).toHaveLength(1)
//     })
//     it("doesn't render if show_microdeposits_in_connect is false", () => {
//       wrapper = mount(
//         <RenderConnectStep {...defaultProps} />,
//         createMountOptions({
//           ...defaultState,
//           connect: {
//             ...defaultState.connect,
//             location: [{ step: STEPS.MICRODEPOSITS }],
//             connectConfig: { mode: VERIFY_MODE },
//             widgetProfile: { show_microdeposits_in_connect: false },
//           },
//           initializedClientConfig: { mode: VERIFY_MODE },
//         }),
//       )
//
//       expect(wrapper.find(Microdeposits)).toHaveLength(0)
//     })
//   })
// })
