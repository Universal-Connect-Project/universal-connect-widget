import _get from 'lodash/get'
import moment from 'moment'
import { from, of } from 'rxjs'
import { catchError, filter, flatMap, map, mergeMap, pluck, repeat, take } from 'rxjs/operators'
import { combineLatest } from 'rxjs'
import { ofType } from 'redux-observable'
import posthog from 'posthog-js'
import sha256 from 'js-sha256'

import { ActionTypes } from '../actions/Analytics'

import { AGG_MODE } from '../../connect/const/Connect'
import { EventCategories } from '../../connect/const/Analytics'
import FireflyAPI from '../../utils/FireflyAPI'
import { getHostname } from '../../utils/Browser'

export const initializeSession = actions$ =>
  actions$.pipe(
    ofType(ActionTypes.INITIALIZE_ANALYTICS_SESSION),
    pluck('payload'),
    flatMap(sessionDetails =>
      from(FireflyAPI.createAnalyticsSession({ analytics_session: sessionDetails })).pipe(
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
        FireflyAPI.createNewFeatureVisit({
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
      const currentMode =
        state$.value.connect.connectConfig.mode ??
        state$.value.initializedClientConfig.connect?.mode ??
        AGG_MODE

      return from(
        FireflyAPI.sendAnalyticsEvent({
          ...payload,
          category:
            payload.category === EventCategories.CONNECT
              ? `${EventCategories.CONNECT} - ${currentMode}`
              : payload.category,
          path: store.analytics.path.map(obj => obj.path).join(''),
          data_source: store.analytics.dataSource,
          session_id: _get(store, 'analytics.currentSession.guid', null),
          host: getHostname(),
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

      // If posthog has been initialized and the path includes connect, send to posthog for connects analytics.
      if (store.analytics.posthogInitialized && path.includes('/connect')) {
        posthog.capture('$pageview', {
          $current_url: path,
        })
      }

      return from(
        FireflyAPI.sendAnalyticsPageview({
          data_source: store.analytics.dataSource,
          session_id: _get(store, 'analytics.currentSession.guid', null),
          created_at: moment().unix(), //UTC is set globally for moment
          app_version: 'widgets-v2',
          user_agent: navigator.userAgent,
          name: `MX - ${payload.name}`,
          path,
          host: getHostname(),
          metadata: _get(window.app, 'clientConfig.metadata', null),
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
      posthog.init(process.env.POSTHOG_API_KEY, {
        api_host: 'https://app.posthog.com', // This is default. Change if self hosted.
        autocapture: false, // Default is true, which will auto capture user events.
        capture_pageview: false, // Do not auto capture pageviews. This doesn't work on SPAs.
        disable_session_recording: true, // Security didn't approve this due to recorder.js requested at runtime.
        persistence: 'memory', // Store identify info on page memory.
        loaded: posthog => {
          const userGuid = _get(state$, 'value.user.details.guid', null)
          const client = _get(state$, 'value.client', {})

          if (userGuid) {
            posthog.identify(sha256(userGuid))
          }
          if (client.guid) {
            posthog.group('client', client.guid, { name: client.name || null })
          }
        },
      })
      return of({ type: ActionTypes.INITIALIZE_POSTHOG_SUCCESS })
    }),
  )
}
