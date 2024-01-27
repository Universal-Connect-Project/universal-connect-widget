import _find from 'lodash/find'
import _get from 'lodash/get'
import _some from 'lodash/some'
import moment from 'moment'
import {
  ConnectedStatuses,
  ConnectionStatusMap,
  ErrorStatuses,
  MemberMessages as messages,
  MFAStatuses,
  ProcessingStatuses,
  StatusesRequiringMessages,
} from '../constants/Member'

const Member = {
  getLastAggregatedTime() {
    const now = new Date().getTime()
    const nowMom = moment(now)
    const timestamp = this.get('last_update_time')
    const lastMom = moment(timestamp)

    if (!timestamp || nowMom.format('YYYY-MM-DD') === lastMom.format('YYYY-MM-DD')) {
      return Member.lastAggregatedMessages.TODAY
    } else {
      return Member.lastAggregatedMessages.PREVIOUS({
        time: lastMom.fromNow(),
      })
    }
  },

  getMemberByGuid(members, guid) {
    if (guid === '') return {}

    return _find(members, { guid }) || {guid}
  },

  getMembersWithoutAccounts(accounts, members) {
    return members.filter(member => {
      return (
        !member.is_manual && !accounts.filter(account => account.member_guid === member.guid).length
      )
    })
  },

  hasCredentials(member) {
    return _get(member, 'mfa.credentials.length', 0) > 0
  },

  hasCredentialsWithValues(credentials = []) {
    if (credentials.length === 0) return false
    return !_some(credentials, credential => credential.value === null || credential.value === '')
  },

  hasMFA(member) {
    const credentials = _get(member, ['credentials'], [])

    return MFAStatuses.indexOf(member.connection_status) !== -1 && credentials.length > 0
  },

  hasError(member) {
    return ErrorStatuses.indexOf(member.connection_status) !== -1
  },

  hasAnyKindOfError(member) {
    return Member.hasMFA(member) || Member.hasError(member)
  },

  isAuthenticated(member) {
    return ConnectedStatuses.includes(member.connection_status)
  },

  getNameForPostMessage(member) {
    if (member.is_manual) {
      return 'Manual Accounts'
    } else {
      return member.name || member.institution_name
    }
  },

  shouldShowConnectionStatusErrorMessage(member) {
    return (
      StatusesRequiringMessages.indexOf(member.connection_status) !== -1 &&
      (member.is_managed_by_user || member.is_user_created)
    )
  },

  getPostMessageObject(member, accounts) {
    const message = {
      connection_status: ConnectionStatusMap[member.connection_status]
        ? ConnectionStatusMap[member.connection_status].key
        : null,
      guid: member.guid,
      id: member.external_guid,
      is_user_created: member.is_user_created,
      is_manual: member.is_manual,
      name: Member.getNameForPostMessage(member),
      most_recent_job_guid: member.most_recent_job_guid,
      institution_guid: member.institution_guid,
      type: 'member',
      metadata: member.metadata,
    }

    return accounts ? { ...message, accounts_count: accounts.length } : message
  },

  buildSubtitleMessage(member) {
    if (member.is_manual || !member.is_managed_by_user) {
      return messages.ACCOUNTS_CONNECTED
    }

    const hasError = Member.hasAnyKindOfError(member)

    if (hasError) {
      return member.connection_status
        ? ConnectionStatusMap[member.connection_status].titleMessage
        : messages.ERROR
    }

    if (ProcessingStatuses.includes(member.connection_status)) {
      return messages.CONNECTING
    }

    return messages.ACCOUNTS_CONNECTED
  },

  isProcessing(member) {
    return (
      ProcessingStatuses.indexOf(member.connection_status) !== -1 &&
      !member.is_manual &&
      member.is_managed_by_user &&
      member.is_being_aggregated
    )
  },

  hasAggregatingMembers(members) {
    return members.length > 0 && members.filter(member => member.is_being_aggregated).length > 0
  },
}

export default Member
