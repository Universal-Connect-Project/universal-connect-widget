import _clone from 'lodash/clone'
import _find from 'lodash/find'
import _get from 'lodash/get'
import _sortBy from 'lodash/sortBy'
import _values from 'lodash/values'
import moment from 'moment'
import { TransactionTypes } from '../constants/Transaction'
import getUnixTime from 'date-fns/getUnixTime'
import startOfDay from 'date-fns/startOfDay'

export default {
  // this value will be used to persist the projected available cash balance for the last day of the current month into the first day of the next month
  projectedAvailableBalanceForLastDayOfCurrentMonth: 0,
  compileDataForChart(accounts, dateRange, historicalAccountBalances, events) {
    const chartDataObjects = {}
    const endOfPreviousDateRangeInterval = moment()
      .subtract(1, 'day')
      .endOf('day')

    // Create chart ready objects based on historical daily account balances
    historicalAccountBalances.forEach(item => {
      const dateInterval = moment.unix(item.date).unix()
      const dateIntervalObject = chartDataObjects[dateInterval]

      if (dateIntervalObject) {
        // If the day or month object already exists, add to the values
        dateIntervalObject.above += item.credit_transaction_total
        dateIntervalObject.below += item.debit_transaction_total
        dateIntervalObject.change += item.credit_transaction_total + item.debit_transaction_total
        dateIntervalObject.y += item.ending_balance
      } else {
        // Create an object for each day or month (depending on dateRange selected)
        chartDataObjects[dateInterval] = {
          above: item.credit_transaction_total,
          below: item.debit_transaction_total,
          change: item.credit_transaction_total + item.debit_transaction_total,
          date: dateInterval,
          x: dateInterval,
          y: item.ending_balance,
        }
      }
    })

    // Create chart ready objects based on the projected cash flow events
    events.forEach(event => {
      const dateInterval = moment
        .unix(event.date)
        .startOf('day')
        .add(12, 'hours')
        .unix()
      const dateIntervalObject = chartDataObjects[dateInterval]
      const isCredit = event.transaction_type === TransactionTypes.CREDIT

      if (dateIntervalObject && moment.unix(dateInterval).isAfter(endOfPreviousDateRangeInterval)) {
        dateIntervalObject.above += isCredit ? event.amount : 0
        dateIntervalObject.below -= isCredit ? 0 : event.amount
        dateIntervalObject.change = dateIntervalObject.above + dateIntervalObject.below
      }
    })

    // Sort the chart data objects
    const sortedChartObjects = _sortBy(_values(chartDataObjects), 'x')

    let currentBalance = this._getAccountBalance(accounts, dateRange, events)

    return sortedChartObjects.map(item => {
      // We have to clone each item as the new array resulting from the map still
      // has reference to the old objects contained inside other wise.
      const newItem = _clone(item)
      const itemDate = moment.unix(newItem.x).startOf('day')

      // We need to have the projected available cash  balance for the last day of the current month to persist to the first day of the next month

      // We will use isFirstDayOfNextMonth and isLastDayOfCurrentMonth as comparison values to determine if we update the persisted projected available cash balance
      const isFirstDayOfNextMonth = itemDate.isSame(
        moment()
          .add(1, 'month')
          .startOf('month'),
        'day',
      )
      const isLastDayOfCurrentMonth = itemDate.isSame(moment().endOf('month'), 'day')

      // Checks to see if it's last day of current month to update the persisted projected available cash balance
      if (isLastDayOfCurrentMonth) {
        this.projectedAvailableBalanceForLastDayOfCurrentMonth = currentBalance + newItem.change
      }

      if (
        itemDate.isAfter(moment.unix(dateRange.selectedStartDate).startOf('day')) ||
        itemDate.isSame(moment.unix(dateRange.selectedStartDate).startOf('day'))
      ) {
        // When the user changes the date range to the next month, the base value that is used to determine the projected available cash balance for the first day of the next month is the current available cash balance the user has
        // This causes a problem because if the user has a projected cash event from the current month that has not yet happened - that projected available cash amount after the event does not get persisted to the next month and throws off the projected available cash balances for the next month
        // Setting the current balance to the persisted available cash balance for the first day of the next month (lines 94-96) fixes this issue
        if (itemDate.isAfter(moment().endOf('day'))) {
          // Use persisted projected available cash balance if it's the first day of the next month
          // Use the current balance if it isn't
          if (isFirstDayOfNextMonth) {
            currentBalance = this.projectedAvailableBalanceForLastDayOfCurrentMonth + newItem.change
          } else {
            currentBalance += newItem.change
          }
          newItem.y = currentBalance
        }
      }

      return newItem
    })
  },

  compileEvents(actualEvents, projectedEvents, sequences) {
    const filteredActualEvents = actualEvents.filter(actualEvent => {
      const sequence = _find(sequences, sequence => {
        return sequence.guid === actualEvent.cashflow_sequence_guid
      })

      return sequence
    })

    const filteredProjectedEvents = projectedEvents.filter(projectedEvent => {
      const actualMatch = _find(filteredActualEvents, actualEvent => {
        return (
          actualEvent.cashflow_sequence_guid === projectedEvent.cashflow_sequence_guid &&
          actualEvent.expected_date === projectedEvent.expected_date
        )
      })

      return !actualMatch
    })

    return _sortBy(filteredActualEvents.concat(filteredProjectedEvents), 'date')
  },

  formatEvent(event, accounts, sequences) {
    const today = moment().startOf('day')
    const sequence = _find(sequences, { guid: event.cashflow_sequence_guid }) || {}
    const account = _find(accounts, { guid: sequence.account_guid }) || {}

    return Object.assign({}, event, {
      accountGuid: account.guid,
      accountName: account.user_name,
      date: moment
        .unix(event.occurred_on || event.expected_date)
        .startOf('day')
        .add(12, 'hours')
        .unix(),
      expected_date: event.expected_date
        ? moment
            .unix(event.expected_date)
            .startOf('day')
            .add(12, 'hours')
            .unix()
        : null,
      isPastDue: moment
        .unix(event.expected_date)
        .startOf('day')
        .isBefore(today),
      isProjected: !event.occurred_on,
      occurred_on: event.occurred_on
        ? moment
            .unix(event.occurred_on)
            .startOf('day')
            .add(12, 'hours')
            .unix()
        : null,
      recurrenceDescription: sequence.recurrence_description,
    })
  },

  formatEvents(events, accounts, sequences) {
    return events.map(event => {
      return this.formatEvent(event, accounts, sequences)
    })
  },

  hasAccountBalanceBelowZeroNextFifteenDays(accounts, projectedEvents, sequences) {
    const today = moment().startOf('day')
    const fifteenDaysFromToday = moment()
      .startOf('day')
      .add(15, 'days')

    const compiledEvents = projectedEvents
      // Get events with in the next 15 days
      .filter(event => {
        const expectedDate = moment.unix(event.expected_date).startOf('day')

        return expectedDate.isBetween(today, fifteenDaysFromToday)
      })
      // Map account guid to each event from its sequence
      .map(event => {
        const sequence = _find(sequences, sequence => {
          return sequence.guid === event.cashflow_sequence_guid
        })

        return {
          ...event,
          account_guid: sequence ? sequence.account_guid : null,
        }
      })
      // Reduce events to an object where each key is an account guid
      // with an array of events and a starting account balance
      .reduce((acc, event) => {
        if (acc[event.account_guid]) {
          acc[event.acccount_guiid].events.push(event)
        } else {
          acc[event.acccount_guiid] = {
            startingBalance: _get(
              _find(accounts, account => account.guid === event.account_guid),
              'balance',
              0,
            ),
            events: [event],
          }
        }

        return acc
      }, {})

    return (
      // Converts the above object back to array of objects
      _values(compiledEvents)
        // Does the maths for a final balance of the account
        // after events for group are taken into consideration
        .map(accountGroup => {
          let finalBalance = accountGroup.startingBalance

          accountGroup.events.forEach(event => {
            if (event.transaction_type === TransactionTypes.DEBIT) {
              finalBalance -= event.amount
            } else {
              finalBalance += event.amount
            }
          })

          return {
            ...accountGroup,
            finalBalance,
          }
        })
        // maps to an array of bools where each bool is
        // true or false based upon if the final balance
        // ended up below zero
        .map(accountGroup => {
          return accountGroup.finalBalance < 0
        })
        // At least one account ended up with a below zero balance
        .includes(true)
    )
  },

  _getAccountBalance(accounts, dateRange, events) {
    const startOfRange = moment.unix(dateRange.selectedStartDate).startOf('day')
    let balance = accounts.reduce((acc, account) => acc + account.balance, 0)

    const filteredEvents = events.filter(event => {
      const eventExpectedDate = moment.unix(event.expected_date).startOf('day')
      const eventIsExpectedBeforeRange = eventExpectedDate.isBefore(startOfRange)

      return eventIsExpectedBeforeRange
    })

    filteredEvents.forEach(event => {
      const isCredit = event.transaction_type === TransactionTypes.CREDIT

      balance += isCredit ? event.amount : event.amount * -1
    })

    return balance
  },
}

