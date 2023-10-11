import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import store from '../../../../redux/Store'

import { OAuthError, getOAuthErrorMessage } from '../OAuthError'
import { OAUTH_ERROR_REASONS } from '../../../../connect/const/Connect'
import * as connectActions from '../../../../redux/actions/Connect'

const TEST_MEMBER_GUID = 'MBR-1'

// Provides the redux store to component for testing
const setupWrapper = oauthErrorProps => {
  return mount(
    <Provider store={store}>
      <OAuthError {...oauthErrorProps} />
    </Provider>,
  )
}

// Helps set the store's errorReason correctly for the test
const setTestErrorReason = (errorReason, memberGuid = TEST_MEMBER_GUID) => {
  store.dispatch(
    connectActions.handleOAuthError({
      memberGuid,
      errorReason,
    }),
  )
}

describe('OAuthError Component', () => {
  const onRetrySpy = jest.fn()
  const sendPostMessageSpy = jest.fn()
  const sendAnalyticsEventSpy = jest.fn()
  const testMember = { guid: TEST_MEMBER_GUID, name: 'MX Bank' }
  const testProps = {
    currentMember: testMember,
    onRetry: onRetrySpy,
    sendAnalyticsEvent: sendAnalyticsEventSpy,
    sendPostMessage: sendPostMessageSpy,
    size: 'small',
  }

  beforeEach(() => {
    onRetrySpy.mockReset()
    sendPostMessageSpy.mockReset()
    sendAnalyticsEventSpy.mockReset()
  })

  test('baseline callbacks and messaging', () => {
    const wrapper = setupWrapper(testProps)

    expect(wrapper.find('MessageBox').text()).toEqual(
      'Oops! There was an error trying to connect your account. Please try again.',
    )
    // IMPORTANT: This is a post message and not sending this could affect
    // client implementations. If this is failing, be extra cautious and don't
    // simply remove this unless the message has been deprecated and/or removed
    // officially.
    expect(sendPostMessageSpy).toHaveBeenCalledWith('connect/oauthError', {
      member_guid: TEST_MEMBER_GUID,
      error_reason: OAUTH_ERROR_REASONS.SERVER_ERROR,
    })

    wrapper.find('Button').simulate('click')

    expect(onRetrySpy).toHaveBeenCalledTimes(1)
    expect(sendAnalyticsEventSpy).toHaveBeenCalledTimes(1)
  })

  test('should have specific error if the user cancelled/rejected/denied oauth', () => {
    setTestErrorReason(OAUTH_ERROR_REASONS.CANCELLED)
    const wrapper = setupWrapper(testProps)

    expect(wrapper.find('MessageBox').text()).toEqual(
      'Looks like you declined to share your account info with this app. If this was a mistake, please try again. If you change your mind, you can connect your account later.',
    )
    expect(sendPostMessageSpy).toHaveBeenCalledWith('connect/oauthError', {
      member_guid: TEST_MEMBER_GUID,
      error_reason: OAUTH_ERROR_REASONS.CANCELLED,
    })
  })

  test('should have a specific message if the user had issues with authentication', () => {
    setTestErrorReason(OAUTH_ERROR_REASONS.DENIED)
    const wrapper = setupWrapper(testProps)

    expect(wrapper.find('MessageBox').text()).toEqual(
      'Looks like there was a problem logging in. Please try again.',
    )
    expect(sendPostMessageSpy).toHaveBeenCalledWith('connect/oauthError', {
      member_guid: TEST_MEMBER_GUID,
      error_reason: OAUTH_ERROR_REASONS.DENIED,
    })
  })

  test('should have a specific message if the provider had an error', () => {
    setTestErrorReason(OAUTH_ERROR_REASONS.PROVIDER_ERROR)
    const wrapper = setupWrapper(testProps)

    expect(wrapper.find('MessageBox').text()).toEqual(
      'Looks like something went wrong while connecting to MX Bank. Please try again.',
    )
    expect(sendPostMessageSpy).toHaveBeenCalledWith('connect/oauthError', {
      member_guid: TEST_MEMBER_GUID,
      error_reason: OAUTH_ERROR_REASONS.PROVIDER_ERROR,
    })
  })

  test('should have a specific message for impeded reasons', () => {
    setTestErrorReason(OAUTH_ERROR_REASONS.IMPEDED)
    const wrapper = setupWrapper(testProps)

    expect(wrapper.find('MessageBox').text()).toEqual(
      "Your attention is needed at this institution's website. Please log in to the appropriate website for MX Bank and follow the steps to resolve the issue.",
    )
    expect(sendPostMessageSpy).toHaveBeenCalledWith('connect/oauthError', {
      member_guid: TEST_MEMBER_GUID,
      error_reason: OAUTH_ERROR_REASONS.IMPEDED,
    })
  })

  test('should have a fallback message for impeded reasons', () => {
    setTestErrorReason(OAUTH_ERROR_REASONS.IMPEDED)
    const wrapper = setupWrapper({
      ...testProps,
      currentMember: { guid: TEST_MEMBER_GUID, name: '' },
    })

    expect(wrapper.find('MessageBox').text()).toEqual(
      "Your attention is needed at this institution's website. Please log in to their website and follow the steps to resolve the issue.",
    )
    expect(sendPostMessageSpy).toHaveBeenCalledWith('connect/oauthError', {
      member_guid: TEST_MEMBER_GUID,
      error_reason: OAUTH_ERROR_REASONS.IMPEDED,
    })
  })

  test('should have a fallback message for provider reasons', () => {
    setTestErrorReason(OAUTH_ERROR_REASONS.PROVIDER_ERROR)
    const wrapper = setupWrapper({
      ...testProps,
      currentMember: { guid: TEST_MEMBER_GUID, name: '' },
    })

    expect(wrapper.find('MessageBox').text()).toEqual(
      'Looks like something went wrong while connecting to this institution. Please try again.',
    )
    expect(sendPostMessageSpy).toHaveBeenCalledWith('connect/oauthError', {
      member_guid: TEST_MEMBER_GUID,
      error_reason: OAUTH_ERROR_REASONS.PROVIDER_ERROR,
    })
  })

  test('should have a fallback message if member values are blank', () => {
    setTestErrorReason(OAUTH_ERROR_REASONS.PROVIDER_ERROR)
    const wrapper = setupWrapper({
      ...testProps,
      currentMember: {},
    })

    expect(wrapper.find('MessageBox').text()).toEqual(
      'Looks like something went wrong while connecting to this institution. Please try again.',
    )
  })
})

