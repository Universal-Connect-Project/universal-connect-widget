import React from 'react'
import PropTypes from 'prop-types'

import { Text } from '@kyper/text'
import { Button } from '@kyper/button'
import { useTokens } from '@kyper/tokenprovider'

export const ActionableUtilityRow = props => {
  const { text, textStyles, onClick, icon, role = 'button', showHorizontalLine = true } = props

  const tokens = useTokens()
  const styles = getStyles(tokens)

  return (
    <div style={styles.container}>
      <Button
        onClick={onClick}
        role={role}
        size="small"
        style={styles.button}
        variant="transparent"
      >
        <div style={styles.content}>
          <Text as="Paragraph" color="secondary" style={textStyles ?? {}} tag="p">
            {text}
          </Text>

          {icon}
        </div>
      </Button>

      {showHorizontalLine && <hr style={styles.hr} />}
    </div>
  )
}

const getStyles = tokens => {
  return {
    container: {
      marginLeft: `-${tokens.Spacing.Small}px`,
      marginRight: `-${tokens.Spacing.Small}px`,
    },
    content: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    button: {
      width: '100%',
      paddingLeft: tokens.Spacing.Small,
      paddingRight: tokens.Spacing.Small,
      borderRadius: tokens.BorderRadius.CardRounded,
    },
    hr: {
      margin: `0px ${tokens.Spacing.Small}px`,
      backgroundColor: tokens.BackgroundColor.HrLight,
      borderTop: 'unset',
    },
  }
}

ActionableUtilityRow.propTypes = {
  icon: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired,
  role: PropTypes.string,
  showHorizontalLine: PropTypes.bool,
  text: PropTypes.string.isRequired,
  textStyles: PropTypes.object,
}
