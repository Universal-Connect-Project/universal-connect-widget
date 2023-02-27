import { expectRx } from '../../../utils/Test'
import {
  ActionTypes,
  updateUserCommunicationProfile,
} from 'reduxify/actions/UserCommunicationProfile'
import * as epics from '../../epics/UserCommunicationProfile'
import { of } from 'rxjs'

describe('User Epic', () => {
  const ctx = {
    FireflyAPI: {
      /*
        The data coming back from updateUserCommunicationProfile 
        should be in the form shown below
      */
      updateUserCommunicationProfile: jest.fn(() =>
        of({
          data: {
            user_communication_profile: {},
          },
        }),
      ),
    },
  }

  describe('updateUser', () => {
    it('should emit UPDATE_USER_COMMUNICATION_PROFILE_SUCCESS', () => {
      expect.assertions(2)

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: updateUserCommunicationProfile({}) })

        expectObservable(epics.updateUserCommunicationProfile(input$, undefined, ctx)).toBe('a', {
          a: { type: ActionTypes.UPDATE_USER_COMMUNICATION_PROFILE_SUCCESS, payload: {} },
        })
      })
      expect(ctx.FireflyAPI.updateUserCommunicationProfile).toHaveBeenCalled()
    })
  })
})
