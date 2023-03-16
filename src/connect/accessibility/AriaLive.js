import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

export const AriaLive = ({ level, message, timeout = 0, ...rest }) => {
  const [ariaLiveRegionMessage, setAriaLiveRegionMessage] = useState('')
  const timerRef = useRef()
  const styles = getStyles()
  /**
   * If we don't use setTimeout() here the JAWS/NVDA screen readers fail to read the changes.
   */
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setAriaLiveRegionMessage(message)
    }, timeout)
    return () => {
      clearTimeout(timerRef.current)
      setAriaLiveRegionMessage('')
    }
  }, [message])

  return (
    <div aria-live={level} style={styles.accessibilityStyles} {...rest}>
      {ariaLiveRegionMessage}
    </div>
  )
}

const getStyles = () => {
  return {
    accessibilityStyles: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      whiteSpace: 'nowrap',
      width: 1,
    },
  }
}

AriaLive.propTypes = {
  level: PropTypes.oneOf(['assertive', 'off', 'polite']),
  message: PropTypes.string.isRequired,
  timeout: PropTypes.number,
}

AriaLive.defaultProps = {
  level: 'polite',
  message: '',
}
