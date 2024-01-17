import React from 'react'
import PropTypes from 'prop-types'

import { useTokens } from '@kyper/tokenprovider'

const StickyComponentContainer = React.forwardRef(
  ({ children, header = null, footer = null }, ref) => {
    const tokens = useTokens()
    const styles = getStyles(tokens)

    return (
      <div ref={ref} style={styles.container}>
        {header && <div style={styles.header}>{header}</div>}
        <div style={styles.content}>{children}</div>
        {footer && <div style={styles.footer}>{footer}</div>}
      </div>
    )
  },
)

StickyComponentContainer.propTypes = {
  footer: PropTypes.element,
  header: PropTypes.element,
}
StickyComponentContainer.displayName = 'StickyComponentContainer'

const getStyles = tokens => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    content: {
      flexGrow: 1,
    },
    footer: {
      width: '100%',
      position: 'sticky',
      bottom: 0,
      backgroundColor: tokens.BackgroundColor.Container,
      borderTop: `1px solid ${tokens.BackgroundColor.HrLight}`,
      borderRadius: '0',
      marginBottom: `-${tokens.Spacing.Large}px`,
    },
    header: {
      width: '100%',
      position: 'sticky',
      top: 0,
      backgroundColor: tokens.BackgroundColor.Container,
      zIndex: 10,
      borderRadius: '0',
    },
  }
}

export default StickyComponentContainer
