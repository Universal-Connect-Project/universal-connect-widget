import React from 'react'
import { mount } from 'enzyme'

import { Store } from 'reduxify/__mocks__/Store'
import { getMountOptions } from 'src/connect/utilities/Store'
import { SupportMenu } from 'src/connect/components/support/SupportMenu'
import { UtilityRow } from '@kyper/utilityrow'
import { GoBackButton } from 'src/connect/components/GoBackButton'
import { useAnalyticsPath } from 'src/connect/hooks/useAnalyticsPath'
import { PageviewInfo } from 'src/connect/const/Analytics'

jest.mock('src/connect/hooks/useAnalyticsPath')

const createMountOptions = customStore => {
  return getMountOptions(Store(customStore))
}

describe('SupportMenu', () => {
  const mockHandleClose = jest.fn()
  const mockSelectGeneralSupport = jest.fn()
  const mockSelectRequestInstitution = jest.fn()

  const props = {
    handleClose: mockHandleClose,
    selectGeneralSupport: mockSelectGeneralSupport,
    selectRequestInstitution: mockSelectRequestInstitution,
  }
  const defaultStore = {
    userFeatures: { items: [] },
  }

  let wrapper

  beforeEach(() => {
    wrapper = mount(<SupportMenu {...props} />, createMountOptions(defaultStore))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render and dispatch pageview', () => {
    expect(wrapper).toHaveLength(1)
    expect(useAnalyticsPath).toHaveBeenCalledWith(...PageviewInfo.CONNECT_SUPPORT_MENU)
  })

  it('renders a <GoBackButton /> component inside the header', () => {
    expect(wrapper.find(GoBackButton)).toHaveLength(1)
    wrapper.find(GoBackButton).simulate('click')
    expect(mockHandleClose).toHaveBeenCalledTimes(1)
  })

  it('renders two <UtilityRow /> components for support options', () => {
    expect(wrapper.find(UtilityRow)).toHaveLength(2)

    // Test click event for "Request to have it added" option
    wrapper
      .find(UtilityRow)
      .at(0)
      .simulate('click')
    expect(mockSelectRequestInstitution).toHaveBeenCalledTimes(1)

    // Test click event for "Get help connecting your account" option
    wrapper
      .find(UtilityRow)
      .at(1)
      .simulate('click')
    expect(mockSelectGeneralSupport).toHaveBeenCalledTimes(1)
  })
})
