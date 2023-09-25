import { initGettextLocaleData } from './Personalization'

export const initGettextAndReturnReactLocaleData = localeCode => {
  const reactLocale = scrubLocale(localeCode)

  // This sets up our locale and handles our JSON loading
  // for gettext related translations along with custom copy
  initGettextLocaleData(reactLocale)
}

/**
 * Returns the `MoneyDesktopWidgetLoader` configured locale code (aka `language`)
 */
export const widgetLoaderLanguage = () =>
  window.app && window.app.options && window.app.options.language

// Support for Safari 9
export const maybeRequireIntlPolyfill = () => {
}

// prepare the locale for lookup
export const scrubLocale = locale => {
  const lowerLocale = locale.toLowerCase()

  // use react-intl's default of 'en'
  return lowerLocale === 'en-us' ? 'en' : lowerLocale
}