// Account balances are fetched as an array of one object per day per account.
// This formats that array into an object with keys of each account guid and values
// of pertinent info from the last day (today) as well as the array of balances
//for that account in case they are needed.
export const formatDailyAccountBalances = dailyAccountBalances => {
  // Create an object with keys of account guid and value of the array of balances.
  // Add the ending balance for the last day to the key, should be the current account balance.
  // If the time period extends into the future, the sum of the account balances is used as a
  // starting point before factoring in any projected events.
  const balancesGroupedByAccount = dailyAccountBalances.reduce((acc, currentBalance) => {
    if (acc[currentBalance.account_guid]) {
      return {
        ...acc,
        [currentBalance.account_guid]: {
          balances: [...acc[currentBalance.account_guid].balances, currentBalance],
          endingBalance: currentBalance.ending_balance,
        },
      }
    } else {
      return {
        ...acc,
        [currentBalance.account_guid]: {
          balances: [currentBalance],
          endingBalance: currentBalance.ending_balance,
        },
      }
    }
  }, {})

  return balancesGroupedByAccount
}

// Pertinent info from the account balance object arrays are:
// { date: , credit_transaction_total: , debit_transaction_total: , ending_balance: , transaction_total }
// to use in the chart and calendar. For each day we sum all of these values from
// all accounts.
export const sumDailyAccountBalances = groupedDailyAccountBalances => {
  const balances = Object.values(groupedDailyAccountBalances).reduce((acc, dailyBalances) => {
    return [...acc, ...dailyBalances.balances]
  }, [])

  const summedDailyAccountBalances = balances.reduce((acc, balance) => {
    if (acc[balance.date]) {
      acc[balance.date] = {
        credit_transaction_total:
          Math.round(
            acc[balance.date].credit_transaction_total * 100 +
              balance.credit_transaction_total * 100,
          ) / 100,
        debit_transaction_total:
          Math.round(
            acc[balance.date].debit_transaction_total * 100 + balance.debit_transaction_total * 100,
          ) / 100,
        ending_balance:
          Math.round(acc[balance.date].ending_balance * 100 + balance.ending_balance * 100) / 100,
        transaction_total:
          Math.round(acc[balance.date].transaction_total * 100 + balance.transaction_total * 100) /
          100,
      }
    } else {
      acc[balance.date] = {
        credit_transaction_total: balance.credit_transaction_total,
        debit_transaction_total: balance.debit_transaction_total,
        ending_balance: balance.ending_balance,
        transaction_total: balance.transaction_total,
      }
    }
    return acc
  }, {})

  return summedDailyAccountBalances
}

