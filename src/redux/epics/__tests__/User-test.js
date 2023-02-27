import { expectRx } from '../../../utils/Test'
import { ActionTypes, updateUser } from '../../actions/User'
import * as epics from '../../epics/User'
import { of } from 'rxjs'

describe('User Epic', () => {
  const ctx = {
    FireflyAPI: {
      updateUser: jest.fn(() => of([])),
    },
  }

  describe('updateUser', () => {
    it('should emit UPDATE_USER_SUCCESS', () => {
      expect.assertions(2)

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: updateUser([]) })

        expectObservable(epics.updateUser(input$, undefined, ctx)).toBe('a', {
          a: { type: ActionTypes.UPDATE_USER_SUCCESS },
        })
      })
      expect(ctx.FireflyAPI.updateUser).toHaveBeenCalled()
    })
  })
})
