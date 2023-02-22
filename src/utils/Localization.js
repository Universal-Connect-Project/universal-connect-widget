import _mapValues from 'lodash/mapValues'
/**
 * Convert messages to Intl MessageDescriptor
 * `messages` is an Object where the key is the `id`
 * and the value is either the `defaultMessage` or a MessageDescriptor.
 */
export const convertToMessages = messages => {
  return _mapValues(messages, convertToMessageDescriptor)
}

/**
 * Convert to Intl MessageDescriptor
 */
export const convertToMessageDescriptor = (defaultMessage, id) => {
  return typeof defaultMessage === 'string'
    ? { id, defaultMessage }
    : Object.assign({}, defaultMessage, { id }) // ignore possible existing id because the key and the id should match
}

/**
 * @param {String} locale - e.g. "en-CA"
 * @returns {String} the default currency code for the country, e.g. "CAD"
 */
export const currencyCodeForLocale = locale => {
  const currencyCodeMap = {
    CA: 'CAD',
    US: 'USD',
  }

  return currencyCodeMap[countryCode(locale)] || 'USD'
}
/**
 * @param {String} locale
 * @returns {String} the ISO 3166-1 Country Code of the locale, defaults to "US"
 */
export const countryCode = locale => {
  return (locale.split('-')[1] || 'US').toUpperCase()
}
