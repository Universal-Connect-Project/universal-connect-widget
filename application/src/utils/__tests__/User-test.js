import * as User from 'utils/User'

describe('User', () => {
  describe('shouldShowTooSmallModalFromSnooze', () => {
    const nowDate = new Date(1680195964443)
    const yesterdayDate = new Date(1680109564000)
    const thirtyDaysAgoDate = new Date(1677607564000)
    const threeDaysAgo = new Date(1679936764000)

    it('defaults true when no "dismissed at" or "threshold days" given', () => {
      expect(User.shouldShowTooSmallModalFromSnooze(null, 10)).toBe(true)
      expect(User.shouldShowTooSmallModalFromSnooze(threeDaysAgo, null)).toBe(true)
      expect(User.shouldShowTooSmallModalFromSnooze(threeDaysAgo, 0)).toBe(true)
    })

    it('should show modal if days since dismissal exceeds client set threshold', () => {
      expect(User.shouldShowTooSmallModalFromSnooze(thirtyDaysAgoDate, 15, nowDate)).toBe(false)
    })

    it('should not show modal if days since dismissal is below client set threshold', () => {
      expect(User.shouldShowTooSmallModalFromSnooze(yesterdayDate, 15, nowDate)).toBe(false)
    })
  })
})
