import _get from 'lodash/get'

import { ActionTypes } from '../actions/Analytics'

const {
  ADD_ANALYTIC_PATH,
  CREATE_FEATURE_VISIT_SUCCESS,
  INITIALIZE_ANALYTICS_SESSION_SUCCESS,
  INITIALIZE_POSTHOG_SUCCESS,
  REMOVE_ANALYTIC_PATH,
  SEND_ANALYTIC_PATH,
  UNSHIFT_ANALYTIC_PATH,
  UPDATE_DATA_SOURCE,
} = ActionTypes

export const defaultState = {
  currentSession: {},
  featureVisit: {},
  path: [],
  // Data source will correspond with the widget type in all situations except
  // when loading the master widget. The master widget will update the data source
  // to include the additional widget being selected. For example, loading the
  // transaction widget in master will update to "master/transactions".
  // This also includes the mini navigations items such as settings and help.
  dataSource: _get(window, 'app.options.type', 'app'),
  posthogInitialized: false,
}

const analyticsSessionInitialized = (state, action) => ({
  ...state,
  currentSession: action.payload,
})

const featureVisitCreated = (state, action) => ({
  ...state,
  featureVisit: action.payload,
})

const addAnalyticPath = (state, action) => ({
  ...state,
  path: [...state.path, action.payload],
})

const removeAnalyticPath = (state, action) => ({
  ...state,
  path: state.path.filter(obj => obj.path !== action.payload),
})

const unshiftAnalyticPath = (state, action) => ({
  ...state,
  path: [action.payload, ...state.path],
})

const updateDataSource = (state, action) => ({
  ...state,
  dataSource: action.payload,
})

const initializePosthogSuccess = state => ({
  ...state,
  posthogInitialized: true,
})

export const analytics = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_ANALYTIC_PATH:
      return addAnalyticPath(state, action)
    case CREATE_FEATURE_VISIT_SUCCESS:
      return featureVisitCreated(state, action)
    case INITIALIZE_ANALYTICS_SESSION_SUCCESS:
      return analyticsSessionInitialized(state, action)
    case INITIALIZE_POSTHOG_SUCCESS:
      return initializePosthogSuccess(state)
    case REMOVE_ANALYTIC_PATH:
      return removeAnalyticPath(state, action)
    case SEND_ANALYTIC_PATH:
      return addAnalyticPath(state, action)
    case UNSHIFT_ANALYTIC_PATH:
      return unshiftAnalyticPath(state, action)
    case UPDATE_DATA_SOURCE:
      return updateDataSource(state, action)
    default:
      return state
  }
}
