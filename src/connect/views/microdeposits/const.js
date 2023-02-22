import { __ } from '../../../utils/Intl'

export const MicrodepositsStatuses = {
  INITIATED: 0, // Job started
  REQUESTED: 1, // Micro deposits requested from provider
  DEPOSITED: 2, // Micro deposits deposited in account; ready for verification
  VERIFIED: 3, // Micro deposits verified by user
  ERRORED: 4, // Unable to create micro deposits.  Typically an ACH error on the provider side (MicrodepositErrors.js)
  DENIED: 5, // User entered incorrect amounts (VerifyDeposits.js)
  PREVENTED: 6, // Too many invalid verification attempts (MicrodepositErrors.js)
  CONFLICTED: 7, // There is an existing micro deposit request (Auto load to step based off existing MD status)
  REJECTED: 8, // Rejected either because validation failed on our side, or the provider didn't like something (MicrodepositErrors.js)
  PREINITIATED: 9, // Pre-initiated micro deposit with user info(first name, last name, and email) from client.
}

export const ReadableStatuses = {
  0: 'INITIATED',
  1: 'REQUESTED',
  2: 'DEPOSITED',
  3: 'VERIFIED',
  4: 'ERRORED',
  5: 'DENIED',
  6: 'PREVENTED',
  7: 'CONFLICTED',
  8: 'REJECTED',
  9: 'PREINITIATED',
}

export const ErrorStatuses = [4, 5, 6, 7, 8]

export const AccountFields = {
  ACCOUNT_TYPE: 'accountType',
  ROUTING_NUMBER: 'routingNumber',
  ACCOUNT_NUMBER: 'accountNumber',
  ACCOUNT_NAME: 'accountName',
  USER_NAME: 'userName',
  EMAIL: 'email',
}

export const BLOCKED_REASONS = {
  INVALID: 0,
  BLOCKED: 1,
  CLIENT_BLOCKED: 2,
  IAV_PREFERRED: 3,
}

/**
 * Account Type Constants
 */
export const AccountTypeLabels = {
  1: __('Checking'),
  2: __('Savings'),
}
export const ReadableAccountTypes = {
  CHECKING: 1,
  SAVINGS: 2,
}
