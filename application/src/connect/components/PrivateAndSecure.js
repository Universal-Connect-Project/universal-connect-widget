import React from 'react'

import { useTokens } from '@kyper/tokenprovider'
import { Lock } from '@kyper/icon/Lock'

import { __ } from '../../utils/Intl'

export const PrivateAndSecure = ({ style }) => {
  const tokens = useTokens()
  const styles = getStyles(tokens)

  return (
    <div style={style ? { ...styles.secureSeal, ...style } : styles.secureSeal}>
      <Lock color={tokens.TextColor.InputLabel} size={12} style={styles.lock} />
      {// --TR: This is a "MX" slogan bank level security meaning as safe as banks are able
      __('Private and secure')}
    </div>
  )
}

const getStyles = tokens => ({
  secureSeal: {
    alignContent: 'center',
    color: tokens.TextColor.InputLabel,
    display: 'flex',
    fontSize: tokens.FontSize.Small,
    justifyContent: 'center',
    padding: `${tokens.Spacing.Medium}px 0`,
  },
  lock: {
    marginRight: tokens.Spacing.Tiny,
  },
})
