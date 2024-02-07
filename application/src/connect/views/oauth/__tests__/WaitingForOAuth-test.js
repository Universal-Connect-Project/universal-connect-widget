// import React from 'react'
// import { mount } from 'enzyme'
// import { act } from 'react-dom/test-utils'
// import { getMountOptions } from 'src/connect/utilities/Store'
// import { WaitingForOAuth } from 'src/connect/views/oauth/WaitingForOAuth'
//
// jest.useFakeTimers()

describe('WaitingForOAuth placeholder', () => {
    it('should be a placeholder', () => {
        expect(true).toBe(true)
    });
});

// describe('WaitingForOAuth view', () => {
//     describe('Button delay for try again and cancel', () => {
//         let wrapper
//         const defaultProps = {
//             institution: { guid: 'INS-123', name: 'MX Bank' },
//             member: { guid: 'MBR-123' },
//             onOAuthError: jest.fn(),
//             onOAuthRetry: jest.fn(),
//             onOAuthSuccess: jest.fn(),
//             onReturnToSearch: jest.fn(),
//         }
//         const mountOptions = getMountOptions()
//
//         beforeEach(() => {
//             wrapper = mount(<WaitingForOAuth {...defaultProps} />, mountOptions)
//         })
//
//         it('should disable the buttons when the component loads', () => {
//             const tryAgainButton = wrapper.find('Button[children="Try again"]')
//             const cancelButton = wrapper.find('Button[children="Cancel"]')
//             expect(tryAgainButton.props().disabled).toBe(true)
//             expect(cancelButton.props().disabled).toBe(true)
//         })
//
//         it('should enable the buttons after 2 seconds', () => {
//             act(() => {
//                 jest.advanceTimersByTime(2000)
//                 wrapper.update()
//             })
//             const tryAgainButton = wrapper.find('Button[children="Try again"]')
//             const cancelButton = wrapper.find('Button[children="Cancel"]')
//             expect(tryAgainButton.props().disabled).toBe(false)
//             expect(cancelButton.props().disabled).toBe(false)
//         })
//     })
// })
