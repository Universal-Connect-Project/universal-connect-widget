import { ActionTypes, LocaleSources } from '../actions/Localization'
import { languageMapper } from '../../constants/Localization'
import { createReducer } from '../../utils/Reducer'

const { LOCALIZATION_LOADED } = ActionTypes

// Ordered from lowest to highest priority
const LocaleSourcePriority = [LocaleSources.FIREFLY, LocaleSources.WIDGET_LOADER]

export const defaultState = {
  locale: 'en',
  languageMap: languageMapper('en'), // deprecated
  messages: {},
  source: null,
}

const isHigherPriority = (currentSource, newSource) =>
  LocaleSourcePriority.indexOf(currentSource) < LocaleSourcePriority.indexOf(newSource)

const localizationLoaded = (state, action) => {
  const { locale, messages, source } = action.payload

  if (!isHigherPriority(state.source, source)) return state

  const languageMap = languageMapper(locale) || defaultState.languageMap

  return {
    ...state,
    locale,
    languageMap,
    messages, // for <IntlProvider>
    source,
  }
}

export default createReducer(defaultState, {
  [LOCALIZATION_LOADED]: localizationLoaded,
})
