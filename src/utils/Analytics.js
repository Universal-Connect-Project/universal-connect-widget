import moment from 'moment'
import _get from 'lodash/get'
import _memoize from 'lodash/memoize'
import FireflyAPI from './FireflyAPI'
import { getHostname } from './Browser'

export const sendAnalyticsPageviewFactory = _memoize(
  currentSession => (name, path, host = getHostname()) => {
    return FireflyAPI.sendAnalyticsPageview({
      created_at: moment().unix(), //UTC is set globally for moment
      session_id: currentSession && currentSession.guid,
      app_version: 'widgets-v2',
      user_agent: navigator.userAgent,
      name: `MX - ${name}`,
      path,
      host,
      metadata: _get(window.app, ['clientConfig', 'metadata'], null),
    })
  },
)

export const closeFeatureVisitFactory = _memoize(featureVisit => () =>
  FireflyAPI.closeFeatureVisit({ feature_visit: featureVisit }),
)

export const closeAnalyticsSessionFactory = _memoize(currentSession => () =>
  FireflyAPI.closeAnalyticsSession({ analytics_session: currentSession }),
)
