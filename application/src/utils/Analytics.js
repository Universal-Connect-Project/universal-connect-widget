import moment from 'moment'
import _get from 'lodash/get'
import _memoize from 'lodash/memoize'
import { getHostname } from 'src/connect/utilities/Browser'
import connectAPI from 'src/connect/services/api'

export const sendAnalyticsPageviewFactory = _memoize(
  currentSession => (name, path, host = getHostname()) => {
    return connectAPI.sendAnalyticsPageview({
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
  connectAPI.closeFeatureVisit({ feature_visit: featureVisit }),
)

export const closeAnalyticsSessionFactory = _memoize(currentSession => () =>
  connectAPI.closeAnalyticsSession({ analytics_session: currentSession }),
)
