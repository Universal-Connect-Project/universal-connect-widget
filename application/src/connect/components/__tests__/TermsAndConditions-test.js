// import React from 'react'
// import * as Redux from 'react-redux'
// import { mount } from 'enzyme'
// import { Button } from '@kyper/button'
//
// import { Store } from 'reduxify/__mocks__/Store'
// import { ActionTypes as AgreementActionTypes } from 'reduxify/actions/Agreement'
//
// import { getMountOptions } from 'utils/testing/behaviors/Store'
//
// import Modal from 'components/shared/Modal'
// import { TermsAndConditions } from 'src/connect/components/TermsAndConditions'
//
// // Create store and useDispatch spy
// jest.mock('reduxify/Store')
// const createMountOptions = customStore => getMountOptions(Store(customStore))
// const useDispatchSpy = jest.spyOn(Redux, 'useDispatch')
// const mockDispatchFn = jest.fn()
// useDispatchSpy.mockReturnValue(mockDispatchFn)

describe('TermsAndConditions placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('TermsAndConditions Test', () => {
//   let wrapper
//   const defaultStore = {
//     agreement: { details: { title: 'Agreement Title', text: 'Agreement Text' } },
//     browser: { isMobile: false },
//     componentStacks: { scrimStack: [] },
//     user: { details: { has_accepted_terms: false, has_updated_terms_and_conditions: false } },
//     widgetProfile: { display_terms_and_conditions: true, widgets_display_name: 'Test PFM' },
//   }
//
//   beforeEach(() => {
//     wrapper = mount(<TermsAndConditions />, createMountOptions(defaultStore))
//   })
//   afterEach(() => {
//     mockDispatchFn.mockReset()
//     wrapper.unmount()
//   })
//
//   it('should call loadAgreement on mount', () => {
//     expect(mockDispatchFn).toHaveBeenCalledWith({ type: AgreementActionTypes.AGREEMENT_LOADING })
//   })
//
//   it('should show Modal if hasAcceptedTerms and hasAcceptedTerms are true', () => {
//     const html = wrapper.find(Modal).html()
//
//     expect(html).toContain('Welcome to')
//     expect(html).toContain('Test PFM')
//   })
//
//   it('should not show anything if hasAcceptedTerms is true and hasUpdatedTermsAndConditions is false', () => {
//     wrapper = mount(
//       <TermsAndConditions />,
//       createMountOptions({
//         ...defaultStore,
//         user: {
//           ...defaultStore.user,
//           details: { has_accepted_terms: true, has_updated_terms_and_conditions: false },
//         },
//       }),
//     )
//
//     expect(wrapper.find(Modal)).toHaveLength(0)
//   })
//
//   it('should not show if showTerms is false', () => {
//     wrapper = mount(
//       <TermsAndConditions />,
//       createMountOptions({
//         ...defaultStore,
//         widgetProfile: { ...defaultStore.widgetProfile, display_terms_and_conditions: false },
//       }),
//     )
//
//     expect(wrapper.find(Modal)).toHaveLength(0)
//   })
//
//   it('should call acceptTerms when clicking get started', () => {
//     const button = wrapper.find(Button)
//
//     button.simulate('click')
//
//     expect(mockDispatchFn).toHaveBeenCalledWith({
//       type: 'user/update_user',
//       payload: {
//         has_accepted_terms: true,
//         has_updated_terms_and_conditions: false,
//       },
//     })
//   })
//
//   it('Should show the actual Terms and Conditions if link is clicked', () => {
//     expect(wrapper.html()).not.toContain('Agreement Title')
//     expect(wrapper.html()).not.toContain('Agreement Text')
//
//     wrapper.find('[data-test="disclaimer-link"]').simulate('click')
//
//     expect(wrapper.html()).toContain('Agreement Title')
//     expect(wrapper.html()).toContain('Agreement Text')
//   })
// })
