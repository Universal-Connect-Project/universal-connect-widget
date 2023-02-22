import { convertToMessages } from '../utils/Localization'

export const MemberMessages = convertToMessages({
  ACCOUNTS_CONNECTED: `{count} {count, plural,
    one {Account}
    other {Accounts}
  } Connected`,
  CONNECTING: 'Connecting',
  SEVERAL_MINUTES: 'This may take several minutes',
  ERROR: 'Error',
  DEFAULT_CLIENT_MESSAGE:
    "We're temporarily unable to present up to date information for this account. This should be resolved soon.",
  NEW_CREDENTIALS_NEEDED: 'New Credentials Needed',
  CHALLENGED_TITLE: 'Additional Information Required',
  REJECTED_TITLE: 'Incorrect Information',
  LOCKED_TITLE: 'Account is Locked',
  IMPEDED_TITLE: 'Action Needed',
  CONNECTION_MAINTENANCE: 'Connection Maintenance',
  DISCONTINUED_TITLE: 'Connection Discontinued',
  EXPIRED_TITLE: 'Credentials Expired',
  CLOSED_TITLE: 'Closed Account',
  DELAYED_TITLE: 'Connection Delayed',
  FAILED_TITLE: 'Connection Failed',
  DISABLED_TITLE: 'Connection Disabled',
  DENIED_MESSAGE:
    'The credentials entered do not match those at {accountName}. Please update them to continue.',
  CHALLENGED_MESSAGE:
    'To authenticate your connection to {accountName}, please answer the following challenge(s).',
  REJECTED_MESSAGE: 'The answer or answers provided were incorrect. Please try again.',
  LOCKED_MESSAGE:
    'Your account is locked. Please log in to the appropriate website for {accountName} and follow the steps to resolve the issue.',
  IMPEDED_MESSAGE:
    "Your attention is needed at this institution's website. Please log in to the appropriate website for {accountName} and follow the steps to resolve the issue.",
  DEGRADED_MESSAGE: 'We are upgrading this connection. Please try again later.',
  DISCONNECTED_MESSAGE:
    'It looks like your data from {accountName} cannot be imported.  We are working to resolve the issue.',
  DISCONTINUED_MESSAGE:
    'Connections to this institution are no longer supported.  You may create a manual account and use manual transactions to track data for this account.',
  CLOSED_MESSAGE:
    'This connection has been closed. You may track this account manually. If reopened, you may connect the institution again.',
  DELAYED_MESSAGE:
    'Importing your data from {accountName} may take a while. Please check back later.',
  FAILED_MESSAGE:
    'There was a problem validating your credentials with {accountName}. Please try again later.',
  DISABLED_MESSAGE:
    'Importing data from this institution has been disabled. Please contact us if you believe it has been disabled in error.',
  PREVENTED_MESSAGE:
    'The last 3 attempts to connect have failed.  Please re-enter your credentials to continue importing data.',
  IMPORTED_MESSAGE:
    'You must re-authenticate before your data can be imported. Please enter your credentials for {accountName}.',
  EXPIRED_MESSAGE: 'The answer or answers were not provided in time. Please try again.',
  IMPAIRED_MESSAGE:
    'You must re-authenticate before your data can be imported. Please enter your credentials for {accountName}.',
  UPDATED_MESSAGE: 'Connecting to {accountName}...',
  CREATED_MESSAGE: 'Connecting to {accountName}...',
  RESUMED_MESSAGE: 'Connecting to {accountName}...',
  CONNECTED_MESSAGE: 'Connected to {accountName}',
  RECONNECTED_MESSAGE: 'Reconnecting to {accountName}...',
})

const DefaultEmptyStatus = {
  icon: '',
  colorName: '',
  titleMessage: null,
  clientAction: '',
  clientMessage: null,
  userAction: '',
  userMessage: null,
}

const CREATED = {
  ...DefaultEmptyStatus,
  id: 0,
  key: 'CREATED',
  userMessage: MemberMessages.CREATED_MESSAGE,
}

const PREVENTED = {
  id: 1,
  icon: 'attention',
  colorName: 'WARNING',
  titleMessage: MemberMessages.NEW_CREDENTIALS_NEEDED,
  clientAction: '',
  clientMessage: MemberMessages.DEFAULT_CLIENT_MESSAGE,
  key: 'PREVENTED',
  userAction: 'update_credentials',
  userMessage: MemberMessages.PREVENTED_MESSAGE,
}

