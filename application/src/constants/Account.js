import { PropTypes } from 'prop-types'
import _values from 'lodash/values'
import { convertToMessages } from '../utils/Localization'

export const AccountTypes = {
  UNKNOWN: 0,
  CHECKING: 1,
  SAVINGS: 2,
  LOAN: 3,
  CREDIT_CARD: 4,
  INVESTMENT: 5,
  LINE_OF_CREDIT: 6,
  MORTGAGE: 7,
  PROPERTY: 8,
  CASH: 9,
  INSURANCE: 10,
  PREPAID: 11,
  CHECKING_LINE_OF_CREDIT: 12,
}

export const SortTypes = {
  CUSTOM: 'CUSTOM',
  DEFAULT: 'DEFAULT',
}

export const AccountTypesDisplayOrder = {
  CHECKING: 1,
  SAVINGS: 2,
  PREPAID: 3,
  CASH: 4,
  INVESTMENT: 5,
  PROPERTY: 6,
  CREDIT_CARD: 7,
  MORTGAGE: 8,
  LOAN: 9,
  LINE_OF_CREDIT: 10,
  INSURANCE: 11,
  UNKNOWN: 12,
  CHECKING_LINE_OF_CREDIT: 1, // Checking line of credit will be displayed in the same order as checking
}

export const AccountTypeNames = [
  'Other',
  'Checking',
  'Savings',
  'Loan',
  'Credit Card',
  'Investment',
  'Line of Credit',
  'Mortgage',
  'Property',
  'Cash',
  'Insurance',
  'Prepaid',
  'Checking', // Checking line of credit will be referred to as a checking account
]

export const AccountTypeMessages = convertToMessages({
  [AccountTypeNames[AccountTypes.UNKNOWN]]: AccountTypeNames[AccountTypes.UNKNOWN],
  [AccountTypeNames[AccountTypes.CHECKING]]: AccountTypeNames[AccountTypes.CHECKING], // Will also be used for checking line of credit
  [AccountTypeNames[AccountTypes.SAVINGS]]: AccountTypeNames[AccountTypes.SAVINGS],
  [AccountTypeNames[AccountTypes.LOAN]]: AccountTypeNames[AccountTypes.LOAN],
  [AccountTypeNames[AccountTypes.CREDIT_CARD]]: AccountTypeNames[AccountTypes.CREDIT_CARD],
  [AccountTypeNames[AccountTypes.INVESTMENT]]: AccountTypeNames[AccountTypes.INVESTMENT],
  [AccountTypeNames[AccountTypes.LINE_OF_CREDIT]]: AccountTypeNames[AccountTypes.LINE_OF_CREDIT],
  [AccountTypeNames[AccountTypes.MORTGAGE]]: AccountTypeNames[AccountTypes.MORTGAGE],
  [AccountTypeNames[AccountTypes.PROPERTY]]: AccountTypeNames[AccountTypes.PROPERTY],
  [AccountTypeNames[AccountTypes.CASH]]: AccountTypeNames[AccountTypes.CASH],
  [AccountTypeNames[AccountTypes.INSURANCE]]: AccountTypeNames[AccountTypes.INSURANCE],
  [AccountTypeNames[AccountTypes.PREPAID]]: AccountTypeNames[AccountTypes.PREPAID],
})

export const AccountSubTypeNames = {
  0: 'NONE',
  1: 'MONEY_MARKET',
  2: 'CERTIFICATE_OF_DEPOSIT',
  3: 'AUTO',
  4: 'STUDENT',
  5: 'SMALL_BUSINESS',
  6: 'PERSONAL',
  7: 'PERSONAL_WITH_COLLATERAL',
  8: 'HOME_EQUITY',
  9: 'PLAN_401_K',
  10: 'PLAN_403_B',
  11: 'PLAN_529',
  12: 'IRA',
  13: 'ROLLOVER_IRA',
  14: 'ROTH_IRA',
  15: 'TAXABLE',
  16: 'NON_TAXABLE',
  17: 'BROKERAGE',
  18: 'TRUST',
  19: 'UNIFORM_GIFTS_TO_MINORS_ACT',
  20: 'PLAN_457',
  21: 'PENSION',
  22: 'EMPLOYEE_STOCK_OWNERSHIP_PLAN',
  23: 'SIMPLIFIED_EMPLOYEE_PENSION',
  24: 'SIMPLE_IRA',
  25: 'BOAT',
  26: 'POWERSPORTS',
  27: 'RV',
  28: 'HELOC',
}

