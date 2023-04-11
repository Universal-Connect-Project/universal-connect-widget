import _filter from 'lodash/filter'
import _find from 'lodash/find'
import _groupBy from 'lodash/groupBy'
import _sortBy from 'lodash/sortBy'
import _orderBy from 'lodash/orderBy'
import _map from 'lodash/map'
import _get from 'lodash/get'
import _includes from 'lodash/includes'
import moment from 'moment'

import {
  AccountSubTypeNames,
  AccountTypeNames,
  AccountTypes,
  AccountTypesDisplayOrder,
  PropertyTypeNames,
  SortTypes,
  widgetNameToExcludedPropertyMap,
} from '../constants/Account'

import { formatCurrencyFactory } from './Formatting'
import { __ } from './Intl'

export const accountFilteredFromWidget = (account, widgetName = 'accounts') => {
  /**
   * TODO: Remove 'accounts' default once we are persisting
   * widget specific account filter and caller is providing
   * widgetName argument.
   */

  return _get(account, widgetNameToExcludedPropertyMap[widgetName], false)
}

// TODO: Replace this function with a simple filter for hidden accounts once Firefly
// is updated to filter accounts for deleted members: https://gitlab.mx.com/mx/firefly/issues/1101
export const filterAccounts = (members, accounts) => {
  return _filter(accounts, account => {
    const { is_closed, is_deleted, is_hidden, is_manual, member_guid } = account

    if (is_closed || is_deleted || is_hidden) return false
    if (is_manual) return true

    return !!_find(members, { guid: member_guid })
  })
}

export const groupAccounts = (accounts, sortType = SortTypes.DEFAULT) => {
  if (sortType === SortTypes.CUSTOM) {
    return [
      {
        type: 'Custom',
        accounts: _sortBy(accounts, ['display_order']),
        typeDisplayOrder: 1,
      },
    ]
  }

  const accountsGroupedByType = _groupBy(accounts, account => {
    // Group checking and checking line of credit accounts together
    if (
      account.account_type === AccountTypes.CHECKING ||
      account.account_type === AccountTypes.CHECKING_LINE_OF_CREDIT
    ) {
      return AccountTypes.CHECKING
    }

    return account.account_type
  })

  const accountsByTypeWithOrder = _map(accountsGroupedByType, (accounts, type) => {
    return {
      accounts,
      type: Number(type),
      typeDisplayOrder: getAccountTypeDisplayOrder(accounts[0]),
    }
  })

  return _sortBy(accountsByTypeWithOrder, 'typeDisplayOrder')
}

export const formatBalanceFactory = intl => account =>
  formatCurrencyFactory(intl)(account.currency_code)(account.balance)

export const getLogoUrl = (account = {}) => {
  console.log(account)
  if (account.is_manual) {
    return 'https://content.moneydesktop.com/storage/MD_Assets/serenity/manual_account.png'
  } else if (account.institution_guid) {
    return (
      'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/' +
      account.institution_guid +
      '_100x100.png'
    )
  } else {
    return getDefaultLogoUrl()
  }
}

export const getDefaultLogoUrl = () => {
  return 'https://content.moneydesktop.com/storage/MD_Assets/serenity/default_institution_logo.png'
}

export const getDisplayName = account => {
  let accountName = account.user_name || account.name

  if (account.is_closed) {
    accountName += ` (${__('Marked As Closed')})`
  } else if (account.is_hidden) {
    accountName += ` (${__('Hidden')})`
  }

  return accountName
}

export const getLastAggregatedTime = member => {
  const now = new Date().getTime()
  const nowMom = moment(now)
  const timestamp = member.last_update_time
  const lastMom = moment(timestamp)

  if (!timestamp || nowMom.format('YYYY-MM-DD') === lastMom.format('YYYY-MM-DD')) {
    return 'Today'
  } else {
    return lastMom.fromNow()
  }
}

export const getAccountTypeName = account => {
  return AccountTypeNames[account.account_type]
}

export const getAccountTypeDisplayOrder = account => {
  // There is a mismatch with "other" and "unknown"
  // This check corrects it for the display order
  const accountTypeKey =
    AccountTypeNames[account.account_type] === 'Other'
      ? 'Unknown'
      : AccountTypeNames[account.account_type]

  return accountTypeKey
    ? AccountTypesDisplayOrder[accountTypeKey.replace(/\s+/g, '_').toUpperCase()]
    : AccountTypeNames.length
}

export const getPropertyTypeName = account => {
  return PropertyTypeNames[account.property_type]
}

export const isAccountLiability = account => {
  return (
    (account && account.account_type === AccountTypes.CREDIT_CARD) ||
    (account && account.account_type === AccountTypes.LOAN) ||
    (account && account.account_type === AccountTypes.MORTGAGE) ||
    (account && account.account_type === AccountTypes.LINE_OF_CREDIT) ||
    (account && account.account_type === AccountTypes.CHECKING_LINE_OF_CREDIT)
  )
}

