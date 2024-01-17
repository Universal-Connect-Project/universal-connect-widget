import _find from 'lodash/find'
import _sortBy from 'lodash/sortBy'
import _includes from 'lodash/includes'

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
