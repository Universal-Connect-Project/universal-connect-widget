import posthog from 'posthog-js'
import { useSelector } from 'react-redux'
import { defaultEventMetadata } from '../const/Analytics'

/**
 *
 * @description (If you are working inside a React functional component
 * please use `useAnalyticsEvent` instead).  This helps log an analytic event
 * and groups it by client appropriately.
 *
 * @param {string} eventName
 * @param {any} metadata
 * @param {{client: string}} captureOptions
 * @returns void
 */
export const captureEvent = (eventName, metadata = {}, captureOptions = { client: null }) =>
  posthog.capture(`connect_${eventName}`, {
    $groups: { client: captureOptions.client },
    ...defaultEventMetadata,
    ...metadata,
  })

/**
 * This will return a function that can be used for sending analytic events.
 * Grouping by client and prefixing event names with `connect_` are provided by this hook.
 *
 * Usage example code to place inside of your functional component:
 *
 * const sendPosthogEvent = useAnalyticsEvent()
 *
 * sendPosthogEvent(eventName, metadata)
 * @param {string} name of the AnalyticEvent from src/connect/const/Analytics.js
 * @param {object} metadata of the event as requested by Product team
 */
export const useAnalyticsEvent = () => {
  const clientGuid = useSelector(state => state.client.guid)

  return (eventName, metadata = {}) => captureEvent(eventName, metadata, { client: clientGuid })
}

export default useAnalyticsEvent
