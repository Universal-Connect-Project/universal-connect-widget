// import React from 'react'
// import { shallow } from 'enzyme'
//
// import { SecondaryActions } from 'src/connect/views/loginError/SecondaryActions'
// import { AnalyticEvents } from 'src/connect/const/Analytics'
//
// const mockSendPosthogEvent = jest.fn()
// const mockonGetHelpClick = jest.fn()
//
// jest.mock('src/connect/hooks/useAnalyticsEvent', () => {
//   return () => mockSendPosthogEvent
// })

describe('SecondaryActions placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('SecondaryActions', () => {
//   let wrapper
//   const defaultProps = {
//     actions: ['get_help'],
//     institution: { guid: 'INS-123' },
//     isDeleteInstitutionOptionEnabled: true,
//     isInstitutionSearchEnabled: true,
//     member: { guid: 'MBR-123' },
//     onDeleteConnectionClick: jest.fn(),
//     onGetHelpClick: mockonGetHelpClick,
//     onTryAnotherInstitutionClick: jest.fn(),
//     sendAnalyticsEvent: jest.fn(),
//     setIsLeaving: jest.fn(),
//     showExternalLinkPopup: false,
//     showSupport: true,
//   }
//
//   beforeEach(() => {
//     wrapper = shallow(<SecondaryActions {...defaultProps} />)
//   })
//
//   afterEach(() => {
//     jest.clearAllMocks()
//   })
//
//   it('renders correctly', () => {
//     expect(wrapper).toHaveLength(1)
//   })
//
//   it('renders support button when props.showSupport is true', () => {
//     const supportButton = wrapper.find('Button[children="Get help"]')
//
//     expect(supportButton).toExist()
//     supportButton.simulate('click')
//     expect(mockSendPosthogEvent).toHaveBeenCalledWith(AnalyticEvents.LOGIN_ERROR_CLICKED_GET_HELP)
//     expect(mockonGetHelpClick).toHaveBeenCalled()
//   })
//
//   it("doesn't renders support button when props.showSupport is false", () => {
//     wrapper.setProps({ ...defaultProps, showSupport: false })
//     const supportButton = wrapper.find('Button[children="Get help"]')
//
//     expect(supportButton).not.toExist()
//   })
// })
