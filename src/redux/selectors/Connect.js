import { createSelector } from 'reselect'
import _find from 'lodash/find'

import { ReadableStatuses } from '../../constants/Member'

/**
 *
 * Selector Helper Functions
 */
const getMemberByGuid = (members, guid) => {
  if (guid === '') return {}

  return _find(members, { guid }) || {guid}
}

/**
 * Selectors
 */

export const getMembers = state =>
  state.connect.members.filter(member => !(member.connection_status === ReadableStatuses.PENDING))

export const getCurrentMember = createSelector(
  state => state.connect.members,
  state => state.connect.currentMemberGuid,
  getMemberByGuid,
)
