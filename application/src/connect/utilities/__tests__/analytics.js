import { sendAnalyticEvent as sendPosthogEvent } from '../../../connect/utilities/analytics'
import posthog from 'posthog-js'

jest.mock('posthog-js')

describe('sendAnalyticEvent', () => {
  const event_name = 'event_name'
  const metadata = { foo: 'bar' }

  it('should call posthog.capture', () => {
    sendPosthogEvent(event_name)

    expect(posthog.capture).toHaveBeenCalled()
  })
  it('should prefix first param with `connect_` and default second param to {}', () => {
    sendPosthogEvent(event_name)

    expect(posthog.capture).toHaveBeenCalledWith('connect_event_name', {})
  })
  it('should include metadata passed as second param', () => {
    sendPosthogEvent(event_name, metadata)

    expect(posthog.capture).toHaveBeenCalledWith('connect_event_name', metadata)
  })
})
