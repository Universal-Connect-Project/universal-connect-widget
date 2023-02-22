import _sortBy from 'lodash/sortBy'
import { createSelector } from 'reselect'
import { getDisplayName, getInterestRate, isInvestment, isVisible } from '../../utils/Account'
import { updateObject } from '../../utils/Reducer'
import { AccountTypes } from '../../constants/Account'

import { isAccountLiability } from '../../utils/Account'

import { AccountIcons } from '../../constants/Account'

export const getAccounts = state => state.accounts.items

export const getAccount = state => state.accounts.details

export const getAccountFilterSelected = state => state.accounts.filter.selected
export const getAppliedAccountFilterGuids = state => state.accounts.filter.applied
export const getAccountFilterOptions = state => state.accounts.filter.options

export const getAccountFilterAppliedGuids = createSelector(
  getAppliedAccountFilterGuids,
  getAccountFilterOptions,
  (applied, options) => {
    return applied.filter(guid => {
      return options.includes(guid)
    })
  },
)

export const getDetailedAccounts = createSelector(getAccounts, accounts =>
  accounts.map(account =>
    updateObject(account, {
      displayName: getDisplayName(account),
      icon: AccountIcons[account.account_type],
      interestRate: getInterestRate(account),
    }),
  ),
)

export const getVisibleAccounts = createSelector(getDetailedAccounts, accounts =>
  accounts.filter(isVisible),
)

export const getInvestmentAccounts = createSelector(getVisibleAccounts, accounts =>
  accounts.filter(isInvestment),
)

export const getVisibleNotExcludedAccounts = createSelector(getVisibleAccounts, accounts =>
  accounts.filter(account => !account.is_excluded_from_debts),
)

export const getAccountsNotHiddenOrClosed = createSelector(getDetailedAccounts, accounts =>
  accounts.filter(account => !account.is_closed && !account.is_hidden),
)

export const getAccountsNotHiddenOrDeleted = createSelector(getDetailedAccounts, accounts =>
  accounts.filter(account => !account.is_deleted && !account.is_hidden),
)

export const getAccountsNotHiddenOrDeletedOrClosed = createSelector(getDetailedAccounts, accounts =>
  accounts.filter(account => !account.is_deleted && !account.is_hidden && !account.is_closed),
)

export const getAllDebtAccounts = createSelector(getVisibleAccounts, accounts =>
  accounts.filter(isAccountLiability),
)

export const getFilteredAccountsForGoals = createSelector(
  getVisibleNotExcludedAccounts,
  getAppliedAccountFilterGuids,
  (accounts, appliedGuids) => accounts.filter(account => appliedGuids.includes(account.guid)),
)

export const getAllDebtAccountsForGoals = createSelector(getFilteredAccountsForGoals, accounts =>
  accounts.filter(isAccountLiability),
)

export const getAccountsForCashflow = createSelector(getAccountsNotHiddenOrDeleted, visable =>
  visable.filter(account => {
    return (
      account.account_type === AccountTypes.CASH ||
      account.account_type === AccountTypes.CHECKING ||
      account.account_type === AccountTypes.PREPAID ||
      account.account_type === AccountTypes.SAVINGS ||
      account.account_type === AccountTypes.CHECKING_LINE_OF_CREDIT
    )
  }),
)

export const getAccountsForFinstrong = createSelector(
  getAccountsNotHiddenOrDeletedOrClosed,
  visable =>
    visable.filter(account => {
      return (
        account.account_type === AccountTypes.CHECKING ||
        account.account_type === AccountTypes.SAVINGS ||
        account.account_type === AccountTypes.CREDIT_CARD ||
        account.account_type === AccountTypes.INVESTMENT
      )
    }),
)

export const getAccountsFilteredByAccountFilter = createSelector(
  getAppliedAccountFilterGuids,
  getAccounts,
  getAccountFilterOptions,
  (appliedGuids, accounts, options) => {
    const filterGuids = appliedGuids.filter(guid => options.includes(guid))

    return accounts.filter(account => filterGuids.includes(account.guid))
  },
)
export const getAvailableAccountsFromAccountFilter = createSelector(
  getAccountFilterOptions,
  getAccountsNotHiddenOrDeleted,
  (options, accounts) =>
    _sortBy(
      accounts.filter(account => options.includes(account.guid)),
      'user_name',
    ),
)