export const PropertyTypes = {
  REAL_ESTATE: 0,
  VEHICLE: 1,
  ART: 2,
  JEWELRY: 3,
  FURNITURE: 4,
  APPLIANCES: 5,
  COMPUTER: 6,
  ELECTRONICS: 7,
  SPORTS_EQUIPMENT: 8,
  MISCELLANEOUS: 9,
}

export const PropertyTypeNames = [
  'Real Estate',
  'Vehicle',
  'Art',
  'Jewelry',
  'Furniture',
  'Appliances',
  'Computer',
  'Electronics',
  'Sports Equipment',
  'Miscellaneous',
]

export const PropertyTypeMessages = convertToMessages({
  [PropertyTypeNames[PropertyTypes.REAL_ESTATE]]: PropertyTypeNames[PropertyTypes.REAL_ESTATE],
  [PropertyTypeNames[PropertyTypes.VEHICLE]]: PropertyTypeNames[PropertyTypes.VEHICLE],
  [PropertyTypeNames[PropertyTypes.ART]]: PropertyTypeNames[PropertyTypes.ART],
  [PropertyTypeNames[PropertyTypes.JEWELRY]]: PropertyTypeNames[PropertyTypes.JEWELRY],
  [PropertyTypeNames[PropertyTypes.FURNITURE]]: PropertyTypeNames[PropertyTypes.FURNITURE],
  [PropertyTypeNames[PropertyTypes.APPLIANCES]]: PropertyTypeNames[PropertyTypes.APPLIANCES],
  [PropertyTypeNames[PropertyTypes.COMPUTER]]: PropertyTypeNames[PropertyTypes.COMPUTER],
  [PropertyTypeNames[PropertyTypes.ELECTRONICS]]: PropertyTypeNames[PropertyTypes.ELECTRONICS],
  [PropertyTypeNames[PropertyTypes.SPORTS_EQUIPMENT]]:
    PropertyTypeNames[PropertyTypes.SPORTS_EQUIPMENT],
  [PropertyTypeNames[PropertyTypes.MISCELLANEOUS]]: PropertyTypeNames[PropertyTypes.MISCELLANEOUS],
})

export const AccountZeroStateDisplayNames = convertToMessages({
  ADD: 'Add',
  CHECKING: 'a Checking Account',
  SAVINGS: 'a Savings',
  PREPAID: 'a Prepaid Account',
  CASH: 'a Cash Account',
  INVESTMENT: 'an Investment Account',
  PROPERTY: 'a Property',
  CREDIT_CARD: 'a Credit Card',
  MORTGAGE: 'a Mortgage',
  LOAN: 'a Loan',
  LINE_OF_CREDIT: 'a Line of Credit',
  INSURANCE: 'an Insurance Account',
  CHECKING_LINE_OF_CREDIT: 'a Checking Account',
})

export const AccountsMessages = convertToMessages({
  ZERO_STATE_ACCOUNTS_MESSAGE: 'Connect all your accounts to see your finances in one place.',
  ZERO_STATE_ACCOUNTS_TITLE: 'Simplify your life.',
  ZERO_STATE_ACCOUNTS_BUTTON: 'Add Account',
})

export const AccountIcons = {
  [AccountTypes.UNKNOWN]: 'accounts',
  [AccountTypes.CHECKING]: 'checking',
  [AccountTypes.SAVINGS]: 'savings',
  [AccountTypes.LOAN]: 'loans',
  [AccountTypes.CREDIT_CARD]: 'credit-card',
  [AccountTypes.INVESTMENT]: 'investment',
  [AccountTypes.LINE_OF_CREDIT]: 'line-of-credit',
  [AccountTypes.MORTGAGE]: 'home',
  [AccountTypes.PROPERTY]: 'key',
  [AccountTypes.CASH]: 'cash',
  [AccountTypes.INSURANCE]: 'health',
  [AccountTypes.PREPAID]: 'credit-card',
  [AccountTypes.CHECKING_LINE_OF_CREDIT]: 'checking', // Checking line of credit has the same icon as checking
}

