import { __ } from '../utils/Intl'

import { ReadableStatuses } from './const/Statuses'

export const JOB_TYPES = {
  AGGREGATION: 0,
  VERIFICATION: 1,
  IDENTIFICATION: 2,
  HISTORY: 3,
  STATEMENT: 4,
  ORDER: 5,
  REWARD: 6,
  BALANCE: 7,
  MICRO_DEPOSIT: 8,
  TAX: 9,
  CREDIT_REPORT: 10,
}

// This matches the atlas proto for OauthState
export const OauthState = {
  AuthStatus: {
    UNKNOWN: 0,
    PENDING: 1,
    SUCCESS: 2,
    ERRORED: 3,
  },
  ReadableErrorReason: {
    0: 'UNKNOWN_ERROR',
    1: 'CANCELLED',
    2: 'DENIED',
    3: 'IMPEDED',
    4: 'PROVIDER_ERROR',
    5: 'SERVER_ERROR',
    6: 'SESSION_ERROR',
  },
}

export const JOB_STATUSES = {
  ACTIVE: 'active',
  DONE: 'done',
  PENDING: 'pending',
}

const MemberStatusMessages = {
  [ReadableStatuses.PREVENTED]: () =>
    __(
      'The last 3 attempts to connect have failed. Please re-enter your credentials to continue importing data.',
    ),

  [ReadableStatuses.DENIED]: institutionName =>
    __(
      'The credentials entered do not match those at %1. Please update them to continue.',
      institutionName,
    ),

  [ReadableStatuses.REJECTED]: () =>
    __('The answer or answers provided were incorrect. Please try again.'),

  [ReadableStatuses.LOCKED]: institutionName =>
    __(
      'Your account is locked. Please log in to the appropriate website for %1 and follow the steps to resolve the issue.',
      institutionName,
    ),

  [ReadableStatuses.IMPEDED]: institutionName =>
    __(
      'Your login info was correct, but your attention is needed at %1 before we can proceed. You need to:',
      institutionName,
    ),

  [ReadableStatuses.DEGRADED]: () =>
    __('We are upgrading this connection. Please try again later.'),

  [ReadableStatuses.DISCONNECTED]: institutionName =>
    __(
      'It looks like your data from %1 cannot be imported. We are working to resolve the issue.',
      institutionName,
    ),

  [ReadableStatuses.DISCONTINUED]: () =>
    __(
      'Connections to this institution are no longer supported. You may create a manual account and use manual transactions to track data for this account.',
    ),

  [ReadableStatuses.CLOSED]: () =>
    __(
      'This connection has been closed. You may track this account manually. If reopened, you may connect the institution again.',
    ),

  [ReadableStatuses.FAILED]: institutionName =>
    __(
      'There was a problem validating your credentials with %1. Please try again later.',
      institutionName,
    ),

  [ReadableStatuses.DISABLED]: () =>
    __(
      'Importing data from this institution has been disabled. Please contact us if you believe it has been disabled in error.',
    ),

  [ReadableStatuses.IMPORTED]: institutionName =>
    __(
      'You must re-authenticate before your data can be imported. Please enter your credentials for %1.',
      institutionName,
    ),

  [ReadableStatuses.EXPIRED]: () =>
    __('The answer or answers were not provided in time. Please try again.'),

  [ReadableStatuses.IMPAIRED]: institutionName =>
    __(
      'You must re-authenticate before your data can be imported. Please enter your credentials for %1.',
      institutionName,
    ),
}

export const getMemberStatusMessage = (status, institutionName) => {
  return MemberStatusMessages[status](institutionName)
}
