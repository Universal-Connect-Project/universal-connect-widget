import _get from 'lodash/get'
import moment from 'moment'

import { EventActions } from '../../constants/Analytics'

export const ActionTypes = {
  ADD_ANALYTIC_PATH: 'analytics/add_analytic_path',
  ADD_ANALYTIC_PATH_SUCCESS: 'analytics/add_analytic_path_success',
  CREATE_FEATURE_VISIT: 'analytics/create_feature_visit',
  CREATE_FEATURE_VISIT_SUCCESS: 'analytics/create_feature_visit_success',
  CREATE_FEATURE_VISIT_ERROR: 'analytics/create_feature_visit_error',
  INITIALIZE_ANALYTICS_SESSION: 'analytics/initialize_session',
  INITIALIZE_ANALYTICS_SESSION_SUCCESS: 'analytics/initialize_session_success',
  INITIALIZE_ANALYTICS_SESSION_ERROR: 'analytics/initialize_session_error',
  INITIALIZE_POSTHOG: 'analytics/initialize_posthog',
  INITIALIZE_POSTHOG_SUCCESS: 'analytics/initialize_posthog_success',
  REMOVE_ANALYTIC_PATH: 'analytics/remove_analytic_path',
  SEND_ANALYTIC_PATH: 'analytics/send_analytic_path',
  SEND_ANALYTIC_PATH_SUCCESS: 'analytics/send_analytic_path_success',
  SEND_ANALYTIC_PATH_ERROR: 'analytics/send_analytic_path_error',
  SEND_ANALYTICS_EVENT: 'analytics/send_analytics_event',
  SEND_ANALYTICS_EVENT_SUCCESS: 'analytics/send_analytics_event_success',
  SEND_ANALYTICS_EVENT_ERROR: 'analytics/send_analytics_event_error',
  UNSHIFT_ANALYTIC_PATH: 'analytics/unshift_analytic_path',
  UPDATE_DATA_SOURCE: 'analytics/update_data_source',
}

export const initializeAnalyticsSession = sessionDetails => ({
  type: ActionTypes.INITIALIZE_ANALYTICS_SESSION,
  payload: sessionDetails,
})

export const createNewFeatureVisit = featureName => ({
  type: ActionTypes.CREATE_FEATURE_VISIT,
  payload: {
    feature_name: featureName,
  },
})

/**
  @param {object} eventDetails
  @param {string} eventDetails.category - Required,
  @param {string} eventDetails.name - Requried,
  @param {string} eventDetails.action - Default EventActions.CLICK,
  @param {string} eventDetails.value - Default null,
  @param {string} eventDetails.version - Default 2,
 */
export const sendAnalyticsEvent = eventDetails => {
  const defaultPayload = {
    action: EventActions.CLICK,
    app_version: 'widgets-v2',
    created_at: moment().unix(),
    metadata: _get(window.app, 'clientConfig.metadata', null),
    user_agent: _get(navigator, 'userAgent', ''),
    version: 2,
  }

  return {
    type: ActionTypes.SEND_ANALYTICS_EVENT,
    payload: {
      ...defaultPayload,
      ...eventDetails,
      name: `MX - ${eventDetails.label}`, // required for our backend. I want to change the name to label.
      label: `MX - ${eventDetails.label}`,
    },
  }
}

// Does not trigger the epic
export const addAnalyticPath = path => ({
  type: ActionTypes.ADD_ANALYTIC_PATH,
  payload: path,
})

export const removeAnalyticPath = path => ({
  type: ActionTypes.REMOVE_ANALYTIC_PATH,
  payload: path,
})

// Triggers the epic
export const sendAnalyticPath = path => ({
  type: ActionTypes.SEND_ANALYTIC_PATH,
  payload: path,
})

export const unshiftAnalyticPath = path => ({
  type: ActionTypes.UNSHIFT_ANALYTIC_PATH,
  payload: path,
})

export const updateDataSource = source => ({
  type: ActionTypes.UPDATE_DATA_SOURCE,
  payload: source,
})

export default dispatch => ({
  initializeAnalyticsSession: sessionDetails =>
    dispatch(initializeAnalyticsSession(sessionDetails)),
  createNewFeatureVisit: featureName => dispatch(createNewFeatureVisit(featureName)),
})
