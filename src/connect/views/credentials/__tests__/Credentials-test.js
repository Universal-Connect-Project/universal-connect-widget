import React from 'react'
import { mount } from 'enzyme'
import _merge from 'lodash/merge'

import { AGG_MODE } from '../../../../connect/const/Connect'
import { getMountOptions } from '../../../../connect/utilities/Store'
import { Credentials } from '../../../../connect/views/credentials/Credentials'
import { Store } from '../../../../redux/__mocks__/Store'
import StyleConstants from '../../../../constants/Style'
import { ReadableStatuses } from '../../../../connect/const/Statuses'

const createMountOptions = customStore => {
  return getMountOptions(Store(customStore))
}

describe('Credentials View', () => {
  let wrapper
  const defaultStore = {
    browser: { size: 'small' },
    clientProfile: { show_external_link_popup: false },
    connect: {
      connectConfig: { mode: AGG_MODE },
      members: [],
      selectedInstitution: {
        guid: 'INS-123',
        name: 'Test Bank',
        url: 'https://www.testbanklogin1.com',
        instructional_data: {
          description:
            '<a href="https://www.mx.com" id="instructional_text">Instructional Text</a>',
          title: 'This is a custom title',
        },
      },
      widgetProfile: { enable_support_requests: true },
    },
    experiments: { items: [] },
    theme: { ...StyleConstants }, // Needed for AiraLive component
  }
  const defaultProps = {
    credentials: [
      { guid: 'CRD-123', label: 'Username', field_name: 'username' },
      { guid: 'CRD-456', label: 'Password', field_name: 'password' },
    ],
    handleSubmitCredentials: jest.fn(),
    isProcessingMember: false,
    onGoBackClick: jest.fn(),
  }

  describe('instructional data', () => {
    it('does include href attribute if href is a http/https', () => {
      wrapper = mount(<Credentials {...defaultProps} />, createMountOptions(defaultStore))
      const link = wrapper.find('Text[data-test="instructional_text"]')

      expect(link.html()).toContain(
        '<a id="instructional_text" href="https://www.mx.com">Instructional Text</a>',
      )
    })
    it("doesn't include href attribute if href is not http/https", () => {
      const newMountOptions = _merge(defaultStore, {
        connect: {
          selectedInstitution: {
            instructional_data: {
              description: '<a href="tel:123" id="instructional_text">Instructional Text</a>',
            },
          },
        },
      })

      wrapper = mount(<Credentials {...defaultProps} />, createMountOptions(newMountOptions))
      const link = wrapper.find('Text[data-test="instructional_text"]')

      expect(link.html()).toContain('<a id="instructional_text">Instructional Text</a>')
    })
    it('uses custom title if provided', () => {
      wrapper = mount(<Credentials {...defaultProps} />, createMountOptions(defaultStore))

      expect(wrapper.find('h2').text()).toEqual(
        defaultStore.connect.selectedInstitution.instructional_data.title,
      )
    })
  })

  describe('isProcessingMember', () => {
    it('renders connect Button when not processing', () => {
      expect(wrapper.find('Button[data-test="connect-credentials-button"]')).toExist()
    })

    it('replaces connect Button with Spinner when processing', () => {
      const newProps = { ...defaultProps, isProcessingMember: true }

      wrapper = mount(<Credentials {...newProps} />, createMountOptions(defaultStore))

      expect(wrapper.find('Spinner')).toExist()
    })
  })

  describe('DENIED credentials message box', () => {
    /**
     * @param {boolean} is_oauth
     * @returns store configured with is_oauth true|false
     */
    const deniedMemberStoreWithOauth = is_oauth => ({
      ...defaultStore,
      connect: {
        ...defaultStore.connect,
        currentMemberGuid: 'MBR-123',
        members: [{ connection_status: ReadableStatuses.DENIED, guid: 'MBR-123', is_oauth }],
      },
    })

    it('DENIED credential member renders message', () => {
      wrapper = mount(
        <Credentials {...defaultProps} />,
        createMountOptions(deniedMemberStoreWithOauth(false)),
      )

      expect(wrapper.find('Text[data-test="incorrect-credentials"]')).toExist()
    })
  })
})
