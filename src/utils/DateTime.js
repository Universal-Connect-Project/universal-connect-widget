import moment from 'moment'
import 'moment-timezone'
import { DEFAULT_TIMEZONE } from '../constants/App'
import { Config as OSConfig } from 'mx-react-components'

/**
 * Set the default timezone in both raja *and* the OS components.
 * @param {string} timezone e.g. "America/New_York"
 */
export function setMomentDefaultTimeZone(timezone = DEFAULT_TIMEZONE) {
  moment.tz.setDefault(timezone)
  OSConfig.setDefaultTimeZone(timezone)
}
