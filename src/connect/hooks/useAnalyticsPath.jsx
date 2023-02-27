import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { removeAnalyticPath, sendAnalyticPath } from '../../redux/actions/Analytics'

/**
 * This will send a pageview analytic only once, during the render of the component it is
 * used in.
 *
 * Usage example code to place inside of your functional component:
 *
 * useAnalyticsPath("Connect MFA", "/mfa")
 *
 * @param {string} name of the component from src/connect/const/Analytics.js
 * @param {string} path for the component in src/connect/const/Analytics.js
 */
export const useAnalyticsPath = (name, path) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(sendAnalyticPath({ path, name }))

    return () => dispatch(removeAnalyticPath(path))
  }, [])
}

export default useAnalyticsPath
