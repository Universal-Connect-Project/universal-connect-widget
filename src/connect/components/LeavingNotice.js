import React from 'react'
import PropTypes from 'prop-types'

import { __ } from '../../utils/Intl'

import { Text } from '@kyper/text'
import { Card } from '@kyper/card'
import { Button, ButtonGroup } from '@kyper/button'
import { useTokens } from '@kyper/tokenprovider'

export const LeavingNotice = ({ onContinue, onCancel, size }) => {
  const tokens = useTokens()
  const styles = getStyles(tokens)

  const isSmall = size === 'small'

  return (
    <Card borderRadius={isSmall ? 'none' : 'card'} role="alert" style={styles.container}>
      <Text as="H3" style={styles.title} tag="h3">
        {__('You are leaving')}
      </Text>
      <div>
        <Text as="Paragraph" style={styles.text} tag="p">
          {__(
            'Selecting Continue will take you to an external location that we do not control. We are not responsible for the products, services, or information provided there.',
          )}
        </Text>

        <Text as="Paragraph" style={styles.text} tag="p">
          {__(
            'Keep in mind how their privacy policy, security measures, and terms and conditions may impact you.',
          )}
        </Text>
      </div>

      <ButtonGroup>
        <Button onClick={onCancel} style={styles.button}>
          {__('Cancel')}
        </Button>
        <Button onClick={onContinue} style={styles.button} variant="primary">
          {__('Continue')}
        </Button>
      </ButtonGroup>
    </Card>
  )
}

const getStyles = tokens => {
  return {
    container: {
      marginTop: tokens.Spacing.XLarge,
    },
    title: {
      fontSize: tokens.FontSize.H3,
      fontWeight: tokens.FontWeight.Bold,
      marginBottom: tokens.Spacing.Medium,
    },
    text: {
      fontSize: tokens.FontSize.Body,
      lineHeight: tokens.LineHeight.Paragraph,
      marginBottom: tokens.Spacing.Small,
    },
    textBold: {
      fontWeight: tokens.FontWeight.Bold,
    },
    button: {
      width: '100%',
    },
  }
}

LeavingNotice.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  size: PropTypes.string.isRequired,
}
