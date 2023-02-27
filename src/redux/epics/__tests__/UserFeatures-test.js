import { expectRx } from '../../../utils/Test'
import * as actions from '../../actions/UserFeatures'
import * as epics from '../../epics/UserFeatures'
import { of, throwError } from 'rxjs'

describe('User Features Epic', () => {
  describe('loadUserFeatures', () => {
    const userFeatures = []

    it('should emit LOAD_USER_FEATURE_SUCCESS if features load correctly', () => {
      const ctx = {
        FireflyAPI: {
          loadUserFeatures: jest.fn(() => of(userFeatures)),
        },
      }

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.loadUserFeatures() })

        expectObservable(epics.loadUserFeatures(input$, undefined, ctx)).toBe('a', {
          a: actions.loadUserFeaturesSuccess(userFeatures),
        })
      })

      expect(ctx.FireflyAPI.loadUserFeatures).toHaveBeenCalled()
    })

    it('should emit LOAD_USER_FEATURE_ERROR if call fails', () => {
      const ctx = {
        FireflyAPI: {
          loadUserFeatures: () => throwError('loadUserFeatures TEST FAILURE'),
        },
      }

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.loadUserFeatures() })

        expectObservable(epics.loadUserFeatures(input$, undefined, ctx)).toBe('a', {
          a: actions.loadUserFeaturesError('loadUserFeatures TEST FAILURE'),
        })
      })
    })
  })
})
