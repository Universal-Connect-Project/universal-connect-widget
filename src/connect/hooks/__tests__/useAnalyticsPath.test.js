import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'

jest.mock('reduxify/Store')
jest.mock('reduxify/actions/Analytics')

import { removeAnalyticPath, sendAnalyticPath } from '../../../redux/actions/Analytics'

import ReduxStoreMock from '../../../redux/Store'

import useAnalyticsPath from '../../../connect/hooks/useAnalyticsPath'

const FakeComponent = () => {
  useAnalyticsPath('Fake Component', '/parent')
  return <div>Fake Component </div>
}

describe('useAnalyticsPath', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(
      <Provider store={ReduxStoreMock}>
        <FakeComponent />
      </Provider>,
    )
  })

  describe('sendAnalyticPath', () => {
    it('should add the path when the component mounts', () => {
      expect(sendAnalyticPath).toHaveBeenCalledWith({
        path: '/parent',
        name: 'Fake Component',
      })
      wrapper.unmount()
    })
  })

  describe('removeAnalyticPath', () => {
    it('should remove the path when the component unmounts', () => {
      wrapper.unmount()
      expect(removeAnalyticPath).toHaveBeenCalledWith('/parent')
    })
  })
})
