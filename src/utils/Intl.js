// **DOCS ARE BELOW THE CODE IN THIS FOLDER**
import React from 'react'
import PropTypes from 'prop-types'

import trimChars from 'lodash/fp/trimChars'

import makei18n from 'gettext.js'

export const i18n = makei18n()

// More gettext keyword descriptions:
// https://www.gnu.org/software/gettext/manual/gettext.html#Default-Keywords

// gettext() alias. Used for singular strings.
export const __ = i18n.__.bind(i18n)

// ngettext() alias. Used for plural strings.
export const _n = i18n._n.bind(i18n)

// pgettext() alias. Used for singular strings that are "particular" to a given
// context.
export const _p = i18n._p.bind(i18n)

// npgettext() alias. Used for plural strings that are "particular" to
// a given context.
export const _np = (msgctxt, msgid, msgid_plural, n, ...args) =>
  /* eslint-disable no-undefined */
  i18n.dcnpgettext.apply(i18n, [undefined, msgctxt, msgid, msgid_plural, n].concat(args))
/* eslint-enable no-undefined */

// Change the current locale; get the currently selected locale.
export const getLocale = i18n.getLocale.bind(i18n)
export const setLocale = i18n.setLocale.bind(i18n)

// Load a JSON string of tranlations.
export const loadJSON = i18n.loadJSON.bind(i18n)

// Load a JavaScript object of translations.
export const setMessages = i18n.setMessages.bind(i18n)

/**
A React component to bold translated strings with asterisk delimeters

This takes any string and wraps words within asterisk delimeters with <strong>
or a custom element. This allows us to use vanilla gettext.js as normal and to
receive translated strings that contain the original asterisks around the
translated words and output them accordingly.

Example workflow:

1.  We add the string, `This is a *bold* statement.` to our app.
2.  Strings are extracted and sent to translators.
3.  The translators are accustomed to seeing asterisks and will include them in
    the translation (assumption based on an informal survey of people in the
    translation field.)
4.  We receive a translated string like, `C'est une déclaration *audacieuse*.`
5.  The `<B></B>` component below takes that string and turns it into React
    elements suitable to render bold text like
    `C'est une déclaration <strong>audacieuse</strong>.`

Usage:

    <B>{__(`This is a *bold* statement.`)}</B>

    <B>{_n(`This is a *bold* statement.`, `This is %s *bold* statements.`, 3)}</B>

    <B boldTag="em">{__(`This is a *emphasized* statement.`)}</B>

    <B boldTag={(props) => <div className="foo">{props.children}</div>}>
        {__(`This is a *custom bold* statement.`)}
    </B>

    // Shorthand for working with Kyper's Text component:
    import { Text } from '@kyper/text'
    <B boldTag={Text} bold={true} tag="div" color="secondary">
        {__(`This is a *custom bold* statement.`)}
    </B>
**/
const r = /(\*[^*]*\*)/ // Match pairs of asterisks.

export const B = ({ boldTag = 'strong', children, ...rest }) => {
  const ret = children.split(r)

  return (
    <React.Fragment>
      {ret.length === 0
        ? children
        : ret.map(x =>
            x[0] === '*' ? React.createElement(boldTag, { key: x, ...rest }, trimChars('*', x)) : x,
          )}
    </React.Fragment>
  )
}

B.propTypes = {
  boldTag: PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.string]),
  children: PropTypes.string.isRequired,
}

