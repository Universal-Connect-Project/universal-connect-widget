import React from 'react'
import { mount } from 'enzyme'

import { VerifyError } from '../VerifyError'

import { getMountOptions } from '../../../../connect/utilities/Store'

const mountOptions = getMountOptions()

describe('VerifyError Test', () => {
  const NOT_SUPPORTED_RESPONSE = { response: { status: 403 } }
  const DUPLICATE_RESPONSE = { response: { status: 409 } }
  const THROTTLE_RESPONSE = { response: { status: 422 } }
  const INTERNAL_SERVER_ERROR = { response: { status: 500 } }

  it('should render a non supported message for 403 response', () => {
    const wrapper = mount(
      <VerifyError error={NOT_SUPPORTED_RESPONSE} onGoBack={() => {}} size="large" />,
      mountOptions,
    )

    expect(wrapper.find('p').text()).toEqual("This connection doesn't support verification.")
  })

  it('should render a cant verify now message for 409 response', () => {
    const wrapper = mount(
      <VerifyError error={DUPLICATE_RESPONSE} onGoBack={() => {}} size="large" />,
      mountOptions,
    )

    expect(wrapper.find('p').text()).toEqual(
      "We can't verify this connection right now. Please try again later.",
    )
  })

  it('should render a cant verify now message for 422 response', () => {
    const wrapper = mount(
      <VerifyError error={THROTTLE_RESPONSE} onGoBack={() => {}} size="large" />,
      mountOptions,
    )

    expect(wrapper.find('p').text()).toEqual(
      "We can't verify this connection right now. Please try again later.",
    )
  })

  it('should render a general response with error code 500 response', () => {
    const wrapper = mount(
      <VerifyError error={INTERNAL_SERVER_ERROR} onGoBack={() => {}} size="large" />,
      mountOptions,
    )

    expect(wrapper.find('p').text()).toEqual('Oops! Something went wrong. Error code: 500')
  })

  it('should render a general response with error code 500 with undefined', () => {
    const wrapper = mount(
      <VerifyError error={INTERNAL_SERVER_ERROR} onGoBack={() => {}} size="large" />,
      mountOptions,
    )

    expect(wrapper.find('p').text()).toEqual('Oops! Something went wrong. Error code: 500')
  })
})
