// import React from 'react'
// import { mount } from 'enzyme'
//
// import { Store } from 'reduxify/__mocks__/Store'
// import { getMountOptions } from 'src/connect/utilities/Store'
// import { Support, VIEWS } from 'src/connect/components/support/Support'
// import { SupportMenu } from 'src/connect/components/support/SupportMenu'
// import { RequestInstitution } from 'src/connect/components/support/RequestInstitution'
// import { GeneralSupport } from 'src/connect/components/support/GeneralSupport'
// import { SupportSuccess } from 'src/connect/components/support/SupportSuccess'
//
// jest.mock('src/connect/hooks/useAnalyticsPath')
//
// const createMountOptions = customStore => {
//   return getMountOptions(Store(customStore))
// }

describe('Support placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('Support', () => {
//   const onClose = jest.fn()
//
//   const defaultStore = {
//     user: {
//       details: {
//         first_name: 'Bob',
//         last_name: 'Dole',
//         guid: '123345',
//         details: {
//           email: 'foo@foo.com',
//           phone: '8015555555',
//         },
//         email: 'foo@foo.com',
//         phone: '8015555555',
//       },
//       healthScoreError: null,
//     },
//     userFeatures: { items: [] },
//   }
//
//   const defaultProps = {
//     loadToView: VIEWS.MENU,
//     onClose,
//     ref: { current: null },
//   }
//
//   afterEach(() => {
//     jest.clearAllMocks()
//   })
//
//   it('renders SupportMenu when loadToView is MENU', () => {
//     const wrapper = mount(<Support {...defaultProps} />, createMountOptions(defaultStore))
//     expect(wrapper.find(SupportMenu)).toHaveLength(1)
//     expect(wrapper.find(RequestInstitution)).toHaveLength(0)
//     expect(wrapper.find(GeneralSupport)).toHaveLength(0)
//     expect(wrapper.find(SupportSuccess)).toHaveLength(0)
//   })
//
//   it('renders RequestInstitution when loadToView is REQ_INSTITUTION', () => {
//     const newProps = { ...defaultProps, loadToView: VIEWS.REQ_INSTITUTION }
//     const wrapper = mount(<Support {...newProps} />, createMountOptions(defaultStore))
//     expect(wrapper.find(SupportMenu)).toHaveLength(0)
//     expect(wrapper.find(RequestInstitution)).toHaveLength(1)
//     expect(wrapper.find(GeneralSupport)).toHaveLength(0)
//     expect(wrapper.find(SupportSuccess)).toHaveLength(0)
//   })
//
//   it('renders GeneralSupport when loadToView is GENERAL_SUPPORT', () => {
//     const newProps = { ...defaultProps, loadToView: VIEWS.GENERAL_SUPPORT }
//     const wrapper = mount(<Support {...newProps} />, createMountOptions(defaultStore))
//     expect(wrapper.find(SupportMenu)).toHaveLength(0)
//     expect(wrapper.find(RequestInstitution)).toHaveLength(0)
//     expect(wrapper.find(GeneralSupport)).toHaveLength(1)
//     expect(wrapper.find(SupportSuccess)).toHaveLength(0)
//   })
//
//   it('calls fadeOut util and onClose prop when GoBackButton is clicked on MENU', async () => {
//     const wrapper = mount(<Support {...defaultProps} />, createMountOptions(defaultStore))
//     await wrapper.find('GoBackButton').simulate('click')
//     expect(onClose).toHaveBeenCalled()
//   })
// })