const DENIED = {
  id: 2,
  icon: 'attention',
  colorName: 'WARNING',
  titleMessage: MemberMessages.NEW_CREDENTIALS_NEEDED,
  clientAction: '',
  clientMessage: MemberMessages.DEFAULT_CLIENT_MESSAGE,
  key: 'DENIED',
  userAction: 'update_credentials',
  userMessage: MemberMessages.DENIED_MESSAGE,
}

const CHALLENGED = {
  id: 3,
  icon: 'attention',
  colorName: 'WARNING',
  titleMessage: MemberMessages.CHALLENGED_TITLE,
  clientAction: '',
  clientMessage: MemberMessages.DEFAULT_CLIENT_MESSAGE,
  key: 'CHALLENGED',
  userAction: 'resolve',
  userMessage: MemberMessages.CHALLENGED_MESSAGE,
}

const REJECTED = {
  id: 4,
  icon: 'attention',
  colorName: 'DANGER',
  titleMessage: MemberMessages.REJECTED_TITLE,
  clientAction: '',
  clientMessage: MemberMessages.DEFAULT_CLIENT_MESSAGE,
  key: 'REJECTED',
  userAction: 'resolve',
  userMessage: MemberMessages.REJECTED_MESSAGE,
}

const LOCKED = {
  id: 5,
  icon: 'lock',
  colorName: 'DANGER',
  titleMessage: MemberMessages.LOCKED_TITLE,
  clientAction: 'visit_website',
  clientMessage: MemberMessages.LOCKED_MESSAGE,
  key: 'LOCKED',
  userAction: 'visit_website',
  userMessage: MemberMessages.LOCKED_MESSAGE,
}

const CONNECTED = {
  ...DefaultEmptyStatus,
  id: 6,
  key: 'CONNECTED',
  userMessage: MemberMessages.CONNECTED_MESSAGE,
}

const IMPEDED = {
  id: 7,
  icon: 'attention',
  colorName: 'PRIMARY',
  titleMessage: MemberMessages.IMPEDED_TITLE,
  clientAction: 'visit_website',
  clientMessage: MemberMessages.IMPEDED_MESSAGE,
  key: 'IMPEDED',
  userAction: 'visit_website',
  userMessage: MemberMessages.IMPEDED_MESSAGE,
}

const RECONNECTED = {
  ...DefaultEmptyStatus,
  id: 8,
  key: 'RECONNECTED',
}

const DEGRADED = {
  id: 9,
  icon: 'attention',
  colorName: 'PRIMARY',
  titleMessage: MemberMessages.CONNECTION_MAINTENANCE,
  clientAction: '',
  clientMessage: MemberMessages.DEFAULT_CLIENT_MESSAGE,
  key: 'DEGRADED',
  userAction: '',
  userMessage: MemberMessages.DEGRADED_MESSAGE,
}

const DISCONNECTED = {
  id: 10,
  icon: 'sync',
  colorName: 'PRIMARY',
  titleMessage: MemberMessages.CONNECTION_MAINTENANCE,
  clientAction: '',
  clientMessage: MemberMessages.DEFAULT_CLIENT_MESSAGE,
  key: 'DISCONNECTED',
  userAction: '',
  userMessage: MemberMessages.DISCONNECTED_MESSAGE,
}

const DISCONTINUED = {
  id: 11,
  icon: 'subtract',
  colorName: 'PRIMARY',
  titleMessage: MemberMessages.DISCONTINUED_TITLE,
  clientAction: '',
  clientMessage: MemberMessages.DISCONTINUED_MESSAGE,
  key: 'DISCONTINUED',
  userAction: '',
  userMessage: MemberMessages.DISCONTINUED_MESSAGE,
}

const CLOSED = {
  id: 12,
  icon: 'no',
  colorName: 'PRIMARY',
  titleMessage: MemberMessages.CLOSED_TITLE,
  clientAction: '',
  clientMessage: MemberMessages.CLOSED_MESSAGE,
  key: 'CLOSED',
  userAction: '',
  userMessage: MemberMessages.CLOSED_MESSAGE,
}

const DELAYED = {
  id: 13,
  icon: 'spinner',
  colorName: 'WARNING',
  titleMessage: MemberMessages.DELAYED_TITLE,
  clientAction: '',
  clientMessage: MemberMessages.DEFAULT_CLIENT_MESSAGE,
  key: 'DELAYED',
  userAction: '',
  userMessage: MemberMessages.DELAYED_MESSAGE,
}

