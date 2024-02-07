import React from 'react'
import PropTypes from 'prop-types'

import { css, keyframes } from '@mxenabled/cssinjs'

/**
 * @param {int} delay    How long until the animation starts in ms
 * @param {int} duration How long the animation runs in ms
 */
export const SlideDown = props => {
  const { delay, duration } = props
  const styles = getStyles(delay, duration)

  return <div className={styles}>{props.children}</div>
}

const getStyles = (delay, duration) => {
  const slideAnimation = keyframes({
    from: {
      opacity: 0,
      top: '-10px',
    },
    to: {
      opacity: 1,
      top: '0px',
    },
  })

  return css({
    position: 'relative',
    animationName: slideAnimation,
    animationFillMode: 'both',
    animationDuration: `${duration}ms`,
    animationDelay: `${delay}ms`,
    animationTimingFunction: 'ease-in-out',
  })
}

SlideDown.propTypes = {
  delay: PropTypes.number,
  duration: PropTypes.number,
}

SlideDown.defaultProps = {
  delay: 0,
  duration: 300,
}
