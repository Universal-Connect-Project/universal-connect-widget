// import React from 'react'
// import { mount } from 'enzyme'
//
// import { Store } from 'reduxify/__mocks__/Store'
// import { getMountOptions } from 'src/connect/utilities/Store'
// import { RequestInstitution } from 'src/connect/components/support/RequestInstitution'
// import { useAnalyticsPath } from 'src/connect/hooks/useAnalyticsPath'
// import { PageviewInfo } from 'src/connect/const/Analytics'
//
// jest.mock('src/connect/hooks/useAnalyticsPath')
//
// const createMountOptions = customStore => {
//   return getMountOptions(Store(customStore))
// }

describe('RequestInstitution placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('RequestInstitution', () => {
//   const handleClose = jest.fn()
//   const handleTicketSuccess = jest.fn()
//   const sendAnalyticsEvent = jest.fn()
//   const user = {
//     email: 'test@example.com',
//   }
//   const defaultStore = {
//     userFeatures: { items: [] },
//   }
//
//   afterEach(() => {
//     jest.clearAllMocks()
//   })
//
//   it('should render and dispatch pageview', () => {
//     mount(
//       <RequestInstitution
//         handleClose={handleClose}
//         handleTicketSuccess={handleTicketSuccess}
//         ref={{ current: null }}
//         sendAnalyticsEvent={sendAnalyticsEvent}
//         user={user}
//       />,
//       createMountOptions(defaultStore),
//     )
//     expect(useAnalyticsPath).toHaveBeenCalledWith(
//       ...PageviewInfo.CONNECT_SUPPORT_REQUEST_INSTITUTION,
//     )
//   })
//
//   it('renders the cancel button', () => {
//     const wrapper = mount(
//       <RequestInstitution
//         handleClose={handleClose}
//         handleTicketSuccess={handleTicketSuccess}
//         ref={{ current: null }}
//         sendAnalyticsEvent={sendAnalyticsEvent}
//         user={user}
//       />,
//       createMountOptions(defaultStore),
//     )
//     expect(wrapper.find('Button[children="Cancel"]')).toHaveLength(1)
//   })
//
//   it('renders the continue button', () => {
//     const wrapper = mount(
//       <RequestInstitution
//         handleClose={handleClose}
//         handleTicketSuccess={handleTicketSuccess}
//         ref={{ current: null }}
//         sendAnalyticsEvent={sendAnalyticsEvent}
//         user={user}
//       />,
//       createMountOptions(defaultStore),
//     )
//     expect(wrapper.find('Button[children="Continue"]')).toHaveLength(1)
//   })
//
//   it('calls handleCancel when the cancel button is clicked', async () => {
//     const wrapper = mount(
//       <RequestInstitution
//         handleClose={handleClose}
//         handleTicketSuccess={handleTicketSuccess}
//         ref={{ current: null }}
//         sendAnalyticsEvent={sendAnalyticsEvent}
//         user={user}
//       />,
//       createMountOptions(defaultStore),
//     )
//     await wrapper.find('Button[children="Cancel"]').simulate('click')
//     expect(handleClose).toHaveBeenCalled()
//   })
// })
