import IntlPolyfill from 'intl'

import { initGettextLocaleData } from './Personalization'

const DEFAULT_LOCALE = 'en'

// translation files to be loaded asynchronously with react-intl-loader
const localeLoaders = {
  'en-ca': () => require('react-intl-loader?locale=en!constants/language/en-ca'),
  fr: () => localeLoaders['fr-ca'](),
  'fr-ca': () => require('react-intl-loader?locale=fr!constants/language/fr-ca'),
}

// Returns a Promise that resolves to the asynchronously loaded messages for the locale.
// A rejected Promise is returned if there are no translations for the locale.
// Also handles the gettext related translations and custom copy integration
export const initGettextAndReturnReactLocaleData = localeCode => {
  const reactLocale = scrubLocale(localeCode)
  const localeLoader = localeLoaders[scrubLocale(reactLocale)]

  // This sets up our locale and handles our JSON loading
  // for gettext related translations along with custom copy
  initGettextLocaleData(reactLocale)

  if (reactLocale === DEFAULT_LOCALE) {
    return Promise.resolve({ LocaleStrings: {} })
  }

  return localeLoader ? new Promise(resolve => localeLoader()(resolve)) : Promise.reject()
}

/**
 * Returns the `MoneyDesktopWidgetLoader` configured locale code (aka `language`)
 */
export const widgetLoaderLanguage = () =>
  window.app && window.app.options && window.app.options.language

// Support for Safari 9
export const maybeRequireIntlPolyfill = () => {
  if (window.Intl) {
    // Determine if the built-in `Intl` has the locale data we need.
    if (!areIntlLocalesSupported(Object.keys(localeLoaders))) {
      Intl.NumberFormat = IntlPolyfill.NumberFormat
      Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
    }
  } else {
    // No `Intl`, so use and load the polyfill.
    window.Intl = require('intl')
  }
}

// prepare the locale for lookup
export const scrubLocale = locale => {
  const lowerLocale = locale.toLowerCase()

  // use react-intl's default of 'en'
  return lowerLocale === 'en-us' ? 'en' : lowerLocale
}
