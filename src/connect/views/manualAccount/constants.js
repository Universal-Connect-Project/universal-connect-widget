import { __ } from '../../../utils/Intl'

// Parallel structures are used for fast and easy lookups for AccountTypes
// If the backend changes these types, its important to keep AccountTypeNames below in sync
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

// If the backend changes these types, its important to keep AccountTypes above in sync
export const AccountTypeNames = [
  __('Other'),
  __('Checking'),
  __('Savings'),
  __('Loan'),
  __('Credit Card'),
  __('Investment'),
  __('Line of Credit'),
  __('Mortgage'),
  __('Property'),
  __('Cash'),
  __('Insurance'),
  __('Prepaid'),
  __('Checking'), // Checking line of credit will be referred to as a checking account
]

export const PropertyTypeNames = [
  __('Real Estate'),
  __('Vehicle'),
  __('Art'),
  __('Jewelry'),
  __('Furniture'),
  __('Appliances'),
  __('Computer'),
  __('Electronics'),
  __('Sports Equipment'),
  __('Miscellaneous'),
]
