import { of, defer } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import _get from 'lodash/get'
import moment from 'moment'

import FireflyAPI from '../../utils/FireflyAPI'

import { ActionTypes as FinstrongActionTypes } from '../actions/Finstrong'

export const loadDiscoveredInstitutions = actions$ =>
  actions$.pipe(
    ofType(FinstrongActionTypes.LOAD_DISCOVERED_INSTITUTIONS),
    mergeMap(() =>
      defer(() => FireflyAPI.loadDiscoveredInstitutions()).pipe(
        map(institutions => ({
          type: FinstrongActionTypes.LOAD_DISCOVERED_INSTITUTIONS_SUCCESS,
          payload: institutions,
        })),
        catchError(err => {
          return of({
            type: FinstrongActionTypes.LOAD_DISCOVERED_INSTITUTIONS_ERROR,
            payload: err,
          })
        }),
      ),
    ),
  )

export const fetchPeerScore = (actions$, state$) =>
  actions$.pipe(
    ofType(FinstrongActionTypes.FETCH_PEER_SCORE),
    mergeMap(() => {
      const birthdayTimestamp = _get(state$, 'value.user.details.birthday')

      return defer(() =>
        FireflyAPI.fetchPeerScore(moment.unix(birthdayTimestamp).format('YYYY')),
      ).pipe(
        map(peerScore => ({
          type: FinstrongActionTypes.FETCH_PEER_SCORE_SUCCESS,
          payload: peerScore,
        })),
        catchError(err => {
          return of({
            type: FinstrongActionTypes.FETCH_PEER_SCORE_ERROR,
            payload: err,
          })
        }),
      )
    }),
  )

export const fetchAverageHealthScores = actions$ =>
  actions$.pipe(
    ofType(FinstrongActionTypes.FETCH_AVERAGE_HEALTH_SCORES),
    mergeMap(() => {
      return defer(() => FireflyAPI.fetchAverageHealthScores()).pipe(
        map(averageHealthScores => ({
          type: FinstrongActionTypes.FETCH_AVERAGE_HEALTH_SCORES_SUCCESS,
          payload: averageHealthScores,
        })),
        catchError(error =>
          of({
            type: FinstrongActionTypes.FETCH_AVERAGE_HEALTH_SCORES_ERROR,
            payload: error,
          }),
        ),
      )
    }),
  )

export const fetchHealthScore = actions$ =>
  actions$.pipe(
    ofType(FinstrongActionTypes.FETCH_HEALTH_SCORE),
    mergeMap(() => {
      return defer(() => FireflyAPI.fetchHealthScore()).pipe(
        map(healthScore => ({
          type: FinstrongActionTypes.FETCH_HEALTH_SCORE_SUCCESS,
          payload: healthScore,
        })),
        catchError(err =>
          of({
            type: FinstrongActionTypes.FETCH_HEALTH_SCORE_ERROR,
            payload: err,
          }),
        ),
      )
    }),
  )

export const calculateHealthScore = actions$ =>
  actions$.pipe(
    ofType(FinstrongActionTypes.CALCULATE_HEALTH_SCORE),
    mergeMap(() =>
      defer(() => FireflyAPI.calculateHealthScore()).pipe(
        map(score => ({
          type: FinstrongActionTypes.CALCULATE_HEALTH_SCORE_SUCCESS,
          payload: score,
        })),
        catchError(err => {
          return of({
            type: FinstrongActionTypes.CALCULATE_HEALTH_SCORE_ERROR,
            payload: err,
          })
        }),
      ),
    ),
  )

export const fetchDebtSpendTransactions = actions$ =>
  actions$.pipe(
    ofType(FinstrongActionTypes.FETCH_DEBT_SPEND_TRANSACTIONS),
    mergeMap(() => {
      return defer(() => FireflyAPI.fetchDebtSpendTransactions()).pipe(
        map(debtSpendTransactions => ({
          type: FinstrongActionTypes.FETCH_DEBT_SPEND_TRANSACTIONS_SUCCESS,
          payload: debtSpendTransactions,
        })),
        catchError(err =>
          of({
            type: FinstrongActionTypes.FETCH_DEBT_SPEND_TRANSACTIONS_ERROR,
            payload: err,
          }),
        ),
      )
    }),
  )

