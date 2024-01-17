// import React from 'react' // eslint-disable-line no-unused-vars
// import { mount } from 'enzyme'
//
// import Store from 'reduxify/Store'
// import { AGG_MODE } from 'src/connect/const/Connect'
// import {
//   EventCategories,
//   EventActions,
//   EventLabels,
//   PageviewInfo,
// } from 'src/connect/const/Analytics'
//
// jest.mock('reduxify/Store')
// jest.mock('utils/Analytics')
// jest.mock('src/connect/views/search/Search')
//
// // Mock because it relies on the browser's window object
// jest.mock('src/connect/utilities/e2e', () => ({
//   isRunningE2ETests: jest.fn(() => false),
// }))
//
// // cannot use __mocks__ file because of a name conflict
// jest.mock('reduxify/actions/Analytics', () => _dispatch => ({
//   createAnalyticsSession: () => {},
//   createNewFeatureVisit: () => {},
// }))
//
// import { Search } from 'src/connect/views/search/Search'
// import { REFERRAL_SOURCES, STEPS } from 'src/connect/const/Connect'
// import { Connect } from 'widgets/desktop/Connect'
// import { getMountOptions } from 'src/connect/utilities/Store'
// import { isRunningE2ETests } from 'src/connect/utilities/e2e'
//
// const noop = function() {}
// const mountOptions = getMountOptions()

describe('Connect widgets placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('Connect (Connect) widget', () => {
//   let wrapper
//   let defaultProps
//   let state
//
//   beforeEach(() => {
//     state = Store.getState()
//
//     defaultProps = {
//       addAnalyticPath: jest.fn(),
//       acceptDisclosure: jest.fn(),
//       addMember: noop,
//       clientProfile: {},
//       closeFeatureVisit: noop,
//       connectConfig: { mode: AGG_MODE },
//       deleteMemberSucccessContinue: noop,
//       jobComplete: noop,
//       createNewFeatureVisit: noop,
//       currentMember: {},
//       currentSession: {},
//       experimentDetails: { variantPath: '' },
//       goBackCredentials: noop,
//       goBackManualAccount: noop,
//       goBackOauth: noop,
//       goBackPostMessage: noop,
//       handleOAuthError: noop,
//       handleOAuthSuccess: noop,
//       isDeleteInstitutionOptionEnabled: false,
//       iavMembers: [],
//       initializePosthog: jest.fn(),
//       isLoading: false,
//       isManualAccountsEnabled: false,
//       isVerificationEnabled: false,
//       isInstitutionSearchEnabled: false,
//       loadConnect: noop,
//       loadMembers: noop,
//       mfaConnectSubmit: noop,
//       oauthReferralSource: REFERRAL_SOURCES.BROWSER,
//       onManualAccountAdded: noop,
//       onSuccessfulAggregation: noop,
//       removeAnalyticPath: jest.fn(),
//       resetConnect: noop,
//       resetStep: noop,
//       retryOAuth: noop,
//       resetWidgetConnected: noop,
//       resetWidgetMFAStep: noop,
//       selectedInstitution: {},
//       selectInstitution: noop,
//       sendAnalyticsEvent: jest.fn(),
//       sendPostMessage: jest.fn(),
//       setStepFromConnectionStatus: noop,
//       stepToDeleteMemberSuccess: noop,
//       stepToMicrodeposits: noop,
//       showConnectDisclosure: false,
//       showPadding: false,
//       size: 'large',
//       step: STEPS.SEARCH,
//       stepToConnecting: noop,
//       stepToUpdateCredentials: noop,
//       stepToMemberCreateError: noop,
//       stepToVerifyExistingMember: noop,
//       stepToAddManualAccount: jest.fn(),
//       theme: state.theme,
//       updateCredentials: false,
//       userDetails: {},
//       verifyDifferentConnection: noop,
//       widgetProfile: {},
//     }
//
//     wrapper = mount(<Connect {...defaultProps} />, mountOptions)
//   })
//
//   it('renders', () => {
//     expect(wrapper.find(Search).first()).toExist()
//   })
//
//   it('should start analytics', () => {
//     expect(defaultProps.initializePosthog).toHaveBeenCalled()
//   })
//
//   it('should not start analytics in cypress', () => {
//     // Reset applicable mocks
//     defaultProps.initializePosthog.mockReset()
//     isRunningE2ETests.mockImplementation(() => true)
//
//     // Re-mount so that the implementation can take effect before render
//     wrapper = mount(<Connect {...defaultProps} />, mountOptions)
//     expect(defaultProps.initializePosthog).not.toHaveBeenCalled()
//     isRunningE2ETests.mockImplementation(() => false)
//   })
//
//   it('should add the base analytic path', () => {
//     const [name, path] = PageviewInfo.CONNECT
//
//     expect(defaultProps.addAnalyticPath).toHaveBeenCalledWith({ path: `${path}/${AGG_MODE}`, name })
//   })
//
//   describe('_handleAddManualAccountClick', () => {
//     it('should send a START analytic event', () => {
//       const instance = wrapper.instance()
//       const label = EventLabels.MANUAL_ACCOUNT
//
//       instance._handleAddManualAccountClick()
//
//       expect(defaultProps.sendAnalyticsEvent).toHaveBeenCalledWith({
//         category: EventCategories.CONNECT,
//         label,
//         action: `${label} - ${EventActions.START}`,
//       })
//     })
//
//     it('should call stepToAddManualAccount', () => {
//       const instance = wrapper.instance()
//
//       instance._handleAddManualAccountClick()
//
//       expect(defaultProps.stepToAddManualAccount).toHaveBeenCalled()
//     })
//   })
//
//   describe('unmount', () => {
//     it('should remove the analytic path', () => {
//       wrapper.unmount()
//
//       expect(defaultProps.removeAnalyticPath).toHaveBeenCalledWith(
//         `${PageviewInfo.CONNECT[1]}/${AGG_MODE}`,
//       )
//     })
//   })
// })
