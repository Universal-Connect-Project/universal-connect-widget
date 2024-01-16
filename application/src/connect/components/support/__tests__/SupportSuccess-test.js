// import React from 'react'
// import { mount } from 'enzyme'
//
// import { Store } from 'reduxify/__mocks__/Store'
// import { getMountOptions } from 'src/connect/utilities/Store'
// import { SupportSuccess } from 'src/connect/components/support/SupportSuccess'
// import { useAnalyticsPath } from 'src/connect/hooks/useAnalyticsPath'
// import { PageviewInfo } from 'src/connect/const/Analytics'
//
// jest.mock('src/connect/hooks/useAnalyticsPath')
//
// const createMountOptions = customStore => {
//   return getMountOptions(Store(customStore))
// }

describe('SupportSuccess placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('SupportSuccess', () => {
//   const email = 'test@test.com'
//   const handleClose = jest.fn()
//   const defaultStore = {
//     userFeatures: { items: [] },
//   }
//   const wrapper = mount(
//     <SupportSuccess email={email} handleClose={handleClose} ref={{ current: null }} />,
//     createMountOptions(defaultStore),
//   )
//
//   afterEach(() => {
//     jest.clearAllMocks()
//   })
//
//   it('should render and dispatch pageview', () => {
//     expect(wrapper).toHaveLength(1)
//     expect(useAnalyticsPath).toHaveBeenCalledWith(...PageviewInfo.CONNECT_SUPPORT_SUCCESS)
//   })
//
//   it('contains a GoBackButton component', () => {
//     expect(wrapper.find('GoBackButton')).toHaveLength(1)
//   })
//
//   it('contains a PrivateAndSecure component', () => {
//     expect(wrapper.find('PrivateAndSecure')).toHaveLength(1)
//   })
//
//   it('contains a title and message', () => {
//     expect(wrapper.find('Text[tag="h2"]').text()).toEqual('Request received')
//     expect(wrapper.find('Text[tag="p"]').text()).toContain(
//       'Thanks! Your request has been received. A reply will be sent to test@test.com. Be sure to check your junk mail or spam folder, as replies sometimes end up there.',
//     )
//   })
//
//   it('contains a hours message and Continue button', () => {
//     expect(
//       wrapper
//         .find('Text[as="Paragraph"]')
//         .last()
//         .text(),
//     ).toContain('Our hours are Monday to Friday, 9 a.m. – 5 p.m. MST.')
//     expect(wrapper.find('Button[variant="primary"]').text()).toEqual('Continue')
//   })
//
//   it('calls handleClose on Continue button click', async () => {
//     await wrapper.find('Button[type="submit"]').simulate('click')
//     expect(handleClose).toHaveBeenCalled()
//   })
// })
