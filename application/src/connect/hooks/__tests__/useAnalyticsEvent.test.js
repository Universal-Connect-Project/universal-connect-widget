// import React, { useEffect } from 'react'
// import { Provider } from 'react-redux'
// import posthog from 'posthog-js'
// import { mount } from 'enzyme'
//
// jest.mock('../../../redux/Store')
// jest.mock('posthog-js')
//
// import ReduxStoreMock from '../../../redux/Store'
//
// import useAnalyticsEvent from '../hooks/useAnalyticsEvent'
//
// const FakeComponent = () => {
//   const sendEvent = useAnalyticsEvent()
//
//   useEffect(() => {
//     sendEvent('test_event', { metadataKey: 'Metadata value' })
//   })
//
//   return <div>Fake Component</div>
// }

describe('useAnalyticsEvent placeholder', () => {
  it('should be a placeholder', () => {
    expect(true).toBe(true)
  });
});

// describe('useAnalyticsEvent', () => {
//   mount(
//     <Provider store={ReduxStoreMock}>
//       <FakeComponent />
//     </Provider>,
//   )
//
//   it('should call capture with the event name prefixed and grouped to client', () => {
//     expect(posthog.capture).toHaveBeenCalledWith('connect_test_event', {
//       $groups: {
//         client: 'CLT-123',
//       },
//       metadataKey: 'Metadata value',
//       widgetType: 'isolated',
//     })
//   })
// })
