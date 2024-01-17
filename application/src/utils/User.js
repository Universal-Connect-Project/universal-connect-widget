import differenceInDays from 'date-fns/differenceInDays'
import fromUnixTime from 'date-fns/fromUnixTime'
import startOfDay from 'date-fns/startOfDay'

export const shouldShowTooSmallModalFromSnooze = (dismissedAt, thresholdDays, now = null) => {
  if (!dismissedAt || !thresholdDays) {
    return true
  }

  const currentDate = now || new Date(Date.now())
  const dismissalDate =
    typeof dismissedAt === 'string' ? new Date(dismissedAt) : fromUnixTime(dismissedAt)

  const daysSinceDismissal = differenceInDays(currentDate, startOfDay(dismissalDate))

  return daysSinceDismissal > thresholdDays
}
