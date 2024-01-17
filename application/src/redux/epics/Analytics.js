import _get from 'lodash/get'
import moment from 'moment'
import { from, of } from 'rxjs'
import { catchError, filter, flatMap, map, mergeMap, pluck, repeat, take } from 'rxjs/operators'
import { combineLatest } from 'rxjs'
import { ofType } from 'redux-observable'
import sha256 from 'js-sha256'
import posthog from 'posthog-js'
import 'posthog-js/dist/recorder-v2' // Added for security requirements to use PostHog Session Recording

import { ActionTypes } from 'reduxify/actions/Analytics'
import { maskInputFn } from 'src/privacy/withProtection'

import connectAPI from 'src/connect/services/api'
import { getHostname } from 'src/connect/utilities/Browser'
import { defaultEventMetadata } from 'src/connect/const/Analytics'

export const initializeSession = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.INITIALIZE_ANALYTICS_SESSION),
    pluck('payload'),
    flatMap(sessionDetails =>
      from(connectAPI.createAnalyticsSession({ analytics_session: sessionDetails })).pipe(
        map(({ analytics_session }) => ({
          type: ActionTypes.INITIALIZE_ANALYTICS_SESSION_SUCCESS,
          payload: analytics_session,
        })),
        catchError(err => {
          return of({ type: ActionTypes.INITIALIZE_ANALYTICS_SESSION_ERROR, payload: err })
        }),
      ),
    ),
  )

export const createFeatureVisit = (actions$, state$) =>
  /**
   * Combine latest CREATE_FEATURE_VISIT action with latest store
   * update where analytics.currentSession.guid is not null/undefined.
   * Only take the first emit as there could be several store updates
   * where analytics.currentSession.guid could be valid.
   */
  combineLatest(
    actions$.pipe(ofType(ActionTypes.CREATE_FEATURE_VISIT)),
    state$.pipe(filter(state => _get(state, 'analytics.currentSession.guid', null))),
  ).pipe(
    take(1),
    flatMap(([{ payload }, state]) =>
      from(
        connectAPI.createNewFeatureVisit({
          feature_visit: {
            ...payload,
            analytics_session_guid: _get(state, 'analytics.currentSession.guid', null),
          },
        }),
      ).pipe(
        map(({ feature_visit }) => ({
          type: ActionTypes.CREATE_FEATURE_VISIT_SUCCESS,
          payload: feature_visit,
        })),
        catchError(err => of({ type: ActionTypes.CREATE_FEATURE_VISIT_ERROR, payload: err })),
      ),
    ),
    repeat(),
  )

export const sendAnalyticsEvent = (actions$, state$) =>
  /**
   * Combine latest SEND_ANALYTICS_EVENT action with latest store
   * update where analytics.currentSession.guid is not null/undefined.
   * Only take the first emit as there could be several store updates
   * where analytics.currentSession.guid could be valid.
   */
  combineLatest(
    actions$.pipe(ofType(ActionTypes.SEND_ANALYTICS_EVENT)),
    state$.pipe(filter(x => _get(x, 'analytics.currentSession.guid', null))),
  ).pipe(
    take(1),
    repeat(),
    flatMap(([{ payload }, store]) => {
      return from(
        connectAPI.sendAnalyticsEvent({
          ...payload,
          path: store.analytics.path.map(obj => obj.path).join(''),
          data_source: store.analytics.dataSource,
          session_id: _get(store, 'analytics.currentSession.guid', null),
          host: getHostname(),
          is_mobile_webview: _get(window.app, 'is_mobile_webview', false),
        }),
      ).pipe(
        map(() => ({
          type: ActionTypes.SEND_ANALYTICS_EVENT_SUCCESS,
        })),
        catchError(err => {
          return of({ type: ActionTypes.SEND_ANALYTICS_EVENT_ERROR, payload: err })
        }),
      )
    }),
  )

export const sendAnalyticPageview = (actions$, state$) =>
  /**
   * Combine latest SEND_ANALYTIC_PATH action with latest store
   * update where analytics.currentSession.guid is not null/undefined.
   * Only take the first emit as there could be several store updates
   * where analytics.currentSession.guid could be valid.
   */
  combineLatest(
    actions$.pipe(ofType(ActionTypes.SEND_ANALYTIC_PATH)),
    state$.pipe(filter(x => _get(x, 'analytics.currentSession.guid', null))),
  ).pipe(
    take(1),
    repeat(),
    flatMap(([{ payload }, store]) => {
      const path = store.analytics.path.map(obj => obj.path).join('')
      const clientGuid = store.client.guid

      // If posthog has been initialized and the path includes connect, send to posthog for connects analytics.
      if (store.analytics.posthogInitialized && path.includes('/connect')) {
        posthog.capture('$pageview', {
          $current_url: path,
          $groups: { client: clientGuid },
          ...defaultEventMetadata,
          ...payload.metadata,
        })
      }

      return from(
        connectAPI.sendAnalyticsPageview({
          data_source: store.analytics.dataSource,
          session_id: _get(store, 'analytics.currentSession.guid', null),
          created_at: moment().unix(), //UTC is set globally for moment
          app_version: 'widgets-v2',
          user_agent: navigator.userAgent,
          name: `MX - ${payload.name}`,
          path,
          host: getHostname(),
          metadata: _get(window.app, 'clientConfig.metadata', null),
          is_mobile_webview: _get(window.app, 'is_mobile_webview', false),
        }),
      ).pipe(
        map(() => ({
          type: ActionTypes.SEND_ANALYTIC_PATH_SUCCESS,
        })),
        catchError(err => {
          return of({ type: ActionTypes.SEND_ANALYTIC_PATH_ERROR, payload: err })
        }),
      )
    }),
  )

export const initializePostHog = (actions$, state$) => {
  return combineLatest([
    actions$.pipe(ofType(ActionTypes.INITIALIZE_POSTHOG)),
    state$.pipe(filter(x => _get(x, 'user.details.guid', null))),
  ]).pipe(
    take(1), // This "magic" makes the epic only run one time when the above two conditions are satisfied.
    mergeMap(() => {
      /**
       * Autocapture below is for events related with a, button, form, input, select, textarea, and label tags.
       * Only the name, id, and class attributes from input tags will be collected.
       */
      posthog.init(window?.app?.postHogPublicKey || process.env.POSTHOG_API_KEY, {
        api_host: 'https://app.posthog.com', // This is default. Change if self hosted.
        autocapture: false, // Default is true, which will auto capture user events.
        capture_pageview: false, // Do not auto capture pageviews. This doesn't work on SPAs.
        /*
          The posthog-js library directly exposes recorder.js using:
          import 'posthog-js/dist/recorder'

          Without the import, posthog-js gets and applies a js file via the network,
          which for security purposes is a no-go.  We must import it directly.
        */
        disable_session_recording: true,
        persistence: 'memory', // Store identify info on page memory.
        loaded: posthog => {
          const userGuid = _get(state$, 'value.user.details.guid', null)

          if (userGuid) {
            posthog.identify(sha256(userGuid))
          }

          /**
           * Conditionally start Session Recording
           *
           * Only 'connect' | 'connections' requests for now
           * MoneyMap 'master' requests have too much PII to enable it
           */
          const requestedWidgetType = _get(state$, 'value.widgetProfile.type', null)
          if (['connect', 'connections'].includes(requestedWidgetType)) {
            posthog.startSessionRecording()
          }
        },
        session_recording: {
          maskAllInputs: true,
          maskInputFn,
        },
      })

      return of({ type: ActionTypes.INITIALIZE_POSTHOG_SUCCESS })
    }),
  )
}
