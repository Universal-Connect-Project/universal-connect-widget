import './honeybadger'
import '../loggerInit.js'
import '@babel/polyfill'

import { maybeRequireIntlPolyfill } from '../utils/LocaleLoader'
import { setMomentDefaultTimeZone } from '../utils/DateTime'

import { fromEntriesPolyfill } from '../utils/Polyfill'

// Ensure that we set the default timezone on startup.
setMomentDefaultTimeZone()
maybeRequireIntlPolyfill()

// A temporary polyfill for Object.fromEntries and IE11
fromEntriesPolyfill()