export const isInvestment = account => {
  return account && account.account_type === AccountTypes.INVESTMENT
}

export const isManual = account => {
  return account.is_manual || !account.guid
}

export const isVisible = account => {
  return account && !account.is_deleted && !account.is_hidden && !account.is_closed
}

export const isAccountManagedByUser = account =>
  isManual(account) || account.member_is_managed_by_user

export const getVisibleAccounts = accounts => {
  return accounts.filter(isVisible)
}

export const usesInterestRateField = account => {
  return (
    account.account_type === AccountTypes.SAVINGS ||
    account.account_type === AccountTypes.CHECKING ||
    account.account_type === AccountTypes.LINE_OF_CREDIT ||
    account.account_type === AccountTypes.CREDIT_CARD ||
    account.account_type === AccountTypes.LOAN ||
    account.account_type === AccountTypes.MORTGAGE
  )
}

export const usesCreditLimitField = account => {
  return (
    account.account_type === AccountTypes.LINE_OF_CREDIT ||
    account.account_type === AccountTypes.CREDIT_CARD ||
    account.account_type === AccountTypes.CHECKING_LINE_OF_CREDIT
  )
}

export const usesOriginalBalanceField = account => {
  return (
    account.account_type === AccountTypes.LOAN || account.account_type === AccountTypes.MORTGAGE
  )
}

export const hasInterestRate = account => {
  return !!account.interest_rate_set_by || getInterestRate(account) > 0
}

export const getInterestRate = account => {
  return account[getInterestAttribute(account)]
}

// Asset Accounts use APY
// Debt/Liability Accounts use APR || Interest Rate
export const getInterestAttribute = account => {
  if (account.is_manual) {
    return 'interest_rate'
  }
  if (account.apr || account.apr === 0) return 'apr'
  if (account.apy || account.apy === 0) return 'apy'
  return 'interest_rate'
}

export const getInterestLabel = account => {
  const labelMap = {
    apr: 'APR',
    apy: 'APY',
    interest_rate: 'Interest Rate',
  }

  return labelMap[getInterestAttribute(account)]
}

export const getNextPaymentDate = account => {
  const day = new Date()

  day.setDate(account.day_payment_is_due || 1)
  if (day < new Date()) {
    return moment(day)
      .add(1, 'M')
      .toDate()
  } else {
    return day
  }
}

export const getPropertyType = account => {
  if (account.account_type === AccountTypes.PROPERTY) {
    return PropertyTypeNames[account.property_type] || ''
  }
  return ''
}

export const getSelectOptions = (types, names, icons, displayFormatter) => {
  return _map(types, type => getSelectedOption(type, names, icons, displayFormatter))
}

export const getSelectedOption = (type, names, icons, displayFormatter) => {
  const value = type
  const name = names[type]
  const displayValue = displayFormatter(name)
  const icon = icons[type]

  return { displayValue, icon, value }
}

export const getPostMessageObject = account => {
  return {
    guid: account.guid,
    id: account.external_guid,
    member_guid: account.member_guid,
    balance: account.balance,
    name: account.user_name || account.name,
    is_manual: !!account.is_manual,
    property_type: getPropertyType(account),
    account_type: AccountTypeNames[account.account_type],
    account_subtype: AccountSubTypeNames[account.account_subtype] || 'NONE',
    is_closed: account.is_closed,
    is_hidden: account.is_hidden,
    type: 'account',
    metadata: account.metadata,
  }
}

export const buildAccountFilterOptions = accounts => {
  return accounts.reduce((acc, account) => {
    const accountTypeName = AccountTypeNames[account.account_type]
    const newItem = {
      accountNumber: account.account_number,
      label: `${account.user_name || account.name}${account.is_closed ? ` (${__('Closed')})` : ''}`,
      memberName: account.memberName,
      value: account.guid,
    }

    if (acc.hasOwnProperty(accountTypeName)) {
      acc[accountTypeName] = acc[accountTypeName].concat(newItem)
    } else {
      acc[accountTypeName] = [newItem]
    }
    return acc
  }, {})
}

export const sortAccountsByBalanceDescending = accounts => {
  return _orderBy(accounts, 'balance', 'desc')
}

export const getSortedAccountsWithMembers = (accounts, members) => {
  const hasMember = members => account =>
    _includes(
      members.map(m => m.guid),
      account.member_guid,
    )

  return _sortBy(accounts, 'user_name')
    .filter(hasMember(members))
    .map(account => {
      const member = _find(members, member => member.guid === account.member_guid) || {}

      return { ...account, memberName: member.name }
    })
}
