import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTokens } from '@kyper/tokenprovider'

import { __ } from '../../../../utils/Intl'
import useAnalyticsPath from '../../../hooks/useAnalyticsPath'
import { PageviewInfo } from '../../../const/Analytics'

export const SearchTooManyResults = props => {
  useAnalyticsPath(...PageviewInfo.CONNECT_SEARCH_TOO_MANY)
  const { searchTerm, setAriaLiveRegionMessage } = props
  const timerRef = useRef(null)

  const tokens = useTokens()
  const styles = getStyles(tokens)

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setAriaLiveRegionMessage(__('Keep typing - too many results to display'))
    }, 500)
    return () => {
      clearTimeout(timerRef.current)
      setAriaLiveRegionMessage('')
    }
  }, [searchTerm])

  return <div style={styles.tooManyResults}>{__('Keep typing - too many results to display')}</div>
}

const getStyles = tokens => ({
  tooManyResults: {
    marginTop: tokens.Spacing.Large,
    color: tokens.TextColor.Default,
    fontSize: tokens.FontSize.Paragraph,
    fontWeight: tokens.FontWeight.Regular,
  },
})

SearchTooManyResults.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setAriaLiveRegionMessage: PropTypes.func.isRequired,
}
