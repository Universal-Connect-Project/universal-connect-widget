import React from 'react'
import PropTypes from 'prop-types'

import { Spinner } from '@kyper/progressindicators'
import { useTokens } from '@kyper/tokenprovider'
import { __ } from '../../utils/Intl'

export const LoadingSpinner = ({ bgColor, fgColor, showText = false }) => {
  const tokens = useTokens()
  const styles = getStyles(tokens)

  return (
    <div style={styles.container}>
      <Spinner
        bgColor={bgColor ? bgColor : 'transparent'}
        fgColor={fgColor ? fgColor : tokens.Color.Brand300}
        size={48}
      />
      {showText && <div style={styles.text}>{__('Loading ...')}</div>}
    </div>
  )
}

const getStyles = (tokens, bgColor) => {
  return {
    container: {
      backgroundColor: bgColor ? bgColor : 'transparent',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: '#999',
      fontSize: tokens.FontSize.Tiny,
      fontWeight: tokens.FontWeight.SemiBold,
      textAlign: 'center',
      marginTop: '16px',
    },
  }
}

LoadingSpinner.propTypes = {
  bgColor: PropTypes.string,
  fgColor: PropTypes.string,
  showText: PropTypes.bool,
}
