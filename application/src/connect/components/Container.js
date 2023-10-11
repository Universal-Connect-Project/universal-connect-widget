import React from 'react'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'

/**
 * Our root container to handle our widgets min/max widths, positioning and padding for all views
 */
export const Container = React.forwardRef((props, ref) => {
  const { column = false, children, flex = false, id } = props

  const tokens = useTokens()
  const styles = getStyles(column, flex, tokens)

  return (
    <div id={id ?? null} ref={ref ?? null} style={styles.container}>
      <div style={styles.content}>{children}</div>
    </div>
  )
})

const getStyles = (column, flex, tokens) => {
  return {
    container: {
      backgroundColor: tokens.BackgroundColor.Container,
      minHeight: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    content: {
      maxWidth: '400px', // Our max content width (does not include side margin)
      minWidth: '270px', // Our min content width (does not include side margin)
      width: '100%', // We want this container to shrink and grow between our min-max
      margin: tokens.Spacing.Large,
      display: flex ? 'flex' : 'unset',
      flexDirection: column ? 'column' : 'unset',
    },
  }
}

Container.displayName = 'ConnectRootContainer'
Container.propTypes = {
  column: PropTypes.bool,
  flex: PropTypes.bool,
  id: PropTypes.string,
}