const FAILED = {
  id: 14,
  icon: 'attention',
  colorName: 'DANGER',
  titleMessage: MemberMessages.FAILED_TITLE,
  clientAction: '',
  clientMessage: MemberMessages.DEFAULT_CLIENT_MESSAGE,
  key: 'FAILED',
  userAction: '',
  userMessage: MemberMessages.FAILED_MESSAGE,
}

const UPDATED = {
  ...DefaultEmptyStatus,
  id: 15,
  key: 'UPDATED',
  userMessage: MemberMessages.UPDATED_MESSAGE,
}

const DISABLED = {
  id: 16,
  icon: 'pause',
  colorName: 'PRIMARY',
  titleMessage: MemberMessages.DISABLED_TITLE,
  clientAction: '',
  clientMessage: MemberMessages.DISABLED_MESSAGE,
  key: 'DISABLED',
  userAction: 'contact_us',
  userMessage: MemberMessages.DISABLED_MESSAGE,
}

const IMPORTED = {
  id: 17,
  icon: 'attention',
  colorName: 'WARNING',
  titleMessage: MemberMessages.NEW_CREDENTIALS_NEEDED,
  clientAction: '',
  clientMessage: MemberMessages.IMPORTED_MESSAGE,
  key: 'IMPORTED',
  userAction: 'update_credentials',
  userMessage: MemberMessages.IMPORTED_MESSAGE,
}

const RESUMED = {
  ...DefaultEmptyStatus,
  id: 18,
  key: 'RESUMED',
  userMessage: MemberMessages.RESUMED_MESSAGE,
}

const EXPIRED = {
  id: 19,
  icon: 'attention',
  colorName: 'WARNING',
  titleMessage: MemberMessages.EXPIRED_TITLE,
  clientAction: '',
  clientMessage: MemberMessages.DEFAULT_CLIENT_MESSAGE,
  key: 'EXPIRED',
  userAction: 'resolve',
  userMessage: MemberMessages.EXPIRED_MESSAGE,
}

const IMPAIRED = {
  id: 20,
  icon: 'attention',
  colorName: 'WARNING',
  titleMessage: MemberMessages.NEW_CREDENTIALS_NEEDED,
  clientAction: '',
  clientMessage: MemberMessages.IMPAIRED_MESSAGE,
  key: 'IMPAIRED',
  userAction: 'update_credentials',
  userMessage: MemberMessages.IMPAIRED_MESSAGE,
}

const PENDING = {
  id: 21,
  // PENDING status should not be mentioned or show to the end user so
  // no messaging is required.
}

export const ConnectionStatusMap = {
  0: CREATED,
  1: PREVENTED,
  2: DENIED,
  3: CHALLENGED,
  4: REJECTED,
  5: LOCKED,
  6: CONNECTED,
  7: IMPEDED,
  8: RECONNECTED,
  9: DEGRADED,
  10: DISCONNECTED,
  11: DISCONTINUED,
  12: CLOSED,
  13: DELAYED,
  14: FAILED,
  15: UPDATED,
  16: DISABLED,
  17: IMPORTED,
  18: RESUMED,
  19: EXPIRED,
  20: IMPAIRED,
  21: PENDING,
}

export const ReadableStatuses = {
  CREATED: 0,
  PREVENTED: 1,
  DENIED: 2,
  CHALLENGED: 3,
  REJECTED: 4,
  LOCKED: 5,
  CONNECTED: 6,
  IMPEDED: 7,
  RECONNECTED: 8,
  DEGRADED: 9,
  DISCONNECTED: 10,
  DISCONTINUED: 11,
  CLOSED: 12,
  DELAYED: 13,
  FAILED: 14,
  UPDATED: 15,
  DISABLED: 16,
  IMPORTED: 17,
  RESUMED: 18,
  EXPIRED: 19,
  IMPAIRED: 20,
  PENDING: 21,
}

export const StatusesRequiringMessages = [1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 16, 17, 19, 20]
export const ProcessingStatuses = [0, 15, 18] // null statuses keep coming back when it's starting and I've brought it up many times.
export const MFAStatuses = [3, 4]
export const ErrorStatuses = [1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 16, 17, 19, 20]
export const DeniedStatuses = [2]
export const ConnectedStatuses = [6]
export const EndingStatuses = [...MFAStatuses, ...ErrorStatuses, ...ConnectedStatuses]
