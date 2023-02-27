import { of, throwError } from 'rxjs'

import { expectRx } from '../../../utils/Test'

import * as actions from '../../actions/MonthlyCashFlowProfile'
import { ActionTypes } from '../../actions/MonthlyCashFlowProfile'
import {
  loadMonthlyCashFlowProfile,
  updateMonthlyCashFlowProfile,
} from 'reduxify/epics/MonthlyCashFlowProfile'

describe('MonthlyCashFlowProfile test, loadMonthlyCashFlowProfile', () => {
  it('should emit LOAD_MONTHLY_CASH_FLOW_SUCCESS when it is successfull', () => {
    expect.assertions(1)

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const action$ = hot('a', { a: actions.loadMonthlyCashFlowProfile() })
      const ctx = { FireflyAPI: { loadMonthlyCashFlowProfile: () => of({}) } }

      expectObservable(loadMonthlyCashFlowProfile(action$, undefined, ctx)).toBe('a', {
        a: { type: ActionTypes.LOAD_MONTHLY_CASH_FLOW_SUCCESS, payload: {} },
      })
    })
  })
  it('should emit LOAD_MONTHLY_CASH_FLOW_ERROR when it fails', () => {
    expect.assertions(1)

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const action$ = hot('a', { a: actions.loadMonthlyCashFlowProfile() })
      const ctx = { FireflyAPI: { loadMonthlyCashFlowProfile: () => throwError('error') } }

      expectObservable(loadMonthlyCashFlowProfile(action$, undefined, ctx)).toBe('a', {
        a: {
          type: ActionTypes.LOAD_MONTHLY_CASH_FLOW_ERROR,
          payload: 'error',
        },
      })
    })
  })
})

describe('MonthlyCashFlowProfile test, updateMonthlyCashFlowProfile', () => {
  it('should emit UPDATE_MONTHLY_CASH_FLOW_SUCCESS when it is successfull', () => {
    expect.assertions(1)

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const action$ = hot('a', { a: actions.updateMonthlyCashFlowProfile({}) })
      const ctx = { FireflyAPI: { updateMonthlyCashFlowProfile: () => of({}) } }

      expectObservable(updateMonthlyCashFlowProfile(action$, undefined, ctx)).toBe('a', {
        a: { type: ActionTypes.UPDATE_MONTHLY_CASH_FLOW_SUCCESS, payload: {} },
      })
    })
  })
  it('should emit UPDATE_MONTHLY_CASH_FLOW_ERROR when it fails', () => {
    expect.assertions(1)

    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const action$ = hot('a', { a: actions.updateMonthlyCashFlowProfile({}) })
      const ctx = { FireflyAPI: { updateMonthlyCashFlowProfile: () => throwError('error') } }

      expectObservable(updateMonthlyCashFlowProfile(action$, undefined, ctx)).toBe('a', {
        a: {
          type: ActionTypes.UPDATE_MONTHLY_CASH_FLOW_ERROR,
          payload: 'error',
        },
      })
    })
  })
})