export const PropertyIcons = {
  [PropertyTypes.REAL_ESTATE]: 'real-estate',
  [PropertyTypes.VEHICLE]: 'auto',
  [PropertyTypes.ART]: 'art',
  [PropertyTypes.JEWELRY]: 'jewlery',
  [PropertyTypes.FURNITURE]: 'furniture',
  [PropertyTypes.APPLIANCES]: 'appliances',
  [PropertyTypes.COMPUTER]: 'desktop',
  [PropertyTypes.ELECTRONICS]: 'camera',
  [PropertyTypes.SPORTS_EQUIPMENT]: 'sports',
  [PropertyTypes.MISCELLANEOUS]: 'cash',
}

export const AssetTypes = {
  ASSET: 0,
  LIABILITY: 1,
}

// not used as user facing text
export const AssetTypeNames = ['asset', 'liability']

export const AccountAssetTypes = {
  [AccountTypes.UNKNOWN]: AssetTypes.ASSET,
  [AccountTypes.CHECKING]: AssetTypes.ASSET,
  [AccountTypes.SAVINGS]: AssetTypes.ASSET,
  [AccountTypes.LOAN]: AssetTypes.LIABILITY,
  [AccountTypes.CREDIT_CARD]: AssetTypes.LIABILITY,
  [AccountTypes.INVESTMENT]: AssetTypes.ASSET,
  [AccountTypes.LINE_OF_CREDIT]: AssetTypes.LIABILITY,
  [AccountTypes.MORTGAGE]: AssetTypes.LIABILITY,
  [AccountTypes.PROPERTY]: AssetTypes.ASSET,
  [AccountTypes.CASH]: AssetTypes.ASSET,
  [AccountTypes.INSURANCE]: AssetTypes.ASSET,
  [AccountTypes.PREPAID]: AssetTypes.ASSET,
  [AccountTypes.CHECKING_LINE_OF_CREDIT]: AssetTypes.LIABILITY,
}

export const AccountShape = PropTypes.shape({
  account_type: PropTypes.oneOf(_values(AccountTypes)),
  apr: PropTypes.number,
  apy: PropTypes.number,
  balance: PropTypes.number,
  cash_balance: PropTypes.number,
  credit_limit: PropTypes.number,
  guid: PropTypes.string,
  institution_guid: PropTypes.string,
  interest_rate: PropTypes.number,
  is_closed: PropTypes.bool,
  is_deleted: PropTypes.bool,
  is_excluded_from_debts: PropTypes.bool,
  is_hidden: PropTypes.bool,
  is_manual: PropTypes.bool,
  is_personal: PropTypes.bool,
  member_guid: PropTypes.string,
  member_name: PropTypes.string,
  name: PropTypes.string,
  original_balance: PropTypes.number,
  user_guid: PropTypes.string,
  user_name: PropTypes.string,
})

export const InterestRateSetBy = {
  NOT_SET: 0,
  FEED: 1,
  USER: 2,
  SYSTEM: 3,
}

export const DetailLabels = {
  INTEREST_RATE: 'Interest Rate',
  MINIMUM_PAYMENT: 'Minimum Payment',
  PAYMENT_DUE: 'Payment Due',
}

export const DefaultModel = {
  account_type: null,
  apy: null,
  balance: null,
  credit_limit: null,
  day_payment_is_due: null,
  is_excluded_from_debts: false,
  is_hidden: false,
  is_personal: true,
  minimum_payment: null,
  original_balance: null,
  user_name: null,
}

export const widgetNameToExcludedPropertyMap = {
  accounts: 'is_excluded_from_accounts',
  transactions: 'is_excluded_from_transactions',
  spending: 'is_excluded_from_spending',
  budgets: 'is_excluded_from_budgets',
  trends: 'is_excluded_from_trends',
  debts: 'is_excluded_from_debts',
  net_worth: 'is_excluded_from_net_worth',
  investments: 'is_excluded_from_investments',
  cash_flow: 'is_excluded_from_cash_flow',
  goals: 'is_excluded_from_goals',
}
