import React from 'react'
import { mount } from 'enzyme'

import { getMountOptions } from '../../../connect/utilities/Store'
import { MemberError } from '../../../connect/components/MemberError'
import { Store } from '../../../redux/__mocks__/Store'

const createMountOptions = customStore => {
  return getMountOptions(Store(customStore))
}

describe('MemberError View', () => {
  let wrapper
  const defaultProps = {
    error: null,
    institution: {},
  }

  describe('message box messaging', () => {
    it('renders verification message if 403', () => {
      const newProps = { ...defaultProps, error: { response: { status: 403 } } }

      wrapper = mount(<MemberError {...newProps} />, createMountOptions({}))

      expect(wrapper.find('MessageBox').text()).toContain(
        'Verification must be enabled to use this feature.',
      )
    })

    it('renders check credentials message if 409', () => {
      const newProps = { ...defaultProps, error: { response: { status: 409 } } }

      wrapper = mount(<MemberError {...newProps} />, createMountOptions({}))

      expect(wrapper.find('MessageBox').text()).toContain(
        'Oops! There was a problem. Please check your username and password, and try again.',
      )
    })

    it('renders generic validation message if any error other then 403', () => {
      const newProps = { ...defaultProps, error: { response: { status: 422 } } }

      wrapper = mount(<MemberError {...newProps} />, createMountOptions({}))

      expect(wrapper.find('MessageBox').text()).toContain('Please try again or come back later.')
    })
  })
})
