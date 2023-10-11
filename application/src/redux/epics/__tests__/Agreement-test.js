jest.mock('utils/FireflyAPI')
import FireflyAPI from '../../../utils/FireflyAPI'

import { of, throwError } from 'rxjs'

import { expectRx } from '../../../utils/Test'

import { ActionTypes } from '../../actions/Agreement'
import { loadAgreement } from '../../epics/Agreement'

describe('MobileToken', () => {
  describe('.generateMobileToken', () => {
    it('should generate a mobile token', () => {
      expect.assertions(2)
      FireflyAPI.loadAgreement = jest.fn(() => of('SUCCESS'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: { type: ActionTypes.AGREEMENT_LOADING } })

        expectObservable(loadAgreement(input$)).toBe('a', {
          a: { type: ActionTypes.AGREEMENT_LOADED },
        })
      })

      expect(FireflyAPI.loadAgreement).toHaveBeenCalled()
    })

    it('should generate an error', () => {
      expect.assertions(2)
      FireflyAPI.loadAgreement = jest.fn(() => throwError('FAIL'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: { type: ActionTypes.AGREEMENT_LOADING } })

        expectObservable(loadAgreement(input$)).toBe('a', {
          a: { type: ActionTypes.AGREEMENT_ERROR },
        })
      })

      expect(FireflyAPI.loadAgreement).toHaveBeenCalled()
    })
  })
})
