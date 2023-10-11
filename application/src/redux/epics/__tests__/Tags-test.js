jest.mock('utils/FireflyAPI')
import FireflyAPI from '../../../utils/FireflyAPI'
import { of, throwError } from 'rxjs'

import * as epics from '../../epics/Tags'

import { ActionTypes } from '../../actions/Tags'

import { expectRx } from '../../../utils/Test'

describe('Tags epic', () => {
  describe('.createTagging', () => {
    const tagging = { tag_guid: 'TAG-123', transaction_guid: 'TRN-123' }

    it('should create a new tagging', () => {
      FireflyAPI.createTagging = jest.fn(() => of({ ...tagging, guid: 'TGN-123' }))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const action$ = hot('a', {
          a: { type: ActionTypes.CREATE_TAGGING, payload: tagging },
        })
        const output$ = epics.createTagging(action$, {}, { FireflyAPI })

        expectObservable(output$).toBe('a', {
          a: {
            type: ActionTypes.TAGGING_CREATED,
          },
        })
      })
    })

    it('should throw an error if the request fails', () => {
      FireflyAPI.createTagging = jest.fn(() => throwError('Something went wrong'))

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const action$ = hot('a', {
          a: { type: ActionTypes.CREATE_TAGGING, payload: tagging },
        })
        const output$ = epics.createTagging(action$, {}, { FireflyAPI })

        expectObservable(output$).toBe('a', {
          a: {
            type: ActionTypes.CREATE_TAGGING_ERROR,
          },
        })
      })
    })
  })
})
