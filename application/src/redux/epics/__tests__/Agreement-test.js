jest.mock('src/connect/services/api')

import { of, throwError } from 'rxjs'

import connectAPI from 'src/connect/services/api'

import { expectRx } from 'utils/Test'

import { ActionTypes } from 'reduxify/actions/Agreement'
import { loadAgreement } from 'reduxify/epics/Agreement'

describe('MobileToken', () => {
  describe('.generateMobileToken', () => {
    it('should generate a mobile token', () => {
      expect.assertions(2)
      connectAPI.loadAgreement = jest.fn(() => of('SUCCESS'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: { type: ActionTypes.AGREEMENT_LOADING } })

        expectObservable(loadAgreement(input$)).toBe('a', {
          a: { type: ActionTypes.AGREEMENT_LOADED },
        })
      })

      expect(connectAPI.loadAgreement).toHaveBeenCalled()
    })

    it('should generate an error', () => {
      expect.assertions(2)
      connectAPI.loadAgreement = jest.fn(() => throwError('FAIL'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const input$ = hot('a', { a: { type: ActionTypes.AGREEMENT_LOADING } })

        expectObservable(loadAgreement(input$)).toBe('a', {
          a: { type: ActionTypes.AGREEMENT_ERROR },
        })
      })

      expect(connectAPI.loadAgreement).toHaveBeenCalled()
    })
  })
})
