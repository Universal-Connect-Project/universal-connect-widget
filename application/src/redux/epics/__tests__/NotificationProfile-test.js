import { of } from 'rxjs'

import { expectRx } from '../../../utils/Test'

import * as actions from '../../actions/NotificationProfile'
import { ActionTypes } from '../../actions/NotificationProfile'
import {
  loadNotificationProfile,
  editNotificationProfile,
} from 'reduxify/epics/NotificationProfile'

describe('Notification Profile', () => {
  it('should emit LOAD_NOTIFICATION_PROFILE_SUCCESS when it is successful', () => {
    expect.assertions(1)

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const action$ = hot('a', { a: actions.loadNotificationProfiles() })
      const ctx = { FireflyAPI: { loadNotificationProfiles: () => of({}) } }

      expectObservable(loadNotificationProfile(action$, undefined, ctx)).toBe('a', {
        a: { type: ActionTypes.LOAD_NOTIFICATION_PROFILES_SUCCESS, payload: {} },
      })
    })
  })

  it('should emit EDIT_NOTIFICATION_PROFILE_SUCCESS when it is successfull', () => {
    expect.assertions(1)

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const action$ = hot('a', { a: actions.editNotificationProfile({}) })
      const ctx = { FireflyAPI: { editNotificationProfile: () => of({}) } }

      expectObservable(editNotificationProfile(action$, undefined, ctx)).toBe('a', {
        a: { type: ActionTypes.EDIT_NOTIFICATION_PROFILE_SUCCESS, payload: {} },
      })
    })
  })
})
