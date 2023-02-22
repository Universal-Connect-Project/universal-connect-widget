import EnglishCanadian from './language/en-ca'
import EnglishUnitedStates from './language/en-us'
import FrenchCanadian from './language/fr-ca'

// TODO remove this once intl.formatMessage is used everywhere
export const languageMaps = {
  'en-ca': { LocaleStrings: EnglishCanadian.LocaleStrings },
  en: { LocaleStrings: EnglishUnitedStates.LocaleStrings },
  fr: { LocaleStrings: FrenchCanadian.LocaleStrings },
  'fr-ca': { LocaleStrings: FrenchCanadian.LocaleStrings },
}

export const languageMapper = locale => {
  return languageMaps[locale.toLowerCase()]
}
