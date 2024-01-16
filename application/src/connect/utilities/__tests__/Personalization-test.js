import {
  determineLocaleToUse,
  getBaseLocaleStrings,
  getCustomLocaleStrings,
  scrubLocale,
} from 'src/connect/utilities/Personalization'

// gettext related base language files
import frCa from 'src/connect/const/language/frCa.json'

// gettext related custom copy language files
import exampleFrCa from 'src/connect/const/language/custom_copy/example_custom_copy-fr-ca.json'

describe('Personalization', () => {
  describe('determineLocaleToUse', () => {
    const gettextLocale = 'fr-ca'

    it('should return "fr-ca" due to undefined or empty language, or clientConfig', () => {
      expect.assertions(2)
      expect(determineLocaleToUse(gettextLocale, undefined)).toEqual(gettextLocale)
      expect(determineLocaleToUse(gettextLocale, '')).toEqual(gettextLocale)
    })

    it('should return "en-ca" and override the gettextLocale since its provided via the clientConfig', () => {
      expect.assertions(1)
      expect(determineLocaleToUse(gettextLocale, 'en-CA')).toEqual('en-ca')
    })

    it('should return "fr-ca" due to both locales matching', () => {
      expect.assertions(1)
      expect(determineLocaleToUse(gettextLocale, 'fr-CA')).toEqual(gettextLocale)
    })
  })

  describe('getBaseLocaleStrings', () => {
    it('should load our french base strings', () => {
      expect.assertions(1)

      expect(getBaseLocaleStrings('fr-ca')).toEqual(frCa)
    })

    it('should fail to find any base strings and return an empty object', () => {
      expect.assertions(3)

      expect(getBaseLocaleStrings('not-a-locale')).toEqual({})
      expect(getBaseLocaleStrings('not-a-locale')).not.toEqual('')
      expect(getBaseLocaleStrings('not-a-locale')).not.toEqual(undefined)
    })
  })

  describe('getCustomLocaleStrings', () => {
    it('should find our custom copy strings for the correct locale', () => {
      expect.assertions(1)

      expect(getCustomLocaleStrings('fr-CA', 'example')).toEqual(exampleFrCa)
    })

    it('should not find any custom copy strings for the current locale', () => {
      expect.assertions(3)

      expect(getCustomLocaleStrings('en-CA', 'example')).toEqual({})
      expect(getCustomLocaleStrings('fr-CA', 'bad-custom-copy-name')).toEqual({})
      expect(getCustomLocaleStrings('en-US', 'bad-custom-copy-name')).toEqual({})
    })
  })

  describe('scrubLocale', () => {
    it('returns "en" when the locale is "en-US"', () => {
      expect(scrubLocale('en-US')).toEqual('en')
    })
  })
})
