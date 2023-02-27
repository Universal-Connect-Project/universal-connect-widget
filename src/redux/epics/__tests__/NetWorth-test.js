import { of, throwError } from 'rxjs'
import { expectRx } from '../../../utils/Test'

import { ActionTypes } from '../../actions/NetWorth'
import { ActionTypes as MembersActions } from '../../actions/Members'
import { ActionTypes as AccountsActions } from '../../actions/Accounts'
import * as epics from '../../epics/NetWorth'

describe('saveAccountAndLoadMonthlyAccountBalances', () => {
  it('should save the account and fetch monthly account balances and emit success', () => {
    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const account = {
        guid: 'ACT-123',
        balance: '1000',
        credit_limit: '1000',
        interest_rate: '1',
        minimum_payment: '10',
        original_balance: '2000',
      }
      const balances = [{ account_guid: 'ACT-123', balance: 1000 }]
      const ctx = {
        FireflyAPI: {
          saveAccount: () => of(account),
          loadMonthlyAccountBalances: () => of(balances),
        },
      }
      const state$ = {
        value: {
          netWorth: {
            monthlyAccountBalances: [
              {
                account_guid: 'ACT-123',
                balance: 500,
              },
              {
                account_guid: 'ACT-234',
                balance: 2000,
              },
            ],
          },
        },
      }

      const input$ = hot('a', { a: { type: ActionTypes.NET_WORTH_SAVE_ACCOUNT, payload: account } })
      const output$ = epics.saveAccountAndLoadMonthlyAccountBalances(input$, state$, ctx)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.NET_WORTH_SAVE_ACCOUNT_SUCCESS,
          payload: [
            {
              account_guid: 'ACT-234',
              balance: 2000,
            },
            {
              account_guid: 'ACT-123',
              balance: 1000,
            },
          ],
        },
      })
    })
  })

  it("should emit NET_WORTH_SAVE_ACCOUNT_ERROR when there's an issue with saving the account", () => {
    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const account = {
        guid: 'ACT-123',
        balance: '1000',
        credit_limit: '1000',
        interest_rate: '1',
        minimum_payment: '10',
        original_balance: '2000',
      }
      const balances = [{ account_guid: 'ACT-123', balance: 1000 }]
      const ctx = {
        FireflyAPI: {
          saveAccount: () =>
            throwError('saveAccountAndLoadMonthlyAccountBalances saveAccount TEST FAIL'),
          loadMonthlyAccountBalances: () => of(balances),
        },
      }
      const state$ = {
        value: {
          netWorth: {
            monthlyAccountBalances: [
              {
                account_guid: 'ACT-123',
                balance: 500,
              },
              {
                account_guid: 'ACT-234',
                balance: 2000,
              },
            ],
          },
        },
      }

      const input$ = hot('a', { a: { type: ActionTypes.NET_WORTH_SAVE_ACCOUNT, payload: account } })
      const output$ = epics.saveAccountAndLoadMonthlyAccountBalances(input$, state$, ctx)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.NET_WORTH_SAVE_ACCOUNT_ERROR,
          payload: 'saveAccountAndLoadMonthlyAccountBalances saveAccount TEST FAIL',
        },
      })
    })
  })

  it("should emit NET_WORTH_SAVE_ACCOUNT_ERROR when there's an issue with loading the balances", () => {
    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const account = {
        guid: 'ACT-123',
        balance: '1000',
        credit_limit: '1000',
        interest_rate: '1',
        minimum_payment: '10',
        original_balance: '2000',
      }
      const ctx = {
        FireflyAPI: {
          saveAccount: () => of(account),
          loadMonthlyAccountBalances: () =>
            throwError(
              'saveAccountAndLoadMonthlyAccountBalances loadMonthlyAccountBalances TEST FAIL',
            ),
        },
      }
      const state$ = {
        value: {
          netWorth: {
            monthlyAccountBalances: [
              {
                account_guid: 'ACT-123',
                balance: 500,
              },
              {
                account_guid: 'ACT-234',
                balance: 2000,
              },
            ],
          },
        },
      }

      const input$ = hot('a', { a: { type: ActionTypes.NET_WORTH_SAVE_ACCOUNT, payload: account } })
      const output$ = epics.saveAccountAndLoadMonthlyAccountBalances(input$, state$, ctx)

      expectObservable(output$).toBe('a', {
        a: {
          type: ActionTypes.NET_WORTH_SAVE_ACCOUNT_ERROR,
          payload: 'saveAccountAndLoadMonthlyAccountBalances loadMonthlyAccountBalances TEST FAIL',
        },
      })
    })
  })
})

describe('updateNetWorthDataOnWebSocket', () => {
  it('makes no requests if net worth is inactive widget', () => {
    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const ctx = {
        FireflyAPI: {
          loadNetWorthData: jest.fn(),
        },
      }

      const state$ = {
        value: {
          analytics: { dataSource: 'transactions' },
          experiments: { items: [] },
        },
      }
      const input$ = hot('a', { a: { type: AccountsActions.FAYE_ACCOUNTS_UPDATED } })

      expectObservable(epics.updateNetWorthDataOnWebSocket(input$, state$, ctx)).toBe('-')

      expect(ctx.FireflyAPI.loadNetWorthData).not.toHaveBeenCalled()
    })
  })

  it('responds to all websocket actions and makes request for networth data', () => {
    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const expectedAccounts = [{ guid: 'ACT-ABC', member_guid: 'MBR-DEF', balance: 10 }]
      const expectedMembers = [{ guid: 'MBR-DEF' }]
      const expectedMonthlyAccountBalances = [{ balance: 10 }]

      const netWorthData = {
        accounts: expectedAccounts,
        members: expectedMembers,
        monthlyAccountBalances: expectedMonthlyAccountBalances,
      }

      const ctx = {
        FireflyAPI: {
          loadNetWorthData: () => of(netWorthData),
        },
      }

      const state$ = {
        value: {
          analytics: { dataSource: 'master/networth' },
          experiments: { items: [] },
        },
      }

      const eventTypesWS = [
        AccountsActions.FAYE_ACCOUNTS_CREATED,
        AccountsActions.FAYE_ACCOUNTS_DELETED,
        AccountsActions.FAYE_ACCOUNTS_UPDATED,
        MembersActions.FAYE_MEMBERS_AGGREGATED,
        MembersActions.FAYE_MEMBERS_CREATED,
        MembersActions.FAYE_MEMBERS_DELETED,
        MembersActions.FAYE_MEMBERS_UPDATED,
      ]

      eventTypesWS.map(type => {
        const input$ = hot('a', { a: { type } })
        const output$ = epics.updateNetWorthDataOnWebSocket(input$, state$, ctx)

        expectObservable(output$).toBe('a', {
          a: {
            type: ActionTypes.NET_WORTH_DATA_LOADED,
            payload: netWorthData,
          },
        })
      })
    })
  })

  it('emits an error if the network request fails', () => {
    expectRx.toMatchObject.run(({ hot, expectObservable }) => {
      const ctx = {
        FireflyAPI: {
          loadNetWorthData: jest.fn(() => throwError('oh no!')),
        },
      }

      const state$ = {
        value: {
          analytics: { dataSource: 'master/networth' },
          experiments: { items: [] },
        },
      }
      const input$ = hot('a', { a: { type: AccountsActions.FAYE_ACCOUNTS_UPDATED } })

      expectObservable(epics.updateNetWorthDataOnWebSocket(input$, state$, ctx)).toBe('a', {
        a: {
          type: ActionTypes.NET_WORTH_DATA_ERROR,
          payload: 'oh no!',
        },
      })
    })
  })
})
