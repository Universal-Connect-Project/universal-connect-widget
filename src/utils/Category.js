import _sumBy from 'lodash/sumBy'
import _groupBy from 'lodash/groupBy'
import _times from 'lodash/times'
import moment from 'moment'
import add from 'date-fns/add'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import endOfDay from 'date-fns/endOfDay'
import endOfMonth from 'date-fns/endOfMonth'
import endOfYear from 'date-fns/endOfYear'
import fromUnixTime from 'date-fns/fromUnixTime'
import getUnixTime from 'date-fns/getUnixTime'
import startOfDay from 'date-fns/startOfDay'
import startOfMonth from 'date-fns/startOfMonth'
import startOfYear from 'date-fns/startOfYear'

import { DateRangeTypes } from '../constants/Category'

export const getDateRangeByType = (direction, { dateRangeType, endDate, startDate }) => {
  const multiplier = direction === 'left' ? -1 : 1
  const startTimezoneOffset = fromUnixTime(startDate).getTimezoneOffset() * 60
  const endTimezoneOffset = fromUnixTime(endDate).getTimezoneOffset() * 60

  const start = fromUnixTime(startDate + startTimezoneOffset)
  const end = fromUnixTime(endDate + endTimezoneOffset)

  if (dateRangeType === DateRangeTypes.MONTHLY) {
    const newStart = getUnixTime(startOfMonth(add(start, { months: multiplier })))
    const newEnd = getUnixTime(endOfMonth(fromUnixTime(newStart)))

    const newStartTimezoneOffset = fromUnixTime(newStart).getTimezoneOffset() * 60
    const newEndTimezoneOffset = fromUnixTime(newEnd).getTimezoneOffset() * 60

    return {
      dateRangeType,
      newStartDate: newStart - newStartTimezoneOffset,
      newEndDate: newEnd - newEndTimezoneOffset,
    }
  } else if (dateRangeType === DateRangeTypes.YEARLY) {
    const newStart = getUnixTime(startOfYear(add(start, { years: multiplier })))
    const newEnd = getUnixTime(endOfYear(fromUnixTime(newStart)))

    const newStartTimezoneOffset = fromUnixTime(newStart).getTimezoneOffset() * 60
    const newEndTimezoneOffset = fromUnixTime(newEnd).getTimezoneOffset() * 60

    return {
      dateRangeType,
      newStartDate: newStart - newStartTimezoneOffset,
      newEndDate: newEnd - newEndTimezoneOffset,
    }
  } else if (dateRangeType === DateRangeTypes.YTD) {
    const newStart = getUnixTime(startOfYear(add(start, { years: multiplier })))
    const newEnd = getUnixTime(endOfDay(add(end, { years: multiplier })))

    const newStartTimezoneOffset = fromUnixTime(newStart).getTimezoneOffset() * 60
    const newEndTimezoneOffset = fromUnixTime(newEnd).getTimezoneOffset() * 60

    return {
      dateRangeType,
      newStartDate: newStart - newStartTimezoneOffset,
      newEndDate: newEnd - newEndTimezoneOffset,
    }
  } else {
    const diff = differenceInCalendarDays(fromUnixTime(endDate), fromUnixTime(startDate))
    const newStart = getUnixTime(startOfDay(add(start, { days: diff * multiplier })))
    const newEnd = getUnixTime(endOfDay(add(end, { days: diff * multiplier })))

    const newStartTimezoneOffset = fromUnixTime(newStart).getTimezoneOffset() * 60
    const newEndTimezoneOffset = fromUnixTime(newEnd).getTimezoneOffset() * 60

    return {
      dateRangeType,
      newStartDate: newStart - newStartTimezoneOffset,
      newEndDate: newEnd - newEndTimezoneOffset,
    }
  }
}

export const getHistory = (
  totals,
  startDate = moment()
    .startOf('month')
    .unix(),
  monthsBack = 12,
) => {
  const groupedTotals = _groupBy(totals, 'year_month')

  return _times(monthsBack, i => {
    const month = moment.unix(startDate).subtract(i, 'month')
    const yearMonth = month.format('YYYYMM')

    return {
      timestamp: month.unix(),
      label: month.format('MMM YYYY'),
      total: _sumBy(groupedTotals[yearMonth], 'total'),
    }
  }).reverse()
}