describe('OAuthError getOAuthErrorMessage', () => {
  test('DEFAULT message is returned when given a blank reason', () => {
    expect(getOAuthErrorMessage(null)).toEqual(
      'Oops! There was an error trying to connect your account. Please try again.',
    )

    expect(getOAuthErrorMessage('')).toEqual(
      'Oops! There was an error trying to connect your account. Please try again.',
    )
  })

  test('IMPEDED fallback message is returned when missing member name', () => {
    expect(getOAuthErrorMessage(OAUTH_ERROR_REASONS.IMPEDED, null)).toEqual(
      "Your attention is needed at this institution's website. Please log in to their website and follow the steps to resolve the issue.",
    )

    expect(getOAuthErrorMessage(OAUTH_ERROR_REASONS.IMPEDED, '')).toEqual(
      "Your attention is needed at this institution's website. Please log in to their website and follow the steps to resolve the issue.",
    )
  })

  test('PROVIDER_ERROR fallback message is returned when missing member name', () => {
    expect(getOAuthErrorMessage(OAUTH_ERROR_REASONS.PROVIDER_ERROR, null)).toEqual(
      'Looks like something went wrong while connecting to this institution. Please try again.',
    )

    expect(getOAuthErrorMessage(OAUTH_ERROR_REASONS.PROVIDER_ERROR, '')).toEqual(
      'Looks like something went wrong while connecting to this institution. Please try again.',
    )
  })
})
