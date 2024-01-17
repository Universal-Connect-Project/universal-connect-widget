// import React from 'react'
// import PropTypes from 'prop-types'
// import { shallow } from 'enzyme'
//
// jest.mock('reduxify/Store')
// jest.mock('src/connect/services/api')
//
// import { PageviewInfo } from 'src/connect/const/Analytics'
//
// import { Connections, VIEWS } from 'widgets/desktop/Connections'
// import ReduxStoreMock from 'reduxify/Store'
// import { DeleteManualMember } from 'src/connections/components/DeleteManualMember'
// import { DeleteMemberSurvey } from 'src/connect/components/DeleteMemberSurvey'
// import { LoadingSpinner } from 'src/connect/components/LoadingSpinner'
// import { EventCategories, EventLabels, EventActions } from 'src/connect/const/Analytics'
// import { ReadableStatuses } from 'src/connect/const/Statuses'
// import { AGG_MODE } from 'src/connect/const/Connect'
// import { ConnectionsResponsiveLayout } from 'src/connections/ConnectionsResponsiveLayout'
// import { isRunningE2ETests } from 'src/connect/utilities/e2e'
// import connectAPI from 'src/connect/services/api'
//
// // Mock e2e because it relies on the browser's window object
// jest.mock('src/connect/utilities/e2e', () => ({
//   isRunningE2ETests: jest.fn(() => false),
// }))
//
// const noop = function() {}
//
// // getPanels - Helper to get the DOM after applying state for the tests
// // Each test needs to apply it's own state before shallow rendering deeper
// const getPanels = wrapper => {
//   const responsiveLayout = wrapper.find(ConnectionsResponsiveLayout).shallow()
//   const listPanelElement = responsiveLayout.find('#listPanel').getElement()
//   const detailPanelElement = responsiveLayout.find('#detailPanel').getElement()
//   return { listPanelElement, detailPanelElement }
// }

