jest.mock('utils/FireflyAPI')
import FireflyAPI from '../../../utils/FireflyAPI'

import { of, throwError } from 'rxjs'

import { expectRx } from '../../../utils/Test'

import * as actions from '../../actions/Notifications'
import { ActionTypes } from '../../actions/Notifications'
import {
  loadNotifications,
  markAllNotificationsAsRead,
  saveNotification,
} from 'reduxify/epics/Notifications'

describe('Notifications Epics', () => {
  describe('.loadNotifications', () => {
    it('should load Notifications', () => {
      expect.assertions(2)

      FireflyAPI.loadNotifications = jest.fn(() => of('SUCCESS'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.loadNotifications() })

        expectObservable(loadNotifications(input$)).toBe('a', {
          a: { type: ActionTypes.NOTIFICATIONS_LOADED },
        })
      })

      expect(FireflyAPI.loadNotifications).toHaveBeenCalled()
    })

    it('should generate an error', () => {
      expect.assertions(2)

      FireflyAPI.loadNotifications = jest.fn(() => throwError('FAIL'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.loadNotifications() })

        expectObservable(loadNotifications(input$)).toBe('a', {
          a: { type: ActionTypes.NOTIFICATIONS_LOADED_ERROR },
        })
      })

      expect(FireflyAPI.loadNotifications).toHaveBeenCalled()
    })
  })

  describe('.markAllNotificationsAsRead', () => {
    it('should mark all notifications as read', () => {
      expect.assertions(2)

      FireflyAPI.markAllNotificationsAsRead = jest.fn(() => of('SUCCESS'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.markAllAsRead() })

        expectObservable(markAllNotificationsAsRead(input$)).toBe('a', {
          a: { type: ActionTypes.ALL_NOTIFICATIONS_MARKED_AS_READ },
        })
      })

      expect(FireflyAPI.markAllNotificationsAsRead).toHaveBeenCalled()
    })

    it('should generate an error', () => {
      expect.assertions(2)

      FireflyAPI.markAllNotificationsAsRead = jest.fn(() => throwError('FAIL'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.markAllAsRead() })

        expectObservable(markAllNotificationsAsRead(input$)).toBe('a', {
          a: { type: ActionTypes.MARK_ALL_NOTIFICATIONS_AS_READ_ERROR },
        })
      })

      expect(FireflyAPI.markAllNotificationsAsRead).toHaveBeenCalled()
    })
  })

  describe('.saveNotification', () => {
    it('should save a notification', () => {
      expect.assertions(2)

      FireflyAPI.saveNotification = jest.fn(() => of({ guid: 'NTF-123' }))

      expectRx.toEqual.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.saveNotification() })

        expectObservable(saveNotification(input$)).toBe('a', {
          a: { type: ActionTypes.NOTIFICATION_SAVED, payload: { item: { guid: 'NTF-123' } } },
        })
      })

      expect(FireflyAPI.saveNotification).toHaveBeenCalled()
    })

    it('should generate an error', () => {
      expect.assertions(2)

      FireflyAPI.saveNotification = jest.fn(() => throwError('FAIL'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.saveNotification() })

        expectObservable(saveNotification(input$)).toBe('a', {
          a: { type: ActionTypes.NOTIFICATION_SAVE_ERROR },
        })
      })

      expect(FireflyAPI.saveNotification).toHaveBeenCalled()
    })
  })
})
