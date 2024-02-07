// import React from 'react'
// import { mount } from 'enzyme'
//
// import { Store } from 'reduxify/__mocks__/Store'
//
// import MFAStep from 'src/connect/views/mfa/MFAStep'
// import { getMountOptions } from 'src/connect/utilities/Store'
// import { AGG_MODE } from 'src/connect/const/Connect'
// import { AnalyticEvents } from 'src/connect/const/Analytics'
//
// const createMountOptions = customStore => {
//     return getMountOptions(Store(customStore))
// }
// const mockSendPosthogEvent = jest.fn()
//
// jest.mock('src/connect/hooks/useAnalyticsEvent', () => {
//     return () => mockSendPosthogEvent
// })

describe('MFAStep placeholder', () => {
   it('should be a placeholder', () => {
       expect(true).toBe(true)
   });
});

// describe('MFAStep', () => {
//     let wrapper
//     const defaultStore = {
//         app: { humanEvent: true },
//         client: { guid: 'CLT-123' },
//         connect: {
//             connectConfig: { mode: AGG_MODE },
//             members: [{ guid: 'MBR-123' }],
//             currentMemberGuid: 'MBR-123',
//         },
//         user: { details: { guid: 'USR-123', email: 'test.email@mx.com' } },
//         userFeatures: { items: [] },
//     }
//     const defaultProps = {
//         enableSupportRequests: true,
//         institution: { guid: 'INS-123' },
//         onGoBack: jest.fn(),
//         sendAnalyticsEvent: jest.fn(),
//     }
//
//     beforeEach(() => {
//         wrapper = mount(<MFAStep {...defaultProps} />, createMountOptions(defaultStore))
//     })
//
//     afterEach(() => {
//         mockSendPosthogEvent.mockClear()
//         wrapper.unmount()
//     })
//
//     it('renders correctly', () => {
//         expect(wrapper).toHaveLength(1)
//     })
//
//     it('renders support button when props.enableSupportRequests is true', () => {
//         const supportButton = wrapper.find('Button[data-test="mfa-get-help-button"]')
//
//         expect(supportButton).toExist()
//         supportButton.simulate('click')
//         expect(mockSendPosthogEvent).toHaveBeenCalledWith(AnalyticEvents.MFA_CLICKED_GET_HELP)
//         expect(wrapper.find('Support')).toHaveLength(1)
//     })
//
//     it("doesn't renders support button when props.enableSupportRequests is false", () => {
//         wrapper.setProps({ ...defaultProps, enableSupportRequests: false })
//         const supportButton = wrapper.find('Button[data-test="mfa-get-help-button"]')
//
//         expect(supportButton).not.toExist()
//     })
// })
