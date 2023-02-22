import _get from 'lodash/get'
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

  return initGettextAndReturnReactLocaleData(localeCode)
    .then(localeData => {
      //The default here is because of the mixed module system here with the commonjs dynamic require above. It should be removed and replaced with es6 dynamic imports if possible.
      const syncMessages = _get(localeData, ['LocaleStrings'], {})
      const asyncMessages = _get(localeData, ['default', 'LocaleStrings'], null)

      dispatch({
        type: ActionTypes.LOCALIZATION_LOADED,
        payload: {
          locale,
          messages: asyncMessages ? asyncMessages : syncMessages,
          source,
        },
      })
    })
    .catch(() => {
      logger.warn(`Invalid locale "${locale}" from source "${source}"`)
    })
}

export default dispatch => ({
  loadLocaleData: (source, locale) => dispatch(loadMessagesForLocale(source, locale)),
})
