import { of, throwError } from 'rxjs'

import { expectRx } from '../../../utils/Test'

import * as actions from '../../actions/App'
import * as epics from '../../epics/App'

describe('App Epics', () => {
  describe('loadMasterData', () => {
    it('should emit LOAD_MASTER_DATA_SUCCESS', () => {
      expect.assertions(2)

      const ctx = {
        FireflyAPI: {
          loadMaster: jest.fn(() => of('SUCCESS')),
        },
      }

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.loadMasterData() })

        expectObservable(epics.loadMasterData(input$, null, ctx)).toBe('a', {
          a: actions.loadMasterDataSuccess('SUCCESS'),
        })
      })

      expect(ctx.FireflyAPI.loadMaster).toHaveBeenCalled()
    })

    it('should generate an error', () => {
      expect.assertions(2)

      const ctx = {
        FireflyAPI: {
          loadMaster: jest.fn(() => throwError('ERROR')),
        },
      }

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: actions.loadMasterData() })

        expectObservable(epics.loadMasterData(input$, null, ctx)).toBe('a', {
          a: actions.loadMasterDataError('ERROR'),
        })
      })

      expect(ctx.FireflyAPI.loadMaster).toHaveBeenCalled()
    })
  })
})
