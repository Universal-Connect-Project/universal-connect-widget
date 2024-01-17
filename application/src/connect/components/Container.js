import React from 'react'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'

import { STEPS } from 'src/connect/const/Connect'
/**
 * Our root container to handle our widgets min/max widths, positioning and padding for all views
 */
export const Container = props => {
  const tokens = useTokens()
  const styles = getStyles(tokens, props.step)

  return (
    <div data-test="container" style={styles.container}>
      <div style={styles.content}>{props.children}</div>
    </div>
  )
}
Container.propTypes = {
  step: PropTypes.string,
}

const getStyles = (tokens, step) => {
  return {
    container: {
      backgroundColor: tokens.BackgroundColor.Container,
      minHeight: '100%',
      maxHeight: step === STEPS.SEARCH ? '100%' : null,
      display: 'flex',
      justifyContent: 'center',
    },
    content: {
      maxWidth: '400px', // Our max content width (does not include side margin)
      minWidth: '270px', // Our min content width (does not include side margin)
      width: '100%', // We want this container to shrink and grow between our min-max
      margin: tokens.Spacing.Large,
    },
  }
}
