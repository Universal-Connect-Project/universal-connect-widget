import React from 'react'
import PropTypes from 'prop-types'

import { Text } from '@kyper/text'
import { Button } from '@kyper/button'
import { useTokens } from '@kyper/tokenprovider'
import { ChevronLeft } from '@kyper/icon/ChevronLeft'
import { Close } from '@kyper/icon/Close'
import { Lock } from '@kyper/icon/Lock'

import { __ } from '../../utils/Intl'

export const NavHeader = ({ title, onBackClick, onCloseClick }) => {
  const tokens = useTokens()
  const styles = getStyles(tokens)

  return (
    <div style={styles.nav}>
      <div style={styles.navEnd}>
        {onBackClick && (
          <Button onClick={onBackClick} style={styles.navButton} variant="link">
            <ChevronLeft color={tokens.Color.Brand300} size={32} />
          </Button>
        )}
      </div>

      <div style={styles.textContainer}>
        <Text as="H3" style={styles.textPrimary}>
          {title}
        </Text>
        <div style={styles.textSecondary}>
          <Lock size={12} style={styles.icon} />
          <Text as="Small">{__('Private and secure')}</Text>
        </div>
      </div>

      <div style={styles.navEnd}>
        {onCloseClick && (
          <Button onClick={onCloseClick} style={styles.navButton} variant="link">
            <Close color={tokens.Color.Brand300} size={32} />
          </Button>
        )}
      </div>
    </div>
  )
}

const getStyles = tokens => {
  return {
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: tokens.FontSize.H3,
      alignItems: 'center',
      fontWeight: tokens.FontWeight.Bold,
      maxWidth: '400px',
      padding: tokens.Spacing.Small,
    },
    textContainer: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
    },
    textPrimary: {
      fontFamily: 'ProximaNovaSemiBold',
    },
    textSecondary: {
      display: 'flex',
      justifyContent: 'center',
    },
    icon: {
      marginRight: tokens.Spacing.Tiny,
    },
    navButton: {
      borderRadius: '50%',
      height: '40px',
      width: '40px',
    },
    navEnd: {
      minWidth: '40px',
    },
  }
}

NavHeader.propTypes = {
  onBackClick: PropTypes.func,
  onCloseClick: PropTypes.func,
  title: PropTypes.string.isRequired,
}
