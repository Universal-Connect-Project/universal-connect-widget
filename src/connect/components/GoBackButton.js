import React from 'react'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'
import { Button } from '@kyper/button'
import { ChevronLeft } from '@kyper/icon/ChevronLeft'

import { __ } from '../../utils/Intl'

export const GoBackButton = props => {
  const { handleGoBack } = props
  const tokens = useTokens()
  const styles = getStyles(tokens)

  return (
    <Button aria-label={__('Go Back')} onClick={handleGoBack} style={styles} variant="transparent">
      <ChevronLeft
        color={tokens.TextColor.Default}
        height={tokens.Spacing.Large}
        width={tokens.Spacing.Large}
      />
    </Button>
  )
}

const getStyles = tokens => ({
  height: '40px',
  margin: `-${tokens.Spacing.XSmall}px ${tokens.Spacing.XSmall}px ${tokens.Spacing.XSmall}px -${tokens.Spacing.Medium}px`,
  padding: `0px 8px`,
  width: '40px',
})

GoBackButton.propTypes = {
  handleGoBack: PropTypes.func.isRequired,
}