export const getProjectedAvailableBalance = (
  startDate,
  endDate,
  historicalAccountBalances,
  projectedEvents,
  startOfToday,
) => {
  const currentAvailableBalance = Object.values(historicalAccountBalances).reduce(
    (acc, account) => acc + Math.round(account.endingBalance * 100) / 100,
    0,
  )

  // If today is after the selected end date then the current balance should be used
  if (startOfToday > endDate) return currentAvailableBalance

  // If today is before the selected start date then sum events between today and the start date and add them to the balance
  const projectedSum = projectedEvents.reduce((acc, event) => {
    if (event.expected_date > startOfToday && event.expected_date < startDate) {
      return event.transaction_type === TransactionTypes.CREDIT
        ? acc + event.amount
        : acc - event.amount
    }
    return acc
  }, 0)

  return currentAvailableBalance + projectedSum
}

/*

  Chart expects array of data structured as such, one per day in that month:
  {
  above: 155.12,
  below: -96.18,
  change: 58.94,
  date: 1648814400,
  x: 1648814400,
  y: 10058.92,
}

Depending on the selected time period we compile those points either from
historical account balances or from projected events. As we move into the future
we have to sum the projected event balances and apply them to the current account
balance to give an accurate prediction of expected cash.

*/

export const compileTwelveMonthDataForChart = (
  startDate,
  endDate,
  historicalAccountBalances,
  projectedEvents,
  startOfToday = getUnixTime(startOfDay(new Date())),
) => {
  const timezoneOffset = new Date().getTimezoneOffset() * 60
  const projectedAvailableBalance = getProjectedAvailableBalance(
    startDate - timezoneOffset,
    endDate - timezoneOffset,
    historicalAccountBalances,
    projectedEvents,
    startOfToday,
  )
  let iterationTimestamp = startDate - timezoneOffset
  const chartDataObjects = {}

  // Make an object with a timestamp key for every day of the selected time range at midnight GMT
  while (iterationTimestamp <= endDate - timezoneOffset) {
    chartDataObjects[iterationTimestamp] = {
      above: 0,
      below: 0,
      change: 0,
      date: iterationTimestamp,
      x: iterationTimestamp,
      y: 0,
    }
    iterationTimestamp += 86400 // 24 hours in milliseconds aka next day
  }

  // Add historical balance data to chart data
  Object.values(historicalAccountBalances).forEach(account => {
    account.balances.forEach(balance => {
      const dateIntervalObject = chartDataObjects[balance.date]

      if (dateIntervalObject) {
        // If the day object already exists, add to the values
        dateIntervalObject.above += balance.credit_transaction_total
        dateIntervalObject.below += balance.debit_transaction_total
        dateIntervalObject.change +=
          balance.credit_transaction_total + balance.debit_transaction_total
        dateIntervalObject.y += balance.ending_balance
      }
    })
  })

  // Add projected events data to chart data

  // sort projected events by time since they come sorted by sequence
  const sortedProjectedEvents = _sortBy(_values(projectedEvents), 'expected_date')

  // starting balance to manipulate as we move through the projected events
  let workingProjectedBalance = projectedAvailableBalance

  // for each day from today into the future, if an event occurs, update the data and set it
  // if no event occurs, set the working balance and default the "change" values to 0

  Object.values(chartDataObjects).forEach(day => {
    if (day.date >= startOfToday) {
      const dateIntervalObject = chartDataObjects[day.date]

      dateIntervalObject.above = 0
      dateIntervalObject.below = 0
      dateIntervalObject.change = 0
      dateIntervalObject.y = workingProjectedBalance

      sortedProjectedEvents.forEach(event => {
        if (day.date === event.expected_date) {
          const isCredit = event.transaction_type === TransactionTypes.CREDIT

          dateIntervalObject.above += isCredit ? event.amount : 0
          dateIntervalObject.below -= isCredit ? 0 : event.amount
          dateIntervalObject.change = day.above + day.below

          workingProjectedBalance = isCredit
            ? workingProjectedBalance + event.amount
            : workingProjectedBalance - event.amount

          chartDataObjects[day.date].y = workingProjectedBalance
        }
      })
    }
  })

  // This will be used with Object.values to fit the chart implementation but I think
  // it's better to do that in the Calendar component for now so we can have the object
  // with keys if there is a use case for it in the future.
  return chartDataObjects
}
