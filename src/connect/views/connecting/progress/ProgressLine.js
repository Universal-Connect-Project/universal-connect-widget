import React from 'react'
import PropTypes from 'prop-types'
import { useTokens } from '@kyper/tokenprovider'

export const ProgressLine = props => {
  const tokens = useTokens()
  const styles = {
    backLine: {
      width: props.width ? `${props.width}px` : '100%',
      minWidth: props.width ? `${props.width}px` : null,
      height: '2px',
      background: tokens.BackgroundColor.HrDark,
      borderRadius: '1px',
      zIndex: 10,
    },
    activeLine: {
      background: tokens.TextColor.Active,
    },
  }
  const lineStyle = props.isActive
    ? { ...styles.backLine, ...styles.activeLine }
    : { ...styles.backLine }

  return <div style={lineStyle} />
}

ProgressLine.propTypes = {
  isActive: PropTypes.bool,
  width: PropTypes.number,
}
