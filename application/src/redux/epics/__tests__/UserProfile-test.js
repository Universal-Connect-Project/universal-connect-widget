import { expectRx } from '../../../utils/Test'
import * as actions from '../../actions/UserProfile'
import * as epics from '../../epics/UserProfile'
import { of } from 'rxjs'

describe('UserProfile Epic', () => {
  describe('updateUserProfile', () => {
    it('should emit UPDATE_USER_PROFILE_SUCCESS', () => {
      const ctx = {
        FireflyAPI: {
          updateUserProfile: jest.fn(() => of([])),
        },
      }
      const userProfile = {}

      expect.assertions(2)

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.updateUserProfile(userProfile) })

        expectObservable(epics.updateUserProfile(input$, undefined, ctx)).toBe('a', {
          a: actions.updateUserProfileSuccess([]),
        })
      })

      expect(ctx.FireflyAPI.updateUserProfile).toHaveBeenCalled()
    })
  })
})
