import posthog from 'posthog-js'

/**
 * sendAnalyticEvent Util Function
 * @param {string} eventName Name of custom event
 * @param {object} metadata Metadata to include with this event
 */
export const sendAnalyticEvent = (eventName, metadata = {}) =>
  posthog.capture(`connect_${eventName}`, metadata)