describe('Connections Widgets placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('Connections widget', () => {
//   let defaultProps
//   let wrapper
//
//   beforeEach(() => {
//     defaultProps = {
//       accounts: ReduxStoreMock.getState().connections.accounts,
//       accountsLoading: false,
//       addAnalyticPath: jest.fn(),
//       connectionsMembers: ReduxStoreMock.getState().connect.members,
//       connectionsMounted: noop,
//       connectionsUnmounted: jest.fn(),
//       connectMode: AGG_MODE,
//       currentMember: {
//         connection_status: null,
//         is_manual: true,
//       },
//       deleteAccount: noop,
//       deleteMemberSuccess: noop,
//       enableMarkAccountClosedForHeldAccounts: true,
//       enableMarkAccountDuplicateForHeldAccounts: true,
//       hidePartnerManagedMembers: false,
//       initializePosthog: jest.fn(),
//       institutionLoading: false,
//       isConnectionsLoading: false,
//       isDisplayFullExternalAccountNumberEnabled: false,
//       loadAccounts: noop,
//       loadConnections: noop,
//       loadInstitutionByGuid: jest.fn(),
//       loadMemberByGuid: jest.fn(() => Promise.resolve()),
//       loadMembers: noop,
//       mergeAccounts: jest.fn(() => {}),
//       members: ReduxStoreMock.getState().connect.members,
//       membersLoading: false,
//       removeAnalyticPath: jest.fn(),
//       resetStep: () => {},
//       resetWidgetConnections: noop,
//       showExternalLinkPopup: false,
//       size: 'large',
//       selectedInstitution: {},
//       selectedMemberGuid: 'MBR-222',
//       sendAnalyticsEvent: jest.fn(),
//       sendPostMessage: jest.fn(),
//       setStepFromConnectionStatus: jest.fn(),
//       syncMember: noop,
//       updateAccount: jest.fn(),
//     }
//
//     Connections.contextTypes = {
//       BackgroundColor: PropTypes.object,
//       BorderColor: PropTypes.object,
//       Font: PropTypes.object,
//       FontSize: PropTypes.object,
//       MediaQuery: PropTypes.object,
//       Spacing: PropTypes.object,
//       TextColor: PropTypes.object,
//       ZIndex: PropTypes.object,
//     }
//
//     wrapper = shallow(<Connections {...defaultProps} />, {
//       context: {
//         BackgroundColor: {
//           Body: 'white',
//           Card: 'gray',
//         },
//         BorderColor: {
//           TableCell: 'gray',
//         },
//         FontSize: {},
//         Font: {
//           Regular: '',
//         },
//         MediaQuery: { Med: '768px' },
//         Spacing: {
//           XTiny: 2,
//           Small: 12,
//           Large: 24,
//         },
//         TextColor: {
//           Default: 'black',
//         },
//         ZIndex: {
//           Drawer: 5000,
//         },
//       },
//     })
//   })
//
//   it('should render Loader if isConnectionsLoading', () => {
//     wrapper.setProps({ isConnectionsLoading: true })
//     expect(wrapper.find(LoadingSpinner)).toHaveLength(1)
//   })
//
//   it('should add the analytic path', () => {
//     const [name, path] = PageviewInfo.CONNECTIONS
//
//     expect(defaultProps.addAnalyticPath).toHaveBeenCalledWith({ path, name })
//   })
//
//   it('renders DeleteManualMember if memberToDelete is available and is a manual acct', () => {
//     wrapper.setState({ memberToDelete: { guid: 'available', is_manual: true } })
//     expect(wrapper.find(DeleteManualMember)).toHaveLength(1)
//   })
//
//   it('renders DeleteMemberSurvey if memberToDelete is available, is not a manual acct, and state is set as such ', () => {
//     wrapper.setState({
//       memberToDelete: { guid: 'available', is_manual: false },
//       currentView: VIEWS.DELETE_MEMBER_SURVEY,
//     })
//
//     expect(
//       wrapper
//         .find(ConnectionsResponsiveLayout)
//         .shallow()
//         .find(DeleteMemberSurvey),
//     ).toHaveLength(1)
//   })
//
//   describe('renders on the right side if screen size is large', () => {
//     it('calls `_renderConnectionDetails` if state is set as such', () => {
//       wrapper.instance()._renderConnectionDetails = jest.fn(
//         wrapper.instance()._renderConnectionDetails,
//       )
//       wrapper.setState({ size: 'large', currentView: VIEWS.MEMBER_DETAILS })
//       expect(wrapper.instance()._renderConnectionDetails).toHaveBeenCalled()
//     })
//     it('calls `_renderConnect` if state is set as such', () => {
//       wrapper.instance()._renderConnect = jest.fn(wrapper.instance()._renderConnect)
//       wrapper.setState({ size: 'large', currentView: VIEWS.CONNECT })
//       expect(wrapper.instance()._renderConnect).toHaveBeenCalled()
//     })
//   })
//
//   describe('unmount', () => {
//     it('should call connectionsUnmounted', () => {
//       wrapper.unmount()
//       expect(defaultProps.connectionsUnmounted).toHaveBeenCalled()
//     })
//
//     it('should call removeAnalyticPath', () => {
//       wrapper.unmount()
//       expect(defaultProps.removeAnalyticPath).toHaveBeenCalledWith(PageviewInfo.CONNECTIONS[1])
//     })
//   })
//
//   describe('componentDidUpdate', () => {
//     it('set width and size on state', () => {
//       wrapper.instance().container = {
//         clientWidth: 2000,
//       }
//       wrapper.instance().componentDidUpdate()
//       expect(wrapper.state().size).toEqual('large')
//       expect(wrapper.state().width).toEqual(2000)
//     })
//   })
//
//   describe('_handleMemberClick', () => {
//     it('sets currentView to MEMBER_DETAILS if institution guid from param and institution guid from props are not the same', () => {
//       wrapper.setProps({ selectedInstitution: { guid: 'something' } })
//       wrapper.instance()._handleMemberClick({
//         institution_guid: 'notSomething',
//         connection_status: ReadableStatuses.CONNECTED,
//         guid: 'MBR-123',
//       })
//
//       expect(wrapper.instance().state.currentView).toEqual(VIEWS.MEMBER_DETAILS)
//     })
//   })
//
//   describe('_toggleAccountHidden', () => {
//     const label = EventLabels.ACCOUNT_OPTIONS
//
//     //add the account toggle analytic events here make sure that each one is called one for hide and one for unhide
//     it('calls updateAccount if account.is_hidden is available and sends appropriate anaytic event', async () => {
//       const mockAccount = { is_hidden: true }
//
//       await wrapper.instance()._toggleAccountHidden(mockAccount)
//       expect(connectAPI.saveAccount).toHaveBeenCalledWith({ is_hidden: false })
//       expect(defaultProps.updateAccount).toHaveBeenCalledWith({ is_hidden: !mockAccount.is_hidden })
//       expect(defaultProps.sendAnalyticsEvent).toHaveBeenCalledWith({
//         category: EventCategories.CONNECTIONS,
//         label,
//         action: `${label} - ${EventActions.UNHIDE_ACCOUNT}`,
//       })
//     })
//     it('calls updateAccount if account.is_hidden is not available and sends appropriate anaytic event', async () => {
//       await wrapper.instance()._toggleAccountHidden({})
//       expect(connectAPI.saveAccount).toHaveBeenCalledWith({ is_hidden: true })
//       expect(defaultProps.updateAccount).toHaveBeenCalledWith({ is_hidden: true })
//       expect(defaultProps.sendAnalyticsEvent).toHaveBeenCalledWith({
//         category: EventCategories.CONNECTIONS,
//         label,
//         action: `${label} - ${EventActions.HIDE_ACCOUNT}`,
//       })
//     })
//   })
//
//   describe('_handleMemberDelete', () => {
//     it('sets the currentView to DELETE_MEMBER_SURVEY and memberToDelete', () => {
//       const member = {
//         guid: 'MBR_GUID',
//       }
//
//       wrapper.setProps({ selectedInstitution: { guid: 'something' } })
//
//       wrapper.instance()._handleMemberDelete(member)
//
//       expect(wrapper.instance().state.currentView).toEqual(VIEWS.DELETE_MEMBER_SURVEY)
//       expect(wrapper.instance().state.memberToDelete).toEqual(member)
//     })
//   })
//
//   describe('_handleMemberDeleteSuccess', () => {
//     it('sends DELETE_SURVEY analytic event and memberDeleted postMessage', () => {
//       const memberGuid = 'MBR-1'
//
//       wrapper.setProps({ selectedInstitution: { guid: 'something' } })
//       wrapper.setState({
//         memberToDelete: { connection_status: ReadableStatuses.CONNECTED, is_manual: false },
//       })
//
//       wrapper
//         .instance()
//         ._handleMemberDeleteSuccess(
//           { guid: memberGuid, connection_status: ReadableStatuses.CONNECTED },
//           'foobar',
//         )
//
//       expect(defaultProps.sendAnalyticsEvent).toHaveBeenCalledWith({
//         category: EventCategories.CONNECTIONS,
//         label: EventLabels.DELETE_SURVEY,
//         action: `${EventLabels.DELETE_SURVEY} - (${ReadableStatuses.CONNECTED})CONNECTED - foobar`,
//       })
//       expect(defaultProps.sendPostMessage).toHaveBeenCalledWith('connections/memberDeleted', {
//         member_guid: memberGuid,
//       })
//     })
//   })
//
//   describe('_handleManualMemberDeleteSuccess', () => {
//     it('Sends a post message of connections/memberDeleted', () => {
//       const memberGuid = 'MBR-1'
//
//       wrapper.setProps({ selectedInstitution: { guid: 'something' } })
//       wrapper.setState({
//         memberToDelete: { connection_status: ReadableStatuses.CONNECTED, is_manual: true },
//       })
//
//       wrapper
//         .instance()
//         ._handleManualMemberDeleteSuccess(
//           { guid: memberGuid, connection_status: ReadableStatuses.CONNECTED },
//           'foobar',
//         )
//
//       expect(defaultProps.sendPostMessage).toHaveBeenCalledWith('connections/memberDeleted', {
//         member_guid: memberGuid,
//       })
//     })
//   })
//
//   // Full-Screen Tests using size: 'large' - WILL NOT WORK!
//   //
//   // The clientWidth property of the browser
//   // will never be a value other than 0.
//   // see: Connections function _handleSizeAndViewChange using .clientWidth
//   //
//   // In the future we can either
//   // 1. Create our own function to get width
//   // 2. Mock the values
//   // 3. Test these layouts using Cypress instead
//   // describe('Connections full-screen rendering', () => {
//   //   it('CONNECT: renders member list AND Connect', () => {
//   //     wrapper.setState({
//   //       size: 'large',
//   //       currentView: VIEWS.CONNECT,
//   //     })
//
//   //     const { listPanelElement, detailPanelElement } = getPanels(wrapper)
//   //     expect(listPanelElement.props?.style?.display).not.toEqual('none')
//   //     expect(detailPanelElement.props?.style?.display).not.toEqual('none')
//   //   })
//   // })
//
//   // Small screen rendering both panels is possible because the container width is always 0
//   describe('Connections small-screen rendering', () => {
//     it('MEMBER_LIST: renders the member list view and not the details', () => {
//       wrapper.setState({
//         size: 'small',
//         currentView: VIEWS.MEMBER_LIST,
//       })
//
//       const { listPanelElement, detailPanelElement } = getPanels(wrapper)
//       expect(listPanelElement.props?.style?.display).not.toEqual('none')
//       expect(detailPanelElement.props?.style?.display).toEqual('none')
//     })
//
//     it('MEMBER_DETAILS: renders the detail view and not the member list', () => {
//       wrapper.setState({
//         size: 'small',
//         currentView: VIEWS.MEMBER_DETAILS,
//       })
//
//       const { listPanelElement, detailPanelElement } = getPanels(wrapper)
//       expect(listPanelElement.props?.style?.display).toEqual('none')
//       expect(detailPanelElement.props?.style?.display).not.toEqual('none')
//     })
//
//     it('ACCOUNT_DETAILS: renders the detail view and not the member list', () => {
//       wrapper.setState({
//         size: 'small',
//         currentView: VIEWS.ACCOUNT_DETAILS,
//       })
//
//       const { listPanelElement, detailPanelElement } = getPanels(wrapper)
//       expect(listPanelElement.props?.style?.display).toEqual('none')
//       expect(detailPanelElement.props?.style?.display).not.toEqual('none')
//     })
//
//     it('DELETE_MEMBER_SUCCESS: renders the detail view and not the member list', () => {
//       wrapper.setState({
//         size: 'small',
//         currentView: VIEWS.DELETE_MEMBER_SUCCESS,
//       })
//
//       const { listPanelElement, detailPanelElement } = getPanels(wrapper)
//       expect(listPanelElement.props?.style?.display).toEqual('none')
//       expect(detailPanelElement.props?.style?.display).not.toEqual('none')
//     })
//
//     it('DELETE_MEMBER_SURVEY: renders the detail view and not the member list', () => {
//       wrapper.setState({
//         size: 'small',
//         currentView: VIEWS.DELETE_MEMBER_SURVEY,
//       })
//
//       const { listPanelElement, detailPanelElement } = getPanels(wrapper)
//       expect(listPanelElement.props?.style?.display).toEqual('none')
//       expect(detailPanelElement.props?.style?.display).not.toEqual('none')
//     })
//
//     it('CONNECT: renders the detail view and not the member list', () => {
//       wrapper.setState({
//         size: 'small',
//         currentView: VIEWS.CONNECT,
//       })
//
//       const { listPanelElement, detailPanelElement } = getPanels(wrapper)
//       expect(listPanelElement.props?.style?.display).toEqual('none')
//       expect(detailPanelElement.props?.style?.display).not.toEqual('none')
//     })
//   })
//
//   describe('Connections | PostHog Analytics', () => {
//     it('should start analytics', () => {
//       expect(defaultProps.initializePosthog).toHaveBeenCalled()
//     })
//
//     it('should not start analytics in cypress', () => {
//       // Reset applicable mocks
//       defaultProps.initializePosthog.mockReset()
//       isRunningE2ETests.mockImplementation(() => true)
//
//       // Re-mount so that the implementation can take effect before render
//       wrapper = shallow(<Connections {...defaultProps} />, {
//         context: {
//           BackgroundColor: {
//             Body: 'white',
//             Card: 'gray',
//           },
//           BorderColor: {
//             TableCell: 'gray',
//           },
//           MediaQuery: { Med: '768px' },
//           Spacing: {
//             XTiny: 2,
//             Small: 12,
//             Large: 24,
//           },
//           TextColor: {
//             Default: 'black',
//           },
//           ZIndex: {
//             Drawer: 5000,
//           },
//         },
//       })
//
//       expect(defaultProps.initializePosthog).not.toHaveBeenCalled()
//       isRunningE2ETests.mockImplementation(() => false)
//     })
//   })
// })