/**
# gettext.js Overview and Instructions

This is a simple and lightweight translation scheme. It works for singular and
plural strings and simply takes a baseline English string to a translated
string, if one is available. It's just a hashmap lookup, nothing more, of
"baseline english string" to "translated string". The translated strings are
stored in a JSON file and can be lazy-loaded and changed on-the-fly.

It is expected that you will use the JavaScript Intl calls to format numbers
and dates appropriately. Polyfill those APIs as necessary. E.g.:
Intl.DateTimeFormat, Intl.NumberFormat. This lib handles translation,
extraction, and pluralization only.

## Usage

```js
import {__, _n, _p, i18n} from './Intl'

// Basic usage:
__('Hello, world!')                         // => Hello, world!
_n('Hello, world!', 'Hello, worlds!', 1)    // => Hello, world!
_n('Hello, world!', 'Hello, worlds!', 2)    // => Hello, worlds!

// JSX usage:
<p>Singular: {__('Hello, world!')}</p>
<p>Plural: {_n('Hello, world!', 'Hello, worlds!', 2)}</p>

// With variable interpolation:
__('Hello, %1!', nameVar)
// Note, the count _must_ be the first argument after the two strings.
_n(
    'Hello, %3.',
    'Hello to all %1 of you %2 %3.',
    countVar,
    adjectiveVar,
    nameVar,
)

// Singular translations that may vary in meaning due to surrounding context:
_p('appearance', 'This is fair.')
_p('justice', 'This is fair.')
_p('weather', 'Today is fair.')
_p('county fair', 'This is a fair.')

// Plural translations that may vary in meaning due to surrounding context:
_np('appearance', 'He is fair.', 'They are fair.', 2)
_np('justice', 'He is fair.', 'They are fair.', 2)

// Extract comments from the source for inclusion in the translation files:
// *Because the parser expects a `lua` comment, add a -- before comment that
// should be extracted.

// This comment is not extracted (missing prefix).
__('This is a string.')

// --TR: This comment IS extracted (has prefix).
__('This is a string.')

// --TR: This comment is NOT extracted (outside multiline invocation).
_n(
    'There is one %2',
    'There are %1 %3',
    count,
)

_n(
    // --TR: This comment IS extracted (inside multiline invocation).
    'There is one %2',
    'There are %1 %3',
    count,
)

```

NOTE: The program that extracts strings can parse some JavaScript but does not
understand JavaScript. It is looking for the literal function signatures
mentioned above. Avoid ES6 string templates and avoid changing the call syntax
by wrapping, currying, etc. Stick to the variable interpolation syntax above
for any dynamic content.

## Current (simple) approach

If we only have one language, like fr-ca, to support we might as well hard-code
the translations JSON and bundle the file into the regular build. E.g.:

```js
// robinhood/Index.js
import { loadJSON } from './Intl'
import frCa from 'robinhood/constants/language/fr-ca.json'

if (lang === 'fr-ca') {
    loadJSON(frCa)
    setLocale('fr-ca')
}
```

## Future compatibility

Should the need arise for a company-wide standardization effort the above
simple approach can be easily swapped out for a traditional gettext approach.
Transitioning should go something like this:

1.  Extract translatable strings from the source files. This will need to be
    done after every file change, probably as a CI hook. (Tested with xgettext
    0.19.8.1.)

    ```sh
    find /path/to/robinhood/robinhood -name '*.js' \
        | xgettext -f - \
            --add-comments='TR' \
            --keyword='__:1' \
            --keyword='_n:1,2' \
            --keyword='_p:1c' \
            --keyword='_np:1c,2,3'
    ```

    This will produce a `messages.po` template file.

    https://www.gnu.org/software/gettext/manual/html_node/xgettext-Invocation.html

2.  Copy that template file once for each target language.

    ```sh
    cp messages.po ./po/fr-ca.po
    ```

    These files will typically be loaded into some central repository for
    translation. There are several options/providers that work with gettext.
    Other gettext utils can help combine, trim, and deduplicate messages.

3.  Once those files are filled out with translations we need to download them
    from whatever service and reformat them to work with JavaScript. There is
    a `./node_modules/.bin/po2json` script that will do that. The resulting
    JSON files must be hosted somewhere.

4.  Lazy-load those hosted JSON files during app load. E.g.:

    ```js
    FetchUtils.request(`/path/to/translations/${lang}.json`)
        .then(x => loadJSON(x))
        .catch(err => {
            if (_get(err, 'response.status') === 404) {
                // swallow 404s
            } else {
                throw err
            }
        })
    ```

    After moving to a service to manage the translation files we should remove
    the translations hosted in this repository.
**/
