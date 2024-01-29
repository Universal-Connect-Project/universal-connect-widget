import { setLocale, loadJSON, getLocale } from './Intl'

import { scrubLocale } from './LocaleLoader'

// gettext related base language files
import frCa from '../constants/language/frCa.json'
import enCa from '../constants/language/enCa.json'
// This is a catch all for spanish. Country code optional.
import es from '../constants/language/es.json'

// gettext related custom copy language files
import exampleFrCa from '../constants/language/custom_copy/example_custom_copy-fr-ca.json'
import exampleEnUs from '../constants/language/custom_copy/example_custom_copy-en-us.json'
import regionsEnUs from '../constants/language/custom_copy/regions_custom_copy-en-us.json'
import mandtEnUs from '../constants/language/custom_copy/mandt_custom_copy-en-us.json'
import nohoEnUs from '../constants/language/custom_copy/noho_custom_copy-en-us.json'

// These keys match up with our /language/custom_copy/FILENAMES, to load specific client copy
const CLIENT_CUSTOM_COPY = {
  [generateClientCustomCopyKey('fr-ca', 'example')]: exampleFrCa,
  [generateClientCustomCopyKey('en', 'example')]: exampleEnUs,
  [generateClientCustomCopyKey('en', 'regions')]: regionsEnUs,
  [generateClientCustomCopyKey('en', 'mandt')]: mandtEnUs,
  [generateClientCustomCopyKey('en', 'noho')]: nohoEnUs,
}

// These keys match up with our base non-generic english language files
const LOCALE_TO_STRINGS = {
  'en-ca': enCa,
  'fr-ca': frCa,
  es,
}

/**
 * Based on the locale, we load up our base language strings, if we are in english then we
 * don't load a specific language file, as we fall back to our initial provided strings.
 *
 * If we are using a different language, we get that language file.
 *
 * We then check for any custom copy based on an optionally provided "custom_copy_namespace" from the client_profile.
 * This is opt-in functionality, and works normally if one isnt provided.
 *
 * We then combine both objects to ultimately give gettext the final string object via `loadJSON()`
 *
 * == To add custom copy for a client you'll want to do the following:
 * ==== Create a `constants/language/custom_copy/{namespace}_custom_copy-{lang}.json` file.
 * ==== Add the entry to the CLIENT_CUSTOM_COPY object for each language they want to support.
 * ==== Manually add the translations entry to their custom copy file (which will cause the overriding of our base strings or language specific strings)
 *
 * Code Example:
 * # This is used if you want to replace all instances of this string
 * {__('Connect your account')}
 * === The argument is the actual english string
 *
 * # This is used when you only want to replace this string instance
 * {_p('connect-disclosure', 'Connect your account')}
 * === The first argument is the unique key for that specific text
 * === The second argument is the actual english string
 *
 * == Run `npm run i18n extract`, this will create a new entry in our `messages.po` file.
 * == Copy that entry into the {language}.po file (if it's in a language with an existing language file), add the translation.
 * === If not, you'll just add it directly to the custom copy language file.
 * == Run `npm run i18n po2json`, which will auto generate your {language}.json file.
 * == Copy the line added into your custom copy language file
 *
 * The flow of language and personalization data is as follows:
 *
 * ENGLISH <- BASE_LANGAGE (determined from firefly then widget loader config) <- CUSTOM_COPY
 *
 * Order to determine which locale is used
 * 1) Firefly HTML attribute
 * 2) clientConfig via the widget loader
 *
 * In the future, the language and or custom copy files could easily be coming from a backend service instead of in the repo.
 */

/**
 * This function sets up all of the needed gettext behavior
 * This sets our locale, determines our language files along with loading the client custom copy
 *
 * @param {string} reactLocale
 */
export const initGettextLocaleData = reactLocale => {
  // This comes from the client->client_profile
  const clientCustomCopyNamespace = window.app.options?.custom_copy_namespace ?? ''

  // Get our locale based on the way it's supplied to us
  const locale = determineLocaleToUse(getLocale(), reactLocale)

  // Set our locale
  setLocale(locale.toLowerCase())

  // Pass in the client custom copy namespace, example: 'greyfield' (this will come from the client profile)
  const baseStrings = getBaseLocaleStrings(locale)
  const customStrings = getCustomLocaleStrings(locale, clientCustomCopyNamespace)

  const mergedCopy = { ...baseStrings, ...customStrings }

  // Load our JSON only if we have any keys based on language and custom copy files
  if (Object.keys(mergedCopy).length) {
    loadJSON(mergedCopy)
  }
}

/**
 * Compares gettext locale with supplied reactLocale, if they differ we favor the reactLocale since that
 * means it's from the widget loader configuration which should override everything else
 *
 * @param {string} gettextLocale
 * @param {string} reactLocale
 * @returns {string} locale
 */
export const determineLocaleToUse = (gettextLocale, reactLocale) => {
  if (!reactLocale) {
    return scrubLocale(gettextLocale)
  }

  const scrubbedReactLocale = scrubLocale(reactLocale)

  return gettextLocale.toLowerCase() === scrubbedReactLocale ? gettextLocale : scrubbedReactLocale
}

/**
 * When we support more languages, we simply add a new case
 *
 * @param {string} locale
 * @returns {object} Either hydrated or empty
 */
export const getBaseLocaleStrings = locale => LOCALE_TO_STRINGS[locale.toLowerCase()] || {}

/**
 * Does a look up based on the customCopyNamespace to return the clients custom copy
 *
 * @param {string} locale
 * @param {string} customCopyNamespace
 * @returns {object} Either hydrated or empty
 */
export const getCustomLocaleStrings = (locale, customCopyNamespace) => {
  const customCopyKey = generateClientCustomCopyKey(locale, customCopyNamespace)

  return CLIENT_CUSTOM_COPY[customCopyKey] ?? {}
}

/**
 * Produces the full string for the copy look up
 *
 * @param {string} locale
 * @param {string} customCopyNamespace
 * @returns {string} ex: 'greyfield_custom_copy-en-us'
 */
function generateClientCustomCopyKey(locale, customCopyNamespace) {
  return `${customCopyNamespace}_custom_copy-${locale}`.toLowerCase()
}
