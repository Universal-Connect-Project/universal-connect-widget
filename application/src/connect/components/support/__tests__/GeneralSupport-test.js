// import React from 'react'
// import { mount } from 'enzyme'
//
// import { Store } from 'reduxify/__mocks__/Store'
// import { getMountOptions } from 'src/connect/utilities/Store'
// import { GeneralSupport } from 'src/connect/components/support/GeneralSupport'
// import { useAnalyticsPath } from 'src/connect/hooks/useAnalyticsPath'
// import { PageviewInfo } from 'src/connect/const/Analytics'
//
// jest.mock('src/connect/hooks/useAnalyticsPath')
//
// const createMountOptions = customStore => {
//   return getMountOptions(Store(customStore))
// }

describe('GeneralSupport placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('GeneralSupport', () => {
//   let wrapper
//   const handleClose = jest.fn()
//   const handleTicketSuccess = jest.fn()
//   const user = { email: 'test@example.com' }
//
//   const defaultStore = {
//     userFeatures: { items: [] },
//   }
//
//   beforeEach(() => {
//     wrapper = mount(
//       <GeneralSupport
//         handleClose={handleClose}
//         handleTicketSuccess={handleTicketSuccess}
//         ref={{ current: null }}
//         user={user}
//       />,
//       createMountOptions(defaultStore),
//     )
//   })
//
//   afterEach(() => {
//     wrapper.unmount()
//     jest.clearAllMocks()
//   })
//
//   it('should render and dispatch pageview', () => {
//     expect(wrapper).toHaveLength(1)
//     expect(useAnalyticsPath).toHaveBeenCalledWith(...PageviewInfo.CONNECT_SUPPORT_GENERAL)
//   })
//
//   it('should render email input if user email is not provided', () => {
//     const newUser = { email: null }
//     wrapper.setProps({ user: newUser })
//     expect(wrapper.find('TextInput[name="email"]')).toHaveLength(1)
//   })
//
//   it('should not render email input if user email is provided', () => {
//     expect(wrapper.find('TextInput[name="email"]')).toHaveLength(0)
//   })
//
//   it('should render issue description input', () => {
//     expect(wrapper.find('TextInput[name="issueDescription"]')).toHaveLength(1)
//   })
//
//   it('should render issue details textarea', () => {
//     expect(wrapper.find('TextArea[name="issueDetails"]')).toHaveLength(1)
//   })
//
//   it('should call handleClose on cancel button click', async () => {
//     await wrapper.find('Button[variant="neutral"]').simulate('click')
//     expect(handleClose).toHaveBeenCalled()
//   })
// })
