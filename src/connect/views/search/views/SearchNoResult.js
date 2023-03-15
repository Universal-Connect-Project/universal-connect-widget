import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { Button } from '@kyper/button'

import { Text } from '@kyper/text'
import { useTokens } from '@kyper/tokenprovider'

import { __ } from '../../../../utils/Intl'
import useAnalyticsPath from '../../../hooks/useAnalyticsPath'
import { PageviewInfo } from '../../../const/Analytics'

export const SearchNoResult = props => {
  useAnalyticsPath(...PageviewInfo.CONNECT_SEARCH_NO_RESULTS)
  const {
    enableManualAccounts,
    enableSupportRequests,
    isMicrodepositsEnabled,
    onAddManualAccountClick,
    onRequestInstitution,
    onVerifyWithMicrodeposits,
    setAriaLiveRegionMessage,
  } = props
  const timerRef = useRef(null)
  const tokens = useTokens()
  const styles = getStyles(tokens)

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setAriaLiveRegionMessage(__('0 search results'))
    }, 500)
    return () => {
      clearTimeout(timerRef.current)
      setAriaLiveRegionMessage('')
    }
  }, [])

  return (
    <div style={styles.container}>
      <Text as="Paragraph" style={styles.paragraph}>
        {__('0 search results')}
      </Text>

      <hr aria-hidden={true} style={styles.rule} />

      <div style={styles.transparentButton}>
        {enableManualAccounts && (
          <Button onClick={onAddManualAccountClick} variant={'transparent'}>
            {__('Add account manually')}
          </Button>
        )}

        {enableSupportRequests && (
          <Button onClick={onRequestInstitution} variant={'transparent'}>
            {__('Submit an institution request')}
          </Button>
        )}

        {/* Microdeposits uses ACH which isn't availbale in Canada(fr-CA) so not translating */}
        {isMicrodepositsEnabled && (
          <Button onClick={onVerifyWithMicrodeposits} variant={'transparent'}>
            {__('Connect with account numbers')}
          </Button>
        )}
      </div>
    </div>
  )
}

const getStyles = tokens => {
  return {
    container: {
      overflow: 'auto',
      maxHeight: '100%',
    },
    paragraph: {
      display: 'block',
      margin: `${tokens.Spacing.Large}px 0`,
    },
    rule: {
      margin: `${tokens.Spacing.Small}px 0`,
    },
    transparentButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '8px',
    },
  }
}

SearchNoResult.propTypes = {
  enableManualAccounts: PropTypes.bool.isRequired,
  enableSupportRequests: PropTypes.bool.isRequired,
  isMicrodepositsEnabled: PropTypes.bool.isRequired,
  onAddManualAccountClick: PropTypes.func.isRequired,
  onRequestInstitution: PropTypes.func.isRequired,
  onVerifyWithMicrodeposits: PropTypes.func.isRequired,
  setAriaLiveRegionMessage: PropTypes.func.isRequired,
}
