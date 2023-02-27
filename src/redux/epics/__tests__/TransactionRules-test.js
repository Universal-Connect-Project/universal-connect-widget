import { of, from, throwError } from 'rxjs'
import { expectRx } from '../../../utils/Test'

import * as actions from '../../actions/TransactionRules'
import { ActionTypes } from '../../actions/TransactionRules'
import {
  loadTransactionRules,
  createTransactionRule,
  deleteTransactionRule,
  saveTransactionRule,
  transactionRuleSaved,
} from 'reduxify/epics/TransactionRules'

import { ActionTypes as TransactionActionTypes } from '../../actions/Transactions'
import * as transactionStream from '../../../streams/transactions'

describe('Transaction Rules Epics', () => {
  describe('loadTransactionRules', () => {
    it('should emit RULES_LOADED when it succeeds', () => {
      const rules = [
        {
          rule_guid: 'rule_guid',
          rule_name: 'test rule name',
        },
        {
          rule_guid: 'rule_guid',
          rule_name: 'test rule name 2',
        },
        {
          rule_guid: 'rule_guid',
          rule_name: 'test rule name 3',
        },
      ]

      expect.assertions(1)
      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const action$ = hot('a', { a: actions.loadTransactionRules() })
        const ctx = { FireflyAPI: { loadTransactionRules: () => of(rules) } }

        expectObservable(loadTransactionRules(action$, undefined, ctx)).toBe('a', {
          a: { type: ActionTypes.RULES_LOADED, payload: { items: rules } },
        })
      })
    })
    it('should emit RULES_LOADED_ERROR when it fais', () => {
      expect.assertions(1)
      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const action$ = hot('a', { a: actions.loadTransactionRules() })
        const ctx = {
          FireflyAPI: {
            loadTransactionRules: () => throwError('loadTransactionRules TEST FAILURE'),
          },
        }

        expectObservable(loadTransactionRules(action$, undefined, ctx)).toBe('a', {
          a: { type: ActionTypes.RULES_LOADED_ERROR, payload: 'loadTransactionRules TEST FAILURE' },
        })
      })
    })
  })
  describe('createTransactionRule', () => {
    it('should emit RULE_CREATED when it succeeds', () => {
      const transaction_rule = {
        category_guid: 'categoryGUID',
        rule_guid: 'ruleGUID',
        name: 'rule name',
      }

      expect.assertions(1)

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const action$ = hot('a', { a: actions.createRule({}) })
        const ctx = { FireflyAPI: { createTransactionRule: () => of({ transaction_rule }) } }

        expectObservable(createTransactionRule(action$, undefined, ctx)).toBe('a', {
          a: {
            type: ActionTypes.RULE_CREATED,
            payload: { item: transaction_rule },
          },
        })
      })
    })
    it('should emit RULE_CREATED_ERROR when it fails', () => {
      expect.assertions(1)
      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const action$ = hot('a', { a: actions.createRule() })
        const ctx = {
          FireflyAPI: {
            createTransactionRule: () => throwError('createTransactionRule TEST FAILURE'),
          },
        }

        expectObservable(createTransactionRule(action$, undefined, ctx)).toBe('a', {
          a: {
            type: ActionTypes.RULE_CREATED_ERROR,
            payload: 'createTransactionRule TEST FAILURE',
          },
        })
      })
    })
  })
  describe('deleteTransactionRule', () => {
    it('should emit RULE_DELETED when it succeeds', () => {
      const rule = { rule_guid: 'ruleNameGUID' }

      expect.assertions(1)

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const action$ = hot('a', { a: actions.deleteRule(rule) })
        const ctx = { FireflyAPI: { deleteTransactionRule: () => of({ item: rule }) } }

        expectObservable(deleteTransactionRule(action$, undefined, ctx)).toBe('a', {
          a: {
            type: ActionTypes.RULE_DELETED,
            payload: { item: rule },
          },
        })
      })
    })
    it('should emit RULE_DELETED_ERROR when it fails', () => {
      expect.assertions(1)

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const action$ = hot('a', { a: actions.deleteRule({}) })
        const ctx = {
          FireflyAPI: {
            deleteTransactionRule: () => throwError('deleteTransactionRule TEST FAILURE'),
          },
        }

        expectObservable(deleteTransactionRule(action$, undefined, ctx)).toBe('a', {
          a: {
            type: ActionTypes.RULE_DELETED_ERROR,
            payload: 'deleteTransactionRule TEST FAILURE',
          },
        })
      })
    })
  })
  describe('saveTransactionRule', () => {
    it('should emit RULE_SAVED when it succeeds', () => {
      const transaction_rule = { rule_guid: 'ruleNameGUID', name: 'ruleName' }

      expect.assertions(1)
      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const action$ = hot('a', { a: actions.saveRule() })
        const ctx = { FireflyAPI: { saveTransactionRule: () => of({ transaction_rule }) } }

        expectObservable(saveTransactionRule(action$, undefined, ctx)).toBe('a', {
          a: {
            type: ActionTypes.RULE_SAVED,
            payload: { item: transaction_rule },
          },
        })
      })
    })
    it('should emit RULE_SAVED_ERROR when it fails', () => {
      expect.assertions(1)

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const action$ = hot('a', { a: actions.saveRule() })
        const ctx = {
          FireflyAPI: { saveTransactionRule: () => throwError('saveTransactionRule TEST FAILURE') },
        }

        expectObservable(saveTransactionRule(action$, undefined, ctx)).toBe('a', {
          a: {
            type: ActionTypes.RULE_SAVED_ERROR,
            payload: 'saveTransactionRule TEST FAILURE',
          },
        })
      })
    })
  })
  describe('transactionRuleSaved', () => {
    it('should emit TRANSACTIONS_UPDATED if more than one transaction is updated', () => {
      transactionStream.TransactionUpdated$ = from([{ guid: 1 }, { guid: 2 }])

      expectRx.toMatchObject.run(({ hot, expectObservable }) => {
        const action$ = hot('a', { a: actions.ruleSaved({}) })
        const output$ = transactionRuleSaved(action$)

        expectObservable(output$).toBe('a', {
          a: { type: TransactionActionTypes.TRANSACTIONS_UPDATED },
        })
      })
    })
  })
})
