import React from 'react'
import { useTokens } from '@kyper/tokenprovider'
import { CheckmarkFilled } from '@kyper/icon/CheckmarkFilled'

export const ProgressCheckMark = () => {
  const tokens = useTokens()

  const styles = {
    height: '24px',
    width: '24px',
    zIndex: 20,
  }

  return (
    <div style={styles}>
      <CheckmarkFilled color={tokens.TextColor.Active} size={24} />
    </div>
  )
}
