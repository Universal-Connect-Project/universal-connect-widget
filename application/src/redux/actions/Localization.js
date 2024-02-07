import { initGettextAndReturnReactLocaleData, scrubLocale } from '../../utils/LocaleLoader'

export const ActionTypes = {
  LOCALIZATION_LOADED: 'localization/localization_loaded',
}

export const LocaleSources = {
  WIDGET_LOADER: 'WIDGET_LOADER',
  FIREFLY: 'FIREFLY',
}

/**
 * @param {String} source - should come from LocaleSources
 * @param {String} localeCode - e.g. en-CA
 */
const loadMessagesForLocale = (source, localeCode) => dispatch => {
  const locale = scrubLocale(localeCode)

  initGettextAndReturnReactLocaleData(localeCode)

  dispatch({
    type: ActionTypes.LOCALIZATION_LOADED,
    payload: {
      locale,
      messages: {},
      source,
    },
  })
}

export default dispatch => ({
  loadLocaleData: (source, locale) => dispatch(loadMessagesForLocale(source, locale)),
})