export const fetchStandardSpendTransactions = actions$ =>
  actions$.pipe(
    ofType(FinstrongActionTypes.FETCH_STANDARD_SPEND_TRANSACTIONS),
    mergeMap(() => {
      return defer(() => FireflyAPI.fetchStandardSpendTransactions()).pipe(
        map(standardSpendTransactions => ({
          type: FinstrongActionTypes.FETCH_STANDARD_SPEND_TRANSACTIONS_SUCCESS,
          payload: standardSpendTransactions,
        })),
        catchError(err =>
          of({
            type: FinstrongActionTypes.FETCH_STANDARD_SPEND_TRANSACTIONS_ERROR,
            payload: err,
          }),
        ),
      )
    }),
  )

export const fetchSpendingFeeTransactions = actions$ =>
  actions$.pipe(
    ofType(FinstrongActionTypes.FETCH_SPENDING_FEE_TRANSACTIONS),
    mergeMap(() => {
      return defer(() => FireflyAPI.fetchSpendingFeeTransactions()).pipe(
        map(spendingFeeTransactions => ({
          type: FinstrongActionTypes.FETCH_SPENDING_FEE_TRANSACTIONS_SUCCESS,
          payload: spendingFeeTransactions,
        })),
        catchError(err =>
          of({
            type: FinstrongActionTypes.FETCH_SPENDING_FEE_TRANSACTIONS_ERROR,
            payload: err,
          }),
        ),
      )
    }),
  )

export const fetchIncomeTransactions = actions$ =>
  actions$.pipe(
    ofType(FinstrongActionTypes.FETCH_INCOME_TRANSACTIONS),
    mergeMap(() => {
      return defer(() => FireflyAPI.fetchIncomeTransactions()).pipe(
        map(incomeTransactions => ({
          type: FinstrongActionTypes.FETCH_INCOME_TRANSACTIONS_SUCCESS,
          payload: incomeTransactions,
        })),
        catchError(err =>
          of({
            type: FinstrongActionTypes.FETCH_INCOME_TRANSACTIONS_ERROR,
            payload: err,
          }),
        ),
      )
    }),
  )

export const fetchMonthlyHealthScoreSummaries = actions$ =>
  actions$.pipe(
    ofType(FinstrongActionTypes.FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES),
    mergeMap(() => {
      return defer(() => FireflyAPI.fetchMonthlyHealthScoreSummaries()).pipe(
        map(monthylHealthScoreSummaries => ({
          type: FinstrongActionTypes.FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES_SUCCESS,
          payload: monthylHealthScoreSummaries,
        })),
        catchError(err =>
          of({
            type: FinstrongActionTypes.FETCH_MONTHLY_HEALTH_SCORE_SUMMARIES_ERROR,
            payload: err,
          }),
        ),
      )
    }),
  )

export const fetchHealthScoreChangeReports = actions$ =>
  actions$.pipe(
    ofType(FinstrongActionTypes.FETCH_HEALTH_SCORE_CHANGE_REPORTS),
    mergeMap(() => {
      /**
       * the /healthscores/change_report endpoint requires a start
       * and end date in epoch time to get a range of healthscores to
       * show a change report from
       */
      const startDate = moment()
        .subtract(2, 'months')
        .unix()
      const endDate = moment().unix()

      return defer(() => FireflyAPI.fetchHealthScoreChangeReports(startDate, endDate)).pipe(
        map(healthScoreChangeReports => ({
          type: FinstrongActionTypes.FETCH_HEALTH_SCORE_CHANGE_REPORTS_SUCCESS,
          payload: healthScoreChangeReports,
        })),
        catchError(error =>
          of({
            type: FinstrongActionTypes.FETCH_HEALTH_SCORE_CHANGE_REPORTS_ERROR,
            payload: error,
          }),
        ),
      )
    }),
  )
