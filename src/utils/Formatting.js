import _isNil from 'lodash/isNil'
import numeral from 'numeral'
import moment from 'moment'

import { currencyCodeForLocale } from './Localization'

export function tryPhoneNumber(str) {
  const digits = str ? str.replace(/[^\d]/g, '') : ''

  if (digits.length === 11) {
    return phoneNumber(digits)
  } else {
    return str
  }
}

export function phoneNumber(str) {
  const digits = str.replace(/[^\d]/g, '')
  const country_code = digits.slice(0, 1)
  const area_code = digits.slice(1, 4)
  const exchange_code = digits.slice(4, 7)
  const line_number = digits.slice(7, 11)

  return `${country_code} (${area_code}) ${exchange_code}-${line_number}`
}

export const urlWithHttps = url => {
  return url && url.indexOf('http') !== -1 ? url : `https://${url}`
}

export const ordinalize = number => numeral(number).format('0o')

export const Pluralize = (count, string, plural = null) => {
  if (count === 1) return string

  if (plural) return plural

  return string + 's'
}

export const formatCurrencyFactory = intl => currencyCode => amount => {
  const currency = currencyCode || currencyCodeForLocale(intl.locale)

  return intl.formatNumber(amount, { currency, style: 'currency' })
}

export const formatPercentFactory = intl => value =>
  intl.formatNumber(value, { style: 'percent', maximumFractionDigits: 3 })

/**
 * Useful with formatCurrencyFactory and formatPercentFactory
 */
export const isValidNumber = value => !_isNil(value) && value !== '' && isFinite(Number(value))

export const formatNumber = (numberToFormat, formatToUse, fallback) => {
  const formattedNumber = numeral(numberToFormat).format(formatToUse)

  // Infinity would return '$NaN' so we specifically handle that case here
  if (numberToFormat === Infinity) {
    return fallback ? fallback : 'NA'
  }
  // if numeral returns zero, but is not given zero, it is likely there was
  // some malformed data and should return the fallback string instead
  if (
    numberToFormat !== '0' &&
    numberToFormat !== 0 &&
    formattedNumber === numeral(0).format(formatToUse)
  ) {
    return fallback ? fallback : 'NA'
  }
  return formattedNumber
}

// If a user puts a float into a string input, this will round it down to an int if needed
export const roundDownFloatStringToInt = input => {
  return Math.floor(Number(input))
}

// If the value is a number, it likely came from redux and is an epoch date timestamp.
// If it's a string, the user likely input it and it needs to be converted to an epoch timestamp.
export const convertedBirthdayTimestamp = input => {
  const timestamp =
    typeof input === 'number' ? input : Number(moment(input, 'MM-DD-YYYY').format('X'))

  return timestamp
}

// Only numbers allowed
export const inputNumberMask = input => {
  return input.replace(/[^\d]/g, '')
}

// Use in combination with maxLength of 10 characters in input
export const inputDateMask = input => {
  return input
    .replace(/^(\d\d)(\d)$/g, '$1/$2')
    .replace(/^(\d\d\/\d\d)(\d+)$/g, '$1/$2')
    .replace(/[^\d/]/g, '')
}

// Use to allow only two digits after a decimal point in an input
// input should be a string
export const limitDigitsAfterDecimal = (input, digits) => {
  let amount

  // Check if the value includes a decimal
  if (input.includes('.')) {
    const index = input.indexOf('.')
    const lastDigitIndex = index + digits + 1

    // Only get up to two digits past the decimal
    amount = input.slice(0, lastDigitIndex)
  } else {
    amount = input
  }

  return amount
}

// Use to remove leading zeros from an input
// value should be a string
export const removeLeadingZeros = value => {
  let strippedValue

  // Return current value if no leading zero
  if (value[0] !== '0') return value

  // Strip zero from front since one exists
  strippedValue = value.slice(1)

  // If there is still another zero, repeat
  if (strippedValue[0] === '0') {
    strippedValue = removeLeadingZeros(strippedValue)
  }

  return strippedValue
}
