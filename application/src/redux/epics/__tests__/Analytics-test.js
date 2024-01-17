jest.mock('src/connect/services/api')

import { StateObservable } from 'redux-observable'

import { of, throwError } from 'rxjs'

import { expectRx } from 'utils/Test'

import connectAPI from 'src/connect/services/api'

import * as actions from 'reduxify/actions/Analytics'
import { ActionTypes } from 'reduxify/actions/Analytics'
import { initializeSession, createFeatureVisit, sendAnalyticsEvent } from 'reduxify/epics/Analytics'

describe('Analytics Epics', () => {
  describe('.initializeSession', () => {
    it('should initialize the analytics session', () => {
      expect.assertions(2)

      connectAPI.createAnalyticsSession = jest.fn(() => of('SUCCESS'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.initializeAnalyticsSession() })

        expectObservable(initializeSession(input$)).toBe('a', {
          a: { type: ActionTypes.INITIALIZE_ANALYTICS_SESSION_SUCCESS },
        })
      })

      expect(connectAPI.createAnalyticsSession).toHaveBeenCalled()
    })

    it('should generate an error', () => {
      expect.assertions(2)

      connectAPI.createAnalyticsSession = jest.fn(() => throwError('FAIL'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.initializeAnalyticsSession() })

        expectObservable(initializeSession(input$)).toBe('a', {
          a: { type: ActionTypes.INITIALIZE_ANALYTICS_SESSION_ERROR },
        })
      })

      expect(connectAPI.createAnalyticsSession).toHaveBeenCalled()
    })
  })

  describe('.createFeatureVisit', () => {
    afterEach(() => {
      connectAPI.createNewFeatureVisit.mockReset()
    })

    it('should wait for the the session guid *AND* CREATE_FEATURE_VISIT to fire', () => {
      expect.assertions(2)
      const featureVisit = { feature_visit: 'something' }
      const state = { analytics: { currentSession: { guid: 'ANS-1' } } }

      connectAPI.createNewFeatureVisit = jest.fn(() => of(featureVisit))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('a', {
          a: { type: ActionTypes.CREATE_FEATURE_VISIT, payload: featureVisit },
        })
        const state$ = hot('-b', { b: state })
        const unsub$ = '--!'

        expectObservable(createFeatureVisit(actions$, state$), unsub$).toBe('-c', {
          c: {
            type: ActionTypes.CREATE_FEATURE_VISIT_SUCCESS,
            payload: featureVisit.feature_visit,
          },
        })
      })

      // It should also wait for the action if the session emits first.
      // this just swaps the actions$ and state$ emit times
      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('-a', {
          a: { type: ActionTypes.CREATE_FEATURE_VISIT, payload: featureVisit },
        })
        const state$ = hot('b', { b: state })
        const unsub$ = '--!'

        expectObservable(createFeatureVisit(actions$, state$), unsub$).toBe('-c', {
          c: {
            type: ActionTypes.CREATE_FEATURE_VISIT_SUCCESS,
            payload: featureVisit.feature_visit,
          },
        })
      })
    })

    it('should error if the API request fails', () => {
      expect.assertions(1)
      const featureVisit = { feature_visit: 'something' }
      const state = { analytics: { currentSession: { guid: 'ANS-1' } } }

      connectAPI.createNewFeatureVisit = jest.fn(() => throwError('Oops!'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('a', {
          a: { type: ActionTypes.CREATE_FEATURE_VISIT, payload: featureVisit },
        })
        const state$ = hot('-b', { b: state })
        const unsub$ = '--!'

        expectObservable(createFeatureVisit(actions$, state$), unsub$).toBe('-c', {
          c: { type: ActionTypes.CREATE_FEATURE_VISIT_ERROR, payload: 'Oops!' },
        })
      })
    })
  })

  describe('.sendAnalyticsEvent', () => {
    window.app = { is_mobile_webview: true }
    afterEach(() => {
      connectAPI.sendAnalyticsEvent.mockReset()
    })

    it('should wait for the the session guid *AND* SEND_ANALYTICS_EVENT to fire', () => {
      expect.assertions(2)
      const event = { name: 'some cool event', is_mobile_webview: true }
      const state = {
        analytics: { currentSession: { guid: 'ANS-1' }, path: [] },
        connect: { connectConfig: {} },
        initializedClientConfig: {},
      }

      connectAPI.sendAnalyticsEvent = jest.fn(() => of(event))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('a', {
          a: { type: ActionTypes.SEND_ANALYTICS_EVENT, payload: event },
        })
        const state$ = new StateObservable(hot('-b', { b: state }))
        const unsub$ = '--!'

        expectObservable(sendAnalyticsEvent(actions$, state$), unsub$).toBe('-c', {
          c: {
            type: ActionTypes.SEND_ANALYTICS_EVENT_SUCCESS,
          },
        })
      })

      // It should also wait for the action if the session emits first.
      // this just swaps the actions$ and state$ emit times
      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('-a', {
          a: { type: ActionTypes.SEND_ANALYTICS_EVENT, payload: event },
        })
        const state$ = new StateObservable(hot('b', { b: state }))
        const unsub$ = '--!'

        expectObservable(sendAnalyticsEvent(actions$, state$), unsub$).toBe('-c', {
          c: {
            type: ActionTypes.SEND_ANALYTICS_EVENT_SUCCESS,
          },
        })
      })
    })

    it('should error if the API request fails', () => {
      expect.assertions(1)
      const event = { name: 'some cool event' }
      const state = {
        analytics: { currentSession: { guid: 'ANS-1' }, path: [] },
        connect: { connectConfig: {} },
        initializedClientConfig: {},
      }

      connectAPI.sendAnalyticsEvent = jest.fn(() => throwError('Oops!'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const actions$ = hot('a', {
          a: { type: ActionTypes.SEND_ANALYTICS_EVENT, payload: event },
        })
        const state$ = new StateObservable(hot('-b', { b: state }))
        const unsub$ = '--!'

        expectObservable(sendAnalyticsEvent(actions$, state$), unsub$).toBe('-c', {
          c: { type: ActionTypes.SEND_ANALYTICS_EVENT_ERROR, payload: 'Oops!' },
        })
      })
    })
  })
})
